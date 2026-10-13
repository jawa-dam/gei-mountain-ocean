/**
 * Play Billing Bridge — Client-Side Interface
 *
 * Provides the web-side of the TWA ↔ native BillingClient communication.
 * The native Android TWA wrapper injects `window.PlayBillingBridge` with methods:
 *   - launchBillingFlow(playProductId) → Promise<{purchaseToken, orderId, playProductId}>
 *   - queryPurchases() → Promise<[{purchaseToken, orderId, playProductId, purchaseState}]>
 *   - consumePurchase(purchaseToken) → Promise<{ok}>
 *
 * This module wraps that native bridge with server-side verification,
 * entitlement claim/fulfill, and client-side credit — mirroring the PayPal
 * checkout flow's security guarantees.
 *
 * The game never grants entitlements based on the native bridge response alone.
 * Every purchase goes through: Native Purchase → Server Verify → Claim → Fulfill → Credit.
 */

(function() {
  "use strict";

  var PLAY_BILLING_AVAILABLE = false;
  var PLAY_BILLING_PRODUCTS = null;

  function isPlayBillingAvailable() {
    return PLAY_BILLING_AVAILABLE &&
      typeof window.PlayBillingBridge === "object" &&
      typeof window.PlayBillingBridge.launchBillingFlow === "function";
  }

  function detectPlayBillingEnvironment() {
    if (typeof window.PlayBillingBridge === "object" &&
        typeof window.PlayBillingBridge.launchBillingFlow === "function") {
      PLAY_BILLING_AVAILABLE = true;
      return true;
    }

    var ref = document.referrer || "";
    if (ref.indexOf("android-app://") === 0) {
      console.log("[PlayBilling] TWA detected via referrer but native bridge not available yet.");
    }

    return false;
  }

  async function fetchPlayProducts() {
    if (PLAY_BILLING_PRODUCTS) return PLAY_BILLING_PRODUCTS;

    var apiUrl = (typeof window.__GEI_API_URL__ === "function")
      ? window.__GEI_API_URL__("/api/playbilling/products")
      : "/api/playbilling/products";

    var response = await fetch(apiUrl);
    var data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.error || "Failed to load Play Billing products.");

    PLAY_BILLING_PRODUCTS = data;
    return data;
  }

  function playFulfillmentId(orderId) {
    return "GEI-PLAY-FULFILL-" + String(orderId || "").replace(/[^A-Za-z0-9._:-]/g, "-");
  }

  function playClaimId(orderId) {
    var storageKey = "gei.playbilling.claim." + orderId;
    try {
      var existing = sessionStorage.getItem(storageKey);
      if (existing) return existing;
    } catch(e) {}
    var id = "play-claim-" + crypto.randomUUID();
    try { sessionStorage.setItem(storageKey, id); } catch(e) {}
    return id;
  }

  async function fetchJson(url, options, attempts) {
    attempts = attempts || 3;
    var lastError = null;
    var requestUrl = (typeof window.__GEI_API_URL__ === "function")
      ? window.__GEI_API_URL__(url)
      : url;

    for (var attempt = 1; attempt <= attempts; attempt++) {
      try {
        var response = await fetch(requestUrl, options);
        var data = await response.json().catch(function() { return {}; });
        if (response.ok || response.status < 500) return { response: response, data: data };
        lastError = new Error(data.error || ("HTTP " + response.status));
      } catch(err) { lastError = err; }
      if (attempt < attempts) await new Promise(function(r) { setTimeout(r, 350 * attempt); });
    }
    throw lastError || new Error("Play Billing request failed.");
  }

  /**
   * Main purchase flow for Google Play Billing.
   * Called by the game's startCheckout when running inside a TWA.
   *
   * @param {string} packId - The game's pack ID (e.g. "single", "special-jesus")
   * @param {object} callbacks - { onStatus, onCredit, onError }
   */
  async function startPlayCheckout(packId, callbacks) {
    callbacks = callbacks || {};
    var onStatus = callbacks.onStatus || function() {};
    var onCredit = callbacks.onCredit || function() {};
    var onError = callbacks.onError || function() {};

    try {
      if (!isPlayBillingAvailable()) {
        throw new Error("Google Play Billing is not available in this environment.");
      }

      onStatus("Loading product catalog…");
      var catalog = await fetchPlayProducts();
      var productInfo = catalog.products.find(function(p) { return p.packId === packId; });
      if (!productInfo) throw new Error("Product not found in Play Billing catalog.");

      var playProductId = productInfo.playProductId;

      // Step 1: Launch native billing flow
      onStatus("Opening Google Play purchase…");
      var nativeResult;
      try {
        nativeResult = await window.PlayBillingBridge.launchBillingFlow(playProductId);
      } catch(e) {
        if (e && (e.code === "USER_CANCELED" || e.message === "USER_CANCELED")) {
          onStatus("Purchase cancelled.");
          return { ok: false, cancelled: true };
        }
        throw e;
      }

      if (!nativeResult || !nativeResult.purchaseToken || !nativeResult.orderId) {
        throw new Error("Google Play did not return a valid purchase result.");
      }

      var purchaseToken = nativeResult.purchaseToken;
      var orderId = nativeResult.orderId;

      // Step 2: Server-side verification (CRITICAL — never trust client alone)
      onStatus("Verifying purchase with server…");
      var verifyResult = await fetchJson("/api/playbilling/verify-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchaseToken: purchaseToken,
          playProductId: playProductId,
          orderId: orderId
        })
      });

      if (!verifyResult.response.ok || !verifyResult.data.ok) {
        throw new Error(verifyResult.data.error || "Purchase verification failed.");
      }

      var claimToken = verifyResult.data.claimToken;

      // Step 3: Claim entitlement
      onStatus("Securing entitlement…");
      var claimId = playClaimId(orderId);
      var claimResult = await fetchJson("/api/playbilling/claim-entitlement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claimToken: claimToken,
          claimId: claimId
        })
      });

      if (!claimResult.response.ok || !claimResult.data.ok) {
        throw new Error(claimResult.data.error || "Entitlement claim failed.");
      }

      // Step 4: Fulfill entitlement
      onStatus("Fulfilling purchase…");
      var fulfillmentId = playFulfillmentId(orderId);
      var fulfillResult = await fetchJson("/api/playbilling/fulfill-entitlement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claimToken: claimToken,
          fulfillmentId: fulfillmentId
        })
      });

      if (!fulfillResult.response.ok || !fulfillResult.data.ok || !fulfillResult.data.receipt) {
        throw new Error(fulfillResult.data.error || "Entitlement fulfillment failed.");
      }

      var receipt = fulfillResult.data.receipt;

      // Step 5: Consume on Google Play (for consumable products)
      if (productInfo.consumable && window.PlayBillingBridge.consumePurchase) {
        try {
          await window.PlayBillingBridge.consumePurchase(purchaseToken);
        } catch(e) {
          console.error("[PlayBilling] Consume failed (non-fatal):", e);
        }
      }

      // Step 6: Client-side credit (same creditPack as PayPal flow)
      onStatus("Applying to your account…");
      var creditResult = onCredit(receipt.packId, receipt.fulfillmentId, {
        orderID: orderId,
        captureID: orderId,
        serverAuthorized: true,
        fulfillmentId: receipt.fulfillmentId,
        productType: receipt.productType,
        characterId: receipt.characterId
      });

      // Clean up session storage
      try { sessionStorage.removeItem("gei.playbilling.claim." + orderId); } catch(e) {}

      onStatus("Purchase complete!");
      return {
        ok: true,
        packId: receipt.packId,
        fulfillmentId: receipt.fulfillmentId,
        orderId: orderId,
        creditResult: creditResult
      };

    } catch(err) {
      console.error("[PlayBilling checkout]", err);
      onError(err.message || "Google Play purchase failed.");
      return { ok: false, error: err.message };
    }
  }

  /**
   * Restore previously purchased non-consumable items.
   */
  async function restorePlayPurchases(callbacks) {
    callbacks = callbacks || {};
    var onStatus = callbacks.onStatus || function() {};
    var onCredit = callbacks.onCredit || function() {};

    if (!isPlayBillingAvailable()) return { ok: false, reason: "NOT_AVAILABLE" };

    try {
      onStatus("Querying Google Play for purchases…");
      var purchases = await window.PlayBillingBridge.queryPurchases();
      if (!Array.isArray(purchases) || purchases.length === 0) {
        return { ok: true, restored: 0 };
      }

      var validPurchases = purchases
        .filter(function(p) { return p.orderId && p.purchaseState === 0; });

      var orderIds = validPurchases.map(function(p) { return p.orderId; });

      if (orderIds.length === 0) return { ok: true, restored: 0 };

      var purchaseTokens = validPurchases
        .filter(function(p) { return p.purchaseToken && p.playProductId; })
        .map(function(p) { return { orderId: p.orderId, purchaseToken: p.purchaseToken, playProductId: p.playProductId }; });

      onStatus("Checking entitlements…");
      var result = await fetchJson("/api/playbilling/restore-purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: orderIds, purchaseTokens: purchaseTokens })
      });

      if (!result.response.ok || !result.data.ok) {
        throw new Error(result.data.error || "Restoration failed.");
      }

      var restored = 0;
      for (var i = 0; i < result.data.restorations.length; i++) {
        var r = result.data.restorations[i];
        if (r.ok && r.status === "FULFILLED" && r.fulfillmentId) {
          var creditResult = onCredit(r.packId, r.fulfillmentId, {
            orderID: r.orderId,
            captureID: r.orderId,
            serverAuthorized: true,
            fulfillmentId: r.fulfillmentId,
            productType: r.productType,
            characterId: r.characterId
          });
          if (creditResult && creditResult.ok) restored++;
        }
      }

      return { ok: true, restored: restored };
    } catch(err) {
      console.error("[PlayBilling restore]", err);
      return { ok: false, error: err.message };
    }
  }

  // Expose to global scope for game integration
  window.GeiPlayBilling = {
    detect: detectPlayBillingEnvironment,
    isAvailable: isPlayBillingAvailable,
    startCheckout: startPlayCheckout,
    restorePurchases: restorePlayPurchases,
    fetchProducts: fetchPlayProducts,
    _fulfillmentId: playFulfillmentId
  };
})();
