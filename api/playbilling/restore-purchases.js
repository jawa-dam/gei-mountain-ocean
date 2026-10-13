import { getPlayEntitlement } from "../_lib/playbilling-ledger.js";
import { ECONOMY_AUTHORITY_VERSION, getPack } from "../_lib/economy-authority.js";
import { packIdFromPlayProductId, isConsumable } from "../_lib/billing-channel.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { orderIds } = req.body || {};
    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ error: "Missing order IDs for restoration." });
    }
    if (orderIds.length > 50) {
      return res.status(400).json({ error: "Too many order IDs (max 50)." });
    }

    const results = [];
    for (const orderId of orderIds) {
      if (typeof orderId !== "string" || !orderId) continue;

      const entitlement = await getPlayEntitlement(orderId);
      if (!entitlement.ok) {
        results.push({ orderId, ok: false, reason: entitlement.reason || "NOT_FOUND" });
        continue;
      }

      const record = entitlement.record;
      const pack = getPack(record.packId);
      const consumable = isConsumable(record.packId);

      if (consumable && record.status === "FULFILLED") {
        results.push({
          orderId,
          ok: true,
          status: record.status,
          packId: record.packId,
          flOz: record.flOz,
          consumable: true,
          alreadyFulfilled: true
        });
        continue;
      }

      results.push({
        orderId,
        ok: true,
        status: record.status,
        packId: record.packId,
        flOz: record.flOz,
        productType: record.productType || "fl-oz",
        characterId: record.characterId || null,
        consumable,
        claimedAt: record.claimedAt,
        fulfilledAt: record.fulfilledAt,
        fulfillmentId: record.fulfillmentId || null
      });
    }

    return res.status(200).json({
      ok: true,
      restorations: results,
      economyAuthorityVersion: ECONOMY_AUTHORITY_VERSION
    });
  } catch (err) {
    console.error("[PlayBilling restore-purchases]", err);
    return res.status(500).json({ error: err.message || "Unable to restore purchases." });
  }
}
