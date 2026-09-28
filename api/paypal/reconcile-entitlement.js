import {
  reconcileAndFreezeEntitlement
} from "../_lib/paypal-ledger.js";

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

    const result = await reconcileAndFreezeEntitlement(
      claimToken,
      captureID,
      "RECONCILIATION_ENDPOINT"
    );

    if (result.reason === "NOT_FOUND") {
      return res.status(404).json({
        ok: false,
        driftDetected: false,
        frozen: false,
        reason: "NOT_FOUND"
      });
    }

    if (result.reason === "CAPTURE_MISMATCH") {
      return res.status(403).json({
        ok: false,
        driftDetected: true,
        frozen: false,
        reason: "CAPTURE_MISMATCH"
      });
    }

    if (result.ok) {
      return res.status(200).json({
        ok: true,
        authoritative: true,
        driftDetected: false,
        frozen: false,
        reconciliation: result.reconciliation,
        entitlement: {
          status: result.record.status,
          packId: result.record.packId,
          flOz: result.record.flOz,
          amount: result.record.amount,
          currency: result.record.currency,
          captureID: result.record.captureID,
          orderID: result.record.orderID,
          fulfillmentId: result.record.fulfillmentId || null,
          auditVersion: result.record.auditVersion || null
        }
      });
    }

    return res.status(409).json({
      ok: false,
      authoritative: false,
      driftDetected: true,
      frozen: result.frozen === true,
      status: result.frozen ? "FROZEN" : "UNRESOLVED",
      incident: result.incident || null,
      reconciliation: result.reconciliation || null
    });
  } catch (err) {
    console.error("[PayPal reconcile-entitlement]", err);
    return res.status(500).json({ error: "Unable to reconcile entitlement." });
  }
}
