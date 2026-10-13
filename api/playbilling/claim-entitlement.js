import { claimPlayEntitlement } from "../_lib/playbilling-ledger.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { claimToken, claimId } = req.body || {};
  try {
    if (!claimToken || !claimId) {
      return res.status(400).json({ error: "Missing entitlement claim information." });
    }

    const result = await claimPlayEntitlement(claimToken, claimId);

    if (!result.ok) {
      if (result.reason === "NOT_FOUND") {
        return res.status(404).json({ error: "Entitlement not found." });
      }
      if (result.reason === "REVOKED") {
        return res.status(409).json({ error: "This entitlement has been revoked.", reason: "REVOKED" });
      }
      if (result.reason === "ALREADY_CLAIMED") {
        return res.status(409).json({ error: "This entitlement has already been claimed." });
      }
      return res.status(409).json({ error: "Entitlement could not be claimed." });
    }

    return res.status(200).json({
      ok: true,
      alreadyClaimed: result.alreadyClaimed,
      recovery: result.alreadyClaimed ? "REPLAY_RECOVERED" : "FIRST_CLAIM",
      entitlement: {
        packId: result.record.packId,
        flOz: result.record.flOz,
        orderId: result.record.orderId,
        status: result.record.status
      }
    });
  } catch (err) {
    console.error("[PlayBilling claim-entitlement]", err);
    if (err?.code === "ECONOMY_DRIFT_DETECTED") {
      return res.status(409).json({
        error: "Economy authority drift detected.",
        code: "ECONOMY_DRIFT_DETECTED",
        reconciliation: err.reconciliation || null
      });
    }
    return res.status(500).json({ error: err.message || "Unable to claim entitlement." });
  }
}
