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
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    if (!webhookId) return res.status(503).json({ error: "PayPal webhook is not configured." });

    const token = await paypalToken();
    const headers = req.headers || {};
    const verificationPayload = {
      auth_algo: headers["paypal-auth-algo"],
      cert_url: headers["paypal-cert-url"],
      transmission_id: headers["paypal-transmission-id"],
      transmission_sig: headers["paypal-transmission-sig"],
      transmission_time: headers["paypal-transmission-time"],
      webhook_id: webhookId,
      webhook_event: req.body
    };

    const verify = await fetch("https://api-m.paypal.com/v1/notifications/verify-webhook-signature", {
      method: "POST",
      headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify(verificationPayload)
    });
    const result = await verify.json();
    if (!verify.ok || result.verification_status !== "SUCCESS") {
      return res.status(400).json({ error: "Invalid PayPal webhook signature." });
    }

    const eventType = req.body?.event_type || "UNKNOWN";
    console.log("[PayPal webhook]", eventType, req.body?.id || "");
    return res.status(200).json({ received: true, verified: true, eventType });
  } catch (err) {
    console.error("[PayPal webhook]", err);
    return res.status(500).json({ error: err.message || "Webhook verification failed." });
  }
}
