import { getEntitlement } from "../_lib/paypal-ledger.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { claimToken, captureID } = req.body || {};
    if (!claimToken || !captureID) {
      return res.status(400).json({ error: "Missing entitlement reconciliation information." });
    }

    const result = await getEntitlement(claimToken, captureID);

    if (result.reason === "NOT_FOUND") {
      return res.status(404).json({
        ok: false,
        driftDetected: false,
        reason: "NOT_FOUND"
      });
    }

    if (result.reason === "CAPTURE_MISMATCH") {
      return res.status(403).json({
        ok: false,
        driftDetected: true,
        reason: "CAPTURE_MISMATCH"
      });
    }

    if (result.reason === "CORRUPT_RECORD") {
      return res.status(409).json({
        ok: false,
        driftDetected: true,
        reason: "CORRUPT_RECORD"
      });
    }

    return res.status(result.ok ? 200 : 409).json({
      ok: result.ok,
      authoritative: result.reconciliation?.authoritative === true,
      driftDetected: result.driftDetected === true,
      reconciliation: result.reconciliation,
      entitlement: result.ok ? {
        status: result.record.status,
        packId: result.record.packId,
        flOz: result.record.flOz,
        amount: result.record.amount,
        currency: result.record.currency,
        captureID: result.record.captureID,
        orderID: result.record.orderID,
        fulfillmentId: result.record.fulfillmentId || null,
        auditVersion: result.record.auditVersion || null
      } : null
    });
  } catch (err) {
    console.error("[PayPal reconcile-entitlement]", err);
    return res.status(500).json({ error: "Unable to reconcile entitlement." });
  }
}
