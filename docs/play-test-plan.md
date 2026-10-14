# TapLites: GEI — Internal Play Store Test Plan

**Version**: V2.4.7  
**Status**: Native bridge stabilized, prerequisites documented, not yet executed on device

## External Prerequisites (Manual Setup Required)

### 1. Google Play Developer Account
- [ ] Enroll in Google Play Developer Program ($25 one-time fee)
- [ ] Create app listing for "TapLites: GEI" in Play Console
- [ ] Set application ID: `com.yalltoo.taplites.gei`

### 2. Play Console Product Configuration
- [ ] Create in-app products matching `play-product-catalog.js` IDs:
  - `gei_floz_100` (consumable, FL OZ pack)
  - `gei_floz_500` (consumable, FL OZ pack)
  - `gei_floz_1200` (consumable, FL OZ pack)
  - `gei_character_mountaineer` (non-consumable, character unlock)
  - `gei_character_oceanographer` (non-consumable, character unlock)
- [ ] Set prices matching the existing PayPal catalog
- [ ] Activate products for testing

### 3. Google Cloud Service Account
- [ ] Create a Google Cloud project linked to the Play Console
- [ ] Enable Google Play Android Developer API
- [ ] Create a service account with `androidpublisher` scope
- [ ] Download service account JSON key
- [ ] Store key securely — **never commit to Git**
- [ ] Set `GOOGLE_SERVICE_ACCOUNT_KEY` environment variable in Vercel (encrypted)

### 4. Real-Time Developer Notifications (RTDN)
- [ ] Create Cloud Pub/Sub topic (e.g., `projects/<project>/topics/play-billing-rtdn`)
- [ ] Set Pub/Sub topic in Play Console → Monetization → Monetization setup
- [ ] Configure push subscription pointing to: `https://gei-mountain-ocean.vercel.app/api/playbilling/rtdn-notification`
- [ ] Verify RTDN endpoint receives test pings

### 5. Digital Asset Links
- [ ] Generate release signing keystore (or use Play App Signing)
- [ ] Extract SHA-256 fingerprint from signing certificate
- [ ] Host `/.well-known/assetlinks.json` at `https://gei-mountain-ocean.vercel.app`:
  ```json
  [{
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.yalltoo.taplites.gei",
      "sha256_cert_fingerprints": ["<SHA-256 from signing key>"]
    }
  }]
  ```

### 6. App Signing
- [ ] Generate debug keystore: `keytool -genkey -v -keystore debug.keystore -alias debug -keyalg RSA -keysize 2048 -validity 10000`
- [ ] For release: enroll in Play App Signing (recommended) or create release keystore
- [ ] **Never commit keystores or signing credentials to Git**
- [ ] Document keystore passwords in a secure credential manager

### 7. Android Build Environment
- [ ] Install Android SDK (API 35) and build-tools
- [ ] Set `ANDROID_HOME` / `ANDROID_SDK_ROOT` environment variable
- [ ] Gradle wrapper JAR is committed — run `cd android && ./gradlew assembleDebug`
- [ ] If wrapper JAR is missing: `cd android && gradle wrapper --gradle-version 8.9`
- [ ] Build debug APK: `cd android && ./gradlew assembleDebug`
- [ ] Build release APK: `cd android && ./gradlew assembleRelease` (requires signing config)

**Build command**: `cd android && ./gradlew assembleDebug --no-daemon`  
**Expected output**: `android/app/build/outputs/apk/debug/app-debug.apk`

**Known blocker (V2.4.7)**: Build requires Android SDK with API 35 and AGP 8.7.3. The CI/cloud environment does not have the Android SDK installed. The exact failure is:
```
Plugin [id: 'com.android.application', version: '8.7.3', apply: false] was not found
```
This is resolved by installing the Android SDK locally and running the build on a developer machine.

## V2.4.7 Bridge Contract Changes

### Native Bridge Architecture
The native `PlayBillingBridge.kt` exposes `@JavascriptInterface` methods that return synchronous `String` responses with a `{pending: true, callbackId: "..."}` pattern. A JS shim (`PlayBillingBridge.JS_BRIDGE_SHIM`) injected into the WebView on page start wraps these into `Promise`-returning functions that `play-billing-bridge.js` can `await`.

**Flow**:
1. JS calls `window.PlayBillingBridge.launchBillingFlow(playProductId)` (Promise)
2. Shim calls `window.__NativePlayBillingBridge.launchBillingFlow(playProductId)` (sync String)
3. Native returns `{"pending":true,"callbackId":"billing_<nanoTime>"}` immediately
4. Shim registers callback in `window.__PlayBillingCallbacks[callbackId]` with 120s timeout
5. Native `onPurchasesUpdated` resolves via `webView.evaluateJavascript` + Base64 encoding
6. Shim callback parses the result and resolves/rejects the Promise

### Error Codes
All native errors include structured `{error, code}` JSON:
- `USER_CANCELED` — user dismissed billing dialog
- `PENDING` — purchase is pending (deferred payment)
- `SERVICE_UNAVAILABLE` — BillingClient disconnected
- `PRODUCT_UNAVAILABLE` — product not found or no one-time offer
- `PURCHASE_FAILED` — billing flow returned error
- `DESTROYED` — activity/bridge destroyed with pending callbacks
- `INVALID_ARGS` — empty product ID or purchase token
- `BILLING_ERROR` — uncaught exception during billing flow

### Recovery
- Unresolved purchases (received via `onPurchasesUpdated` with no active callback) are stored in `unresolvedPurchaseJson` and delivered via `getUnresolvedPurchase()` on next page load
- All active callbacks are rejected with `DESTROYED` error on `destroy()`
- BillingClient reconnection handled via `ensureConnected()` with `BillingClientStateListener`

