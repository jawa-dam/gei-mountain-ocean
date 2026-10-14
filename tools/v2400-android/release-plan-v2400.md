# V2.4.0 — Android Release Plan

**Branch:** `claude/affectionate-johnson-az0k8c`
**HEAD:** (see latest commit)
**PR:** #43 (draft — do not merge)

---

## 1. Recommended Packaging Architecture: TWA (Trusted Web Activity)

### Why TWA over Capacitor

| Factor | TWA | Capacitor |
|--------|-----|-----------|
| Codebase changes | Minimal — thin Android wrapper | Moderate — plugin system, config, native bridge |
| Maintenance | Android project only | Capacitor + plugins + bridge code |
| Performance | Full Chrome, hardware-accelerated WebGL | WebView (may differ from Chrome) |
| URL bar | Hidden when Digital Asset Links verified | Hidden (WebView) |
| Offline | Requires service worker (not yet implemented) | Same |
| Play Billing | Requires native bridge (same either way) | Same, via Capacitor plugin |
| Audio | Full Chrome Web Audio API | WebView audio (may need workarounds) |
| Update path | Web deploys update instantly | Web deploys update instantly |

**Recommendation: TWA** — the game is a fully functional web application with no native hardware requirements (camera, GPS, Bluetooth). TWA provides the best performance (full Chrome engine, hardware WebGL) with the least wrapper code. The only complexity is Google Play Billing, which requires a native bridge regardless of wrapper choice.

### Android Package Configuration

