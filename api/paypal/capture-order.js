import { recordEntitlement } from "../_lib/paypal-ledger.js";

const PACKS = {
  single: { label: "1 Song", price: "1.00", flOz: 6660 },
  ten: { label: "10 Songs", price: "3.00", flOz: 66600 },
  twentyfive: { label: "25 Songs", price: "6.00", flOz: 166500 }
};

async function paypalToken() {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  const env = (process.env.PAYPAL_ENV || "live").toLowerCase();
  if (!id || !secret) throw new Error("PayPal credentials are not configured.");
  if (env !== "live") throw new Error("PayPal Live checkout is not enabled.");
  const auth = Buffer.from(id + ":" + secret).toString("base64");
  const r = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: { Authorization: "Basic " + auth, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials"
  });
  const data = await r.json();
  if (!r.ok || !data.access_token) throw new Error(data.error_description || "PayPal authentication failed.");
  return data.access_token;
}

function validOrder(order, packId) {
  const pack = PACKS[packId];
  const unit = order && order.purchase_units && order.purchase_units[0];
  const amount = unit && unit.amount;
  return !!pack &&
    unit && unit.custom_id === packId &&
    amount && amount.currency_code === "USD" &&
    amount.value === pack.price;
}

function completedCapture(order) {
  const captures = order?.purchase_units?.[0]?.payments?.captures || [];
  return captures.find(capture => capture.status === "COMPLETED") || null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { orderID, packId } = req.body || {};
    if (!orderID || !PACKS[packId]) return res.status(400).json({ error: "Missing order or pack." });

    const token = await paypalToken();
    const headers = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json"
    };

    const check = await fetch(
      "https://api-m.paypal.com/v2/checkout/orders/" + encodeURIComponent(orderID),
      { headers, cache: "no-store" }
    );
    const order = await check.json();

    if (!check.ok || !validOrder(order, packId)) {
      return res.status(400).json({ error: "PayPal order validation failed." });
    }

    const existing = completedCapture(order);
    const invoiceId = order.purchase_units?.[0]?.invoice_id;

    if (order.status === "COMPLETED" && existing && invoiceId) {
      const ledgerResult = await recordEntitlement({
        eventId: "capture:" + existing.id,
        orderID,
        captureID: existing.id,
        invoiceId,
        packId,
        flOz: PACKS[packId].flOz,
        amount: PACKS[packId].price,
        currency: "USD"
      });
      return res.status(200).json({
        ok: true,
        orderID,
        captureID: existing.id,
        status: existing.status,
        packId,
        flOz: PACKS[packId].flOz,
        claimToken: invoiceId,
        fulfillmentStatus: "FULFILLABLE"
      });
    }

    const captureResponse = await fetch(
      "https://api-m.paypal.com/v2/checkout/orders/" + encodeURIComponent(orderID) + "/capture",
      {
        method: "POST",
        headers: {
          ...headers,
          "PayPal-Request-Id": "gei-capture-" + orderID
        },
        body: "{}"
      }
    );

    const capture = await captureResponse.json();

    if (!captureResponse.ok) {
      // A retry can race with an already-completed capture. Re-read the order
      // before treating the request as a failed payment.
      const retryCheck = await fetch(
        "https://api-m.paypal.com/v2/checkout/orders/" + encodeURIComponent(orderID),
        { headers, cache: "no-store" }
      );
      const retryOrder = await retryCheck.json();
      const retryCapture = completedCapture(retryOrder);

      const retryInvoiceId = retryOrder.purchase_units?.[0]?.invoice_id;
      if (retryCheck.ok && retryOrder.status === "COMPLETED" && retryCapture && retryInvoiceId) {
        const ledgerResult = await recordEntitlement({
          eventId: "capture:" + retryCapture.id,
          orderID,
          captureID: retryCapture.id,
          invoiceId: retryInvoiceId,
          packId,
          flOz: PACKS[packId].flOz,
          amount: PACKS[packId].price,
          currency: "USD"
        });
        return res.status(200).json({
          ok: true,
          orderID,
          captureID: retryCapture.id,
          status: retryCapture.status,
          packId,
          flOz: PACKS[packId].flOz,
          claimToken: retryInvoiceId,
          fulfillmentStatus: ledgerResult.record?.status || "FULFILLABLE"
        });
      }

      return res.status(captureResponse.status || 502).json({
        error: capture.message || "PayPal capture failed."
      });
    }

    const payment = capture.purchase_units?.[0]?.payments?.captures?.[0];

    if (capture.status !== "COMPLETED" || !payment || payment.status !== "COMPLETED") {
      return res.status(409).json({
        error: "Payment was not completed.",
        status: capture.status || payment?.status || "UNKNOWN"
      });
    }

    const finalInvoiceId = capture.purchase_units?.[0]?.invoice_id || invoiceId;
    if (!finalInvoiceId) {
      return res.status(502).json({ error: "Payment completed but entitlement token was missing." });
    }

    const ledgerResult = await recordEntitlement({
      eventId: "capture:" + payment.id,
      orderID,
      captureID: payment.id,
      invoiceId: finalInvoiceId,
      packId,
      flOz: PACKS[packId].flOz,
      amount: PACKS[packId].price,
      currency: "USD"
    });

    return res.status(200).json({
      ok: true,
      orderID,
      captureID: payment.id,
      status: payment.status,
      packId,
      flOz: PACKS[packId].flOz,
      claimToken: finalInvoiceId,
      fulfillmentStatus: ledgerResult.record?.status || "FULFILLABLE"
    });
  } catch (err) {
    console.error("[PayPal capture-order]", err);
    return res.status(500).json({ error: err.message || "Unable to capture PayPal order." });
  }
}