### WebView Security (V2.4.7)
- Navigation validated by scheme+host origin (not hostname alone)
- Only `https://gei-mountain-ocean.vercel.app` loads in the billing WebView
- PayPal URLs (`www.paypal.com`, `www.paypalobjects.com`) open in external browser — billing bridge NOT exposed
- Intent data validated against allowed origins before loading
- `android:usesCleartextTraffic="false"` in AndroidManifest.xml
- `mixedContentMode = MIXED_CONTENT_NEVER_ALLOW` in WebView settings

## Testing Procedure

### Phase A: Local Debug Build
1. Build debug variant: `cd android && ./gradlew assembleDebug`
2. Install on emulator/device: `adb install app/build/outputs/apk/debug/app-debug.apk`
3. Verify WebView loads `https://gei-mountain-ocean.vercel.app`
4. Verify `window.PlayBillingBridge` is detected by `play-billing-bridge.js`
5. Verify the JS shim is injected (check `typeof window.PlayBillingBridge.launchBillingFlow === "function"`)
6. Verify PayPal buttons remain functional (opens in external browser, not in WebView)
7. Verify HTTP URLs are blocked (`usesCleartextTraffic="false"`)

### Phase B: License Testing (Sandbox)
1. Add test accounts in Play Console → Settings → License testing
2. On a test device, sign in with a license test account
3. Attempt purchase of `gei_floz_100`:
   - Verify billing dialog appears
   - Complete sandbox purchase
   - Verify server receives purchase token
   - Verify `verify-purchase` handler validates with Google API
   - Verify `claim-entitlement` creates ledger entry
   - Verify `fulfill-entitlement` credits FL OZ
   - Verify `consumePurchase` acknowledges the consumable
4. Attempt purchase of `gei_character_mountaineer`:
   - Verify non-consumable flow (no consumption step)
   - Verify character unlock persists across sessions
5. Test cancellation:
   - Dismiss billing dialog
   - Verify `USER_CANCELED` error propagates to JS
   - Verify no entitlement created
6. Test restore flow:
   - Clear app data
   - Trigger `restorePurchases()`
   - Verify non-consumable entitlements restored
   - Verify consumables NOT re-credited
7. Test recovery after app restart:
   - Complete purchase, then force-kill app before JS callback
   - Re-open app
   - Verify `getUnresolvedPurchase()` delivers stored purchase
8. Test timeout:
   - Simulate billing dialog with no response for >120s
   - Verify JS Promise rejects with timeout error

### Phase C: RTDN Verification
1. Complete a sandbox purchase
2. Refund via Play Console → Orders
3. Verify RTDN notification received at `/api/playbilling/rtdn-notification`
4. Verify entitlement status changed to `REVOKED`
5. Verify refunded FL OZ deducted / character access revoked
6. Verify duplicate RTDN delivery is idempotent

### Phase D: Edge Cases
1. Cancel mid-purchase → verify no entitlement created
2. Network failure during verify → verify retry works
3. Concurrent purchase + revocation → verify TOCTOU protection
4. Purchase with mismatched productId → verify rejection
5. Missing orderId from Google → verify rejection
6. PayPal purchase unaffected by Play Billing operations
7. Activity destroyed during billing flow → verify DESTROYED error
8. BillingClient disconnected → verify reconnection on next call

## Verification Levels

| Check | Level | Notes |
|-------|-------|-------|
| Handler logic (verify, claim, fulfill, restore, RTDN) | **Mocked tests — 121 suites, 546 assertions** | All pass |
| Bridge contract (error codes, callback lifecycle, JSON transport) | **Mocked tests — 16 V2.4.7 suites** | Tests validate contract shapes, not native execution |
| WebView security (URL validation, intent validation) | **Mocked tests — 2 V2.4.7 suites** | Tests validate JS-equivalent logic |
| Vercel function consolidation | **Code review + structural** | Cannot verify Vercel deployment from CI |
| Android project structure | **Code review** | Builds require Android SDK |
| Kotlin compilation | **Not verified** | No Android SDK in CI environment |
| PlayBillingBridge ↔ play-billing-bridge.js contract | **Code review + mocked contract tests** | JS shim bridges async/sync mismatch |
| WebView host whitelist | **Code review + mocked tests** | Scheme+host validation, PayPal opens externally |
| Emulator test | **Not executed** | Requires Android emulator |
| Device test | **Not executed** | Requires physical device |
| Live Google API | **Not executed** | Requires service account |
| Play Store sandbox | **Not executed** | Requires developer account + product config |
| RTDN end-to-end | **Not executed** | Requires Pub/Sub + Play Console |

## Reproducible Commands

```bash
# Run all handler-level tests (121 suites, 546 assertions)
node tools/v2410-playbilling/playbilling-tests.mjs

# Generate Gradle wrapper (if JAR missing)
cd android && gradle wrapper --gradle-version 8.9

# Build debug APK (requires Android SDK)
cd android && ./gradlew assembleDebug --no-daemon

# Install on connected device
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## Production Readiness Notice

**Production billing is NOT authorized until:**
- [ ] Real Google API verification is tested with a service account
- [ ] Refund/revocation delivery via RTDN is verified end-to-end
- [ ] Internal sandbox testing is completed with license test accounts
- [ ] Purchase recovery after app restart is verified on a real device
- [ ] The JS shim ↔ native bridge contract is verified via emulator testing
- [ ] Security review of WebView navigation is confirmed on device
