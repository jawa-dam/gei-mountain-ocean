export const ECONOMY_AUTHORITY_VERSION = "2.0.25";
export const ECONOMY_MAX_FL_OZ = 1000000000;
export const PACKS = Object.freeze({
  single: Object.freeze({ label:"1 Song", price:"1.00", flOz:6660 }),
  ten: Object.freeze({ label:"10 Songs", price:"3.00", flOz:66600 }),
  twentyfive: Object.freeze({ label:"25 Songs", price:"6.00", flOz:166500 })
});

export function getPack(packId) {
  return PACKS[packId] || null;
}

export function canonicalFulfillmentId(captureID) {
  return "GEI-FULFILL-" + String(captureID || "").replace(/[^A-Za-z0-9._:-]/g, "-");
}

export function validatePackAuthority(packId, amount, currency = "USD") {
  const pack = getPack(packId);
  return !!pack && currency === "USD" && amount === pack.price;
}

export function validateEntitlementAuthority({ packId, flOz, amount, currency = "USD" }) {
  const pack = getPack(packId);
  return !!pack &&
    currency === "USD" &&
    amount === pack.price &&
    Number(flOz) === pack.flOz &&
    Number.isInteger(pack.flOz) &&
    pack.flOz > 0;
}

export function auditReceipt(record) {
  const pack = getPack(record?.packId);
  return {
    auditVersion: ECONOMY_AUTHORITY_VERSION,
    authoritative: !!pack &&
      record?.currency === "USD" &&
      record?.amount === pack.price &&
      Number(record?.flOz) === pack.flOz,
    packId: record?.packId || null,
    flOz: pack?.flOz ?? null,
    amount: pack?.price ?? null,
    currency: "USD"
  };
}

/*
 * V2.0.26 — Reconcile an existing durable record against the
 * canonical economy authority. This is detection only: it never
 * rewrites the financial record.
 */
export function reconcileEntitlementAuthority(record) {
  const pack = getPack(record?.packId);
  const audit = auditReceipt(record);
  const reasons = [];

  if (!record) reasons.push("MISSING_RECORD");
  if (!pack) reasons.push("UNKNOWN_PACK");
  if (record?.currency !== "USD") reasons.push("CURRENCY_DRIFT");
  if (pack && record?.amount !== pack.price) reasons.push("AMOUNT_DRIFT");
  if (pack && Number(record?.flOz) !== pack.flOz) reasons.push("FL_OZ_DRIFT");
  if (record?.auditVersion && record.auditVersion !== ECONOMY_AUTHORITY_VERSION) {
    reasons.push("AUDIT_VERSION_DRIFT");
  }
  if (record?.audit && record.audit.authoritative !== true) {
    reasons.push("NON_AUTHORITATIVE_AUDIT");
  }
  if (record?.audit && (
    record.audit.packId !== pack?.[record?.packId ? "packId" : ""] ||
    record.audit.amount !== pack?.price ||
    Number(record.audit.flOz) !== pack?.flOz ||
    record.audit.currency !== "USD"
  )) {
    reasons.push("AUDIT_RECORD_DRIFT");
  }
  if (record?.captureID && record?.fulfillmentId &&
      record.fulfillmentId !== canonicalFulfillmentId(record.captureID)) {
    reasons.push("FULFILLMENT_ID_DRIFT");
  }

  const authoritative = reasons.length === 0 && audit.authoritative === true;

  return {
    ok: authoritative,
    authoritative,
    driftDetected: !authoritative,
    reasons,
    auditVersion: ECONOMY_AUTHORITY_VERSION,
    audit
  };
}
