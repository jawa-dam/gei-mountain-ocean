import { recordEntitlement } from "../_lib/paypal-ledger.js";
import { getPack } from "../_lib/economy-authority.js";

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
    headers: {
      Authorization: "Basic " + auth,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });
  const data = await r.json();
  if (!r.ok || !data.access_token) throw new Error(data.error_description || "PayPal authentication failed.");
  return data.access_token;
}

function getHeader(headers, name) {
  return headers[name] || headers[name.toLowerCase()] || "";
}

function getEventCaptureId(event) {
  return event?.resource?.id || event?.resource?.supplementary_data?.related_ids?.capture_id || "";
}

function getEventOrderId(event) {
  return event?.resource?.supplementary_data?.related_ids?.order_id ||
    event?.resource?.supplementary_data?.related_ids?.orderId || "";
}

function getEventPackId(event) {
  return event?.resource?.custom_id ||
    event?.resource?.purchase_units?.[0]?.custom_id || "";
}

async function verifyWebhook(token, webhookId, req) {
  const headers = req.headers || {};
  const verificationPayload = {
    auth_algo: getHeader(headers, "paypal-auth-algo"),
    cert_url: getHeader(headers, "paypal-cert-url"),
    transmission_id: getHeader(headers, "paypal-transmission-id"),
    transmission_sig: getHeader(headers, "paypal-transmission-sig"),
    transmission_time: getHeader(headers, "paypal-transmission-time"),
    webhook_id: webhookId,
    webhook_event: req.body
  };

  const verify = await fetch("https://api-m.paypal.com/v1/notifications/verify-webhook-signature", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(verificationPayload)
  });
  const result = await verify.json();
  return {
    ok: verify.ok && result.verification_status === "SUCCESS",
    result
  };
}

async function validateCompletedCapture(token, event) {
  const captureId = getEventCaptureId(event);
  const orderId = getEventOrderId(event);
  if (!captureId) throw new Error("Completed capture webhook is missing a capture id.");
  if (!orderId) throw new Error("Completed capture webhook is missing the PayPal order id.");

  const response = await fetch(
    "https://api-m.paypal.com/v2/checkout/orders/" + encodeURIComponent(orderId),
    { headers: { Authorization: "Bearer " + token }, cache: "no-store" }
  );
  const order = await response.json();
  if (!response.ok) throw new Error("Unable to validate the PayPal order.");

  const unit = order.purchase_units?.[0];
  const packId = unit?.custom_id;

  /* V2.2.04 — the PayPal app is shared with other GEI products (e.g. the
     GEI Discovery Guide, custom_id "GEI-DISCOVERY-50"). Captures that are
     not DAM NATION packs belong to another app's webhook: acknowledge them
     instead of failing, so PayPal does not retry them against this endpoint. */
  if (!getPack(packId)) return { ignored: true, packId: packId || null };

  const amount = unit?.amount;
  const pack = PACKS[packId];
  const capture = unit?.payments?.captures?.find(item => item.id === captureId) ||
    unit?.payments?.captures?.[0];

  if (!pack || !unit || !amount ||
      amount.currency_code !== "USD" ||
      amount.value !== pack.price ||
      !capture ||
      capture.id !== captureId ||
      capture.status !== "COMPLETED" ||
      order.status !== "COMPLETED") {
    throw new Error("PayPal capture validation failed.");
  }

  const invoiceId = unit?.invoice_id;
  if (!invoiceId) throw new Error("PayPal order is missing the entitlement token.");

  return {
    orderID: orderId,
    captureID: captureId,
    invoiceId,
    packId,
    flOz: pack.flOz,
    amount: pack.price,
    currency: "USD"
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    if (!webhookId) return res.status(503).json({ error: "PayPal webhook is not configured." });

    const token = await paypalToken();
    const verification = await verifyWebhook(token, webhookId, req);

    if (!verification.ok) {
      return res.status(400).json({ error: "Invalid PayPal webhook signature." });
    }

    const event = req.body || {};
    const eventType = event.event_type || "UNKNOWN";
    const eventId = event.id || "";
    console.log("[PayPal webhook]", eventType, eventId);

    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      const fulfillment = await validateCompletedCapture(token, event);
      if (fulfillment.ignored) {
        return res.status(200).json({
          received: true,
          verified: true,
          eventType,
          eventId,
          ignored: true,
          reason: "NOT_A_DAM_NATION_PACK"
        });
      }
      const ledger = await recordEntitlement({
        eventId: eventId || "capture:" + fulfillment.captureID,
        ...fulfillment
      });

      return res.status(200).json({
        received: true,
        verified: true,
        eventType,
        eventId,
        fulfillment: {
          ...fulfillment,
          status: "FULFILLABLE",
          durable: true,
          created: ledger.created
        }
      });
    }

    if (eventType === "PAYMENT.CAPTURE.PENDING") {
      return res.status(200).json({
        received: true,
        verified: true,
        eventType,
        eventId,
        fulfillment: { status: "PENDING", packId: getEventPackId(event) || null }
      });
    }

    if (eventType === "PAYMENT.CAPTURE.DENIED" ||
        eventType === "CHECKOUT.PAYMENT-APPROVAL.REVERSED") {
      return res.status(200).json({
        received: true,
        verified: true,
        eventType,
        eventId,
        fulfillment: { status: "DENIED", packId: getEventPackId(event) || null }
      });
    }

    if (eventType === "CHECKOUT.ORDER.APPROVED") {
      return res.status(200).json({
        received: true,
        verified: true,
        eventType,
        eventId,
        action: "CAPTURE_ORDER"
      });
    }

    return res.status(200).json({
      received: true,
      verified: true,
      eventType,
      eventId,
      ignored: true
    });
  } catch (err) {
    console.error("[PayPal webhook]", err);
    return res.status(500).json({ error: err.message || "Webhook processing failed." });
  }
}
