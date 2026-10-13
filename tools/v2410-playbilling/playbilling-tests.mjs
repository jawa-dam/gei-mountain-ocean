/**
 * V2.4.3 — Google Play Billing Security Test Suite
 *
 * Handler-level tests with mock Redis and Google API doubles.
 * Covers: purchase verification, claim/fulfill pipeline, RTDN notifications,
 * revocation, restoration with Google re-verification, exactly-once processing.
 *
 * Run: node tools/v2410-playbilling/playbilling-tests.mjs
 */

import { strict as assert } from "node:assert";

// ─── Test Framework ─────────────────────────────────────────────────
let suiteCount = 0, passCount = 0, failCount = 0, assertionCount = 0;
const suites = [];

function suite(name, fn) { suites.push({ name, fn }); }
function t(label, condition) {
  assertionCount++;
  if (!condition) { failCount++; console.error(`    FAIL: ${label}`); throw new Error(`Assertion failed: ${label}`); }
}

async function runAll() {
  for (const s of suites) {
    suiteCount++;
    try {
      await s.fn();
      passCount++;
      console.log(`  PASS  ${s.name}`);
    } catch (e) {
      console.error(`  FAIL  ${s.name}: ${e.message}`);
    }
  }
  console.log(`\n${passCount}/${suiteCount} suites passed, ${assertionCount} assertions, ${failCount} failures.`);
  if (failCount > 0) process.exit(1);
}

// ─── Mock Infrastructure ────────────────────────────────────────────

class MockRedis {
  constructor() { this.store = new Map(); this.commands = []; }

  async exec(command) {
    this.commands.push(command);
    const [op, ...args] = command;

    if (op === "GET") {
      return this.store.get(args[0]) ?? null;
    }

    if (op === "SET") {
      this.store.set(args[0], args[1]);
      return "OK";
    }

    if (op === "EVAL") {
      return this._evalLua(args);
    }

    return null;
  }

  _evalLua(args) {
    const [script, numKeys, ...rest] = args;
    const keys = rest.slice(0, Number(numKeys));
    const argv = rest.slice(Number(numKeys));

    if (script.includes("KEYS[3]") && script.includes("KEYS[2]")) {
      return this._evalRecordWithTokenMapScript(script, keys, argv);
    }
    if (script.includes("KEYS[2]")) {
      return this._evalRecordScript(script, keys, argv);
    }
    if (script.includes("revokedAt")) {
      return this._evalRevokeScript(script, keys, argv);
    }
    if (script.includes("fulfilledAt")) {
      return this._evalFulfillScript(script, keys, argv);
    }
    if (script.includes("claimedAt")) {
      return this._evalClaimScript(script, keys, argv);
    }
    if (Number(numKeys) === 1 && !script.includes("claimedAt") && !script.includes("fulfilledAt") && !script.includes("revokedAt")) {
      return this._evalRtdnDedupScript(script, keys, argv);
    }

    return [0, "UNKNOWN_SCRIPT"];
  }

  _evalRecordWithTokenMapScript(script, keys, argv) {
    const existing = this.store.get(keys[1]);
    if (existing) {
      this.store.set(keys[0], argv[0]);
      return [0, existing];
    }
    this.store.set(keys[0], argv[0]);
    this.store.set(keys[1], argv[2]);
    this.store.set(keys[2], argv[3]);
    return [1, argv[2]];
  }

  _evalRecordScript(script, keys, argv) {
    const existing = this.store.get(keys[1]);
    if (existing) {
      this.store.set(keys[0], argv[0]);
      return [0, existing];
    }
    this.store.set(keys[0], argv[0]);
    this.store.set(keys[1], argv[2]);
    return [1, argv[2]];
  }

  _evalClaimScript(script, keys, argv) {
    const raw = this.store.get(keys[0]);
    if (!raw) return [0, "NOT_FOUND"];
    const obj = JSON.parse(raw);
    if (obj.claimedAt) {
      if (obj.claimId === argv[1]) return [2, raw];
      return [0, "ALREADY_CLAIMED"];
    }
    obj.claimedAt = argv[0];
    obj.claimId = argv[1];
    const updated = JSON.stringify(obj);
    this.store.set(keys[0], updated);
    return [1, updated];
  }

  _evalFulfillScript(script, keys, argv) {
    const raw = this.store.get(keys[0]);
    if (!raw) return [0, "NOT_FOUND"];
    const obj = JSON.parse(raw);
    if (!obj.claimedAt) return [0, "NOT_CLAIMED"];
    if (obj.fulfilledAt) {
      if (obj.fulfillmentId === argv[1]) return [2, raw];
      return [0, "ALREADY_FULFILLED"];
    }
    obj.fulfilledAt = argv[0];
    obj.fulfillmentId = argv[1];
    obj.status = "FULFILLED";
    const updated = JSON.stringify(obj);
    this.store.set(keys[0], updated);
    return [1, updated];
  }

  _evalRevokeScript(script, keys, argv) {
    const raw = this.store.get(keys[0]);
    if (!raw) return [0, "NOT_FOUND"];
    const obj = JSON.parse(raw);
    if (obj.status === "REVOKED") return [2, raw];
    obj.revokedAt = argv[0];
    obj.revocationReason = argv[1];
    obj.revocationNotificationType = Number(argv[2]);
    obj.googlePurchaseState = Number(argv[3]);
    obj.previousStatus = obj.status;
    obj.status = "REVOKED";
    const updated = JSON.stringify(obj);
    this.store.set(keys[0], updated);
    return [1, updated];
  }

  _evalRtdnDedupScript(script, keys, argv) {
    const existing = this.store.get(keys[0]);
    if (existing) return [0, existing];
    this.store.set(keys[0], argv[0]);
    return [1, argv[0]];
  }

  reset() { this.store.clear(); this.commands = []; }
}

const mockRedis = new MockRedis();

class MockResponse {
  constructor() { this._status = 200; this._json = null; this._headers = {}; }
  status(code) { this._status = code; return this; }
  json(data) { this._json = data; return this; }
  setHeader(k, v) { this._headers[k] = v; return this; }
}

function makeReq(method, body, query) {
  return { method, body, query: query || {} };
}

// ─── Install global fetch interceptor for Redis ────────────────────

const UPSTASH_URL = "https://mock-redis.upstash.io";
const UPSTASH_TOKEN = "mock-token";
process.env.UPSTASH_REDIS_REST_URL = UPSTASH_URL;
process.env.UPSTASH_REDIS_REST_TOKEN = UPSTASH_TOKEN;
process.env.GOOGLE_PLAY_PACKAGE_NAME = "com.yalltoo.taplites.gei";

let googleApiHandler = null;
let googleOAuthHandler = null;

