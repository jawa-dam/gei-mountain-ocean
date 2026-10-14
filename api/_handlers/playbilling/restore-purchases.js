import { getPlayEntitlement } from "../../_lib/playbilling-ledger.js";
import { ECONOMY_AUTHORITY_VERSION, getPack } from "../../_lib/economy-authority.js";
import { packIdFromPlayProductId, isConsumable } from "../../_lib/billing-channel.js";

async function verifyPurchaseTokenWithGoogle(packageName, playProductId, purchaseToken) {
  const keyJson = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_KEY;
  if (!keyJson) return { ok: false, reason: "SERVICE_ACCOUNT_NOT_CONFIGURED" };

  try {
    const key = JSON.parse(keyJson);
    const now = Math.floor(Date.now() / 1000);
    const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }))
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const claims = btoa(JSON.stringify({
      iss: key.client_email,
      scope: "https://www.googleapis.com/auth/androidpublisher",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600
    })).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

    const signingInput = header + "." + claims;
    const privateKey = await crypto.subtle.importKey(
      "pkcs8",
      pemToArrayBuffer(key.private_key),
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signature = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      privateKey,
      new TextEncoder().encode(signingInput)
    );
    const sig = btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const jwt = signingInput + "." + sig;

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=" + jwt
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      return { ok: false, reason: "GOOGLE_AUTH_FAILED" };
    }

    const endpoint = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(packageName)}/purchases/products/${encodeURIComponent(playProductId)}/tokens/${encodeURIComponent(purchaseToken)}`;
    const response = await fetch(endpoint, {
      headers: { Authorization: "Bearer " + tokenData.access_token },
      cache: "no-store"
    });

    let purchaseData;
    try {
      purchaseData = await response.json();
    } catch {
      return { ok: false, reason: "GOOGLE_API_PARSE_ERROR" };
    }

    if (!response.ok) {
      return { ok: false, reason: "GOOGLE_API_ERROR", status: response.status };
    }

    return { ok: true, purchase: purchaseData };
  } catch {
    return { ok: false, reason: "GOOGLE_VERIFICATION_ERROR" };
  }
}

function pemToArrayBuffer(pem) {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { orderIds, purchaseTokens } = req.body || {};
    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ error: "Missing order IDs for restoration." });
    }
    if (orderIds.length > 50) {
      return res.status(400).json({ error: "Too many order IDs (max 50)." });
    }

    const packageName = process.env.GOOGLE_PLAY_PACKAGE_NAME || "com.yalltoo.taplites.gei";
    const tokenMap = {};
    if (Array.isArray(purchaseTokens)) {
      for (const entry of purchaseTokens) {
        if (entry && typeof entry.orderId === "string" && typeof entry.purchaseToken === "string" && typeof entry.playProductId === "string") {
          tokenMap[entry.orderId] = entry;
        }
      }
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

      if (record.status === "REVOKED") {
        results.push({
          orderId,
          ok: false,
          reason: "REVOKED",
          packId: record.packId,
          revokedAt: record.revokedAt || null
        });
        continue;
      }

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

      const tokenInfo = tokenMap[orderId];

      if (!consumable && !tokenInfo) {
        results.push({
          orderId,
          ok: false,
          reason: "TOKEN_REQUIRED",
          packId: record.packId
        });
        continue;
      }

      if (tokenInfo) {
        if (record.playProductId && tokenInfo.playProductId !== record.playProductId) {
          results.push({
            orderId,
            ok: false,
            reason: "PRODUCT_ID_MISMATCH",
            packId: record.packId
          });
          continue;
        }

        const googleResult = await verifyPurchaseTokenWithGoogle(
          packageName,
          tokenInfo.playProductId,
          tokenInfo.purchaseToken
        );

        if (googleResult.ok) {
          const purchase = googleResult.purchase;
          if (purchase.purchaseState !== 0) {
            results.push({
              orderId,
              ok: false,
              reason: "PURCHASE_NOT_VALID",
              purchaseState: purchase.purchaseState,
              packId: record.packId
            });
            continue;
          }

          if (!purchase.orderId || purchase.orderId !== orderId) {
            results.push({
              orderId,
              ok: false,
              reason: "ORDER_ID_MISMATCH",
              packId: record.packId
            });
            continue;
          }

          if (!purchase.productId || purchase.productId !== tokenInfo.playProductId) {
            results.push({
              orderId,
              ok: false,
              reason: "GOOGLE_PRODUCT_ID_MISMATCH",
              packId: record.packId
            });
            continue;
          }

          const freshEntitlement = await getPlayEntitlement(orderId);
          if (freshEntitlement.ok && freshEntitlement.record.status === "REVOKED") {
            results.push({
              orderId,
              ok: false,
              reason: "REVOKED",
              packId: record.packId,
              revokedAt: freshEntitlement.record.revokedAt || null
            });
            continue;
          }

          const current = freshEntitlement.ok ? freshEntitlement.record : record;
          results.push({
            orderId,
            ok: true,
            status: current.status,
            packId: current.packId,
            flOz: current.flOz,
            productType: current.productType || "fl-oz",
            characterId: current.characterId || null,
            consumable,
            claimedAt: current.claimedAt,
            fulfilledAt: current.fulfilledAt,
            fulfillmentId: current.fulfillmentId || null,
            googleVerified: true
          });
        } else {
          results.push({
            orderId,
            ok: false,
            reason: "GOOGLE_VERIFICATION_FAILED",
            packId: record.packId,
            googleError: googleResult.reason
          });
        }
        continue;
      }

      results.push({
        orderId,
        ok: false,
        reason: "TOKEN_REQUIRED",
        packId: record.packId
      });
    }

    return res.status(200).json({
      ok: true,
      restorations: results,
      economyAuthorityVersion: ECONOMY_AUTHORITY_VERSION
    });
  } catch (err) {
    console.error("[PlayBilling restore-purchases]", err);
    return res.status(500).json({ error: "Unable to restore purchases." });
  }
}
