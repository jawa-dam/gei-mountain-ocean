export const ECONOMY_AUTHORITY_VERSION = "2.0.25";
export const ECONOMY_RECONCILIATION_VERSION = "2.0.26";
export const ECONOMY_MAX_FL_OZ = 1000000000;

/* V2.1.13 — authoritative store pricing.
   Pack IDs and FL OZ fulfillment remain unchanged; USD prices are now $6 / $12 / $18. */
export const PACKS = Object.freeze({
  single: Object.freeze({ label:"1 Song", price:"6.00", flOz:6660 }),
  ten: Object.freeze({ label:"10 Songs", price:"12.00", flOz:66600 }),
  twentyfive: Object.freeze({ label:"25 Songs", price:"18.00", flOz:166500 }),
  "special-jesus": Object.freeze({ label:"Jesus — Special Character", price:"12.00", flOz:0, kind:"special-character", characterId:"jesus", cashOnly:true, machineEligible:false }),
  "special-dam-black-jesus": Object.freeze({ label:"DAM Black Jesus — Special Character", price:"12.00", flOz:0, kind:"special-character", characterId:"dam-black-jesus", cashOnly:true, machineEligible:false }),
  "special-devil": Object.freeze({ label:"Devil — Special Character", price:"6.00", flOz:0, kind:"special-character", characterId:"devil", cashOnly:true, machineEligible:false })
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
  const special = pack?.kind === "special-character";
  return !!pack &&
    currency === "USD" &&
    amount === pack.price &&
    Number(flOz) === pack.flOz &&
    Number.isInteger(pack.flOz) &&
    (special
      ? Number(flOz) === 0 &&
        typeof pack.characterId === "string" &&
        pack.cashOnly === true &&
        pack.machineEligible === false
      : pack.flOz > 0);
}

export function auditReceipt(record) {
  const pack = getPack(record?.packId);
  return {
    auditVersion: ECONOMY_AUTHORITY_VERSION,
    authoritative: !!pack &&
      record?.currency === "USD" &&
      record?.amount === pack.price &&
      Number(record?.flOz) === pack.flOz &&
      (pack.kind === "special-character"
        ? record?.productType === "special-character" &&
          record?.characterId === pack.characterId &&
          pack.cashOnly === true &&
          pack.machineEligible === false
        : (record?.productType === "fl-oz" || !record?.productType)),
    packId: record?.packId || null,
    flOz: pack?.flOz ?? null,
    amount: pack?.price ?? null,
    currency: "USD",
    productType: pack?.kind || "fl-oz",
    characterId: pack?.characterId || null
  };
}

/*
 * V2.0.26 — Reconcile an existing durable record against the
 * canonical economy authority. Detection only: it never rewrites
 * the financial record.
 */
export function reconcileEntitlementAuthority(record) {
  const packId = record?.packId || null;
  const pack = getPack(packId);
  const audit = auditReceipt(record);
  const reasons = [];

  if (!record) reasons.push("MISSING_RECORD");
  if (!pack) reasons.push("UNKNOWN_PACK");
  if (record?.currency !== "USD") reasons.push("CURRENCY_DRIFT");
  if (pack && record?.amount !== pack.price) reasons.push("AMOUNT_DRIFT");
  if (pack && Number(record?.flOz) !== pack.flOz) reasons.push("FL_OZ_DRIFT");
  if (pack?.kind === "special-character") {
    if (pack.cashOnly !== true) reasons.push("CASH_ONLY_POLICY_DRIFT");
    if (pack.machineEligible !== false) reasons.push("MACHINE_ELIGIBILITY_DRIFT");
    if (record?.productType !== "special-character") reasons.push("PRODUCT_TYPE_DRIFT");
    if (record?.characterId !== pack.characterId) reasons.push("CHARACTER_ID_DRIFT");
  } else if (record?.productType && record.productType !== "fl-oz") {
    reasons.push("PRODUCT_TYPE_DRIFT");
  }
  if (record?.auditVersion !== ECONOMY_AUTHORITY_VERSION) {
    reasons.push("AUDIT_VERSION_DRIFT");
  }
  if (record?.audit?.authoritative !== true) {
    reasons.push("NON_AUTHORITATIVE_AUDIT");
  }
  if (record?.audit && (
    record.audit.packId !== packId ||
    record.audit.amount !== pack?.price ||
    Number(record.audit.flOz) !== pack?.flOz ||
    record.audit.currency !== "USD" ||
    (pack?.kind === "special-character" && (record.audit.productType !== "special-character" || record.audit.characterId !== pack.characterId))
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
    reconciliationVersion: ECONOMY_RECONCILIATION_VERSION,
    auditVersion: ECONOMY_AUTHORITY_VERSION,
    audit
  };
}
