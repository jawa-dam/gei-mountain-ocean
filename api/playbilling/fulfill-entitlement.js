import { fulfillPlayEntitlement } from "../_lib/playbilling-ledger.js";
import {
  ECONOMY_AUTHORITY_VERSION,
  auditReceipt
} from "../_lib/economy-authority.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { claimToken, fulfillmentId } = req.body || {};
  try {
    if (!claimToken || !fulfillmentId) {
      return res.status(400).json({ error: "Missing entitlement fulfillment information." });
    }

    if (typeof fulfillmentId !== "string" || !/^GEI-PLAY-FULFILL-[A-Za-z0-9._:-]{8,120}$/.test(fulfillmentId)) {
      return res.status(400).json({ error: "Invalid fulfillment receipt identity." });
    }

    const result = await fulfillPlayEntitlement(claimToken, fulfillmentId);

    if (!result.ok) {
      if (result.reason === "NOT_FOUND") {
        return res.status(404).json({ error: "Entitlement not found." });
      }
      if (result.reason === "REVOKED") {
        return res.status(409).json({ error: "This entitlement has been revoked.", reason: "REVOKED" });
      }
      if (result.reason === "NOT_CLAIMED") {
        return res.status(409).json({ error: "Entitlement must be claimed before fulfillment." });
      }
      if (result.reason === "ALREADY_FULFILLED") {
        return res.status(409).json({ error: "This entitlement has already been fulfilled." });
      }
      return res.status(409).json({ error: "Entitlement could not be fulfilled." });
    }

    return res.status(200).json({
      ok: true,
      alreadyFulfilled: result.alreadyFulfilled,
      recovery: result.alreadyFulfilled ? "FULFILLMENT_REPLAY_RECOVERED" : "FIRST_FULFILLMENT",
      receipt: {
        fulfillmentId: result.record.fulfillmentId,
        packId: result.record.packId,
        flOz: result.record.flOz,
        productType: result.record.productType || "fl-oz",
        characterId: result.record.characterId || null,
        orderId: result.record.orderId,
        status: result.record.status,
        auditVersion: ECONOMY_AUTHORITY_VERSION,
        authoritative: auditReceipt(result.record).authoritative,
        driftDetected: false
      }
    });
  } catch (err) {
    console.error("[PlayBilling fulfill-entitlement]", err);
    if (err?.code === "ECONOMY_DRIFT_DETECTED") {
      return res.status(409).json({
        error: "Economy authority drift detected.",
        code: "ECONOMY_DRIFT_DETECTED",
        reconciliation: err.reconciliation || null
      });
    }
    return res.status(500).json({ error: err.message || "Unable to fulfill entitlement." });
  }
}
