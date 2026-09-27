import crypto from "node:crypto";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const env = (process.env.PAYPAL_ENV || "live").toLowerCase();

  if (!clientId) {
    return res.status(503).json({ ok:false, error:"PayPal client ID is not configured." });
  }
  if (env !== "live") {
    return res.status(503).json({ ok:false, error:"PayPal Live checkout is not enabled." });
  }

  const fingerprint = crypto.createHash("sha256").update(clientId).digest("hex").slice(0, 12);
  const sdkUrl =
    "https://www.paypal.com/sdk/js?client-id=" +
    encodeURIComponent(clientId.trim()) +
    "&currency=USD&intent=capture&components=buttons&debug=true";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const r = await fetch(sdkUrl, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: { Accept: "application/javascript,text/javascript,*/*;q=0.8" }
    });

    clearTimeout(timeout);

    return res.status(200).json({
      ok: r.ok,
      environment: "live",
      clientIdFingerprint: fingerprint,
      paypalHttpStatus: r.status,
      contentType: r.headers.get("content-type") || null,
      contentLength: r.headers.get("content-length") || null
    });
  } catch (err) {
    clearTimeout(timeout);
    return res.status(200).json({
      ok: false,
      environment: "live",
      clientIdFingerprint: fingerprint,
      paypalHttpStatus: null,
      error: err && err.name === "AbortError"
        ? "PayPal SDK probe timed out after 8 seconds."
        : (err && err.message) || "PayPal SDK probe failed."
    });
  }
}