| Field | Value |
|-------|-------|
| Package name | `com.yalltoo.taplites.gei` |
| App name | TapLites: GEI Mountain Ocean |
| Version code | 1 |
| Version name | 2.4.0 |
| Min SDK | 24 (Android 7.0) |
| Target SDK | 35 (Android 15) |
| Start URL | `https://<production-domain>/` |
| Status bar color | `#06070d` |
| Navigation bar color | `#06070d` |
| Orientation | portrait |
| Splash screen | Brand gradient (#06070d background, app icon centered) |

### Signing Key Requirements

- A new Android upload keystore must be generated (NOT committed to the repository)
- Use `keytool -genkeypair -alias taplites -keyalg RSA -keysize 2048 -validity 10000 -keystore taplites-upload.jks`
- Store the keystore and its passwords securely (NOT in version control)
- The SHA-256 fingerprint from this key goes into `.well-known/assetlinks.json`
- Enroll in Google Play App Signing (Google manages the app signing key; you upload with the upload key)

### Deep Link and Navigation

- TWA opens the start URL (`/`) in a verified Chrome Custom Tab
- All navigation within the same origin stays in the TWA (no URL bar)
- External links (PayPal checkout, yalltoo.com) open in the default browser
- The back button navigates browser history; if at the start URL, it exits the app
- No custom URL scheme or intent filters needed for the current game

---

## 2. Files Created in This Preparation

| File | Purpose | Status |
|------|---------|--------|
| `manifest.json` | Web App Manifest for TWA/PWA | Created — references icons, screenshots |
| `icons/icon-{48,72,96,144,192,512}.png` | App icons (procedural placeholder) | Created — replace with official brand asset |
| `icons/icon-maskable-{192,512}.png` | Adaptive/maskable icons | Created — replace with official brand asset |
| `icons/generate-icons.html` | Browser-based icon generator tool | Created — for regenerating from brand source |
| `.well-known/assetlinks.json` | Digital Asset Links for TWA verification | Created — needs signing key fingerprint |
| `privacy-policy.html` | Privacy policy page (Google Play requirement) | Created — review for accuracy |
| `index.html` | Added `<link rel="manifest">`, theme-color, favicon | Modified — 3 lines added to `<head>` |
| `tools/v2400-android/release-plan-v2400.md` | This document | Created |
| `tools/v2400-android/release-checklist-v2400.md` | Pre-publication verification checklist | Created |
| `tools/v2400-android/store-listing-v2400.md` | Google Play store listing draft | Created |

---

## 3. Release Blockers

### Critical (must resolve before Play Store submission)

| # | Blocker | Current State | Resolution |
|---|---------|--------------|------------|
| 1 | **Google Play Billing** | PayPal only — violates Play Store policy for digital goods | Implement Play Billing Library with native bridge in TWA wrapper. PayPal can remain for the web edition. See §4 below. |
| 2 | **App icons** | Procedural placeholders generated | Export the official TapLites logo (`assets.zyrosite.com/…/tap-lites-dam-game-*.png`) at required sizes (48–512px) and as maskable variants |
| 3 | **Signing key** | Not created | Generate upload keystore, update `assetlinks.json` with SHA-256 fingerprint, deploy to production domain |
| 4 | **TWA wrapper project** | Not created | Generate Android project using Bubblewrap CLI or Android Studio TWA template. See §5 below. |
| 5 | **Android device testing** | UNVERIFIED (entire Android checklist) | Complete `tools/v2300-premium/android-checklist-v2300.md` on a physical device |
| 6 | **Production domain** | Vercel preview deploy | The TWA must point to the stable production URL. `assetlinks.json` must be served from that domain. |
| 7 | **Privacy policy URL** | Created at `/privacy-policy.html` | Must be accessible at the production URL for Google Play Console submission |
| 8 | **Content rating** | Not submitted | Complete the IARC content rating questionnaire in Google Play Console |

### Important (should resolve before publication)

| # | Item | Current State | Resolution |
|---|------|--------------|------------|
| 9 | Service worker | None | Add a basic service worker for offline shell (TWA quality signal). Not strictly required but improves user experience on poor connections. |
| 10 | Splash screen | TWA default | Configure TWA splash with brand colors and icon |
| 11 | Store listing screenshots | 6 webp files exist in `listing/screens/` | Verify dimensions meet Google Play requirements (min 320px, max 3840px, 16:9 or 9:16). Current files are appropriate. |
| 12 | Promotional graphic | Not created | Required: 1024×500 PNG/JPG feature graphic for Play Store header |
| 13 | Purchase sandbox testing | No sandbox mode exists | Must test Play Billing in Google Play Console's internal/closed testing track before production release |

### Informational (track but not blocking)

| # | Item | Notes |
|---|------|-------|
| 14 | Audio autoplay | Chrome on Android requires user gesture before AudioContext.resume(). The game already handles this (AudioContext created on first tap). Verify on device. |
| 15 | Notch/cutout | `viewport-fit=cover` is set. Verify safe-area rendering on notched devices. |
| 16 | Version in listing page | `play-listing.html` shows V2.2.16; actual version is V2.3.1. Update `LISTING_CONFIG.release.version`. |

---

## 4. Google Play Billing Integration Architecture

The game sells digital goods (FL OZ currency packs, character unlocks). Google Play policy requires that digital goods sold in Android apps distributed via the Play Store use Google Play Billing. PayPal cannot be used for these purchases on Android.

### Recommended Architecture

```
┌─────────────────────────────┐
│  TapLites Web App (JS)      │
│  ┌───────────────────────┐  │
│  │  startCheckout(pack)  │  │
│  │  ┌─────────┬────────┐ │  │
│  │  │ PayPal  │ Play   │ │  │
│  │  │ (web)   │ Billing│ │  │
│  │  │         │ bridge │ │  │
│  │  └────┬────┴───┬────┘ │  │
│  └───────┼────────┼──────┘  │
└──────────┼────────┼─────────┘
           │        │
    PayPal API    TWA native
    (existing)    JS bridge
                    │
           ┌────────┴────────┐
           │ BillingClient   │
           │ (Kotlin/Java)   │
           │ in TWA wrapper  │
           └────────┬────────┘
                    │
           Google Play servers
```

### Key Design Decisions

1. **Payment provider detection:** The web app detects whether it's running inside the TWA (via `document.referrer` containing `android-app://` or a custom TWA-injected flag) and switches `startCheckout()` to use the Play Billing bridge instead of PayPal.

2. **Reuse existing entitlement pipeline:** The server-side claim/fulfill/reconcile flow in `api/paypal/` can be extended with a parallel `api/playbilling/` path that validates Google Play purchase tokens via the Android Publisher API. The core `economy-authority.js` pack definitions remain the canonical source.

3. **Product ID mapping:**

| Pack ID | Google Play Product ID | Type |
|---------|----------------------|------|
| single | `com.yalltoo.taplites.gei.single_song` | Consumable (managed) |
| ten | `com.yalltoo.taplites.gei.ten_songs` | Consumable (managed) |
| twentyfive | `com.yalltoo.taplites.gei.twentyfive_songs` | Consumable (managed) |
| special-jesus | `com.yalltoo.taplites.gei.char_jesus` | Non-consumable |
| special-dam-black-jesus | `com.yalltoo.taplites.gei.char_dam_black_jesus` | Non-consumable |
| special-devil | `com.yalltoo.taplites.gei.char_devil` | Non-consumable |

4. **Not implemented in this preparation.** Play Billing requires:
   - A Google Play Console developer account ($25 one-time fee)
   - The TWA wrapper project with BillingClient dependency
   - Server-side purchase token verification endpoint
   - Products created in Google Play Console
   - Testing on a device enrolled in the internal test track

---

## 5. TWA Wrapper Build Instructions

### Prerequisites

- Android Studio (latest stable) or the command-line SDK tools
- JDK 17+
- Node.js 20+ (for Bubblewrap CLI alternative)

### Option A: Bubblewrap CLI (recommended for simplicity)

```bash
npm install -g @nickersoft/bubblewrap
bubblewrap init --manifest https://<production-domain>/manifest.json
# Edit twa-manifest.json: set packageId, signingKey path, host
bubblewrap build
# Output: app-release-bundle.aab
```

### Option B: Android Studio

1. Create new project → Empty Activity
2. Add `com.google.androidbrowserhelper:androidbrowserhelper:2.5.0` dependency
3. Configure `LauncherActivity` to extend `com.google.androidbrowserhelper.trusted.LauncherActivity`
4. Set `asset_statements` in `res/values/strings.xml` pointing to the production URL
5. Build → Generate Signed Bundle (AAB)

### Build Output

- **AAB file**: Required for Google Play submission (not APK)
- **Signing**: Use the upload keystore generated in step 3 above
- **Verification**: `bundletool build-apks --bundle=app.aab --output=app.apks` then install on a device to verify

---

## 6. What Has NOT Been Done

This preparation is documentation and configuration only. The following have NOT been implemented:

1. ❌ TWA Android project (no `build.gradle`, no Kotlin/Java code)
2. ❌ Google Play Billing integration (no native bridge, no server endpoints)
3. ❌ Service worker for offline capability
4. ❌ AAB build artifact
5. ❌ Real app icons (placeholders only — need official brand asset)
6. ❌ Signing key generation (security-sensitive, must not be committed)
7. ❌ Google Play Console setup (developer account, app listing, products)
8. ❌ Content rating questionnaire
9. ❌ Physical Android device testing
10. ❌ Promotional feature graphic (1024×500)

---

## 7. Recommended Next Actions for the Project Owner

### Immediate (before any Android build)

1. **Create a Google Play Developer account** at https://play.google.com/console — requires $25 fee and identity verification (can take days).
2. **Decide the production domain** — the domain that `assetlinks.json` will be served from and that the TWA will open.
3. **Export official app icons** from the TapLites brand source file at 48, 72, 96, 144, 192, and 512px (plus maskable variants with safe-zone padding). Replace the procedural placeholders in `icons/`.
4. **Create a feature graphic** (1024×500 PNG/JPG) for the Play Store header.
5. **Review the privacy policy** at `/privacy-policy.html` for accuracy.

### Build phase

6. **Generate the signing keystore** (NOT in the repository). Store securely.
7. **Update `.well-known/assetlinks.json`** with the SHA-256 fingerprint from the signing key.
8. **Deploy to production** with the updated `index.html` (manifest link), `manifest.json`, icons, `assetlinks.json`, and `privacy-policy.html`.
9. **Create the TWA wrapper** using Bubblewrap or Android Studio.
10. **Build and sign the AAB**.

### Testing phase

11. **Upload AAB to Google Play Console** internal testing track.
12. **Complete the Android checklist** (`tools/v2300-premium/android-checklist-v2300.md`) on a physical device.
13. **Test purchases** using Google Play Console's license testing with test accounts.
14. **Complete the IARC content rating questionnaire**.

### Publication

15. **Promote to closed testing** → open testing → production release.
16. **Update `play-listing.html`** `LISTING_CONFIG.googlePlayUrl` with the verified Play Store URL.

---

## 8. Existing Game Systems Preserved

All existing game systems remain unchanged:

| System | Status |
|--------|--------|
| Six repeating Days (1–6) | ✅ Preserved |
| Shared hydraulic simulation | ✅ Preserved |
| Premium 3D scenes (V2.3.1) | ✅ Preserved |
| SVG fallback | ✅ Preserved |
| TAPLITES ARCADE | ✅ Preserved |
| Exactly-once rewards (awardDay) | ✅ Preserved |
| XP, FL OZ, Builder Parts | ✅ Preserved |
| PayPal purchases (web) | ✅ Preserved |
| Audio / soundtrack / voice | ✅ Preserved |
| Characters and unlocks | ✅ Preserved |
| Saved player progress (localStorage) | ✅ Preserved |
| Economy security certification | ✅ Preserved |

No production payment settings, live entitlements, reward rules, tap requirements, or save formats were modified.