const originalFetch = globalThis.fetch;
globalThis.fetch = async function(url, opts) {
  const urlStr = String(url);

  if (urlStr === UPSTASH_URL) {
    const body = JSON.parse(opts.body);
    const result = await mockRedis.exec(body);
    return new Response(JSON.stringify({ result }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (urlStr.includes("oauth2.googleapis.com/token")) {
    if (googleOAuthHandler) return googleOAuthHandler(urlStr, opts);
    return new Response(JSON.stringify({ access_token: "mock-access-token" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (urlStr.includes("androidpublisher.googleapis.com")) {
    if (googleApiHandler) return googleApiHandler(urlStr, opts);
    return new Response(JSON.stringify({ error: { message: "No mock handler" } }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  return originalFetch(url, opts);
};

// ─── Mock service account key ──────────────────────────────────────
import { generateKeyPairSync } from "node:crypto";

const { privateKey: rsaPrivateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" }
});

process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_KEY = JSON.stringify({
  type: "service_account",
  client_email: "test@test-project.iam.gserviceaccount.com",
  private_key: rsaPrivateKey
});

// ─── Import modules under test ──────────────────────────────────────
const {
  GOOGLE_PLAY_PRODUCT_MAP,
  BILLING_CHANNELS,
  packIdFromPlayProductId,
  playProductIdFromPackId,
  isConsumable,
  validatePlayProductMapping,
  allProductMappings
} = await import("../../api/_lib/billing-channel.js");

const {
  PACKS,
  getPack,
  ECONOMY_AUTHORITY_VERSION,
  validateEntitlementAuthority,
  canonicalFulfillmentId
} = await import("../../api/_lib/economy-authority.js");

// Import handlers
const verifyPurchaseModule = await import("../../api/playbilling/verify-purchase.js");
const claimEntitlementModule = await import("../../api/playbilling/claim-entitlement.js");
const fulfillEntitlementModule = await import("../../api/playbilling/fulfill-entitlement.js");
const productsModule = await import("../../api/playbilling/products.js");
const restorePurchasesModule = await import("../../api/playbilling/restore-purchases.js");
const rtdnModule = await import("../../api/playbilling/rtdn-notification.js");

const verifyHandler = verifyPurchaseModule.default;
const claimHandler = claimEntitlementModule.default;
const fulfillHandler = fulfillEntitlementModule.default;
const productsHandler = productsModule.default;
const restoreHandler = restorePurchasesModule.default;
const rtdnHandler = rtdnModule.default;

// Import ledger functions
const { hashToken } = await import("../../api/_lib/playbilling-ledger.js");

// ─── Helpers ───────────────────────────────────────────────────────

function validGooglePurchase(overrides = {}) {
  return {
    purchaseState: 0,
    consumptionState: 0,
    acknowledgementState: 0,
    orderId: "GPA.1234-5678-9012-34567",
    productId: "com.yalltoo.taplites.gei.single_song",
    purchaseTimeMillis: String(Date.now()),
    ...overrides
  };
}

function setGoogleApiResponse(purchase, status = 200) {
  googleApiHandler = (url, opts) => {
    if (opts?.method === "POST" && url.endsWith(":acknowledge")) {
      return new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify(purchase), {
      status,
      headers: { "Content-Type": "application/json" }
    });
  };
}

function setGoogleApiError(message, status = 500) {
  googleApiHandler = (url, opts) => {
    if (opts?.method === "POST" && url.endsWith(":acknowledge")) {
      return new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ error: { message } }), {
      status,
      headers: { "Content-Type": "application/json" }
    });
  };
}

async function fullVerifyClaimFulfill(orderId, playProductId, purchaseToken) {
  const purchase = validGooglePurchase({ orderId, productId: playProductId });
  setGoogleApiResponse(purchase);

  const fid = "GEI-PLAY-FULFILL-" + orderId.replace(/[^A-Za-z0-9._:-]/g, "-");

  const vRes = new MockResponse();
  await verifyHandler(makeReq("POST", { purchaseToken, playProductId, orderId }), vRes);
  if (vRes._status !== 200) return { verify: vRes };

  const cRes = new MockResponse();
  await claimHandler(makeReq("POST", { claimToken: orderId, claimId: "claim-" + orderId }), cRes);
  if (cRes._status !== 200) return { verify: vRes, claim: cRes };

  const fRes = new MockResponse();
  await fulfillHandler(makeReq("POST", { claimToken: orderId, fulfillmentId: fid }), fRes);
  return { verify: vRes, claim: cRes, fulfill: fRes };
}

function makeRtdnBody(notificationType, sku, purchaseToken, messageId, packageName) {
  const data = {
    packageName: packageName || "com.yalltoo.taplites.gei",
    eventTimeMillis: String(Date.now()),
    oneTimeProductNotification: {
      notificationType,
      sku: sku || "com.yalltoo.taplites.gei.single_song",
      purchaseToken: purchaseToken || "rtdn-test-token"
    }
  };
  return {
    message: {
      data: Buffer.from(JSON.stringify(data)).toString("base64"),
      messageId: messageId || "msg-" + Date.now()
    }
  };
}


// ════════════════════════════════════════════════════════════════════
// 1. PRODUCT MAPPING
// ════════════════════════════════════════════════════════════════════

suite("Product map covers all 6 PACKS with correct Play IDs", () => {
  const packIds = Object.keys(PACKS);
  t("PACKS has 6 entries", packIds.length === 6);
  for (const pid of packIds) {
    t(`${pid} has a Play product ID`, typeof GOOGLE_PLAY_PRODUCT_MAP[pid] === "string");
    t(`${pid} Play ID starts with com.yalltoo`, GOOGLE_PLAY_PRODUCT_MAP[pid].startsWith("com.yalltoo.taplites.gei."));
  }
});

suite("Reverse mapping is bijective", () => {
  for (const [packId, playId] of Object.entries(GOOGLE_PLAY_PRODUCT_MAP)) {
    t(`${playId} → ${packId}`, packIdFromPlayProductId(playId) === packId);
    t(`${packId} → ${playId}`, playProductIdFromPackId(packId) === playId);
  }
  t("unknown pack → null", playProductIdFromPackId("nonexistent") === null);
  t("unknown play ID → null", packIdFromPlayProductId("com.fake.product") === null);
});

suite("Consumable classification matches economy authority", () => {
  for (const packId of ["single", "ten", "twentyfive"]) {
    t(`${packId} is consumable`, isConsumable(packId) === true);
    t(`${packId} has flOz > 0`, getPack(packId).flOz > 0);
  }
  for (const packId of ["special-jesus", "special-dam-black-jesus", "special-devil"]) {
    t(`${packId} is NOT consumable`, isConsumable(packId) === false);
    t(`${packId} has flOz === 0`, getPack(packId).flOz === 0);
    t(`${packId} is special-character`, getPack(packId).kind === "special-character");
  }
});

suite("allProductMappings returns complete economy-consistent catalog", () => {
  const all = allProductMappings();
  t("6 product mappings", all.length === 6);
  for (const m of all) {
    t(`${m.packId} has playProductId`, typeof m.playProductId === "string");
    const pack = getPack(m.packId);
    t(`${m.packId} price matches authority`, m.price === pack.price);
    t(`${m.packId} flOz matches authority`, m.flOz === pack.flOz);
    t(`${m.packId} has economyAuthorityVersion`, m.economyAuthorityVersion === ECONOMY_AUTHORITY_VERSION);
  }
});


// ════════════════════════════════════════════════════════════════════
// 2. PRODUCTS ENDPOINT
// ════════════════════════════════════════════════════════════════════

suite("GET /products returns full catalog", async () => {
  const res = new MockResponse();
  await productsHandler(makeReq("GET"), res);
  t("status 200", res._status === 200);
  t("ok true", res._json.ok === true);
  t("6 products", res._json.products.length === 6);
  t("packageName set", res._json.packageName === "com.yalltoo.taplites.gei");
});

suite("POST /products rejected", async () => {
  const res = new MockResponse();
  await productsHandler(makeReq("POST"), res);
  t("status 405", res._status === 405);
});


// ════════════════════════════════════════════════════════════════════
// 3. VERIFY-PURCHASE HANDLER — INPUT VALIDATION
// ════════════════════════════════════════════════════════════════════

suite("verify-purchase rejects missing/invalid fields via handler", async () => {
  const cases = [
    [{ }, "no body"],
    [{ purchaseToken: "tok" }, "no product"],
    [{ purchaseToken: "tok", playProductId: "pid" }, "no orderId"],
    [{ purchaseToken: 123, playProductId: "pid", orderId: "oid" }, "numeric token"],
    [{ purchaseToken: "a".repeat(2049), playProductId: "com.yalltoo.taplites.gei.single_song", orderId: "o" }, "token too long"],
    [{ purchaseToken: "tok", playProductId: "com.fake.product", orderId: "o" }, "unknown product"],
  ];

  for (const [body, label] of cases) {
    const res = new MockResponse();
    await verifyHandler(makeReq("POST", body), res);
    t(`${label} → 400`, res._status === 400);
  }
});

suite("verify-purchase rejects non-POST methods", async () => {
  const res = new MockResponse();
  await verifyHandler(makeReq("GET"), res);
  t("status 405", res._status === 405);
});


// ════════════════════════════════════════════════════════════════════
// 4. VERIFY-PURCHASE — GOOGLE API RESPONSE VALIDATION
// ════════════════════════════════════════════════════════════════════

suite("verify-purchase accepts valid PURCHASED state", async () => {
  mockRedis.reset();
  const purchase = validGooglePurchase();
  setGoogleApiResponse(purchase);

  const res = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: "valid-token-1",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    orderId: "GPA.1234-5678-9012-34567"
  }), res);

  t("status 200", res._status === 200);
  t("ok true", res._json.ok === true);
  t("packId is single", res._json.packId === "single");
  t("flOz is 6660", res._json.flOz === 6660);
  t("claimToken is orderId", res._json.claimToken === "GPA.1234-5678-9012-34567");
  t("economyAuthorityVersion present", res._json.economyAuthorityVersion === ECONOMY_AUTHORITY_VERSION);
});

suite("verify-purchase rejects cancelled purchase (state 1)", async () => {
  mockRedis.reset();
  setGoogleApiResponse(validGooglePurchase({ purchaseState: 1 }));

  const res = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: "cancelled-token",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    orderId: "GPA.1234-5678-9012-34567"
  }), res);

  t("status 409", res._status === 409);
  t("purchaseState 1", res._json.purchaseState === 1);
});

suite("verify-purchase rejects pending purchase (state 2)", async () => {
  mockRedis.reset();
  setGoogleApiResponse(validGooglePurchase({ purchaseState: 2 }));

  const res = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: "pending-token",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    orderId: "GPA.1234-5678-9012-34567"
  }), res);

  t("status 409", res._status === 409);
  t("purchaseState 2", res._json.purchaseState === 2);
});

