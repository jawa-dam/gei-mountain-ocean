# TapLites: GEI — Internal Play Store Test Plan

**Version**: V2.4.9  
**Status**: Auto-recovery trigger implemented, bridge contract verified via source inspection, lifecycle validated, prerequisites documented, not yet executed on device

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

**Known blocker (V2.4.8)**: Build requires Android SDK with API 35 and AGP 8.7.3. The CI/cloud environment does not have the Android SDK installed, and `dl.google.com` is blocked by the environment's egress proxy. The exact failure is:
```
curl: (56) Received HTTP code 403 from proxy after CONNECT (dl.google.com blocked)
```
To resolve: allow `dl.google.com` in the cloud environment's Network access settings, or build on a local developer machine with Android SDK installed.

## V2.4.9 Changes

### Automatic Purchase Recovery on Startup
V2.4.8 replaced `unresolvedPurchaseJson` with `queryPurchasesAsync` but recovery still required the user to manually invoke `restorePurchases()`. V2.4.9 adds:
- `GeiPlayBilling.initAutoRecovery(callbacks)` — the game calls this once during initialization with its `onCredit` handler
- If the native billing bridge is already available (shim injected, `__PlayBillingRecoveryReady === true`), recovery runs immediately
- If the bridge is not yet available, recovery polls every 200ms (up to 50 checks / 10 seconds) for bridge readiness
- `AUTO_RECOVERY_RAN` guard prevents duplicate auto-recovery attempts
- Recovery goes through the full server verification pipeline: `queryPurchases → verify → claim → fulfill → credit → consume`
- Already-fulfilled consumables are not re-credited (server-side idempotency)
- Non-consumable entitlements are restored if still valid

### Debug Build Application ID
The debug build type configures `applicationIdSuffix = ".debug"`, so:
- **Debug APK**: `com.yalltoo.taplites.gei.debug`
- **Release APK**: `com.yalltoo.taplites.gei`

Play Console products and license testing use the release application ID. Debug builds will show billing UI but sandbox purchases use a different package name. For internal testing with real billing flows, use a release-signed build or remove the debug suffix.

### Bridge Contract Verification (Source Inspection)
V2.4.9 adds 20 test suites verifying:
- `launchBillingFlow`, `queryPurchases`, `consumePurchase` return `{pending: true, callbackId}` pattern
- Base64 + `evaluateJavascript` callback resolution path
- JS shim Promise wrappers with 120s timeout, error code propagation, `__PlayBillingRecoveryReady` flag
- WebView origin validation, PayPal external browser handling, mixed content blocking
- `destroy()` resets all state (billingFlowInProgress, callbacks, BillingClient)
- Every error path in `launchBillingFlow` resets the concurrency guard
- No purchase tokens appear in any `Log.*` call
- AndroidManifest permissions, cleartext disabled, export flags, configChanges
- Build configuration consistency (applicationId, SDK versions, dependencies, ProGuard)

### Build Blocker
Android compilation remains blocked by `dl.google.com` proxy restriction in the cloud environment. The `google()` Gradle repository resolves to `https://dl.google.com/dl/android/maven2/` and all Google Maven artifacts require this domain. No alternative mirror exists.

**To build locally**:
```bash
# Requires: Android SDK (API 35), JDK 17+, ANDROID_HOME set
cd android && ./gradlew assembleDebug --no-daemon
# Expected output: android/app/build/outputs/apk/debug/app-debug.apk
```

**Gradlew wrapper note**: If `JAVA_TOOL_OPTIONS` is set in the environment (e.g., proxy settings), the wrapper script may fail with "Unknown command-line option '-X'". Workaround:
```bash
cd android && java -Xmx64m -Xms64m \
  -Dorg.gradle.appname=gradlew \
  -classpath gradle/wrapper/gradle-wrapper.jar \
  org.gradle.wrapper.GradleWrapperMain assembleDebug --no-daemon
```

## V2.4.8 Bridge Changes

### Concurrency: Prevent Overlapping Billing Flows
V2.4.7 used a single `billingFlowCallbackId` field that could be overwritten by a concurrent `launchBillingFlow` call. V2.4.8 adds:
- `@Volatile billingFlowInProgress: Boolean` — guards against concurrent launches
- `launchBillingFlow` returns `BILLING_IN_PROGRESS` error immediately if a flow is active
- `billingFlowInProgress` is reset on every exit path: `onPurchasesUpdated`, all error branches in the coroutine, `destroy()`
- The guard prevents the single `billingFlowCallbackId` from being overwritten

