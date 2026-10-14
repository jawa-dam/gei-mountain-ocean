# TapLites: GEI — Internal Play Store Test Plan

**Version**: V2.4.6  
**Status**: Prerequisites documented, not yet executed

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

### 7. Android Build
- [ ] Install Android SDK (API 35) and build-tools
- [ ] Run `gradle wrapper` in `android/` to generate `gradle-wrapper.jar`
- [ ] Build debug APK: `cd android && ./gradlew assembleDebug`
- [ ] Build release APK: `cd android && ./gradlew assembleRelease` (requires signing config)

## Testing Procedure

### Phase A: Local Debug Build
1. Build debug variant: `./gradlew assembleDebug`
2. Install on emulator/device: `adb install app/build/outputs/apk/debug/app-debug.apk`
3. Verify WebView loads `https://gei-mountain-ocean.vercel.app`
4. Verify `window.PlayBillingBridge` is detected by `play-billing-bridge.js`
5. Verify PayPal buttons remain functional (host whitelist includes paypal.com)

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
5. Test restore flow:
   - Clear app data
   - Trigger `restorePurchases()`
   - Verify non-consumable entitlements restored
   - Verify consumables NOT re-credited

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

## Verification Levels

| Check | Level | Notes |
|-------|-------|-------|
| Handler logic (verify, claim, fulfill, restore, RTDN) | **Code review + mocked tests** | 105 suites, 440 assertions |
| Vercel function consolidation | **Code review + structural** | Cannot verify Vercel deployment from CI |
| Android project structure | **Code review** | Builds require Android SDK |
| Kotlin compilation | **Not verified** | No Kotlin compiler in CI |
| PlayBillingBridge contract | **Code review** | Matches `play-billing-bridge.js` expectations |
| WebView host whitelist | **Code review** | Allows app origin + PayPal |
| Emulator test | **Not executed** | Requires Android emulator |
| Device test | **Not executed** | Requires physical device |
| Live Google API | **Not executed** | Requires service account |
| Play Store sandbox | **Not executed** | Requires developer account + product config |
| RTDN end-to-end | **Not executed** | Requires Pub/Sub + Play Console |