suite("verify-purchase rejects mismatched order ID", async () => {
  mockRedis.reset();
  setGoogleApiResponse(validGooglePurchase({ orderId: "GPA.REAL-ORDER" }));

  const res = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: "mismatch-token",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    orderId: "GPA.FAKE-ORDER"
  }), res);

  t("status 403", res._status === 403);
  t("error mentions order ID", res._json.error.includes("Order ID"));
});

suite("verify-purchase rejects missing order ID from Google", async () => {
  mockRedis.reset();
  setGoogleApiResponse(validGooglePurchase({ orderId: undefined }));

  const res = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: "no-order-token",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    orderId: "GPA.CLIENT-ORDER"
  }), res);

  t("status 403", res._status === 403);
});

suite("verify-purchase rejects mismatched product ID from Google", async () => {
  mockRedis.reset();
  setGoogleApiResponse(validGooglePurchase({
    productId: "com.yalltoo.taplites.gei.ten_songs"
  }));

  const res = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: "product-mismatch-token",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    orderId: "GPA.1234-5678-9012-34567"
  }), res);

  t("status 403", res._status === 403);
  t("error mentions product ID", res._json.error.includes("Product ID"));
});

suite("verify-purchase handles Google API error", async () => {
  mockRedis.reset();
  setGoogleApiError("Purchase not found", 404);

  const res = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: "invalid-token",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    orderId: "GPA.NOT-REAL"
  }), res);

  t("status 404", res._status === 404);
  t("has reason", res._json.reason === "GOOGLE_API_ERROR");
});

suite("verify-purchase handles non-JSON Google response", async () => {
  mockRedis.reset();
  googleApiHandler = (url, opts) => {
    if (opts?.method === "POST") return new Response("{}", { status: 200 });
    return new Response("<html>Server Error</html>", {
      status: 500,
      headers: { "Content-Type": "text/html" }
    });
  };

  const res = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: "html-error-token",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    orderId: "GPA.ERROR"
  }), res);

  t("status 502", res._status === 502);
  t("has reason", res._json.reason === "GOOGLE_API_ERROR");
});

suite("verify-purchase handles Google OAuth failure", async () => {
  mockRedis.reset();
  googleOAuthHandler = () => {
    return new Response(JSON.stringify({ error: "invalid_grant", error_description: "Key expired" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  };

  const res = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: "oauth-fail-token",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    orderId: "GPA.OAUTH-FAIL"
  }), res);

  t("status 500", res._status === 500);
  t("error does not leak details", !res._json.error.includes("Key expired"));
  t("generic error message", res._json.error === "Unable to verify purchase.");

  googleOAuthHandler = null;
});

suite("verify-purchase does not leak internal errors", async () => {
  mockRedis.reset();
  const savedKey = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_KEY;
  process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_KEY = "not-valid-json{{{";

  const res = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: "leak-test-token",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    orderId: "GPA.LEAK-TEST"
  }), res);

  t("status 500", res._status === 500);
  t("error is generic", res._json.error === "Unable to verify purchase.");
  t("no stack trace in error", !JSON.stringify(res._json).includes("SyntaxError"));

  process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_KEY = savedKey;
});


// ════════════════════════════════════════════════════════════════════
// 5. VERIFY → CLAIM → FULFILL PIPELINE
// ════════════════════════════════════════════════════════════════════

suite("Full verify → claim → fulfill pipeline succeeds", async () => {
  mockRedis.reset();
  const result = await fullVerifyClaimFulfill(
    "GPA.PIPELINE-001",
    "com.yalltoo.taplites.gei.single_song",
    "pipeline-token-001"
  );

  t("verify 200", result.verify._status === 200);
  t("claim 200", result.claim._status === 200);
  t("fulfill 200", result.fulfill._status === 200);
  t("receipt has fulfillmentId", result.fulfill._json.receipt.fulfillmentId.startsWith("GEI-PLAY-FULFILL-"));
  t("receipt packId", result.fulfill._json.receipt.packId === "single");
  t("receipt flOz", result.fulfill._json.receipt.flOz === 6660);
  t("receipt status FULFILLED", result.fulfill._json.receipt.status === "FULFILLED");
});

suite("Full pipeline for special character (non-consumable)", async () => {
  mockRedis.reset();
  const result = await fullVerifyClaimFulfill(
    "GPA.CHAR-JESUS-001",
    "com.yalltoo.taplites.gei.char_jesus",
    "char-token-001"
  );

  t("verify 200", result.verify._status === 200);
  t("claim 200", result.claim._status === 200);
  t("fulfill 200", result.fulfill._status === 200);
  t("receipt packId", result.fulfill._json.receipt.packId === "special-jesus");
  t("receipt flOz 0", result.fulfill._json.receipt.flOz === 0);
  t("receipt productType", result.fulfill._json.receipt.productType === "special-character");
  t("receipt characterId", result.fulfill._json.receipt.characterId === "jesus");
});

suite("Verify stores token-to-order mapping for RTDN lookup", async () => {
  mockRedis.reset();
  const purchase = validGooglePurchase({ orderId: "GPA.TOKEN-MAP-001" });
  setGoogleApiResponse(purchase);

  const res = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: "token-for-map-test",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    orderId: "GPA.TOKEN-MAP-001"
  }), res);

  t("verify succeeded", res._status === 200);

  const tokenHash = await hashToken("token-for-map-test");
  const tokenOrderKey = "gei:playbilling:token-order:" + tokenHash;
  const storedOrderId = mockRedis.store.get(tokenOrderKey);
  t("token-order mapping stored", storedOrderId === "GPA.TOKEN-MAP-001");
});


// ════════════════════════════════════════════════════════════════════
// 6. DUPLICATE PREVENTION
// ════════════════════════════════════════════════════════════════════

suite("Duplicate verification returns idempotent result", async () => {
  mockRedis.reset();
  const purchase = validGooglePurchase({ orderId: "GPA.DUP-001" });
  setGoogleApiResponse(purchase);

  const body = {
    purchaseToken: "dup-token-001",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    orderId: "GPA.DUP-001"
  };

  const r1 = new MockResponse();
  await verifyHandler(makeReq("POST", body), r1);
  t("first verify 200", r1._status === 200);
  t("first verify created", r1._json.alreadyVerified === false);

  const r2 = new MockResponse();
  await verifyHandler(makeReq("POST", body), r2);
  t("second verify 200", r2._status === 200);
  t("second verify idempotent", r2._json.alreadyVerified === true);
  t("same packId", r2._json.packId === "single");
});

suite("Duplicate claim with same claimId replays safely", async () => {
  mockRedis.reset();
  const purchase = validGooglePurchase({ orderId: "GPA.DUPCLAIM-001" });
  setGoogleApiResponse(purchase);

  const vRes = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: "dupclaim-token",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    orderId: "GPA.DUPCLAIM-001"
  }), vRes);

  const c1 = new MockResponse();
  await claimHandler(makeReq("POST", { claimToken: "GPA.DUPCLAIM-001", claimId: "claim-dup-1" }), c1);
  t("first claim 200", c1._status === 200);
  t("first claim not replay", c1._json.alreadyClaimed === false);

  const c2 = new MockResponse();
  await claimHandler(makeReq("POST", { claimToken: "GPA.DUPCLAIM-001", claimId: "claim-dup-1" }), c2);
  t("replay claim 200", c2._status === 200);
  t("replay claim flagged", c2._json.alreadyClaimed === true);
  t("replay recovery", c2._json.recovery === "REPLAY_RECOVERED");
});

