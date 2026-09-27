import { claimEntitlement } from "../_lib/paypal-ledger.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { claimToken, captureID, claimId } = req.body || {};
    if (!claimToken || !captureID || !claimId) {
      return res.status(400).json({ error: "Missing entitlement claim information." });
    }

    const result = await claimEntitlement(claimToken, captureID, claimId);

    if (!result.ok) {
      if (result.reason === "NOT_FOUND") {
        return res.status(404).json({ error: "Entitlement not found." });
      }
      if (result.reason === "CAPTURE_MISMATCH") {
        return res.status(403).json({ error: "Entitlement does not match this payment." });
      }
      if (result.reason === "ALREADY_CLAIMED") {
        return res.status(409).json({ error: "This entitlement has already been claimed." });
      }
      return res.status(409).json({ error: "Entitlement could not be claimed." });
    }

    return res.status(200).json({
      ok: true,
      alreadyClaimed: result.alreadyClaimed,
      entitlement: {
        packId: result.record.packId,
        flOz: result.record.flOz,
        captureID: result.record.captureID,
        orderID: result.record.orderID,
        status: result.record.status
      }
    });
  } catch (err) {
    console.error("[PayPal claim-entitlement]", err);
    return res.status(500).json({ error: err.message || "Unable to claim entitlement." });
  }
}
