import crypto from "node:crypto";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  const env = (process.env.PAYPAL_ENV || "live").toLowerCase();

  if (!id || !secret) {
    return res.status(503).json({ ok:false, error:"PayPal Live credentials are not both configured." });
  }
  if (env !== "live") {
    return res.status(503).json({ ok:false, error:"PayPal environment is not Live." });
  }

  const fingerprint = crypto.createHash("sha256").update(id).digest("hex").slice(0, 12);
  const auth = Buffer.from(id + ":" + secret).toString("base64");

  try {
    const r = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: "Basic " + auth,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json"
      },
      body: "grant_type=client_credentials"
    });

    const data = await r.json().catch(() => ({}));

    return res.status(200).json({
      ok: r.ok && !!data.access_token,
      environment: "live",
      clientIdFingerprint: fingerprint,
      paypalHttpStatus: r.status,
      error: data.error || null,
      errorDescription: data.error_description || null
    });
  } catch (err) {
    return res.status(200).json({
      ok: false,
      environment: "live",
      clientIdFingerprint: fingerprint,
      paypalHttpStatus: null,
      error: err && err.message ? err.message : "PayPal credential probe failed."
    });
  }
}