suite("Duplicate claim with different claimId is rejected", async () => {
  mockRedis.reset();
  const purchase = validGooglePurchase({ orderId: "GPA.DIFFCLAIM-001" });
  setGoogleApiResponse(purchase);

  const vRes = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: "diffclaim-token",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    orderId: "GPA.DIFFCLAIM-001"
  }), vRes);

  const c1 = new MockResponse();
  await claimHandler(makeReq("POST", { claimToken: "GPA.DIFFCLAIM-001", claimId: "claim-A" }), c1);
  t("first claim succeeds", c1._status === 200);

  const c2 = new MockResponse();
  await claimHandler(makeReq("POST", { claimToken: "GPA.DIFFCLAIM-001", claimId: "claim-B" }), c2);
  t("second claim rejected", c2._status === 409);
  t("already claimed error", c2._json.error.includes("already been claimed"));
});

suite("Duplicate fulfillment with same fulfillmentId replays safely", async () => {
  mockRedis.reset();
  const result = await fullVerifyClaimFulfill(
    "GPA.DUPFULFILL-001",
    "com.yalltoo.taplites.gei.single_song",
    "dupfulfill-token"
  );
  t("first fulfill 200", result.fulfill._status === 200);
  t("first fulfill not replay", result.fulfill._json.alreadyFulfilled === false);

  const f2 = new MockResponse();
  await fulfillHandler(makeReq("POST", {
    claimToken: "GPA.DUPFULFILL-001",
    fulfillmentId: "GEI-PLAY-FULFILL-GPA.DUPFULFILL-001"
  }), f2);
  t("replay fulfill 200", f2._status === 200);
  t("replay flagged", f2._json.alreadyFulfilled === true);
});

suite("Duplicate fulfillment with different fulfillmentId is rejected", async () => {
  mockRedis.reset();
  const result = await fullVerifyClaimFulfill(
    "GPA.DIFFFULFILL-001",
    "com.yalltoo.taplites.gei.single_song",
    "difffulfill-token"
  );

  const f2 = new MockResponse();
  await fulfillHandler(makeReq("POST", {
    claimToken: "GPA.DIFFFULFILL-001",
    fulfillmentId: "GEI-PLAY-FULFILL-GPA.DIFFFULFILL-002"
  }), f2);
  t("different fid rejected", f2._status === 409);
  t("already fulfilled error", f2._json.error.includes("already been fulfilled"));
});


// ════════════════════════════════════════════════════════════════════
// 7. CLAIM/FULFILL STATE MACHINE
// ════════════════════════════════════════════════════════════════════

suite("Claim before verify returns 404", async () => {
  mockRedis.reset();
  const res = new MockResponse();
  await claimHandler(makeReq("POST", { claimToken: "GPA.NONEXIST", claimId: "c1" }), res);
  t("status 404", res._status === 404);
});

suite("Fulfill before claim returns 409 NOT_CLAIMED", async () => {
  mockRedis.reset();
  const purchase = validGooglePurchase({ orderId: "GPA.NOFULFILL-001" });
  setGoogleApiResponse(purchase);

  const vRes = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: "nofulfill-token",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    orderId: "GPA.NOFULFILL-001"
  }), vRes);

  const fRes = new MockResponse();
  await fulfillHandler(makeReq("POST", {
    claimToken: "GPA.NOFULFILL-001",
    fulfillmentId: "GEI-PLAY-FULFILL-GPA.NOFULFILL-001"
  }), fRes);
  t("status 409", fRes._status === 409);
  t("not claimed error", fRes._json.error.includes("claimed before"));
});

suite("Claim/fulfill reject missing fields via handler", async () => {
  const c1 = new MockResponse();
  await claimHandler(makeReq("POST", {}), c1);
  t("empty claim → 400", c1._status === 400);

  const c2 = new MockResponse();
  await claimHandler(makeReq("POST", { claimToken: "t" }), c2);
  t("no claimId → 400", c2._status === 400);

  const f1 = new MockResponse();
  await fulfillHandler(makeReq("POST", {}), f1);
  t("empty fulfill → 400", f1._status === 400);

  const f2 = new MockResponse();
  await fulfillHandler(makeReq("POST", { claimToken: "t", fulfillmentId: "bad" }), f2);
  t("invalid fid → 400", f2._status === 400);

  const f3 = new MockResponse();
  await fulfillHandler(makeReq("POST", { claimToken: "t", fulfillmentId: "GEI-FULFILL-abc12345" }), f3);
  t("PayPal prefix rejected → 400", f3._status === 400);
});


// ════════════════════════════════════════════════════════════════════
// 8. TOKEN SECURITY
// ════════════════════════════════════════════════════════════════════

suite("Purchase tokens are SHA-256 hashed before Redis storage", async () => {
  mockRedis.reset();
  const purchase = validGooglePurchase({ orderId: "GPA.HASH-001" });
  setGoogleApiResponse(purchase);

  const plainToken = "super-secret-purchase-token-" + Date.now();

  const res = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: plainToken,
    playProductId: "com.yalltoo.taplites.gei.single_song",
    orderId: "GPA.HASH-001"
  }), res);
  t("verify succeeded", res._status === 200);

  let foundPlainToken = false;
  for (const [key, value] of mockRedis.store.entries()) {
    if (key.includes(plainToken)) foundPlainToken = true;
    if (typeof value === "string" && value.includes(plainToken)) foundPlainToken = true;
  }
  t("plain token NOT in any Redis key or value", foundPlainToken === false);

  let foundTokenHash = false;
  for (const [key] of mockRedis.store.entries()) {
    if (key.startsWith("gei:playbilling:event:") && key.length > 40) {
      foundTokenHash = true;
    }
  }
  t("hashed event key exists in Redis", foundTokenHash === true);
});

suite("Different tokens produce different Redis event keys", async () => {
  mockRedis.reset();

  const purchase1 = validGooglePurchase({ orderId: "GPA.HASH-A" });
  setGoogleApiResponse(purchase1);
  const r1 = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: "token-alpha",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    orderId: "GPA.HASH-A"
  }), r1);

  const purchase2 = validGooglePurchase({ orderId: "GPA.HASH-B" });
  setGoogleApiResponse(purchase2);
  const r2 = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: "token-beta",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    orderId: "GPA.HASH-B"
  }), r2);

  const eventKeys = [...mockRedis.store.keys()].filter(k => k.startsWith("gei:playbilling:event:"));
  t("two distinct event keys", eventKeys.length === 2);
  t("keys differ", eventKeys[0] !== eventKeys[1]);
});


// ════════════════════════════════════════════════════════════════════
// 9. CHANNEL SEPARATION
// ════════════════════════════════════════════════════════════════════

suite("Play and PayPal fulfillment IDs never collide", () => {
  const ids = [
    "GPA.1234-5678-9012-34567",
    "ABC123DEF456",
    "SHARED-ORDER-123"
  ];
  for (const id of ids) {
    const paypalFid = canonicalFulfillmentId(id);
    const playFid = "GEI-PLAY-FULFILL-" + id.replace(/[^A-Za-z0-9._:-]/g, "-");
    t(`${id}: PayPal prefix GEI-FULFILL-`, paypalFid.startsWith("GEI-FULFILL-"));
    t(`${id}: Play prefix GEI-PLAY-FULFILL-`, playFid.startsWith("GEI-PLAY-FULFILL-"));
    t(`${id}: they differ`, paypalFid !== playFid);
  }
});

suite("Redis namespaces are completely disjoint", async () => {
  mockRedis.reset();
  await fullVerifyClaimFulfill(
    "GPA.NS-001",
    "com.yalltoo.taplites.gei.single_song",
    "ns-token-001"
  );

  const keys = [...mockRedis.store.keys()];
  const playKeys = keys.filter(k => k.startsWith("gei:playbilling:"));
  const paypalKeys = keys.filter(k => k.startsWith("gei:paypal:"));
  t("Play keys exist", playKeys.length > 0);
  t("no PayPal keys created", paypalKeys.length === 0);
  t("all keys are Play-namespaced", keys.every(k => k.startsWith("gei:playbilling:")));
});


// ════════════════════════════════════════════════════════════════════
// 10. RESTORE PURCHASES
// ════════════════════════════════════════════════════════════════════

suite("restore-purchases validates input via handler", async () => {
  const cases = [
    [{}, "empty body", 400],
    [{ orderIds: [] }, "empty array", 400],
    [{ orderIds: "not-array" }, "not array", 400],
    [{ orderIds: Array(51).fill("x") }, "too many", 400],
  ];

  for (const [body, label, expected] of cases) {
    const res = new MockResponse();
    await restoreHandler(makeReq("POST", body), res);
    t(`${label} → ${expected}`, res._status === expected);
  }
});

