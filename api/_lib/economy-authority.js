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
