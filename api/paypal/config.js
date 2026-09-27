export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const env = (process.env.PAYPAL_ENV || "live").toLowerCase();
  if (!clientId) return res.status(503).json({ error: "PayPal is not configured." });
  if (env !== "live") return res.status(503).json({ error: "PayPal Live checkout is not enabled yet." });
  return res.status(200).json({ clientId, currency: "USD", environment: "live" });
}