suite("restore-purchases returns NOT_FOUND for unknown orders", async () => {
  mockRedis.reset();
  const res = new MockResponse();
  await restoreHandler(makeReq("POST", { orderIds: ["GPA.UNKNOWN-001"] }), res);
  t("status 200", res._status === 200);
  t("ok true", res._json.ok === true);
  t("result NOT_FOUND", res._json.restorations[0].ok === false);
  t("reason", res._json.restorations[0].reason === "NOT_FOUND");
});

suite("restore-purchases returns fulfilled non-consumable", async () => {
  mockRedis.reset();
  await fullVerifyClaimFulfill(
    "GPA.RESTORE-CHAR-001",
    "com.yalltoo.taplites.gei.char_jesus",
    "restore-char-token"
  );

  const res = new MockResponse();
  await restoreHandler(makeReq("POST", { orderIds: ["GPA.RESTORE-CHAR-001"] }), res);
  t("status 200", res._status === 200);
  const r = res._json.restorations[0];
  t("ok true", r.ok === true);
  t("status FULFILLED", r.status === "FULFILLED");
  t("packId", r.packId === "special-jesus");
  t("productType", r.productType === "special-character");
  t("characterId", r.characterId === "jesus");
  t("has fulfillmentId", r.fulfillmentId.startsWith("GEI-PLAY-FULFILL-"));
});

suite("restore-purchases skips non-string order IDs", async () => {
  mockRedis.reset();
  const res = new MockResponse();
  await restoreHandler(makeReq("POST", { orderIds: [null, 123, "", "GPA.VALID"] }), res);
  t("status 200", res._status === 200);
  t("only valid entries processed", res._json.restorations.length === 1);
});

suite("restore-purchases with Google re-verification for non-consumable", async () => {
  mockRedis.reset();
  await fullVerifyClaimFulfill(
    "GPA.REVERIFY-001",
    "com.yalltoo.taplites.gei.char_jesus",
    "reverify-token"
  );

  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.REVERIFY-001",
    productId: "com.yalltoo.taplites.gei.char_jesus",
    purchaseState: 0,
    acknowledgementState: 1
  }));

  const res = new MockResponse();
  await restoreHandler(makeReq("POST", {
    orderIds: ["GPA.REVERIFY-001"],
    purchaseTokens: [{
      orderId: "GPA.REVERIFY-001",
      purchaseToken: "reverify-token",
      playProductId: "com.yalltoo.taplites.gei.char_jesus"
    }]
  }), res);

  t("status 200", res._status === 200);
  const r = res._json.restorations[0];
  t("ok true", r.ok === true);
  t("google verified", r.googleVerified === true);
  t("packId", r.packId === "special-jesus");
});

suite("restore-purchases rejects revoked purchase via Google re-verification", async () => {
  mockRedis.reset();
  await fullVerifyClaimFulfill(
    "GPA.REVOKED-RESTORE-001",
    "com.yalltoo.taplites.gei.char_devil",
    "revoked-restore-token"
  );

  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.REVOKED-RESTORE-001",
    productId: "com.yalltoo.taplites.gei.char_devil",
    purchaseState: 1,
    acknowledgementState: 1
  }));

  const res = new MockResponse();
  await restoreHandler(makeReq("POST", {
    orderIds: ["GPA.REVOKED-RESTORE-001"],
    purchaseTokens: [{
      orderId: "GPA.REVOKED-RESTORE-001",
      purchaseToken: "revoked-restore-token",
      playProductId: "com.yalltoo.taplites.gei.char_devil"
    }]
  }), res);

  t("status 200", res._status === 200);
  const r = res._json.restorations[0];
  t("not ok", r.ok === false);
  t("reason", r.reason === "PURCHASE_NOT_VALID");
  t("purchaseState", r.purchaseState === 1);
});

suite("restore-purchases blocks revoked entitlement", async () => {
  mockRedis.reset();
  await fullVerifyClaimFulfill(
    "GPA.REVOKED-ENT-001",
    "com.yalltoo.taplites.gei.char_jesus",
    "revoked-ent-token"
  );

  const entKey = "gei:playbilling:entitlement:GPA.REVOKED-ENT-001";
  const raw = mockRedis.store.get(entKey);
  const record = JSON.parse(raw);
  record.status = "REVOKED";
  record.revokedAt = new Date().toISOString();
  mockRedis.store.set(entKey, JSON.stringify(record));

  const res = new MockResponse();
  await restoreHandler(makeReq("POST", { orderIds: ["GPA.REVOKED-ENT-001"] }), res);
  t("status 200", res._status === 200);
  const r = res._json.restorations[0];
  t("not ok", r.ok === false);
  t("reason REVOKED", r.reason === "REVOKED");
});

suite("restore-purchases does not re-credit fulfilled consumable", async () => {
  mockRedis.reset();
  await fullVerifyClaimFulfill(
    "GPA.CONSUMED-001",
    "com.yalltoo.taplites.gei.single_song",
    "consumed-token"
  );

  const res = new MockResponse();
  await restoreHandler(makeReq("POST", { orderIds: ["GPA.CONSUMED-001"] }), res);
  t("status 200", res._status === 200);
  const r = res._json.restorations[0];
  t("ok true", r.ok === true);
  t("already fulfilled", r.alreadyFulfilled === true);
  t("consumable true", r.consumable === true);
  t("no fulfillmentId exposed for re-credit", r.fulfillmentId === undefined);
});


// ════════════════════════════════════════════════════════════════════
// 11. CONSUMABLE RE-PURCHASE LIFECYCLE
// ════════════════════════════════════════════════════════════════════

suite("Same consumable pack can be purchased with different orders", async () => {
  mockRedis.reset();

  const r1 = await fullVerifyClaimFulfill(
    "GPA.REPURCHASE-001",
    "com.yalltoo.taplites.gei.single_song",
    "repurchase-token-001"
  );
  t("first purchase fulfilled", r1.fulfill._status === 200);
  t("first receipt", r1.fulfill._json.receipt.packId === "single");

  const r2 = await fullVerifyClaimFulfill(
    "GPA.REPURCHASE-002",
    "com.yalltoo.taplites.gei.single_song",
    "repurchase-token-002"
  );
  t("second purchase fulfilled", r2.fulfill._status === 200);
  t("second receipt", r2.fulfill._json.receipt.packId === "single");
  t("different fulfillmentIds",
    r1.fulfill._json.receipt.fulfillmentId !== r2.fulfill._json.receipt.fulfillmentId);
});


// ════════════════════════════════════════════════════════════════════
// 12. REDIS OUTAGE / PARTIAL FAILURE
// ════════════════════════════════════════════════════════════════════

suite("Redis outage during verify fails closed", async () => {
  const savedUrl = process.env.UPSTASH_REDIS_REST_URL;
  process.env.UPSTASH_REDIS_REST_URL = "";

  const purchase = validGooglePurchase({ orderId: "GPA.REDIS-FAIL" });
  setGoogleApiResponse(purchase);

  const res = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: "redis-fail-token",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    orderId: "GPA.REDIS-FAIL"
  }), res);

  t("status 500", res._status === 500);
  process.env.UPSTASH_REDIS_REST_URL = savedUrl;
});

suite("Redis outage during claim fails closed", async () => {
  const savedUrl = process.env.UPSTASH_REDIS_REST_URL;
  process.env.UPSTASH_REDIS_REST_URL = "";

  const res = new MockResponse();
  await claimHandler(makeReq("POST", { claimToken: "GPA.REDIS-CLAIM", claimId: "c1" }), res);
  t("status 500", res._status === 500);

  process.env.UPSTASH_REDIS_REST_URL = savedUrl;
});


// ════════════════════════════════════════════════════════════════════
// 13. ECONOMY AUTHORITY CONSISTENCY
// ════════════════════════════════════════════════════════════════════

suite("All 6 products pass economy authority validation", () => {
  for (const [packId] of Object.entries(GOOGLE_PLAY_PRODUCT_MAP)) {
    const pack = getPack(packId);
    t(`${packId} validates`, validateEntitlementAuthority({
      packId,
      flOz: pack.flOz,
      amount: pack.price,
      currency: "USD"
    }));
  }
});

