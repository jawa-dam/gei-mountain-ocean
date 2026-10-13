import {
  getPlayEntitlement,
  revokePlayEntitlement,
  recordRtdnEvent
} from "../_lib/playbilling-ledger.js";
import {
  ECONOMY_AUTHORITY_VERSION,
  getPack
} from "../_lib/economy-authority.js";
import {
  packIdFromPlayProductId,
  isConsumable
} from "../_lib/billing-channel.js";

const SUPPORTED_NOTIFICATION_TYPES = Object.freeze({
  1: "ONE_TIME_PRODUCT_PURCHASED",
  2: "ONE_TIME_PRODUCT_CANCELED",
  3: "ONE_TIME_PRODUCT_REFUNDED",
  5: "ONE_TIME_PRODUCT_REVOKED",
  12: "ONE_TIME_PRODUCT_PENDING_PURCHASE_CANCELED"
});

const REVOCABLE_NOTIFICATION_TYPES = new Set([2, 3, 5, 12]);

function parseNotificationPayload(body) {
  if (!body || !body.message) return { ok: false, reason: "MISSING_MESSAGE" };

  let data;
  try {
    const raw = body.message.data;
    if (!raw) return { ok: false, reason: "MISSING_DATA" };
    data = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  } catch {
    return { ok: false, reason: "MALFORMED_DATA" };
  }

  if (!data.oneTimeProductNotification) {
    return { ok: false, reason: "UNSUPPORTED_NOTIFICATION_TYPE" };
  }

  const notif = data.oneTimeProductNotification;
  const notificationType = notif.notificationType;

  if (!SUPPORTED_NOTIFICATION_TYPES[notificationType]) {
    return { ok: false, reason: "UNKNOWN_NOTIFICATION_TYPE", notificationType };
  }

  return {
    ok: true,
    packageName: data.packageName || null,
    eventTimeMillis: data.eventTimeMillis || null,
    purchaseToken: notif.purchaseToken || null,
    sku: notif.sku || null,
    notificationType,
    notificationLabel: SUPPORTED_NOTIFICATION_TYPES[notificationType],
    messageId: body.message.messageId || null
  };
}

async function verifyPurchaseStateWithGoogle(packageName, playProductId, purchaseToken) {
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
    return { ok: false, reason: "GOOGLE_API_PARSE_ERROR", status: response.status };
  }

  if (!response.ok) {
    return {
      ok: false,
      reason: "GOOGLE_API_ERROR",
      status: response.status,
      message: purchaseData.error?.message || "Google Play API verification failed."
    };
  }

  return { ok: true, purchase: purchaseData };
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
    const rtdnSecret = process.env.GOOGLE_RTDN_VERIFICATION_TOKEN;
    if (rtdnSecret) {
      const providedToken = req.query?.token || req.headers?.["x-rtdn-token"];
      if (providedToken !== rtdnSecret) {
        return res.status(403).json({ error: "Unauthorized notification." });
      }
    }

    const parsed = parseNotificationPayload(req.body);
    if (!parsed.ok) {
      return res.status(200).json({
        ok: false,
        reason: parsed.reason,
        ack: true
      });
    }

    const expectedPackage = process.env.GOOGLE_PLAY_PACKAGE_NAME || "com.yalltoo.taplites.gei";
    if (parsed.packageName && parsed.packageName !== expectedPackage) {
      return res.status(200).json({
        ok: false,
        reason: "WRONG_PACKAGE",
        ack: true
      });
    }

    if (!parsed.purchaseToken || !parsed.sku) {
      return res.status(200).json({
        ok: false,
        reason: "MISSING_PURCHASE_IDENTITY",
        ack: true
      });
    }

    const packId = packIdFromPlayProductId(parsed.sku);
    if (!packId) {
      return res.status(200).json({
        ok: false,
        reason: "UNKNOWN_PRODUCT",
        ack: true
      });
    }

    const eventResult = await recordRtdnEvent({
      messageId: parsed.messageId,
      notificationType: parsed.notificationType,
      notificationLabel: parsed.notificationLabel,
      purchaseToken: parsed.purchaseToken,
      sku: parsed.sku,
      packId,
      eventTimeMillis: parsed.eventTimeMillis
    });

    if (!eventResult.created) {
      return res.status(200).json({
        ok: true,
        action: "DUPLICATE_IGNORED",
        ack: true
      });
    }

    if (parsed.notificationType === 1) {
      return res.status(200).json({
        ok: true,
        action: "PURCHASE_NOTED",
        ack: true
      });
    }

    if (!REVOCABLE_NOTIFICATION_TYPES.has(parsed.notificationType)) {
      return res.status(200).json({
        ok: true,
        action: "NOTED",
        ack: true
      });
    }

    const verification = await verifyPurchaseStateWithGoogle(
      expectedPackage,
      parsed.sku,
      parsed.purchaseToken
    );

    if (!verification.ok) {
      await recordRtdnEvent({
        messageId: (parsed.messageId || "unknown") + ":google-api-failed",
        notificationType: parsed.notificationType,
        notificationLabel: "GOOGLE_API_VERIFICATION_FAILED",
        purchaseToken: parsed.purchaseToken,
        sku: parsed.sku,
        packId,
        eventTimeMillis: parsed.eventTimeMillis,
        googleApiError: verification.reason
      });

      return res.status(200).json({
        ok: false,
        reason: "GOOGLE_VERIFICATION_FAILED",
        retryable: true,
        ack: true
      });
    }

    const purchase = verification.purchase;
    const purchaseState = purchase.purchaseState;

    if (purchaseState === 0 && purchase.acknowledgementState === 1) {
      return res.status(200).json({
        ok: true,
        action: "PURCHASE_STILL_VALID",
        purchaseState,
        ack: true
      });
    }

    const consumable = isConsumable(packId);
    const revocationResult = await revokePlayEntitlement({
      purchaseToken: parsed.purchaseToken,
      packId,
      notificationType: parsed.notificationType,
      notificationLabel: parsed.notificationLabel,
      googlePurchaseState: purchaseState,
      consumable
    });

    return res.status(200).json({
      ok: true,
      action: revocationResult.action,
      packId,
      consumable,
      notificationType: parsed.notificationType,
      notificationLabel: parsed.notificationLabel,
      ack: true
    });
  } catch (err) {
    console.error("[PlayBilling RTDN]", err);
    return res.status(500).json({
      error: "Unable to process notification.",
      retryable: true
    });
  }
}

export { parseNotificationPayload, SUPPORTED_NOTIFICATION_TYPES, REVOCABLE_NOTIFICATION_TYPES };
