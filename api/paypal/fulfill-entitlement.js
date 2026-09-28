import { fulfillEntitlement } from "../_lib/paypal-ledger.js";
import { ECONOMY_AUTHORITY_VERSION, auditReceipt } from "../_lib/economy-authority.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { claimToken, captureID, fulfillmentId } = req.body || {};
    if (!claimToken || !captureID || !fulfillmentId) {
      return res.status(400).json({ error: "Missing entitlement fulfillment information." });
    }

    if (typeof fulfillmentId !== "string" || !/^GEI-FULFILL-[A-Za-z0-9._:-]{8,120}$/.test(fulfillmentId)) {
      return res.status(400).json({ error: "Invalid fulfillment receipt identity." });
    }

    // V2.0.24 — the fulfillment receipt is bound to the PayPal capture identity.
    const canonicalFulfillmentId = "GEI-FULFILL-" + String(captureID).replace(/[^A-Za-z0-9._:-]/g, "-");
    if (fulfillmentId !== canonicalFulfillmentId) {
      return res.status(403).json({ error: "Fulfillment receipt does not match this payment." });
    }

    const result = await fulfillEntitlement(claimToken, captureID, fulfillmentId);

    if (!result.ok) {
      if (result.reason === "NOT_FOUND") {
        return res.status(404).json({ error: "Entitlement not found." });
      }
      if (result.reason === "CAPTURE_MISMATCH") {
        return res.status(403).json({ error: "Entitlement does not match this payment." });
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
        captureID: result.record.captureID,
        orderID: result.record.orderID,
        status: result.record.status,
        auditVersion: ECONOMY_AUTHORITY_VERSION,
        authoritative: auditReceipt(result.record).authoritative
      }
    });
  } catch (err) {
    console.error("[PayPal fulfill-entitlement]", err);
    return res.status(500).json({ error: err.message || "Unable to fulfill entitlement." });
  }
}