suite("Economy authority rejects tampered values", () => {
  t("wrong flOz rejected", !validateEntitlementAuthority({
    packId: "single", flOz: 99999, amount: "6.00", currency: "USD"
  }));
  t("wrong price rejected", !validateEntitlementAuthority({
    packId: "single", flOz: 6660, amount: "1.00", currency: "USD"
  }));
  t("wrong currency rejected", !validateEntitlementAuthority({
    packId: "single", flOz: 6660, amount: "6.00", currency: "EUR"
  }));
  t("wrong packId rejected", !validateEntitlementAuthority({
    packId: "nonexistent", flOz: 6660, amount: "6.00", currency: "USD"
  }));
});


// ════════════════════════════════════════════════════════════════════
// 14. CROSS-PRODUCT SUBSTITUTION ATTACK
// ════════════════════════════════════════════════════════════════════

suite("Cannot use cheap product token to claim expensive product", async () => {
  mockRedis.reset();
  const purchase = validGooglePurchase({
    orderId: "GPA.SUBSTITUTION-001",
    productId: "com.yalltoo.taplites.gei.single_song"
  });
  setGoogleApiResponse(purchase);

  const res = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: "substitution-token",
    playProductId: "com.yalltoo.taplites.gei.twentyfive_songs",
    orderId: "GPA.SUBSTITUTION-001"
  }), res);

  t("substitution rejected", res._status === 403);
  t("error mentions product", res._json.error.includes("Product ID"));
});


// ════════════════════════════════════════════════════════════════════
// 15. RTDN NOTIFICATION — INPUT VALIDATION
// ════════════════════════════════════════════════════════════════════

suite("RTDN rejects non-POST methods", async () => {
  const res = new MockResponse();
  await rtdnHandler(makeReq("GET"), res);
  t("status 405", res._status === 405);
});

suite("RTDN rejects missing message body", async () => {
  mockRedis.reset();
  const res = new MockResponse();
  await rtdnHandler(makeReq("POST", {}), res);
  t("status 200 (ack)", res._status === 200);
  t("reason", res._json.reason === "MISSING_MESSAGE");
  t("ack true", res._json.ack === true);
});

suite("RTDN rejects malformed base64 data", async () => {
  mockRedis.reset();
  const res = new MockResponse();
  await rtdnHandler(makeReq("POST", {
    message: { data: "not-valid-base64!!!", messageId: "msg-bad" }
  }), res);
  t("status 200 (ack)", res._status === 200);
  t("reason", res._json.reason === "MALFORMED_DATA");
});

suite("RTDN rejects unsupported notification types (subscriptions)", async () => {
  mockRedis.reset();
  const data = { packageName: "com.yalltoo.taplites.gei", subscriptionNotification: { notificationType: 4 } };
  const res = new MockResponse();
  await rtdnHandler(makeReq("POST", {
    message: {
      data: Buffer.from(JSON.stringify(data)).toString("base64"),
      messageId: "msg-sub"
    }
  }), res);
  t("status 200 (ack)", res._status === 200);
  t("reason", res._json.reason === "UNSUPPORTED_NOTIFICATION_TYPE");
});

suite("RTDN rejects wrong package name", async () => {
  mockRedis.reset();
  const body = makeRtdnBody(1, "com.yalltoo.taplites.gei.single_song", "tok-wrong-pkg", "msg-pkg");
  const innerData = JSON.parse(Buffer.from(body.message.data, "base64").toString("utf8"));
  innerData.packageName = "com.evil.app";
  body.message.data = Buffer.from(JSON.stringify(innerData)).toString("base64");

  const res = new MockResponse();
  await rtdnHandler(makeReq("POST", body), res);
  t("status 200 (ack)", res._status === 200);
  t("reason WRONG_PACKAGE", res._json.reason === "WRONG_PACKAGE");
});

suite("RTDN rejects unknown product SKU", async () => {
  mockRedis.reset();
  const body = makeRtdnBody(1, "com.fake.product.sku", "tok-fake", "msg-fake");
  const res = new MockResponse();
  await rtdnHandler(makeReq("POST", body), res);
  t("status 200 (ack)", res._status === 200);
  t("reason UNKNOWN_PRODUCT", res._json.reason === "UNKNOWN_PRODUCT");
});

suite("RTDN rejects unauthenticated notification when token is configured", async () => {
  mockRedis.reset();
  process.env.GOOGLE_RTDN_VERIFICATION_TOKEN = "secret-rtdn-token";

  const body = makeRtdnBody(1, "com.yalltoo.taplites.gei.single_song", "tok-noauth", "msg-noauth");
  const res = new MockResponse();
  await rtdnHandler(makeReq("POST", body, {}), res);
  t("status 403", res._status === 403);
  t("error", res._json.error === "Unauthorized notification.");

  delete process.env.GOOGLE_RTDN_VERIFICATION_TOKEN;
});

suite("RTDN accepts authenticated notification with correct token", async () => {
  mockRedis.reset();
  process.env.GOOGLE_RTDN_VERIFICATION_TOKEN = "secret-rtdn-token";

  const body = makeRtdnBody(1, "com.yalltoo.taplites.gei.single_song", "tok-auth", "msg-auth");
  const res = new MockResponse();
  await rtdnHandler(makeReq("POST", body, { token: "secret-rtdn-token" }), res);
  t("status 200", res._status === 200);
  t("ok true", res._json.ok === true);

  delete process.env.GOOGLE_RTDN_VERIFICATION_TOKEN;
});


// ════════════════════════════════════════════════════════════════════
// 16. RTDN — PURCHASE NOTIFICATION
// ════════════════════════════════════════════════════════════════════

suite("RTDN type 1 (PURCHASED) notes without action", async () => {
  mockRedis.reset();
  const body = makeRtdnBody(1, "com.yalltoo.taplites.gei.single_song", "purchased-tok", "msg-purchased");
  const res = new MockResponse();
  await rtdnHandler(makeReq("POST", body), res);
  t("status 200", res._status === 200);
  t("ok true", res._json.ok === true);
  t("action", res._json.action === "PURCHASE_NOTED");
  t("ack", res._json.ack === true);
});


// ════════════════════════════════════════════════════════════════════
// 17. RTDN — DUPLICATE PREVENTION
// ════════════════════════════════════════════════════════════════════

suite("RTDN duplicate message is idempotent", async () => {
  mockRedis.reset();
  const body = makeRtdnBody(1, "com.yalltoo.taplites.gei.single_song", "dup-rtdn-tok", "msg-dup-001");

  const r1 = new MockResponse();
  await rtdnHandler(makeReq("POST", body), r1);
  t("first 200", r1._status === 200);
  t("first ok", r1._json.ok === true);
  t("first action", r1._json.action === "PURCHASE_NOTED");

  const r2 = new MockResponse();
  await rtdnHandler(makeReq("POST", body), r2);
  t("second 200", r2._status === 200);
  t("second ok", r2._json.ok === true);
  t("second action DUPLICATE", r2._json.action === "DUPLICATE_IGNORED");
});


// ════════════════════════════════════════════════════════════════════
// 18. RTDN — REFUND REVOCATION
// ════════════════════════════════════════════════════════════════════

suite("RTDN type 3 (REFUNDED) revokes non-consumable character", async () => {
  mockRedis.reset();
  const token = "refund-char-token-" + Date.now();
  await fullVerifyClaimFulfill(
    "GPA.REFUND-CHAR-001",
    "com.yalltoo.taplites.gei.char_jesus",
    token
  );

  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.REFUND-CHAR-001",
    productId: "com.yalltoo.taplites.gei.char_jesus",
    purchaseState: 1,
    acknowledgementState: 1
  }));

  const body = makeRtdnBody(3, "com.yalltoo.taplites.gei.char_jesus", token, "msg-refund-char");
  const res = new MockResponse();
  await rtdnHandler(makeReq("POST", body), res);
  t("status 200", res._status === 200);
  t("ok true", res._json.ok === true);
  t("action revoked", res._json.action === "NON_CONSUMABLE_ACCESS_REVOKED");
  t("packId", res._json.packId === "special-jesus");

  const entKey = "gei:playbilling:entitlement:GPA.REFUND-CHAR-001";
  const record = JSON.parse(mockRedis.store.get(entKey));
  t("status REVOKED", record.status === "REVOKED");
  t("previous status preserved", record.previousStatus === "FULFILLED");
  t("revokedAt set", typeof record.revokedAt === "string");
});