### Recovery: queryPurchases Replaces unresolvedPurchaseJson
V2.4.7 stored unresolved purchases in an in-memory `unresolvedPurchaseJson` field and exposed `getUnresolvedPurchase()` as a `@JavascriptInterface` method. This did not survive process restart, activity recreation, or WebView reload.

V2.4.8 removes both:
- `unresolvedPurchaseJson` field — removed
- `getUnresolvedPurchase()` method — removed
- JS shim no longer calls `getUnresolvedPurchase()` or sets `window.__PlayBillingUnresolvedPurchase`
- JS shim sets `window.__PlayBillingRecoveryReady = true` to signal readiness
- Recovery now uses `queryPurchases()` which calls `BillingClient.queryPurchasesAsync()` — the authoritative Google Play purchase-query flow
- When `onPurchasesUpdated` receives a purchase with no matching callback, it logs a warning (not the purchase token) instead of storing in memory
- The web layer calls `GeiPlayBilling.restorePurchases()` which uses `queryPurchases()` to recover from the authoritative source

### Callback IDs: AtomicLong Replaces nanoTime
V2.4.7 used `System.nanoTime()` for callback IDs, which risked `Number.MAX_SAFE_INTEGER` overflow when multiplied. V2.4.8 uses:
- `AtomicLong` counter with `incrementAndGet()` — thread-safe, monotonically increasing, no overflow risk
- Format: `{prefix}_{counter}` (e.g., `billing_1`, `query_2`, `consume_3`)

### Token Logging
V2.4.8 ensures purchase tokens are never logged. The `Log.w` in `onPurchasesUpdated` logs only a generic message, not the purchase data.

## V2.4.7 Bridge Architecture (Unchanged)

### Native Bridge Architecture
The native `PlayBillingBridge.kt` exposes `@JavascriptInterface` methods that return synchronous `String` responses with a `{pending: true, callbackId: "..."}` pattern. A JS shim (`PlayBillingBridge.JS_BRIDGE_SHIM`) injected into the WebView on page start wraps these into `Promise`-returning functions that `play-billing-bridge.js` can `await`.

**Flow**:
1. JS calls `window.PlayBillingBridge.launchBillingFlow(playProductId)` (Promise)
2. Shim calls `window.__NativePlayBillingBridge.launchBillingFlow(playProductId)` (sync String)
3. Native checks `billingFlowInProgress` — returns `BILLING_IN_PROGRESS` error if true (V2.4.8)
4. Native returns `{"pending":true,"callbackId":"billing_<counter>"}` immediately
5. Shim registers callback in `window.__PlayBillingCallbacks[callbackId]` with 120s timeout
6. Native `onPurchasesUpdated` resolves via `webView.evaluateJavascript` + Base64 encoding
7. Shim callback parses the result and resolves/rejects the Promise
8. `billingFlowInProgress` is reset, allowing the next billing flow

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
- `BILLING_IN_PROGRESS` — concurrent billing flow rejected (V2.4.8)

### Recovery (V2.4.8)
- Purchases with no matching callback are logged (without tokens) and recovered via `queryPurchasesAsync` on next app launch or `restorePurchases()` call
- `queryPurchases()` calls Google Play's `queryPurchasesAsync(INAPP)` — the authoritative source that survives process restart, activity recreation, network interruption, and WebView reload
- The web layer sends recovered purchase tokens to the server for verification before granting entitlements
- All active callbacks are rejected with `DESTROYED` error on `destroy()`
- BillingClient reconnection handled via `ensureConnected()` with `BillingClientStateListener`

### WebView Security (V2.4.7, unchanged in V2.4.8)
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
6. Verify `window.__PlayBillingRecoveryReady === true` is set after shim injection
7. Call `GeiPlayBilling.initAutoRecovery({ onCredit: ... })` and verify auto-recovery runs
8. Verify auto-recovery does not re-run on subsequent calls
9. Verify PayPal buttons remain functional (opens in external browser, not in WebView)
10. Verify HTTP URLs are blocked (`usesCleartextTraffic="false"`)
11. Verify debug APK uses application ID `com.yalltoo.taplites.gei.debug` (not `com.yalltoo.taplites.gei`)

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
   - Verify `queryPurchases()` returns unconsumed purchases from Google Play
   - Verify server re-verifies each returned purchase token
   - Verify non-consumable entitlements restored
   - Verify consumables NOT re-credited
7. Test recovery after app restart:
   - Complete purchase, then force-kill app before JS callback
   - Re-open app
   - Trigger `restorePurchases()` or `queryPurchases()`
   - Verify purchase recovered from Google Play (not in-memory)
   - Verify server verification → claim → fulfill completes
