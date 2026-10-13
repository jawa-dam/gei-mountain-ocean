import { recordPlayEntitlement } from "../_lib/playbilling-ledger.js";
import {
  PACKS,
  ECONOMY_AUTHORITY_VERSION,
  validateEntitlementAuthority
} from "../_lib/economy-authority.js";
import {
  packIdFromPlayProductId,
  validatePlayProductMapping,
  isConsumable
} from "../_lib/billing-channel.js";

async function getGoogleAccessToken() {
  const keyJson = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_KEY;
  if (!keyJson) throw new Error("Google Play service account is not configured.");

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

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=" + jwt
  });

  const data = await response.json();
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || "Google OAuth2 authentication failed.");
  }
  return data.access_token;
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

async function verifyPurchaseWithGoogle({ packageName, playProductId, purchaseToken, consumable }) {
  const accessToken = await getGoogleAccessToken();

  const endpoint = consumable
    ? `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(packageName)}/purchases/products/${encodeURIComponent(playProductId)}/tokens/${encodeURIComponent(purchaseToken)}`
    : `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(packageName)}/purchases/products/${encodeURIComponent(playProductId)}/tokens/${encodeURIComponent(purchaseToken)}`;

  const response = await fetch(endpoint, {
    headers: { Authorization: "Bearer " + accessToken },
    cache: "no-store"
  });

  const data = await response.json();
  if (!response.ok) {
    return {
      ok: false,
      reason: "GOOGLE_API_ERROR",
      status: response.status,
      message: data.error?.message || "Google Play API verification failed."
    };
  }

  return { ok: true, purchase: data };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { purchaseToken, playProductId, orderId } = req.body || {};

    if (!purchaseToken || typeof purchaseToken !== "string") {
      return res.status(400).json({ error: "Missing purchase token." });
    }
    if (!playProductId || typeof playProductId !== "string") {
      return res.status(400).json({ error: "Missing Play product ID." });
    }
    if (!orderId || typeof orderId !== "string") {
      return res.status(400).json({ error: "Missing order ID." });
    }
    if (purchaseToken.length > 2048) {
      return res.status(400).json({ error: "Purchase token exceeds maximum length." });
    }

    const mapping = validatePlayProductMapping(playProductId);
    if (!mapping.ok) {
      return res.status(400).json({ error: "Unknown product: " + playProductId });
    }

    const { packId, pack, consumable } = mapping;
    const packageName = process.env.GOOGLE_PLAY_PACKAGE_NAME || "com.yalltoo.taplites.gei";

    if (!validateEntitlementAuthority({
      packId,
      flOz: pack.flOz,
      amount: pack.price,
      currency: "USD"
    })) {
      return res.status(500).json({ error: "Economy authority configuration failed." });
    }

    const verification = await verifyPurchaseWithGoogle({
      packageName,
      playProductId,
      purchaseToken,
      consumable
    });

    if (!verification.ok) {
      return res.status(verification.status === 404 ? 404 : 502).json({
        error: verification.message || "Purchase verification failed.",
        reason: verification.reason
      });
    }

    const purchase = verification.purchase;

    if (purchase.purchaseState !== 0) {
      return res.status(409).json({
        error: "Purchase is not in a completed state.",
        purchaseState: purchase.purchaseState
      });
    }

    if (purchase.orderId && purchase.orderId !== orderId) {
      return res.status(403).json({
        error: "Order ID does not match the purchase."
      });
    }

    if (consumable && purchase.consumptionState === 1) {
      const existing = await (async () => {
        try {
          const { getPlayEntitlement } = await import("../_lib/playbilling-ledger.js");
          return await getPlayEntitlement(orderId);
        } catch { return { ok: false }; }
      })();

      if (existing.ok && existing.record?.status === "FULFILLED") {
        return res.status(200).json({
          ok: true,
          orderId,
          packId,
          flOz: pack.flOz,
          claimToken: orderId,
          fulfillmentStatus: "FULFILLED",
          alreadyVerified: true,
          economyAuthorityVersion: ECONOMY_AUTHORITY_VERSION
        });
      }
    }

    if (purchase.acknowledgementState !== 1) {
      const ackResponse = await acknowledgeWithGoogle({
        packageName,
        playProductId,
        purchaseToken,
        consumable
      });
      if (!ackResponse.ok) {
        console.error("[PlayBilling] Acknowledgement failed:", ackResponse.message);
      }
    }

    const ledgerResult = await recordPlayEntitlement({
      purchaseToken,
      orderId,
      playProductId,
      packId,
      flOz: pack.flOz,
      amount: pack.price,
      currency: "USD"
    });

    return res.status(200).json({
      ok: true,
      orderId,
      packId,
      flOz: pack.flOz,
      claimToken: orderId,
      fulfillmentStatus: ledgerResult.record?.status || "FULFILLABLE",
      alreadyVerified: !ledgerResult.created,
      economyAuthorityVersion: ECONOMY_AUTHORITY_VERSION
    });
  } catch (err) {
    console.error("[PlayBilling verify-purchase]", err);
    if (err?.code === "ECONOMY_DRIFT_DETECTED") {
      return res.status(409).json({
        error: "Economy authority drift detected.",
        code: "ECONOMY_DRIFT_DETECTED",
        reconciliation: err.reconciliation || null
      });
    }
    return res.status(500).json({ error: err.message || "Unable to verify purchase." });
  }
}

async function acknowledgeWithGoogle({ packageName, playProductId, purchaseToken }) {
  try {
    const accessToken = await getGoogleAccessToken();
    const endpoint = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(packageName)}/purchases/products/${encodeURIComponent(playProductId)}/tokens/${encodeURIComponent(purchaseToken)}:acknowledge`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json"
      },
      body: "{}"
    });
    return { ok: response.ok || response.status === 204 };
  } catch (err) {
    return { ok: false, message: err.message };
  }
}
