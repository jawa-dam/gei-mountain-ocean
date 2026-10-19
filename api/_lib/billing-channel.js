import { PACKS, getPack, ECONOMY_AUTHORITY_VERSION } from "./economy-authority.js";

export const BILLING_CHANNELS = Object.freeze({
  PAYPAL: "paypal",
  GOOGLE_PLAY: "google_play"
});

export const GOOGLE_PLAY_PRODUCT_MAP = Object.freeze({
  "single":                 "com.yalltoo.taplites.gei.single_song",
  "ten":                    "com.yalltoo.taplites.gei.ten_songs",
  "twentyfive":             "com.yalltoo.taplites.gei.twentyfive_songs",
  "special-jesus":          "com.yalltoo.taplites.gei.char_jesus",
  "special-dam-black-jesus":"com.yalltoo.taplites.gei.char_dam_black_jesus",
  "special-devil":          "com.yalltoo.taplites.gei.char_devil"
});

const REVERSE_PRODUCT_MAP = Object.freeze(
  Object.fromEntries(
    Object.entries(GOOGLE_PLAY_PRODUCT_MAP).map(([k, v]) => [v, k])
  )
);

export function packIdFromPlayProductId(playProductId) {
  return REVERSE_PRODUCT_MAP[playProductId] || null;
}

export function playProductIdFromPackId(packId) {
  return GOOGLE_PLAY_PRODUCT_MAP[packId] || null;
}

export function isConsumable(packId) {
  const pack = getPack(packId);
  return !!pack && pack.kind !== "special-character";
}

export function validatePlayProductMapping(playProductId) {
  const packId = packIdFromPlayProductId(playProductId);
  if (!packId) return { ok: false, reason: "UNKNOWN_PLAY_PRODUCT" };
  const pack = getPack(packId);
  if (!pack) return { ok: false, reason: "PACK_NOT_FOUND" };
  return {
    ok: true,
    packId,
    playProductId,
    pack,
    consumable: isConsumable(packId)
  };
}

export function allProductMappings() {
  return Object.entries(GOOGLE_PLAY_PRODUCT_MAP).map(([packId, playProductId]) => {
    const pack = getPack(packId);
    return {
      packId,
      playProductId,
      label: pack?.label || packId,
      price: pack?.price || "0.00",
      flOz: pack?.flOz ?? 0,
      consumable: isConsumable(packId),
      kind: pack?.kind || "fl-oz",
      characterId: pack?.characterId || null,
      economyAuthorityVersion: ECONOMY_AUTHORITY_VERSION
    };
  });
}