suite("RTDN type 3 (REFUNDED) marks consumable for audit review", async () => {
  mockRedis.reset();
  const token = "refund-floz-token-" + Date.now();
  await fullVerifyClaimFulfill(
    "GPA.REFUND-FLOZ-001",
    "com.yalltoo.taplites.gei.single_song",
    token
  );

  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.REFUND-FLOZ-001",
    productId: "com.yalltoo.taplites.gei.single_song",
    purchaseState: 1,
    acknowledgementState: 1
  }));

  const body = makeRtdnBody(3, "com.yalltoo.taplites.gei.single_song", token, "msg-refund-floz");
  const res = new MockResponse();
  await rtdnHandler(makeReq("POST", body), res);
  t("status 200", res._status === 200);
  t("action", res._json.action === "CONSUMABLE_REVOKED_AUDIT_PENDING");
  t("consumable true", res._json.consumable === true);

  const revKey = "gei:playbilling:revocation:GPA.REFUND-FLOZ-001";
  const revRecord = JSON.parse(mockRedis.store.get(revKey));
  t("revocation record exists", !!revRecord);
  t("debt policy AUDIT_REVIEW", revRecord.debtPolicy === "AUDIT_REVIEW");
  t("consumable in revocation", revRecord.consumable === true);
  t("flOz recorded", revRecord.flOz === 6660);
});

suite("RTDN type 5 (REVOKED) revokes access", async () => {
  mockRedis.reset();
  const token = "revoke-token-" + Date.now();
  await fullVerifyClaimFulfill(
    "GPA.REVOKE-001",
    "com.yalltoo.taplites.gei.char_devil",
    token
  );

  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.REVOKE-001",
    productId: "com.yalltoo.taplites.gei.char_devil",
    purchaseState: 1,
    acknowledgementState: 1
  }));

  const body = makeRtdnBody(5, "com.yalltoo.taplites.gei.char_devil", token, "msg-revoke");
  const res = new MockResponse();
  await rtdnHandler(makeReq("POST", body), res);
  t("status 200", res._status === 200);
  t("action", res._json.action === "NON_CONSUMABLE_ACCESS_REVOKED");

  const revKey = "gei:playbilling:revocation:GPA.REVOKE-001";
  const revRecord = JSON.parse(mockRedis.store.get(revKey));
  t("revocation debtPolicy ACCESS_REVOKED", revRecord.debtPolicy === "ACCESS_REVOKED");
});


// ════════════════════════════════════════════════════════════════════
// 19. RTDN — STILL-VALID PURCHASE SKIPS REVOCATION
// ════════════════════════════════════════════════════════════════════

suite("RTDN does not revoke when Google says purchase is still valid", async () => {
  mockRedis.reset();
  const token = "valid-purchase-rtdn-" + Date.now();
  await fullVerifyClaimFulfill(
    "GPA.STILL-VALID-001",
    "com.yalltoo.taplites.gei.char_jesus",
    token
  );

  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.STILL-VALID-001",
    productId: "com.yalltoo.taplites.gei.char_jesus",
    purchaseState: 0,
    acknowledgementState: 1
  }));

  const body = makeRtdnBody(2, "com.yalltoo.taplites.gei.char_jesus", token, "msg-still-valid");
  const res = new MockResponse();
  await rtdnHandler(makeReq("POST", body), res);
  t("status 200", res._status === 200);
  t("action", res._json.action === "PURCHASE_STILL_VALID");

  const entKey = "gei:playbilling:entitlement:GPA.STILL-VALID-001";
  const record = JSON.parse(mockRedis.store.get(entKey));
  t("status NOT revoked", record.status !== "REVOKED");
});


// ════════════════════════════════════════════════════════════════════
// 20. RTDN — DOUBLE REVOCATION IDEMPOTENT
// ════════════════════════════════════════════════════════════════════

suite("RTDN double revocation is idempotent", async () => {
  mockRedis.reset();
  const token = "double-revoke-token-" + Date.now();
  await fullVerifyClaimFulfill(
    "GPA.DOUBLE-REVOKE-001",
    "com.yalltoo.taplites.gei.char_jesus",
    token
  );

  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.DOUBLE-REVOKE-001",
    productId: "com.yalltoo.taplites.gei.char_jesus",
    purchaseState: 1,
    acknowledgementState: 1
  }));

  const body1 = makeRtdnBody(3, "com.yalltoo.taplites.gei.char_jesus", token, "msg-double-1");
  const r1 = new MockResponse();
  await rtdnHandler(makeReq("POST", body1), r1);
  t("first revocation ok", r1._json.action === "NON_CONSUMABLE_ACCESS_REVOKED");

  const body2 = makeRtdnBody(3, "com.yalltoo.taplites.gei.char_jesus", token, "msg-double-2");
  const r2 = new MockResponse();
  await rtdnHandler(makeReq("POST", body2), r2);
  t("second revocation ok", r2._json.ok === true);
  t("second action already revoked", r2._json.action === "ALREADY_REVOKED" || r2._json.action === "NON_CONSUMABLE_ACCESS_REVOKED");
});


// ════════════════════════════════════════════════════════════════════
// 21. RTDN — GOOGLE API FAILURE IS RETRYABLE
// ════════════════════════════════════════════════════════════════════

suite("RTDN marks Google API failure as retryable", async () => {
  mockRedis.reset();
  setGoogleApiError("Service unavailable", 503);

  const body = makeRtdnBody(3, "com.yalltoo.taplites.gei.single_song", "google-fail-rtdn-tok", "msg-google-fail");
  const res = new MockResponse();
  await rtdnHandler(makeReq("POST", body), res);
  t("status 200 (ack)", res._status === 200);
  t("not ok", res._json.ok === false);
  t("retryable", res._json.retryable === true);
  t("reason", res._json.reason === "GOOGLE_VERIFICATION_FAILED");
});


// ════════════════════════════════════════════════════════════════════
// 22. RTDN — REDIS OUTAGE FAILS CLOSED
// ════════════════════════════════════════════════════════════════════

suite("RTDN fails closed during Redis outage", async () => {
  const savedUrl = process.env.UPSTASH_REDIS_REST_URL;
  process.env.UPSTASH_REDIS_REST_URL = "";

  const body = makeRtdnBody(3, "com.yalltoo.taplites.gei.single_song", "redis-fail-rtdn", "msg-redis-fail");
  const res = new MockResponse();
  await rtdnHandler(makeReq("POST", body), res);
  t("status 500", res._status === 500);
  t("retryable", res._json.retryable === true);

  process.env.UPSTASH_REDIS_REST_URL = savedUrl;
});


// ════════════════════════════════════════════════════════════════════
// 23. RTDN — PAYPAL RECORDS UNTOUCHED
// ════════════════════════════════════════════════════════════════════

suite("RTDN processing does not create PayPal namespace keys", async () => {
  mockRedis.reset();
  const token = "paypal-isolation-token-" + Date.now();
  await fullVerifyClaimFulfill(
    "GPA.PAYPAL-ISO-001",
    "com.yalltoo.taplites.gei.single_song",
    token
  );

  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.PAYPAL-ISO-001",
    productId: "com.yalltoo.taplites.gei.single_song",
    purchaseState: 1,
    acknowledgementState: 1
  }));

  const body = makeRtdnBody(3, "com.yalltoo.taplites.gei.single_song", token, "msg-paypal-iso");
  const res = new MockResponse();
  await rtdnHandler(makeReq("POST", body), res);
  t("processed ok", res._status === 200);

  const keys = [...mockRedis.store.keys()];
  const paypalKeys = keys.filter(k => k.startsWith("gei:paypal:"));
  t("no PayPal keys created", paypalKeys.length === 0);
});


// ════════════════════════════════════════════════════════════════════
// 24. RTDN — OUT-OF-ORDER NOTIFICATION USES GOOGLE STATE
// ════════════════════════════════════════════════════════════════════

suite("RTDN out-of-order: cancel then purchase, Google shows valid", async () => {
  mockRedis.reset();
  const token = "ooo-token-" + Date.now();
  await fullVerifyClaimFulfill(
    "GPA.OOO-001",
    "com.yalltoo.taplites.gei.char_jesus",
    token
  );

  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.OOO-001",
    productId: "com.yalltoo.taplites.gei.char_jesus",
    purchaseState: 0,
    acknowledgementState: 1
  }));

  const cancelBody = makeRtdnBody(2, "com.yalltoo.taplites.gei.char_jesus", token, "msg-ooo-cancel");
  const r1 = new MockResponse();
  await rtdnHandler(makeReq("POST", cancelBody), r1);
  t("cancel ignored because Google says valid", r1._json.action === "PURCHASE_STILL_VALID");

  const entKey = "gei:playbilling:entitlement:GPA.OOO-001";
  const record = JSON.parse(mockRedis.store.get(entKey));
  t("entitlement NOT revoked", record.status !== "REVOKED");
});


