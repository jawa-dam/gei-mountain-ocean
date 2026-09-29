import { PACKS, ECONOMY_AUTHORITY_VERSION, validatePackAuthority } from "../_lib/economy-authority.js";

/* V2.1.59 — server checkout reads the canonical authority from economy-authority.js. */

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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const packId = req.body && req.body.packId;
    const requestId = req.body && req.body.requestId;
    const pack = PACKS[packId];
    if (!requestId || typeof requestId !== "string" || !/^[A-Za-z0-9._:-]{8,100}$/.test(requestId)) {
      return res.status(400).json({ error: "A valid checkout request id is required." });
    }
    if (!pack) return res.status(400).json({ error: "Unknown FL OZ pack." });
    if (!validatePackAuthority(packId, pack.price, "USD")) return res.status(500).json({ error: "Economy authority configuration failed." });

    const invoiceId = "GEI-" + requestId;
    const token = await paypalToken();
    const response = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "PayPal-Request-Id": requestId,
        Prefer: "return=representation"
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          custom_id: packId,
          description: pack.kind === "special-character" ? "DAM NATION " + pack.label + " — character entitlement" : "DAM NATION " + pack.label + " — FL OZ water points",
          invoice_id: invoiceId,
          amount: { currency_code: "USD", value: pack.price }
        }],
        application_context: {
          brand_name: "Y'all Too — DAM NATION",
          user_action: "PAY_NOW",
          shipping_preference: "NO_SHIPPING"
        }
      })
    });
    const data = await response.json();
    if (!response.ok || !data.id) {
      return res.status(response.status || 502).json({ error: data.message || "Unable to create PayPal order." });
    }

    const unit = data.purchase_units?.[0];
    const returnedPackId = unit?.custom_id;
    const returnedInvoiceId = unit?.invoice_id;
    const returnedAmount = unit?.amount;
    if (returnedPackId !== packId ||
        returnedInvoiceId !== invoiceId ||
        !returnedAmount ||
        returnedAmount.currency_code !== "USD" ||
        returnedAmount.value !== pack.price) {
      return res.status(502).json({ error: "PayPal returned an order that does not match the requested pack." });
    }

    return res.status(200).json({
      id: data.id,
      packId,
      amount: pack.price,
      currency: "USD",
      claimToken: returnedInvoiceId,
      requestId,
      economyAuthorityVersion: ECONOMY_AUTHORITY_VERSION
    });
  } catch (err) {
    console.error("[PayPal create-order]", err);
    return res.status(500).json({ error: err.message || "Unable to create PayPal order." });
  }
}