8. Test concurrent billing prevention:
   - Initiate a billing flow
   - Immediately call `launchBillingFlow` again before the first completes
   - Verify second call returns `BILLING_IN_PROGRESS` error
   - Verify first flow completes normally
9. Test timeout:
   - Simulate billing dialog with no response for >120s
   - Verify JS Promise rejects with timeout error
10. Test recovery after WebView reload:
    - Complete purchase, reload the WebView page
    - Verify `queryPurchases()` returns the unconsumed purchase
    - Verify server verification completes
11. Test recovery after network interruption:
    - Complete purchase, disconnect network before server verification
    - Reconnect network
    - Verify `queryPurchases()` returns the purchase
    - Verify server verification → fulfillment completes

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
9. Process restart during billing flow → verify `queryPurchases` recovery
10. Activity recreation (config change) → verify bridge survives via `configChanges` in manifest

## Verification Levels

| Check | Level | Notes |
|-------|-------|-------|
| Handler logic (verify, claim, fulfill, restore, RTDN) | **Mocked tests — 152 suites, 717 assertions** | All pass |
| Bridge contract (error codes, callback lifecycle, JSON transport) | **Mocked tests — V2.4.7 + V2.4.8 + V2.4.9 suites** | Tests validate contract shapes, not native execution |
| Automatic purchase recovery trigger | **Mocked tests — V2.4.9** | initAutoRecovery, polling, guard, server pipeline |
| Concurrent billing prevention | **Mocked tests — V2.4.8** | BILLING_IN_PROGRESS guard verified |
| Purchase recovery via queryPurchases | **Mocked tests — V2.4.8 + V2.4.9** | Recovery path verified through server pipeline |
| JS shim Promise wrappers and readiness flag | **Mocked tests — V2.4.8 + V2.4.9** | Shim injects PlayBillingBridge, sets __PlayBillingRecoveryReady |
| Callback ID uniqueness (AtomicLong) | **Mocked tests — V2.4.8** | No nanoTime overflow risk |
| Token logging prevention | **Mocked tests — V2.4.8 + V2.4.9** | Verified no token in any Log.* call |
| Lifecycle validation (destroy, cleanup order) | **Source inspection — V2.4.9** | Every exit path resets concurrency guard |
| AndroidManifest security | **Source inspection — V2.4.9** | Permissions, cleartext, export flags, configChanges |
| Build configuration consistency | **Source inspection — V2.4.9** | applicationId, SDK versions, dependencies, ProGuard |
| WebView security (URL validation, intent validation) | **Mocked tests — V2.4.7** | Tests validate JS-equivalent logic |
| Vercel function consolidation | **Code review + structural** | Cannot verify Vercel deployment from CI |
| Android project structure | **Code review** | Builds require Android SDK |
| Kotlin compilation | **Not verified** | No Android SDK in CI environment (dl.google.com blocked) |
| PlayBillingBridge ↔ play-billing-bridge.js contract | **Code review + mocked contract tests** | JS shim bridges async/sync mismatch |
| WebView host whitelist | **Code review + mocked tests** | Scheme+host validation, PayPal opens externally |
| Emulator test | **Not executed** | Requires Android emulator |
| Device test | **Not executed** | Requires physical device |
| Live Google API | **Not executed** | Requires service account |
| Play Store sandbox | **Not executed** | Requires developer account + product config |
| RTDN end-to-end | **Not executed** | Requires Pub/Sub + Play Console |

## Reproducible Commands

```bash
# Run all handler-level tests (152 suites, 717 assertions)
node tools/v2410-playbilling/playbilling-tests.mjs

# Generate Gradle wrapper (if JAR missing)
cd android && gradle wrapper --gradle-version 8.9

# Build debug APK (requires Android SDK with API 35)
cd android && ./gradlew assembleDebug --no-daemon

# Install on connected device
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## Production Readiness Notice

**Production billing is NOT authorized until:**
- [ ] Real Google API verification is tested with a service account
- [ ] Refund/revocation delivery via RTDN is verified end-to-end
- [ ] Internal sandbox testing is completed with license test accounts
- [ ] Purchase recovery via `queryPurchases` is verified on a real device after process restart
- [ ] Automatic recovery on startup (`initAutoRecovery`) is verified on device
- [ ] Concurrent billing flow prevention is verified on device
- [ ] The JS shim ↔ native bridge contract is verified via emulator testing
- [ ] Security review of WebView navigation is confirmed on device