// ════════════════════════════════════════════════════════════════════
// 25. RESTORE — ORDER ID MISMATCH
// ════════════════════════════════════════════════════════════════════

suite("restore rejects mismatched order ID from Google", async () => {
  mockRedis.reset();
  await fullVerifyClaimFulfill(
    "GPA.MISMATCH-RESTORE-001",
    "com.yalltoo.taplites.gei.char_devil",
    "mismatch-restore-token"
  );

  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.DIFFERENT-ORDER",
    productId: "com.yalltoo.taplites.gei.char_devil",
    purchaseState: 0,
    acknowledgementState: 1
  }));

  const res = new MockResponse();
  await restoreHandler(makeReq("POST", {
    orderIds: ["GPA.MISMATCH-RESTORE-001"],
    purchaseTokens: [{
      orderId: "GPA.MISMATCH-RESTORE-001",
      purchaseToken: "mismatch-restore-token",
      playProductId: "com.yalltoo.taplites.gei.char_devil"
    }]
  }), res);

  t("status 200", res._status === 200);
  const r = res._json.restorations[0];
  t("not ok", r.ok === false);
  t("reason ORDER_ID_MISMATCH", r.reason === "ORDER_ID_MISMATCH");
});


// ════════════════════════════════════════════════════════════════════
// 26. RTDN — NOTIFICATION PARSE
// ════════════════════════════════════════════════════════════════════

suite("RTDN notification parser handles all supported types", () => {
  const { parseNotificationPayload, SUPPORTED_NOTIFICATION_TYPES } = rtdnModule;

  for (const [type, label] of Object.entries(SUPPORTED_NOTIFICATION_TYPES)) {
    const body = makeRtdnBody(Number(type), "com.yalltoo.taplites.gei.single_song", "parse-tok", "msg-parse-" + type);
    const result = parseNotificationPayload(body);
    t(`type ${type} parsed ok`, result.ok === true);
    t(`type ${type} label`, result.notificationLabel === label);
    t(`type ${type} has token`, !!result.purchaseToken);
    t(`type ${type} has sku`, !!result.sku);
  }
});


// ════════════════════════════════════════════════════════════════════
// 27. REVOCATION RECORD AUDIT TRAIL
// ════════════════════════════════════════════════════════════════════

suite("Revocation creates auditable revocation record with debt policy", async () => {
  mockRedis.reset();
  const token = "audit-revoke-token-" + Date.now();
  await fullVerifyClaimFulfill(
    "GPA.AUDIT-REVOKE-001",
    "com.yalltoo.taplites.gei.ten_songs",
    token
  );

  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.AUDIT-REVOKE-001",
    productId: "com.yalltoo.taplites.gei.ten_songs",
    purchaseState: 1,
    acknowledgementState: 1
  }));

  const body = makeRtdnBody(3, "com.yalltoo.taplites.gei.ten_songs", token, "msg-audit-revoke");
  const res = new MockResponse();
  await rtdnHandler(makeReq("POST", body), res);
  t("status 200", res._status === 200);

  const revKey = "gei:playbilling:revocation:GPA.AUDIT-REVOKE-001";
  const revRecord = JSON.parse(mockRedis.store.get(revKey));
  t("revocation orderId", revRecord.orderId === "GPA.AUDIT-REVOKE-001");
  t("revocation packId", revRecord.packId === "ten");
  t("revocation consumable", revRecord.consumable === true);
  t("revocation previousStatus", revRecord.previousStatus === "FULFILLED");
  t("revocation debtPolicy", revRecord.debtPolicy === "AUDIT_REVIEW");
  t("revocation flOz", revRecord.flOz === 66600);
  t("revocation notificationType", revRecord.notificationType === 3);
  t("revocation revokedAt", typeof revRecord.revokedAt === "string");
});


// ════════════════════════════════════════════════════════════════════
// 28. RESTORE — GOOGLE API FAILURE DURING VERIFICATION
// ════════════════════════════════════════════════════════════════════

suite("restore fails safely when Google API is down during re-verification", async () => {
  mockRedis.reset();
  await fullVerifyClaimFulfill(
    "GPA.GOOGLE-DOWN-RESTORE",
    "com.yalltoo.taplites.gei.char_devil",
    "google-down-restore-token"
  );

  setGoogleApiError("Internal error", 500);

  const res = new MockResponse();
  await restoreHandler(makeReq("POST", {
    orderIds: ["GPA.GOOGLE-DOWN-RESTORE"],
    purchaseTokens: [{
      orderId: "GPA.GOOGLE-DOWN-RESTORE",
      purchaseToken: "google-down-restore-token",
      playProductId: "com.yalltoo.taplites.gei.char_devil"
    }]
  }), res);

  t("status 200", res._status === 200);
  const r = res._json.restorations[0];
  t("not ok", r.ok === false);
  t("reason", r.reason === "GOOGLE_VERIFICATION_FAILED");
});


// ════════════════════════════════════════════════════════════════════
// 29. RTDN — PURCHASE TOKEN NOT IN PLAINTEXT
// ════════════════════════════════════════════════════════════════════

suite("RTDN does not store purchase token in plaintext", async () => {
  mockRedis.reset();
  const plainToken = "rtdn-secret-purchase-token-" + Date.now();
  const token = plainToken;
  await fullVerifyClaimFulfill(
    "GPA.RTDN-HASH-001",
    "com.yalltoo.taplites.gei.single_song",
    token
  );

  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.RTDN-HASH-001",
    productId: "com.yalltoo.taplites.gei.single_song",
    purchaseState: 1,
    acknowledgementState: 1
  }));

  const body = makeRtdnBody(3, "com.yalltoo.taplites.gei.single_song", token, "msg-rtdn-hash");
  const res = new MockResponse();
  await rtdnHandler(makeReq("POST", body), res);
  t("processed", res._status === 200);

  for (const [key, value] of mockRedis.store.entries()) {
    if (key.startsWith("gei:playbilling:rtdn:") || key.startsWith("gei:playbilling:revocation:")) {
      t(`key ${key} doesn't contain plain token`, !key.includes(plainToken));
      if (typeof value === "string") {
        t(`value for ${key} doesn't contain plain token`, !value.includes(plainToken));
      }
    }
  }
});


// ════════════════════════════════════════════════════════════════════
// 30. RTDN — TYPE 12 PENDING PURCHASE CANCELED
// ════════════════════════════════════════════════════════════════════

suite("RTDN type 12 (PENDING_PURCHASE_CANCELED) handles gracefully", async () => {
  mockRedis.reset();
  const body = makeRtdnBody(12, "com.yalltoo.taplites.gei.single_song", "pending-cancel-tok", "msg-pending-cancel");

  setGoogleApiResponse(validGooglePurchase({
    purchaseState: 1,
    acknowledgementState: 0
  }));

  const res = new MockResponse();
  await rtdnHandler(makeReq("POST", body), res);
  t("status 200", res._status === 200);
  t("ok true", res._json.ok === true);
  t("ack true", res._json.ack === true);
});


// ════════════════════════════════════════════════════════════════════
// RUN
// ════════════════════════════════════════════════════════════════════

console.log("\nV2.4.3 — Google Play Billing Restore, Refund & Revocation Security\n");
await runAll();

console.log("\n--- Manual Test Checklist (requires Play Console + RTDN) ---");
console.log("  [ ] Configure Cloud Pub/Sub topic for RTDN");
console.log("  [ ] Verify RTDN endpoint receives and acks test notifications");
console.log("  [ ] Refund a consumable via Play Console → verify RTDN revocation");
console.log("  [ ] Refund a non-consumable character → verify access revoked");
console.log("  [ ] Restore non-consumable after reinstall with Google re-verification");
console.log("  [ ] Restore consumable → verify no re-credit");
console.log("  [ ] Duplicate RTDN delivery → verify idempotent processing");
console.log("  [ ] PayPal purchase + Play refund → verify no cross-channel effect");
console.log("  [ ] Test RTDN with invalid/expired verification token");
console.log("  [ ] Network failure during RTDN processing → verify retry succeeds");
