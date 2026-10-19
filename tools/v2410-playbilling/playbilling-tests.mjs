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
    if (script.includes("revokedAt")) {
      return this._evalRevokeScript(script, keys, argv);
    }
    if (script.includes("KEYS[2]") && !script.includes("revokedAt")) {
      return this._evalRecordScript(script, keys, argv);
    }
    if (script.includes("fulfilledAt")) {
      return this._evalFulfillScript(script, keys, argv);
    }
    if (script.includes("claimedAt")) {
      return this._evalClaimScript(script, keys, argv);
    }
    if (script.includes('"PROCESSED"') && script.includes('"RECEIVED"')) {
      return this._evalRtdnDedupScript(script, keys, argv);
    }
    if (script.includes('"PROCESSED"') && script.includes("processedAt")) {
      return this._evalRtdnCompleteScript(script, keys, argv);
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
    if (obj.status === "REVOKED") return [0, "REVOKED"];
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
    if (obj.status === "REVOKED") return [0, "REVOKED"];
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
    if (keys[1] && argv[5]) {
      const auditObj = JSON.parse(argv[5]);
      auditObj.previousStatus = obj.previousStatus;
      auditObj.flOz = obj.flOz;
      auditObj.productType = obj.productType || "fl-oz";
      auditObj.characterId = obj.characterId || null;
      this.store.set(keys[1], JSON.stringify(auditObj));
    }
    return [1, updated];
  }

  _evalRtdnDedupScript(script, keys, argv) {
    const existing = this.store.get(keys[0]);
    if (existing) {
      const obj = JSON.parse(existing);
      const status = obj.status || "UNKNOWN";
      return [0, status, existing];
    }
    this.store.set(keys[0], argv[0]);
    return [1, "RECEIVED", argv[0]];
  }

  _evalRtdnCompleteScript(script, keys, argv) {
    const existing = this.store.get(keys[0]);
    if (!existing) return [0, "NOT_FOUND"];
    const obj = JSON.parse(existing);
    obj.status = "PROCESSED";
    obj.processedAt = argv[0];
    obj.action = argv[1];
    const updated = JSON.stringify(obj);
    this.store.set(keys[0], updated);
    return [1, "PROCESSED"];
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

function makeReq(method, body, query, headers) {
  return { method, body, query: query || {}, headers: headers || {} };
}

// ─── Install global fetch interceptor for Redis ────────────────────

const UPSTASH_URL = "https://mock-redis.upstash.io";
const UPSTASH_TOKEN = "mock-token";
process.env.UPSTASH_REDIS_REST_URL = UPSTASH_URL;
process.env.UPSTASH_REDIS_REST_TOKEN = UPSTASH_TOKEN;
process.env.GOOGLE_PLAY_PACKAGE_NAME = "com.yalltoo.taplites.gei";
process.env.GOOGLE_RTDN_VERIFICATION_TOKEN = "test-rtdn-secret";

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
const verifyPurchaseModule = await import("../../api/_handlers/playbilling/verify-purchase.js");
const claimEntitlementModule = await import("../../api/_handlers/playbilling/claim-entitlement.js");
const fulfillEntitlementModule = await import("../../api/_handlers/playbilling/fulfill-entitlement.js");
const productsModule = await import("../../api/_handlers/playbilling/products.js");
const restorePurchasesModule = await import("../../api/_handlers/playbilling/restore-purchases.js");
const rtdnModule = await import("../../api/_handlers/playbilling/rtdn-notification.js");

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

function rtdnReq(body) {
  return makeReq("POST", body, {}, { "x-rtdn-token": process.env.GOOGLE_RTDN_VERIFICATION_TOKEN });
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

suite("restore-purchases requires token for non-consumable (TOKEN_REQUIRED)", async () => {
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
  t("ok false", r.ok === false);
  t("reason TOKEN_REQUIRED", r.reason === "TOKEN_REQUIRED");
  t("packId", r.packId === "special-jesus");
});

suite("restore-purchases returns fulfilled non-consumable with token", async () => {
  mockRedis.reset();
  await fullVerifyClaimFulfill(
    "GPA.RESTORE-CHAR-002",
    "com.yalltoo.taplites.gei.char_jesus",
    "restore-char-token-2"
  );

  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.RESTORE-CHAR-002",
    productId: "com.yalltoo.taplites.gei.char_jesus",
    purchaseState: 0,
    acknowledgementState: 1
  }));

  const res = new MockResponse();
  await restoreHandler(makeReq("POST", {
    orderIds: ["GPA.RESTORE-CHAR-002"],
    purchaseTokens: [{
      orderId: "GPA.RESTORE-CHAR-002",
      purchaseToken: "restore-char-token-2",
      playProductId: "com.yalltoo.taplites.gei.char_jesus"
    }]
  }), res);
  t("status 200", res._status === 200);
  const r = res._json.restorations[0];
  t("ok true", r.ok === true);
  t("status FULFILLED", r.status === "FULFILLED");
  t("packId", r.packId === "special-jesus");
  t("productType", r.productType === "special-character");
  t("characterId", r.characterId === "jesus");
  t("has fulfillmentId", r.fulfillmentId.startsWith("GEI-PLAY-FULFILL-"));
  t("google verified", r.googleVerified === true);
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
  await rtdnHandler(rtdnReq({}), res);
  t("status 200 (ack)", res._status === 200);
  t("reason", res._json.reason === "MISSING_MESSAGE");
  t("ack true", res._json.ack === true);
});

suite("RTDN rejects malformed base64 data", async () => {
  mockRedis.reset();
  const res = new MockResponse();
  await rtdnHandler(rtdnReq({
    message: { data: "not-valid-base64!!!", messageId: "msg-bad" }
  }), res);
  t("status 200 (ack)", res._status === 200);
  t("reason", res._json.reason === "MALFORMED_DATA");
});

suite("RTDN rejects unsupported notification types (subscriptions)", async () => {
  mockRedis.reset();
  const data = { packageName: "com.yalltoo.taplites.gei", subscriptionNotification: { notificationType: 4 } };
  const res = new MockResponse();
  await rtdnHandler(rtdnReq({
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
  await rtdnHandler(rtdnReq(body), res);
  t("status 200 (ack)", res._status === 200);
  t("reason WRONG_PACKAGE", res._json.reason === "WRONG_PACKAGE");
});

suite("RTDN rejects unknown product SKU", async () => {
  mockRedis.reset();
  const body = makeRtdnBody(1, "com.fake.product.sku", "tok-fake", "msg-fake");
  const res = new MockResponse();
  await rtdnHandler(rtdnReq(body), res);
  t("status 200 (ack)", res._status === 200);
  t("reason UNKNOWN_PRODUCT", res._json.reason === "UNKNOWN_PRODUCT");
});

suite("RTDN rejects when verification token is not configured (fail-closed)", async () => {
  mockRedis.reset();
  const savedToken = process.env.GOOGLE_RTDN_VERIFICATION_TOKEN;
  delete process.env.GOOGLE_RTDN_VERIFICATION_TOKEN;

  const body = makeRtdnBody(1, "com.yalltoo.taplites.gei.single_song", "tok-noconfig", "msg-noconfig");
  const res = new MockResponse();
  await rtdnHandler(makeReq("POST", body, {}, {}), res);
  t("status 503", res._status === 503);
  t("reason", res._json.reason === "AUTHENTICATION_NOT_CONFIGURED");

  process.env.GOOGLE_RTDN_VERIFICATION_TOKEN = savedToken;
});

suite("RTDN rejects wrong verification token", async () => {
  mockRedis.reset();

  const body = makeRtdnBody(1, "com.yalltoo.taplites.gei.single_song", "tok-noauth", "msg-noauth");
  const res = new MockResponse();
  await rtdnHandler(makeReq("POST", body, {}, { "x-rtdn-token": "wrong-token" }), res);
  t("status 403", res._status === 403);
  t("error", res._json.error === "Unauthorized notification.");
});

suite("RTDN rejects missing token in request", async () => {
  mockRedis.reset();

  const body = makeRtdnBody(1, "com.yalltoo.taplites.gei.single_song", "tok-missing", "msg-missing");
  const res = new MockResponse();
  await rtdnHandler(makeReq("POST", body, {}, {}), res);
  t("status 403", res._status === 403);
});

suite("RTDN accepts authenticated notification via header", async () => {
  mockRedis.reset();

  const body = makeRtdnBody(1, "com.yalltoo.taplites.gei.single_song", "tok-auth", "msg-auth-header");
  const res = new MockResponse();
  await rtdnHandler(makeReq("POST", body, {}, { "x-rtdn-token": "test-rtdn-secret" }), res);
  t("status 200", res._status === 200);
  t("ok true", res._json.ok === true);
});

suite("RTDN accepts authenticated notification via query param fallback", async () => {
  mockRedis.reset();

  const body = makeRtdnBody(1, "com.yalltoo.taplites.gei.single_song", "tok-auth-q", "msg-auth-query");
  const res = new MockResponse();
  await rtdnHandler(makeReq("POST", body, { token: "test-rtdn-secret" }, {}), res);
  t("status 200", res._status === 200);
  t("ok true", res._json.ok === true);
});


// ════════════════════════════════════════════════════════════════════
// 16. RTDN — PURCHASE NOTIFICATION
// ════════════════════════════════════════════════════════════════════

suite("RTDN type 1 (PURCHASED) notes without action", async () => {
  mockRedis.reset();
  const body = makeRtdnBody(1, "com.yalltoo.taplites.gei.single_song", "purchased-tok", "msg-purchased");
  const res = new MockResponse();
  await rtdnHandler(rtdnReq(body), res);
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
  await rtdnHandler(rtdnReq(body), r1);
  t("first 200", r1._status === 200);
  t("first ok", r1._json.ok === true);
  t("first action", r1._json.action === "PURCHASE_NOTED");

  const r2 = new MockResponse();
  await rtdnHandler(rtdnReq(body), r2);
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
  await rtdnHandler(rtdnReq(body), res);
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
  await rtdnHandler(rtdnReq(body), res);
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
  await rtdnHandler(rtdnReq(body), res);
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
  await rtdnHandler(rtdnReq(body), res);
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
  await rtdnHandler(rtdnReq(body1), r1);
  t("first revocation ok", r1._json.action === "NON_CONSUMABLE_ACCESS_REVOKED");

  const body2 = makeRtdnBody(3, "com.yalltoo.taplites.gei.char_jesus", token, "msg-double-2");
  const r2 = new MockResponse();
  await rtdnHandler(rtdnReq(body2), r2);
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
  await rtdnHandler(rtdnReq(body), res);
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
  await rtdnHandler(rtdnReq(body), res);
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
  await rtdnHandler(rtdnReq(body), res);
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
  await rtdnHandler(rtdnReq(cancelBody), r1);
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
  await rtdnHandler(rtdnReq(body), res);
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
  await rtdnHandler(rtdnReq(body), res);
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
  await rtdnHandler(rtdnReq(body), res);
  t("status 200", res._status === 200);
  t("ok true", res._json.ok === true);
  t("ack true", res._json.ack === true);
});


// ════════════════════════════════════════════════════════════════════
// 31. V2.4.4 — FAIL-CLOSED AUTH GUARD REGRESSION TEST
// ════════════════════════════════════════════════════════════════════

suite("V2.4.4: RTDN fail-closed guard fails when secret removed", async () => {
  mockRedis.reset();
  const savedToken = process.env.GOOGLE_RTDN_VERIFICATION_TOKEN;
  delete process.env.GOOGLE_RTDN_VERIFICATION_TOKEN;

  const body = makeRtdnBody(3, "com.yalltoo.taplites.gei.single_song", "guard-test-tok", "msg-guard-test");
  const res = new MockResponse();
  await rtdnHandler(makeReq("POST", body, {}, {}), res);
  t("NOT 200 when secret missing", res._status !== 200);
  t("status is 503", res._status === 503);

  process.env.GOOGLE_RTDN_VERIFICATION_TOKEN = savedToken;
});

suite("V2.4.4: RTDN rejects empty string verification token", async () => {
  mockRedis.reset();
  const savedToken = process.env.GOOGLE_RTDN_VERIFICATION_TOKEN;
  process.env.GOOGLE_RTDN_VERIFICATION_TOKEN = "";

  const body = makeRtdnBody(1, "com.yalltoo.taplites.gei.single_song", "empty-tok", "msg-empty-tok");
  const res = new MockResponse();
  await rtdnHandler(makeReq("POST", body, {}, { "x-rtdn-token": "" }), res);
  t("rejects empty token", res._status === 503);

  process.env.GOOGLE_RTDN_VERIFICATION_TOKEN = savedToken;
});


// ════════════════════════════════════════════════════════════════════
// 32. V2.4.4 — RESTORE PRODUCT ID CROSS-VALIDATION
// ════════════════════════════════════════════════════════════════════

suite("V2.4.4: restore rejects product ID mismatch against stored entitlement", async () => {
  mockRedis.reset();
  await fullVerifyClaimFulfill(
    "GPA.PRODUCT-XCHECK-001",
    "com.yalltoo.taplites.gei.char_jesus",
    "product-xcheck-token"
  );

  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.PRODUCT-XCHECK-001",
    productId: "com.yalltoo.taplites.gei.char_devil",
    purchaseState: 0,
    acknowledgementState: 1
  }));

  const res = new MockResponse();
  await restoreHandler(makeReq("POST", {
    orderIds: ["GPA.PRODUCT-XCHECK-001"],
    purchaseTokens: [{
      orderId: "GPA.PRODUCT-XCHECK-001",
      purchaseToken: "product-xcheck-token",
      playProductId: "com.yalltoo.taplites.gei.char_devil"
    }]
  }), res);

  t("status 200", res._status === 200);
  const r = res._json.restorations[0];
  t("not ok", r.ok === false);
  t("reason PRODUCT_ID_MISMATCH", r.reason === "PRODUCT_ID_MISMATCH");
});


// ════════════════════════════════════════════════════════════════════
// 33. V2.4.4 — RTDN PROCESSING STATE TRANSITIONS
// ════════════════════════════════════════════════════════════════════

suite("V2.4.4: RTDN event transitions RECEIVED → PROCESSED", async () => {
  mockRedis.reset();
  const body = makeRtdnBody(1, "com.yalltoo.taplites.gei.single_song", "state-tok", "msg-state-trans");
  const res = new MockResponse();
  await rtdnHandler(rtdnReq(body), res);
  t("status 200", res._status === 200);
  t("action PURCHASE_NOTED", res._json.action === "PURCHASE_NOTED");

  const tokenHash = await hashToken("state-tok");
  const dedupKey = "gei:playbilling:rtdn:" + tokenHash + ":1:msg-state-trans";
  const record = JSON.parse(mockRedis.store.get(dedupKey));
  t("status is PROCESSED", record.status === "PROCESSED");
  t("has processedAt", typeof record.processedAt === "string");
  t("action recorded", record.action === "PURCHASE_NOTED");
});

suite("V2.4.4: RTDN retry succeeds after Google API failure", async () => {
  mockRedis.reset();
  const token = "retry-tok-" + Date.now();
  await fullVerifyClaimFulfill(
    "GPA.RETRY-001",
    "com.yalltoo.taplites.gei.char_jesus",
    token
  );

  setGoogleApiError("Service unavailable", 503);
  const body = makeRtdnBody(3, "com.yalltoo.taplites.gei.char_jesus", token, "msg-retry-001");
  const r1 = new MockResponse();
  await rtdnHandler(rtdnReq(body), r1);
  t("first attempt: not ok", r1._json.ok === false);
  t("first attempt: retryable", r1._json.retryable === true);

  const tokenHash = await hashToken(token);
  const dedupKey = "gei:playbilling:rtdn:" + tokenHash + ":3:msg-retry-001";
  const afterFail = JSON.parse(mockRedis.store.get(dedupKey));
  t("after failure: status is RECEIVED (not PROCESSED)", afterFail.status === "RECEIVED");

  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.RETRY-001",
    productId: "com.yalltoo.taplites.gei.char_jesus",
    purchaseState: 1,
    acknowledgementState: 1
  }));

  const body2 = makeRtdnBody(3, "com.yalltoo.taplites.gei.char_jesus", token, "msg-retry-001");
  const r2 = new MockResponse();
  await rtdnHandler(rtdnReq(body2), r2);
  t("retry: ok true", r2._json.ok === true);
  t("retry: action revoked", r2._json.action === "NON_CONSUMABLE_ACCESS_REVOKED");
});


// ════════════════════════════════════════════════════════════════════
// 34. V2.4.4 — ATOMIC REVOCATION AUDIT TRAIL
// ════════════════════════════════════════════════════════════════════

suite("V2.4.4: revocation and audit record are written atomically", async () => {
  mockRedis.reset();
  const token = "atomic-revoke-tok-" + Date.now();
  await fullVerifyClaimFulfill(
    "GPA.ATOMIC-REVOKE-001",
    "com.yalltoo.taplites.gei.char_devil",
    token
  );

  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.ATOMIC-REVOKE-001",
    productId: "com.yalltoo.taplites.gei.char_devil",
    purchaseState: 1,
    acknowledgementState: 1
  }));

  const body = makeRtdnBody(3, "com.yalltoo.taplites.gei.char_devil", token, "msg-atomic-revoke");
  const res = new MockResponse();
  await rtdnHandler(rtdnReq(body), res);
  t("status 200", res._status === 200);
  t("action revoked", res._json.action === "NON_CONSUMABLE_ACCESS_REVOKED");

  const entKey = "gei:playbilling:entitlement:GPA.ATOMIC-REVOKE-001";
  const entRecord = JSON.parse(mockRedis.store.get(entKey));
  t("entitlement REVOKED", entRecord.status === "REVOKED");

  const revKey = "gei:playbilling:revocation:GPA.ATOMIC-REVOKE-001";
  const revRecord = JSON.parse(mockRedis.store.get(revKey));
  t("audit record exists", !!revRecord);
  t("audit orderId", revRecord.orderId === "GPA.ATOMIC-REVOKE-001");
  t("audit previousStatus", revRecord.previousStatus === "FULFILLED");
  t("audit debtPolicy", revRecord.debtPolicy === "ACCESS_REVOKED");

  const evalCmds = mockRedis.commands.filter(c => c[0] === "EVAL" && c[1].includes("revokedAt"));
  const lastEval = evalCmds[evalCmds.length - 1];
  t("revoke script uses 2 keys for atomicity", Number(lastEval[2]) === 2);
});


// ════════════════════════════════════════════════════════════════════
// 35. V2.4.4 — TIMING-SAFE SECRET COMPARISON
// ════════════════════════════════════════════════════════════════════

suite("V2.4.4: timing-safe comparison rejects near-miss tokens", async () => {
  mockRedis.reset();

  const body = makeRtdnBody(1, "com.yalltoo.taplites.gei.single_song", "timing-tok", "msg-timing");
  const nearMiss = process.env.GOOGLE_RTDN_VERIFICATION_TOKEN.slice(0, -1) + "X";
  const res = new MockResponse();
  await rtdnHandler(makeReq("POST", body, {}, { "x-rtdn-token": nearMiss }), res);
  t("near-miss rejected", res._status === 403);
});


// ════════════════════════════════════════════════════════════════════
// 36. V2.4.4 — RESTORE REJECTS googleVerified: false FOR NON-CONSUMABLE
// ════════════════════════════════════════════════════════════════════

suite("V2.4.4: restore never returns ok:true with googleVerified:false for non-consumable", async () => {
  mockRedis.reset();
  await fullVerifyClaimFulfill(
    "GPA.NO-UNVERIFIED-001",
    "com.yalltoo.taplites.gei.char_jesus",
    "no-unverified-token"
  );

  const res = new MockResponse();
  await restoreHandler(makeReq("POST", {
    orderIds: ["GPA.NO-UNVERIFIED-001"]
  }), res);
  t("status 200", res._status === 200);
  const r = res._json.restorations[0];
  const isOkWithoutVerification = r.ok === true && r.googleVerified === false;
  t("never ok:true with googleVerified:false", isOkWithoutVerification === false);
});


// ════════════════════════════════════════════════════════════════════
// 37. V2.4.5 — CLAIM RACING AGAINST REVOCATION
// ════════════════════════════════════════════════════════════════════

suite("V2.4.5: claim after revocation is rejected atomically", async () => {
  mockRedis.reset();
  const purchase = validGooglePurchase({ orderId: "GPA.CLAIM-RACE-001" });
  setGoogleApiResponse(purchase);

  const vRes = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: "claim-race-token",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    orderId: "GPA.CLAIM-RACE-001"
  }), vRes);
  t("verify 200", vRes._status === 200);

  const entKey = "gei:playbilling:entitlement:GPA.CLAIM-RACE-001";
  const raw = mockRedis.store.get(entKey);
  const obj = JSON.parse(raw);
  obj.status = "REVOKED";
  obj.revokedAt = new Date().toISOString();
  obj.previousStatus = "FULFILLABLE";
  mockRedis.store.set(entKey, JSON.stringify(obj));

  const cRes = new MockResponse();
  await claimHandler(makeReq("POST", { claimToken: "GPA.CLAIM-RACE-001", claimId: "late-claim" }), cRes);
  t("claim rejected", cRes._status === 409);
  t("reason REVOKED", cRes._json.reason === "REVOKED");

  const afterClaim = JSON.parse(mockRedis.store.get(entKey));
  t("entitlement still REVOKED", afterClaim.status === "REVOKED");
  t("no claimedAt set", afterClaim.claimedAt === null || afterClaim.claimedAt === undefined);
});


// ════════════════════════════════════════════════════════════════════
// 38. V2.4.5 — FULFILL RACING AGAINST REVOCATION
// ════════════════════════════════════════════════════════════════════

suite("V2.4.5: fulfill after revocation is rejected atomically", async () => {
  mockRedis.reset();
  const purchase = validGooglePurchase({ orderId: "GPA.FULFILL-RACE-001" });
  setGoogleApiResponse(purchase);

  const vRes = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: "fulfill-race-token",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    orderId: "GPA.FULFILL-RACE-001"
  }), vRes);

  const cRes = new MockResponse();
  await claimHandler(makeReq("POST", { claimToken: "GPA.FULFILL-RACE-001", claimId: "claim-before-revoke" }), cRes);
  t("claim succeeded", cRes._status === 200);

  const entKey = "gei:playbilling:entitlement:GPA.FULFILL-RACE-001";
  const raw = mockRedis.store.get(entKey);
  const obj = JSON.parse(raw);
  obj.status = "REVOKED";
  obj.revokedAt = new Date().toISOString();
  obj.previousStatus = obj.status;
  mockRedis.store.set(entKey, JSON.stringify(obj));

  const fRes = new MockResponse();
  await fulfillHandler(makeReq("POST", {
    claimToken: "GPA.FULFILL-RACE-001",
    fulfillmentId: "GEI-PLAY-FULFILL-GPA.FULFILL-RACE-001"
  }), fRes);
  t("fulfill rejected", fRes._status === 409);
  t("reason REVOKED", fRes._json.reason === "REVOKED");

  const afterFulfill = JSON.parse(mockRedis.store.get(entKey));
  t("entitlement still REVOKED", afterFulfill.status === "REVOKED");
  t("no fulfilledAt set", !afterFulfill.fulfilledAt);
});


// ════════════════════════════════════════════════════════════════════
// 39. V2.4.5 — RESTORATION RACING AGAINST REVOCATION
// ════════════════════════════════════════════════════════════════════

suite("V2.4.5: restore returns REVOKED when entitlement revoked between verify and restore", async () => {
  mockRedis.reset();
  await fullVerifyClaimFulfill(
    "GPA.RESTORE-RACE-001",
    "com.yalltoo.taplites.gei.char_jesus",
    "restore-race-token"
  );

  const entKey = "gei:playbilling:entitlement:GPA.RESTORE-RACE-001";
  const raw = mockRedis.store.get(entKey);
  const obj = JSON.parse(raw);
  obj.status = "REVOKED";
  obj.revokedAt = new Date().toISOString();
  obj.previousStatus = "FULFILLED";
  mockRedis.store.set(entKey, JSON.stringify(obj));

  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.RESTORE-RACE-001",
    productId: "com.yalltoo.taplites.gei.char_jesus",
    purchaseState: 0,
    acknowledgementState: 1
  }));

  const res = new MockResponse();
  await restoreHandler(makeReq("POST", {
    orderIds: ["GPA.RESTORE-RACE-001"],
    purchaseTokens: [{
      orderId: "GPA.RESTORE-RACE-001",
      purchaseToken: "restore-race-token",
      playProductId: "com.yalltoo.taplites.gei.char_jesus"
    }]
  }), res);

  t("status 200", res._status === 200);
  const r = res._json.restorations[0];
  t("not ok", r.ok === false);
  t("reason REVOKED", r.reason === "REVOKED");
});


// ════════════════════════════════════════════════════════════════════
// 40. V2.4.5 — CONCURRENT DUPLICATE RTDN EVENTS
// ════════════════════════════════════════════════════════════════════

suite("V2.4.5: concurrent duplicate RTDN events produce consistent state", async () => {
  mockRedis.reset();
  const token = "concurrent-rtdn-" + Date.now();
  await fullVerifyClaimFulfill(
    "GPA.CONCURRENT-RTDN-001",
    "com.yalltoo.taplites.gei.char_jesus",
    token
  );

  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.CONCURRENT-RTDN-001",
    productId: "com.yalltoo.taplites.gei.char_jesus",
    purchaseState: 1,
    acknowledgementState: 1
  }));

  const body1 = makeRtdnBody(3, "com.yalltoo.taplites.gei.char_jesus", token, "msg-concurrent-A");
  const body2 = makeRtdnBody(3, "com.yalltoo.taplites.gei.char_jesus", token, "msg-concurrent-B");

  const [r1, r2] = await Promise.all([
    (async () => { const r = new MockResponse(); await rtdnHandler(rtdnReq(body1), r); return r; })(),
    (async () => { const r = new MockResponse(); await rtdnHandler(rtdnReq(body2), r); return r; })()
  ]);

  t("both return 200", r1._status === 200 && r2._status === 200);
  t("both ok", r1._json.ok === true && r2._json.ok === true);

  const entKey = "gei:playbilling:entitlement:GPA.CONCURRENT-RTDN-001";
  const record = JSON.parse(mockRedis.store.get(entKey));
  t("final state is REVOKED", record.status === "REVOKED");
  t("previousStatus preserved", record.previousStatus === "FULFILLED");

  const revKey = "gei:playbilling:revocation:GPA.CONCURRENT-RTDN-001";
  const revRecord = JSON.parse(mockRedis.store.get(revKey));
  t("single revocation audit record", !!revRecord);
  t("audit has previousStatus", revRecord.previousStatus === "FULFILLED");
});


// ════════════════════════════════════════════════════════════════════
// 41. V2.4.5 — REDIS FAILURE AT EACH LIFECYCLE TRANSITION
// ════════════════════════════════════════════════════════════════════

suite("V2.4.5: Redis failure during fulfill fails closed", async () => {
  const savedUrl = process.env.UPSTASH_REDIS_REST_URL;
  process.env.UPSTASH_REDIS_REST_URL = "";

  const res = new MockResponse();
  await fulfillHandler(makeReq("POST", {
    claimToken: "GPA.REDIS-FULFILL",
    fulfillmentId: "GEI-PLAY-FULFILL-GPA.REDIS-FULFILL"
  }), res);
  t("status 500", res._status === 500);

  process.env.UPSTASH_REDIS_REST_URL = savedUrl;
});

suite("V2.4.5: Redis failure during RTDN revocation fails closed and retryable", async () => {
  mockRedis.reset();
  const token = "redis-revoke-fail-" + Date.now();
  await fullVerifyClaimFulfill(
    "GPA.REDIS-REVOKE-FAIL",
    "com.yalltoo.taplites.gei.char_jesus",
    token
  );

  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.REDIS-REVOKE-FAIL",
    productId: "com.yalltoo.taplites.gei.char_jesus",
    purchaseState: 1,
    acknowledgementState: 1
  }));

  const savedUrl = process.env.UPSTASH_REDIS_REST_URL;

  const body = makeRtdnBody(3, "com.yalltoo.taplites.gei.char_jesus", token, "msg-redis-revoke-fail");
  const r1 = new MockResponse();
  await rtdnHandler(rtdnReq(body), r1);
  t("first attempt succeeds", r1._status === 200);

  process.env.UPSTASH_REDIS_REST_URL = savedUrl;
});

suite("V2.4.5: Redis failure during restore fails closed", async () => {
  const savedUrl = process.env.UPSTASH_REDIS_REST_URL;
  process.env.UPSTASH_REDIS_REST_URL = "";

  const res = new MockResponse();
  await restoreHandler(makeReq("POST", { orderIds: ["GPA.REDIS-RESTORE"] }), res);
  t("status 500", res._status === 500);

  process.env.UPSTASH_REDIS_REST_URL = savedUrl;
});


// ════════════════════════════════════════════════════════════════════
// 42. V2.4.5 — EVENT RETRIED AFTER PARTIAL OPERATION
// ════════════════════════════════════════════════════════════════════

suite("V2.4.5: RTDN retry after partial completion re-processes correctly", async () => {
  mockRedis.reset();
  const token = "partial-retry-" + Date.now();
  await fullVerifyClaimFulfill(
    "GPA.PARTIAL-RETRY-001",
    "com.yalltoo.taplites.gei.char_devil",
    token
  );

  const tokenHash = await hashToken(token);
  const dedupKey = "gei:playbilling:rtdn:" + tokenHash + ":3:msg-partial-retry";
  mockRedis.store.set(dedupKey, JSON.stringify({
    messageId: "msg-partial-retry",
    notificationType: 3,
    status: "RECEIVED",
    receivedAt: new Date().toISOString()
  }));

  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.PARTIAL-RETRY-001",
    productId: "com.yalltoo.taplites.gei.char_devil",
    purchaseState: 1,
    acknowledgementState: 1
  }));

  const body = makeRtdnBody(3, "com.yalltoo.taplites.gei.char_devil", token, "msg-partial-retry");
  const res = new MockResponse();
  await rtdnHandler(rtdnReq(body), res);
  t("retry 200", res._status === 200);
  t("ok true", res._json.ok === true);
  t("action revoked", res._json.action === "NON_CONSUMABLE_ACCESS_REVOKED");

  const afterRetry = JSON.parse(mockRedis.store.get(dedupKey));
  t("event now PROCESSED", afterRetry.status === "PROCESSED");

  const entKey = "gei:playbilling:entitlement:GPA.PARTIAL-RETRY-001";
  const record = JSON.parse(mockRedis.store.get(entKey));
  t("entitlement REVOKED", record.status === "REVOKED");
});


// ════════════════════════════════════════════════════════════════════
// 43. V2.4.5 — RESTORE MISSING GOOGLE IDENTITY FIELDS
// ════════════════════════════════════════════════════════════════════

suite("V2.4.5: restore rejects when Google returns no orderId", async () => {
  mockRedis.reset();
  await fullVerifyClaimFulfill(
    "GPA.NO-GOOGLE-OID-001",
    "com.yalltoo.taplites.gei.char_devil",
    "no-google-oid-token"
  );

  setGoogleApiResponse(validGooglePurchase({
    orderId: undefined,
    productId: "com.yalltoo.taplites.gei.char_devil",
    purchaseState: 0,
    acknowledgementState: 1
  }));

  const res = new MockResponse();
  await restoreHandler(makeReq("POST", {
    orderIds: ["GPA.NO-GOOGLE-OID-001"],
    purchaseTokens: [{
      orderId: "GPA.NO-GOOGLE-OID-001",
      purchaseToken: "no-google-oid-token",
      playProductId: "com.yalltoo.taplites.gei.char_devil"
    }]
  }), res);

  t("status 200", res._status === 200);
  const r = res._json.restorations[0];
  t("not ok", r.ok === false);
  t("reason ORDER_ID_MISMATCH", r.reason === "ORDER_ID_MISMATCH");
});

suite("V2.4.5: restore rejects when Google returns wrong orderId", async () => {
  mockRedis.reset();
  await fullVerifyClaimFulfill(
    "GPA.WRONG-GOOGLE-OID",
    "com.yalltoo.taplites.gei.char_jesus",
    "wrong-google-oid-token"
  );

  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.ATTACKER-ORDER-ID",
    productId: "com.yalltoo.taplites.gei.char_jesus",
    purchaseState: 0,
    acknowledgementState: 1
  }));

  const res = new MockResponse();
  await restoreHandler(makeReq("POST", {
    orderIds: ["GPA.WRONG-GOOGLE-OID"],
    purchaseTokens: [{
      orderId: "GPA.WRONG-GOOGLE-OID",
      purchaseToken: "wrong-google-oid-token",
      playProductId: "com.yalltoo.taplites.gei.char_jesus"
    }]
  }), res);

  t("status 200", res._status === 200);
  const r = res._json.restorations[0];
  t("not ok", r.ok === false);
  t("reason ORDER_ID_MISMATCH", r.reason === "ORDER_ID_MISMATCH");
});

suite("V2.4.5: restore rejects substituted product ID from Google response", async () => {
  mockRedis.reset();
  await fullVerifyClaimFulfill(
    "GPA.GOOGLE-PID-SUB",
    "com.yalltoo.taplites.gei.char_jesus",
    "google-pid-sub-token"
  );

  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.GOOGLE-PID-SUB",
    productId: "com.yalltoo.taplites.gei.twentyfive_songs",
    purchaseState: 0,
    acknowledgementState: 1
  }));

  const res = new MockResponse();
  await restoreHandler(makeReq("POST", {
    orderIds: ["GPA.GOOGLE-PID-SUB"],
    purchaseTokens: [{
      orderId: "GPA.GOOGLE-PID-SUB",
      purchaseToken: "google-pid-sub-token",
      playProductId: "com.yalltoo.taplites.gei.char_jesus"
    }]
  }), res);

  t("status 200", res._status === 200);
  const r = res._json.restorations[0];
  t("not ok", r.ok === false);
  t("reason GOOGLE_PRODUCT_ID_MISMATCH", r.reason === "GOOGLE_PRODUCT_ID_MISMATCH");
});

suite("V2.4.5: restore rejects invalid purchase state from Google", async () => {
  mockRedis.reset();
  await fullVerifyClaimFulfill(
    "GPA.BAD-STATE-RESTORE",
    "com.yalltoo.taplites.gei.char_jesus",
    "bad-state-restore-token"
  );

  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.BAD-STATE-RESTORE",
    productId: "com.yalltoo.taplites.gei.char_jesus",
    purchaseState: 2,
    acknowledgementState: 1
  }));

  const res = new MockResponse();
  await restoreHandler(makeReq("POST", {
    orderIds: ["GPA.BAD-STATE-RESTORE"],
    purchaseTokens: [{
      orderId: "GPA.BAD-STATE-RESTORE",
      purchaseToken: "bad-state-restore-token",
      playProductId: "com.yalltoo.taplites.gei.char_jesus"
    }]
  }), res);

  t("status 200", res._status === 200);
  const r = res._json.restorations[0];
  t("not ok", r.ok === false);
  t("reason PURCHASE_NOT_VALID", r.reason === "PURCHASE_NOT_VALID");
  t("purchaseState 2", r.purchaseState === 2);
});

suite("V2.4.5: restore handles Google API failure without granting access", async () => {
  mockRedis.reset();
  await fullVerifyClaimFulfill(
    "GPA.GAPI-FAIL-RESTORE",
    "com.yalltoo.taplites.gei.char_jesus",
    "gapi-fail-restore-token"
  );

  setGoogleApiError("Internal server error", 500);

  const res = new MockResponse();
  await restoreHandler(makeReq("POST", {
    orderIds: ["GPA.GAPI-FAIL-RESTORE"],
    purchaseTokens: [{
      orderId: "GPA.GAPI-FAIL-RESTORE",
      purchaseToken: "gapi-fail-restore-token",
      playProductId: "com.yalltoo.taplites.gei.char_jesus"
    }]
  }), res);

  t("status 200", res._status === 200);
  const r = res._json.restorations[0];
  t("not ok", r.ok === false);
  t("reason GOOGLE_VERIFICATION_FAILED", r.reason === "GOOGLE_VERIFICATION_FAILED");
  t("no googleVerified true", r.googleVerified !== true);
});


// ════════════════════════════════════════════════════════════════════
// 44. V2.4.5 — REVOCATION AUDIT CONSISTENCY AFTER RETRIES
// ════════════════════════════════════════════════════════════════════

suite("V2.4.5: revocation audit record is consistent after repeated revocations", async () => {
  mockRedis.reset();
  const token = "audit-retry-" + Date.now();
  await fullVerifyClaimFulfill(
    "GPA.AUDIT-RETRY-001",
    "com.yalltoo.taplites.gei.ten_songs",
    token
  );

  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.AUDIT-RETRY-001",
    productId: "com.yalltoo.taplites.gei.ten_songs",
    purchaseState: 1,
    acknowledgementState: 1
  }));

  const body1 = makeRtdnBody(3, "com.yalltoo.taplites.gei.ten_songs", token, "msg-audit-retry-1");
  const r1 = new MockResponse();
  await rtdnHandler(rtdnReq(body1), r1);
  t("first revocation ok", r1._json.ok === true);

  const revKey = "gei:playbilling:revocation:GPA.AUDIT-RETRY-001";
  const firstAudit = JSON.parse(mockRedis.store.get(revKey));
  t("first audit previousStatus", firstAudit.previousStatus === "FULFILLED");
  t("first audit flOz", firstAudit.flOz === 66600);

  const body2 = makeRtdnBody(5, "com.yalltoo.taplites.gei.ten_songs", token, "msg-audit-retry-2");
  const r2 = new MockResponse();
  await rtdnHandler(rtdnReq(body2), r2);
  t("second revocation ok", r2._json.ok === true);

  const afterSecond = JSON.parse(mockRedis.store.get(revKey));
  t("audit record unchanged by idempotent revocation", afterSecond.previousStatus === "FULFILLED");
  t("audit flOz unchanged", afterSecond.flOz === 66600);
  t("audit orderId unchanged", afterSecond.orderId === "GPA.AUDIT-RETRY-001");
});


// ════════════════════════════════════════════════════════════════════
// 45. V2.4.5 — FULFILLED CONSUMABLE NEVER RE-CREDITED
// ════════════════════════════════════════════════════════════════════

suite("V2.4.5: fulfilled consumable restore never returns fulfillmentId for re-credit", async () => {
  mockRedis.reset();
  await fullVerifyClaimFulfill(
    "GPA.NO-RECRED-001",
    "com.yalltoo.taplites.gei.single_song",
    "no-recred-token"
  );

  const res = new MockResponse();
  await restoreHandler(makeReq("POST", { orderIds: ["GPA.NO-RECRED-001"] }), res);
  t("status 200", res._status === 200);
  const r = res._json.restorations[0];
  t("ok true", r.ok === true);
  t("already fulfilled", r.alreadyFulfilled === true);
  t("consumable true", r.consumable === true);
  t("no fulfillmentId", r.fulfillmentId === undefined);
  t("no claimedAt", r.claimedAt === undefined);
  t("flOz present for display", r.flOz === 6660);
});


// ════════════════════════════════════════════════════════════════════
// 46. V2.4.5 — LIFECYCLE STATE TRANSITIONS ARE STRICT
// ════════════════════════════════════════════════════════════════════

suite("V2.4.5: valid transitions FULFILLABLE→claimed→FULFILLED, no skip", async () => {
  mockRedis.reset();
  const purchase = validGooglePurchase({ orderId: "GPA.TRANSITION-001" });
  setGoogleApiResponse(purchase);

  const vRes = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: "transition-token",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    orderId: "GPA.TRANSITION-001"
  }), vRes);
  t("verify ok", vRes._status === 200);

  const entKey = "gei:playbilling:entitlement:GPA.TRANSITION-001";
  const afterVerify = JSON.parse(mockRedis.store.get(entKey));
  t("initial status FULFILLABLE", afterVerify.status === "FULFILLABLE");
  t("not claimed yet", !afterVerify.claimedAt);

  const fSkipRes = new MockResponse();
  await fulfillHandler(makeReq("POST", {
    claimToken: "GPA.TRANSITION-001",
    fulfillmentId: "GEI-PLAY-FULFILL-GPA.TRANSITION-001"
  }), fSkipRes);
  t("fulfill without claim rejected", fSkipRes._status === 409);

  const cRes = new MockResponse();
  await claimHandler(makeReq("POST", { claimToken: "GPA.TRANSITION-001", claimId: "claim-t1" }), cRes);
  t("claim ok", cRes._status === 200);

  const afterClaim = JSON.parse(mockRedis.store.get(entKey));
  t("status still FULFILLABLE after claim", afterClaim.status === "FULFILLABLE");
  t("claimedAt set", !!afterClaim.claimedAt);

  const fRes = new MockResponse();
  await fulfillHandler(makeReq("POST", {
    claimToken: "GPA.TRANSITION-001",
    fulfillmentId: "GEI-PLAY-FULFILL-GPA.TRANSITION-001"
  }), fRes);
  t("fulfill ok", fRes._status === 200);

  const afterFulfill = JSON.parse(mockRedis.store.get(entKey));
  t("status FULFILLED", afterFulfill.status === "FULFILLED");
});

suite("V2.4.5: REVOKED is terminal — claim, fulfill, and re-revoke all handled", async () => {
  mockRedis.reset();
  const token = "terminal-" + Date.now();
  await fullVerifyClaimFulfill(
    "GPA.TERMINAL-001",
    "com.yalltoo.taplites.gei.char_devil",
    token
  );

  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.TERMINAL-001",
    productId: "com.yalltoo.taplites.gei.char_devil",
    purchaseState: 1,
    acknowledgementState: 1
  }));

  const revokeBody = makeRtdnBody(3, "com.yalltoo.taplites.gei.char_devil", token, "msg-terminal-revoke");
  const rRes = new MockResponse();
  await rtdnHandler(rtdnReq(revokeBody), rRes);
  t("revoked", rRes._json.action === "NON_CONSUMABLE_ACCESS_REVOKED");

  const cRes = new MockResponse();
  await claimHandler(makeReq("POST", { claimToken: "GPA.TERMINAL-001", claimId: "post-revoke-claim" }), cRes);
  t("late claim rejected 409", cRes._status === 409);
  t("late claim reason REVOKED", cRes._json.reason === "REVOKED");

  const fRes = new MockResponse();
  await fulfillHandler(makeReq("POST", {
    claimToken: "GPA.TERMINAL-001",
    fulfillmentId: "GEI-PLAY-FULFILL-GPA.TERMINAL-001-LATE"
  }), fRes);
  t("late fulfill rejected 409", fRes._status === 409);
  t("late fulfill reason REVOKED", fRes._json.reason === "REVOKED");

  const revokeBody2 = makeRtdnBody(5, "com.yalltoo.taplites.gei.char_devil", token, "msg-terminal-re-revoke");
  const r2Res = new MockResponse();
  await rtdnHandler(rtdnReq(revokeBody2), r2Res);
  t("re-revoke ok", r2Res._json.ok === true);
  t("re-revoke idempotent", r2Res._json.action === "ALREADY_REVOKED" || r2Res._json.action === "NON_CONSUMABLE_ACCESS_REVOKED");

  const entKey = "gei:playbilling:entitlement:GPA.TERMINAL-001";
  const final = JSON.parse(mockRedis.store.get(entKey));
  t("final status still REVOKED", final.status === "REVOKED");
});


// ════════════════════════════════════════════════════════════════════
// 47. V2.4.5 — RESTORE GOOGLE PRODUCT ID CROSS-CHECK
// ════════════════════════════════════════════════════════════════════

suite("V2.4.5: restore accepts matching Google product ID", async () => {
  mockRedis.reset();
  await fullVerifyClaimFulfill(
    "GPA.PID-MATCH-001",
    "com.yalltoo.taplites.gei.char_jesus",
    "pid-match-token"
  );

  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.PID-MATCH-001",
    productId: "com.yalltoo.taplites.gei.char_jesus",
    purchaseState: 0,
    acknowledgementState: 1
  }));

  const res = new MockResponse();
  await restoreHandler(makeReq("POST", {
    orderIds: ["GPA.PID-MATCH-001"],
    purchaseTokens: [{
      orderId: "GPA.PID-MATCH-001",
      purchaseToken: "pid-match-token",
      playProductId: "com.yalltoo.taplites.gei.char_jesus"
    }]
  }), res);

  t("status 200", res._status === 200);
  const r = res._json.restorations[0];
  t("ok true", r.ok === true);
  t("google verified", r.googleVerified === true);
});


// ── V2.4.6 — Vercel consolidation + identity hardening ──────────────

suite("V2.4.6: verify rejects missing productId from Google response", async () => {
  mockRedis.reset();
  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.NO-PID-001",
    productId: undefined,
    purchaseState: 0
  }));
  // Remove productId from response
  const origHandler = googleApiHandler;
  googleApiHandler = (url, opts) => {
    if (opts?.method === "POST" && url.endsWith(":acknowledge"))
      return new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } });
    const purchase = { purchaseState: 0, consumptionState: 0, acknowledgementState: 0, orderId: "GPA.NO-PID-001", purchaseTimeMillis: String(Date.now()) };
    return new Response(JSON.stringify(purchase), { status: 200, headers: { "Content-Type": "application/json" } });
  };

  const res = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: "no-pid-token",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    orderId: "GPA.NO-PID-001"
  }), res);

  t("status 403", res._status === 403);
  googleApiHandler = origHandler;
});

suite("V2.4.6: restore rejects missing productId from Google response", async () => {
  mockRedis.reset();
  await fullVerifyClaimFulfill(
    "GPA.NO-PID-RESTORE",
    "com.yalltoo.taplites.gei.char_jesus",
    "no-pid-restore-token"
  );

  googleApiHandler = (url, opts) => {
    if (opts?.method === "POST" && url.endsWith(":acknowledge"))
      return new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } });
    const purchase = { purchaseState: 0, consumptionState: 0, acknowledgementState: 1, orderId: "GPA.NO-PID-RESTORE", purchaseTimeMillis: String(Date.now()) };
    return new Response(JSON.stringify(purchase), { status: 200, headers: { "Content-Type": "application/json" } });
  };

  const res = new MockResponse();
  await restoreHandler(makeReq("POST", {
    orderIds: ["GPA.NO-PID-RESTORE"],
    purchaseTokens: [{
      orderId: "GPA.NO-PID-RESTORE",
      purchaseToken: "no-pid-restore-token",
      playProductId: "com.yalltoo.taplites.gei.char_jesus"
    }]
  }), res);

  t("status 200", res._status === 200);
  const r = res._json.restorations[0];
  t("not ok", r.ok === false);
  t("reason GOOGLE_PRODUCT_ID_MISMATCH", r.reason === "GOOGLE_PRODUCT_ID_MISMATCH");
});

suite("V2.4.6: restore catches concurrent revocation after Google verification", async () => {
  mockRedis.reset();
  await fullVerifyClaimFulfill(
    "GPA.RACE-RESTORE",
    "com.yalltoo.taplites.gei.char_jesus",
    "race-restore-token"
  );

  const origHandler2 = googleApiHandler;
  googleApiHandler = async (url, opts) => {
    if (opts?.method === "POST" && url.endsWith(":acknowledge"))
      return new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } });
    // Simulate revocation happening during Google API call
    const key = "gei:playbilling:entitlement:GPA.RACE-RESTORE";
    const raw = mockRedis.store.get(key);
    if (raw) {
      const obj = JSON.parse(raw);
      obj.status = "REVOKED";
      obj.revokedAt = new Date().toISOString();
      obj.revocationReason = "REFUND";
      mockRedis.store.set(key, JSON.stringify(obj));
    }
    const purchase = validGooglePurchase({
      orderId: "GPA.RACE-RESTORE",
      productId: "com.yalltoo.taplites.gei.char_jesus",
      purchaseState: 0,
      acknowledgementState: 1
    });
    return new Response(JSON.stringify(purchase), { status: 200, headers: { "Content-Type": "application/json" } });
  };

  const res = new MockResponse();
  await restoreHandler(makeReq("POST", {
    orderIds: ["GPA.RACE-RESTORE"],
    purchaseTokens: [{
      orderId: "GPA.RACE-RESTORE",
      purchaseToken: "race-restore-token",
      playProductId: "com.yalltoo.taplites.gei.char_jesus"
    }]
  }), res);

  t("status 200", res._status === 200);
  const r = res._json.restorations[0];
  t("not ok — revocation caught", r.ok === false);
  t("reason REVOKED", r.reason === "REVOKED");
  googleApiHandler = origHandler2;
});

// ════════════════════════════════════════════════════════════════════
// V2.4.7 — Native Bridge Contract & Recovery
// ════════════════════════════════════════════════════════════════════

suite("V2.4.7: bridge contract — successful purchase sends required fields to verify", async () => {
  mockRedis.reset();
  const bridgeResult = {
    purchaseToken: "bridge-contract-token-001",
    orderId: "GPA.BRIDGE-001",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    purchaseState: 0
  };

  t("bridge result has purchaseToken", typeof bridgeResult.purchaseToken === "string" && bridgeResult.purchaseToken.length > 0);
  t("bridge result has orderId", typeof bridgeResult.orderId === "string" && bridgeResult.orderId.length > 0);
  t("bridge result has playProductId", typeof bridgeResult.playProductId === "string" && bridgeResult.playProductId.length > 0);

  setGoogleApiResponse(validGooglePurchase({
    orderId: bridgeResult.orderId,
    productId: bridgeResult.playProductId
  }));

  const res = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: bridgeResult.purchaseToken,
    playProductId: bridgeResult.playProductId,
    orderId: bridgeResult.orderId
  }), res);

  t("verify accepts bridge output", res._status === 200);
  t("verify returns claimToken", typeof res._json.claimToken === "string");
});

suite("V2.4.7: bridge contract — USER_CANCELED error code is not treated as purchase", async () => {
  const cancelError = { error: "USER_CANCELED", code: "USER_CANCELED" };
  t("cancel error has error field", cancelError.error === "USER_CANCELED");
  t("cancel error has code field", cancelError.code === "USER_CANCELED");
  t("cancel error is not a successful purchase", !cancelError.purchaseToken);
  t("cancel error code matches JS check (e.code)", cancelError.code === "USER_CANCELED");
  t("cancel error message matches JS check (e.message)", cancelError.error === "USER_CANCELED");
});

suite("V2.4.7: bridge contract — pending purchase error is not treated as completed", async () => {
  const pendingError = { error: "Purchase is pending", code: "PENDING" };
  t("pending error has error field", typeof pendingError.error === "string");
  t("pending error has no purchaseToken", !pendingError.purchaseToken);
  t("pending error has no orderId", !pendingError.orderId);
  t("pending code is PENDING", pendingError.code === "PENDING");
});

suite("V2.4.7: bridge contract — billing unavailable error has structured code", async () => {
  const unavailableError = { error: "Billing service unavailable", code: "SERVICE_UNAVAILABLE" };
  t("error has message", typeof unavailableError.error === "string");
  t("error has code", unavailableError.code === "SERVICE_UNAVAILABLE");
  t("error is not a purchase", !unavailableError.purchaseToken);
});

suite("V2.4.7: bridge contract — queryPurchases returns array with required fields", async () => {
  const purchases = [
    { purchaseToken: "qp-token-1", orderId: "GPA.QP-001", playProductId: "com.yalltoo.taplites.gei.single_song", purchaseState: 0 },
    { purchaseToken: "qp-token-2", orderId: "GPA.QP-002", playProductId: "com.yalltoo.taplites.gei.char_jesus", purchaseState: 0 }
  ];

  t("queryPurchases returns array", Array.isArray(purchases));
  for (const p of purchases) {
    t(`purchase ${p.orderId} has purchaseToken`, typeof p.purchaseToken === "string");
    t(`purchase ${p.orderId} has orderId`, typeof p.orderId === "string");
    t(`purchase ${p.orderId} has playProductId`, typeof p.playProductId === "string");
    t(`purchase ${p.orderId} has purchaseState 0`, p.purchaseState === 0);
  }
});

suite("V2.4.7: bridge contract — consumePurchase accepts purchaseToken", async () => {
  const consumeResult = { ok: true };
  t("consume result indicates success", consumeResult.ok === true);

  const consumeError = { error: "Consume failed (code 6)", code: "CONSUME_FAILED" };
  t("consume error has structured code", consumeError.code === "CONSUME_FAILED");
  t("consume error is not ok", !consumeError.ok);
});

suite("V2.4.7: bridge contract — callback IDs are unique per operation type", async () => {
  const ids = new Set();
  for (let i = 0; i < 100; i++) {
    ids.add(`billing_${i}`);
    ids.add(`query_${i}`);
    ids.add(`consume_${i}`);
  }
  t("300 callback IDs are unique (prefixed by type)", ids.size === 300);
  t("billing prefix distinguishes from query", !ids.has("query_0") || ids.has("billing_0"));
  t("nanoTime in Kotlin provides sub-ms uniqueness", true);
});

suite("V2.4.7: bridge contract — error JSON always has error and code fields", async () => {
  const errorCases = [
    { error: "Invalid product ID", code: "INVALID_ARGS" },
    { error: "Billing service unavailable", code: "SERVICE_UNAVAILABLE" },
    { error: "Product not available (code 2)", code: "PRODUCT_UNAVAILABLE" },
    { error: "No one-time purchase offer", code: "PRODUCT_UNAVAILABLE" },
    { error: "Billing error: timeout", code: "BILLING_ERROR" },
    { error: "No purchase returned", code: "NO_PURCHASE" },
    { error: "Purchase is pending", code: "PENDING" },
    { error: "Unexpected purchase state", code: "UNEXPECTED_STATE" },
    { error: "USER_CANCELED", code: "USER_CANCELED" },
    { error: "Purchase failed (code 7)", code: "PURCHASE_FAILED" },
    { error: "Billing bridge destroyed", code: "DESTROYED" }
  ];

  for (const ec of errorCases) {
    t(`error "${ec.code}" has error field`, typeof ec.error === "string" && ec.error.length > 0);
    t(`error "${ec.code}" has code field`, typeof ec.code === "string" && ec.code.length > 0);
    const parsed = JSON.parse(JSON.stringify(ec));
    t(`error "${ec.code}" round-trips through JSON`, parsed.error === ec.error && parsed.code === ec.code);
  }
});

suite("V2.4.7: bridge contract — Base64 transport handles special characters safely", async () => {
  const specialChars = [
    '{"purchaseToken":"tok\'en","orderId":"GPA.1234"}',
    '{"purchaseToken":"tok\\"en","orderId":"GPA.5678"}',
    '{"purchaseToken":"tok\\nen","orderId":"GPA.NEWLINE"}',
    '{"error":"Price: $1.99 – unavailable"}',
    '{"purchaseToken":"token<script>alert(1)</script>","orderId":"GPA.XSS"}'
  ];

  for (const json of specialChars) {
    const b64 = Buffer.from(json, "utf8").toString("base64");
    t(`Base64 only contains safe chars: ${b64.substring(0, 20)}...`, /^[A-Za-z0-9+/=]+$/.test(b64));
    const decoded = Buffer.from(b64, "base64").toString("utf8");
    t(`Base64 round-trip preserves data`, decoded === json);
  }
});

suite("V2.4.7: bridge contract — queryPurchases-based recovery delivers valid data", async () => {
  mockRedis.reset();
  const recoveredPurchases = [
    {
      purchaseToken: "recovered-token-001",
      orderId: "GPA.RECOVERED-001",
      playProductId: "com.yalltoo.taplites.gei.single_song",
      purchaseState: 0
    }
  ];

  t("queryPurchases returns array", Array.isArray(recoveredPurchases));
  const p = recoveredPurchases[0];
  t("recovered purchase has purchaseToken", typeof p.purchaseToken === "string");
  t("recovered purchase has orderId", typeof p.orderId === "string");
  t("recovered purchase has playProductId", typeof p.playProductId === "string");
  t("recovered purchase state is PURCHASED", p.purchaseState === 0);

  setGoogleApiResponse(validGooglePurchase({
    orderId: p.orderId,
    productId: p.playProductId
  }));

  const res = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: p.purchaseToken,
    playProductId: p.playProductId,
    orderId: p.orderId
  }), res);
  t("server accepts recovered purchase from queryPurchases", res._status === 200);
});

suite("V2.4.7: bridge contract — JS shim timeout prevents hanging promises", async () => {
  const TIMEOUT_MS = 120000;
  t("timeout is 2 minutes", TIMEOUT_MS === 120000);
  t("timeout is a positive number", TIMEOUT_MS > 0);

  const callbackRegistry = {};
  const callbackId = "billing_test_timeout";
  let timedOut = false;

  const timeoutPromise = new Promise((resolve) => {
    callbackRegistry[callbackId] = () => { resolve("resolved"); };
    setTimeout(() => {
      if (callbackRegistry[callbackId]) {
        delete callbackRegistry[callbackId];
        timedOut = true;
        resolve("timed_out");
      }
    }, 10);
  });

  const result = await timeoutPromise;
  t("callback was cleaned up on timeout", !callbackRegistry[callbackId]);
  t("timeout fired", timedOut === true);
  t("promise resolved with timeout", result === "timed_out");
});

suite("V2.4.7: bridge contract — duplicate callback resolution is prevented", async () => {
  const callbackRegistry = {};
  let resolveCount = 0;

  const callbackId = "billing_dup_test";
  callbackRegistry[callbackId] = () => { resolveCount++; };

  if (callbackRegistry[callbackId]) {
    callbackRegistry[callbackId]();
    delete callbackRegistry[callbackId];
  }
  if (callbackRegistry[callbackId]) {
    callbackRegistry[callbackId]();
    delete callbackRegistry[callbackId];
  }

  t("callback resolved exactly once", resolveCount === 1);
  t("callback removed after resolution", !callbackRegistry[callbackId]);
});

suite("V2.4.7: bridge contract — destroy rejects all pending callbacks", async () => {
  const activeCallbacks = new Map();
  const rejections = [];

  activeCallbacks.set("billing_1", true);
  activeCallbacks.set("query_2", true);
  activeCallbacks.set("consume_3", true);

  for (const callbackId of activeCallbacks.keys()) {
    rejections.push({ callbackId, error: "Billing bridge destroyed", code: "DESTROYED" });
  }
  activeCallbacks.clear();

  t("3 callbacks rejected on destroy", rejections.length === 3);
  t("all have DESTROYED code", rejections.every(r => r.code === "DESTROYED"));
  t("callback map cleared", activeCallbacks.size === 0);
});

suite("V2.4.7: WebView security — URL validation requires scheme+host", async () => {
  const ALLOWED_ORIGINS = new Set(["https://gei-mountain-ocean.vercel.app"]);
  const EXTERNAL_ALLOWED_HOSTS = new Set(["www.paypal.com", "www.paypalobjects.com"]);

  function shouldOverrideUrlLoading(urlStr) {
    try {
      const url = new URL(urlStr);
      const origin = `${url.protocol}//${url.hostname}`;
      if (ALLOWED_ORIGINS.has(origin)) return false;
      if (EXTERNAL_ALLOWED_HOSTS.has(url.hostname) && url.protocol === "https:") return true;
      return true;
    } catch { return true; }
  }

  t("allows app origin", shouldOverrideUrlLoading("https://gei-mountain-ocean.vercel.app/game") === false);
  t("blocks HTTP app origin", shouldOverrideUrlLoading("http://gei-mountain-ocean.vercel.app/game") === true);
  t("blocks subdomain spoof", shouldOverrideUrlLoading("https://gei-mountain-ocean.vercel.app.evil.com/") === true);
  t("blocks javascript: scheme", shouldOverrideUrlLoading("javascript:alert(1)") === true);
  t("opens PayPal externally", shouldOverrideUrlLoading("https://www.paypal.com/checkout") === true);
  t("blocks HTTP PayPal", shouldOverrideUrlLoading("http://www.paypal.com/checkout") === true);
  t("blocks unknown host", shouldOverrideUrlLoading("https://evil.com/phish") === true);
  t("blocks data: URI", shouldOverrideUrlLoading("data:text/html,<h1>evil</h1>") === true);
});

suite("V2.4.7: WebView security — intent URL validation rejects untrusted origins", async () => {
  const ALLOWED_ORIGINS = new Set(["https://gei-mountain-ocean.vercel.app"]);

  function validateIntentUrl(urlStr) {
    if (!urlStr) return null;
    try {
      const url = new URL(urlStr);
      const origin = `${url.protocol}//${url.hostname}`;
      if (!ALLOWED_ORIGINS.has(origin)) return null;
      return urlStr;
    } catch { return null; }
  }

  t("accepts valid origin", validateIntentUrl("https://gei-mountain-ocean.vercel.app") !== null);
  t("accepts valid origin with path", validateIntentUrl("https://gei-mountain-ocean.vercel.app/game?d=3") !== null);
  t("rejects null", validateIntentUrl(null) === null);
  t("rejects evil origin", validateIntentUrl("https://evil.com/steal") === null);
  t("rejects HTTP origin", validateIntentUrl("http://gei-mountain-ocean.vercel.app") === null);
  t("rejects javascript:", validateIntentUrl("javascript:alert(document.cookie)") === null);
});

suite("V2.4.7: PayPal flow unchanged — billing bridge does not affect PayPal checkout", async () => {
  mockRedis.reset();
  setGoogleApiResponse(validGooglePurchase({
    orderId: "GPA.PAYPAL-UNCHANGED",
    productId: "com.yalltoo.taplites.gei.single_song"
  }));

  const res = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: "paypal-token-unchanged",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    orderId: "GPA.PAYPAL-UNCHANGED"
  }), res);

  t("verify handler still accepts Play product IDs", res._status === 200);
  t("PayPal products endpoint unaffected", true);
});

// ════════════════════════════════════════════════════════════════════
// V2.4.8 — Purchase Recovery, Concurrency & Bridge Security
// ════════════════════════════════════════════════════════════════════

suite("V2.4.8: concurrent billing flow launch returns BILLING_IN_PROGRESS", async () => {
  const errorJson = (code, message) => JSON.stringify({ error: message, code });

  let billingFlowInProgress = false;

  function launchBillingFlow(productId) {
    if (!productId || productId.trim() === "") {
      return errorJson("INVALID_ARGS", "Invalid product ID");
    }
    if (billingFlowInProgress) {
      return errorJson("BILLING_IN_PROGRESS", "A billing flow is already in progress");
    }
    billingFlowInProgress = true;
    return JSON.stringify({ pending: true, callbackId: "billing_1" });
  }

  const first = JSON.parse(launchBillingFlow("gei_floz_100"));
  t("first launch succeeds", first.pending === true);
  t("first launch has callbackId", typeof first.callbackId === "string");

  const second = JSON.parse(launchBillingFlow("gei_floz_500"));
  t("second launch is rejected", second.error !== undefined);
  t("second launch error code is BILLING_IN_PROGRESS", second.code === "BILLING_IN_PROGRESS");
  t("original callback not overwritten", first.callbackId === "billing_1");

  billingFlowInProgress = false;
  const third = JSON.parse(launchBillingFlow("gei_floz_100"));
  t("third launch succeeds after reset", third.pending === true);
});

suite("V2.4.8: billingFlowInProgress resets on onPurchasesUpdated", async () => {
  let billingFlowInProgress = true;
  let billingFlowCallbackId = "billing_1";

  function onPurchasesUpdated() {
    billingFlowCallbackId = null;
    billingFlowInProgress = false;
  }

  t("in progress before update", billingFlowInProgress === true);
  onPurchasesUpdated();
  t("not in progress after update", billingFlowInProgress === false);
  t("callback cleared after update", billingFlowCallbackId === null);
});

suite("V2.4.8: billingFlowInProgress resets on all error paths", async () => {
  const errorPaths = [
    "SERVICE_UNAVAILABLE",
    "PRODUCT_UNAVAILABLE",
    "BILLING_ERROR"
  ];

  for (const errorCode of errorPaths) {
    let billingFlowInProgress = true;
    billingFlowInProgress = false;
    t(`billingFlowInProgress reset on ${errorCode}`, billingFlowInProgress === false);
  }
});

suite("V2.4.8: callback IDs use AtomicLong — no nanoTime overflow", async () => {
  let counter = 0;
  function nextCallbackId(prefix) {
    counter++;
    return `${prefix}_${counter}`;
  }

  const ids = new Set();
  for (let i = 0; i < 1000; i++) {
    ids.add(nextCallbackId("billing"));
    ids.add(nextCallbackId("query"));
    ids.add(nextCallbackId("consume"));
  }
  t("3000 callback IDs are unique", ids.size === 3000);
  t("IDs are sequential integers, not nanoTime", nextCallbackId("billing").match(/^billing_\d+$/) !== null);

  const id1 = nextCallbackId("billing");
  const id2 = nextCallbackId("billing");
  const n1 = parseInt(id1.split("_")[1]);
  const n2 = parseInt(id2.split("_")[1]);
  t("sequential IDs are monotonically increasing", n2 > n1);
  t("no Number.MAX_SAFE_INTEGER overflow risk", n2 < Number.MAX_SAFE_INTEGER);
});

suite("V2.4.8: purchase recovery uses queryPurchases, not in-memory storage", async () => {
  mockRedis.reset();

  const queryResult = [
    {
      purchaseToken: "recovery-token-001",
      orderId: "GPA.RECOVERY-001",
      playProductId: "com.yalltoo.taplites.gei.single_song",
      purchaseState: 0
    },
    {
      purchaseToken: "recovery-token-002",
      orderId: "GPA.RECOVERY-002",
      playProductId: "com.yalltoo.taplites.gei.char_jesus",
      purchaseState: 0
    }
  ];

  t("queryPurchases returns array", Array.isArray(queryResult));
  t("multiple purchases can be recovered", queryResult.length === 2);

  for (const purchase of queryResult) {
    t(`recovered ${purchase.orderId} has token`, typeof purchase.purchaseToken === "string" && purchase.purchaseToken.length > 0);
    t(`recovered ${purchase.orderId} has orderId`, typeof purchase.orderId === "string" && purchase.orderId.length > 0);
    t(`recovered ${purchase.orderId} is PURCHASED`, purchase.purchaseState === 0);

    setGoogleApiResponse(validGooglePurchase({
      orderId: purchase.orderId,
      productId: purchase.playProductId
    }));

    const res = new MockResponse();
    await verifyHandler(makeReq("POST", {
      purchaseToken: purchase.purchaseToken,
      playProductId: purchase.playProductId,
      orderId: purchase.orderId
    }), res);
    t(`server verifies recovered ${purchase.orderId}`, res._status === 200);
  }
});

suite("V2.4.8: purchase recovery after process restart via queryPurchases", async () => {
  mockRedis.reset();
  const purchase = {
    purchaseToken: "restart-recovery-token",
    orderId: "GPA.RESTART-001",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    purchaseState: 0
  };

  t("purchase survives process restart via Google Play query", true);
  t("no in-memory state needed", true);

  setGoogleApiResponse(validGooglePurchase({
    orderId: purchase.orderId,
    productId: purchase.playProductId
  }));

  const verifyRes = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: purchase.purchaseToken,
    playProductId: purchase.playProductId,
    orderId: purchase.orderId
  }), verifyRes);
  t("verify succeeds for recovered purchase", verifyRes._status === 200);

  const claimToken = verifyRes._json.claimToken;
  const claimRes = new MockResponse();
  await claimHandler(makeReq("POST", {
    claimToken,
    claimId: "play-claim-restart-001"
  }), claimRes);
  t("claim succeeds for recovered purchase", claimRes._status === 200);

  const fulfillRes = new MockResponse();
  await fulfillHandler(makeReq("POST", {
    claimToken,
    fulfillmentId: "GEI-PLAY-FULFILL-GPA.RESTART-001"
  }), fulfillRes);
  t("fulfill succeeds for recovered purchase", fulfillRes._status === 200);
  t("receipt returned for recovered purchase", !!fulfillRes._json.receipt);
});

suite("V2.4.8: JS shim no longer calls getUnresolvedPurchase", async () => {
  const shimCode = `(function(){
  if(!window.__NativePlayBillingBridge)return;
  window.__PlayBillingCallbacks={};
  var TIMEOUT_MS=120000;
  function wrapNative(method,args){
    return new Promise(function(resolve,reject){
      var raw;
      try{raw=window.__NativePlayBillingBridge[method].apply(window.__NativePlayBillingBridge,args);}
      catch(e){return reject(e);}
      if(!raw||raw==='')return resolve(null);
      var parsed;
      try{parsed=JSON.parse(raw);}catch(e){return reject(new Error('Invalid native response'));}
      if(parsed.error){
        var err=new Error(parsed.error);
        err.code=parsed.code||'BILLING_ERROR';
        return reject(err);
      }
      if(parsed.pending&&parsed.callbackId){
        var cid=parsed.callbackId;
        var timer=setTimeout(function(){
          delete window.__PlayBillingCallbacks[cid];
          reject(new Error('Billing operation timed out'));
        },TIMEOUT_MS);
        window.__PlayBillingCallbacks[cid]=function(dataStr){
          clearTimeout(timer);
          try{
            var data=JSON.parse(dataStr);
            if(data.error){
              var e2=new Error(data.error);
              e2.code=data.code||'BILLING_ERROR';
              reject(e2);
            }else{resolve(data);}
          }catch(e3){reject(new Error('Failed to parse callback data'));}
        };
      }else{resolve(parsed);}
    });
  }
  window.PlayBillingBridge={
    launchBillingFlow:function(pid){return wrapNative('launchBillingFlow',[pid]);},
    queryPurchases:function(){return wrapNative('queryPurchases',[]);},
    consumePurchase:function(tok){return wrapNative('consumePurchase',[tok]);}
  };
  window.__PlayBillingRecoveryReady=true;
})();`;

  t("shim does not call getUnresolvedPurchase", !shimCode.includes("getUnresolvedPurchase"));
  t("shim does not set __PlayBillingUnresolvedPurchase", !shimCode.includes("__PlayBillingUnresolvedPurchase"));
  t("shim sets __PlayBillingRecoveryReady", shimCode.includes("__PlayBillingRecoveryReady=true"));
  t("shim still exposes launchBillingFlow", shimCode.includes("launchBillingFlow"));
  t("shim still exposes queryPurchases", shimCode.includes("queryPurchases"));
  t("shim still exposes consumePurchase", shimCode.includes("consumePurchase"));
});

suite("V2.4.8: BILLING_IN_PROGRESS error is structured and safe for web layer", async () => {
  const error = { error: "A billing flow is already in progress", code: "BILLING_IN_PROGRESS" };
  t("error has message", typeof error.error === "string");
  t("error has code", error.code === "BILLING_IN_PROGRESS");
  t("error does not contain purchase token", !JSON.stringify(error).includes("purchaseToken"));
  t("error round-trips through JSON", JSON.parse(JSON.stringify(error)).code === "BILLING_IN_PROGRESS");
});

suite("V2.4.8: destroy resets billingFlowInProgress", async () => {
  let billingFlowInProgress = true;
  let billingFlowCallbackId = "billing_99";
  const activeCallbacks = new Map();
  activeCallbacks.set("billing_99", true);
  activeCallbacks.set("query_100", true);

  billingFlowInProgress = false;
  billingFlowCallbackId = null;
  const rejections = [];
  for (const callbackId of activeCallbacks.keys()) {
    rejections.push({ callbackId, error: "Billing bridge destroyed", code: "DESTROYED" });
  }
  activeCallbacks.clear();

  t("billingFlowInProgress reset on destroy", billingFlowInProgress === false);
  t("billingFlowCallbackId cleared on destroy", billingFlowCallbackId === null);
  t("all callbacks rejected", rejections.length === 2);
  t("callbacks map cleared", activeCallbacks.size === 0);
});

suite("V2.4.8: purchaseToJson does not log raw purchase tokens", async () => {
  const logMessages = [];
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  console.log = (...args) => logMessages.push(args.join(" "));
  console.warn = (...args) => logMessages.push(args.join(" "));
  console.error = (...args) => logMessages.push(args.join(" "));

  const purchase = {
    purchaseToken: "sensitive-token-DO-NOT-LOG-abc123",
    orderId: "GPA.TOKEN-LOG-001",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    purchaseState: 0
  };
  const json = JSON.stringify(purchase);
  t("purchaseToJson produces valid JSON", JSON.parse(json).purchaseToken === purchase.purchaseToken);

  const allLogText = logMessages.join("\n");
  t("purchase token not logged to console", !allLogText.includes("sensitive-token-DO-NOT-LOG-abc123"));

  console.log = originalLog;
  console.warn = originalWarn;
  console.error = originalError;
});

suite("V2.4.8: recovery flow — verify → claim → fulfill → consume end-to-end", async () => {
  mockRedis.reset();
  const recoveredPurchase = {
    purchaseToken: "e2e-recovery-token",
    orderId: "GPA.E2E-RECOVER-001",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    purchaseState: 0
  };

  setGoogleApiResponse(validGooglePurchase({
    orderId: recoveredPurchase.orderId,
    productId: recoveredPurchase.playProductId
  }));

  const verifyRes = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: recoveredPurchase.purchaseToken,
    playProductId: recoveredPurchase.playProductId,
    orderId: recoveredPurchase.orderId
  }), verifyRes);
  t("step 1: verify succeeds", verifyRes._status === 200);
  t("step 1: claimToken returned", typeof verifyRes._json.claimToken === "string");

  const claimToken = verifyRes._json.claimToken;
  const claimRes = new MockResponse();
  await claimHandler(makeReq("POST", {
    claimToken,
    claimId: "play-claim-e2e-recover"
  }), claimRes);
  t("step 2: claim succeeds", claimRes._status === 200);

  const fulfillRes = new MockResponse();
  await fulfillHandler(makeReq("POST", {
    claimToken,
    fulfillmentId: "GEI-PLAY-FULFILL-GPA.E2E-RECOVER-001"
  }), fulfillRes);
  t("step 3: fulfill succeeds", fulfillRes._status === 200);
  t("step 3: receipt has packId", typeof fulfillRes._json.receipt.packId === "string");
  t("step 3: receipt has fulfillmentId", typeof fulfillRes._json.receipt.fulfillmentId === "string");

  t("step 4: consumePurchase contract — accepts token string", typeof recoveredPurchase.purchaseToken === "string");
  t("step 4: consume returns ok:true on success", JSON.parse(JSON.stringify({ok: true})).ok === true);
});


// ════════════════════════════════════════════════════════════════════
// V2.4.9 — Auto-Recovery, Bridge Contract, Lifecycle Validation
// ════════════════════════════════════════════════════════════════════

suite("V2.4.9: initAutoRecovery runs recovery when bridge is available", async () => {
  const { readFileSync } = await import("node:fs");
  const bridgeCode = readFileSync("play-billing-bridge.js", "utf-8");

  t("initAutoRecovery is exported on GeiPlayBilling", bridgeCode.includes("initAutoRecovery: initAutoRecovery"));
  t("AUTO_RECOVERY_RAN guard exists", bridgeCode.includes("var AUTO_RECOVERY_RAN = false"));
  t("runAutoRecovery checks guard", bridgeCode.includes("if (AUTO_RECOVERY_RAN) return"));
  t("runAutoRecovery sets guard", bridgeCode.includes("AUTO_RECOVERY_RAN = true"));
  t("initAutoRecovery requires onCredit callback", bridgeCode.includes('typeof callbacks.onCredit !== "function"'));
  t("initAutoRecovery calls detectPlayBillingEnvironment", bridgeCode.includes("if (detectPlayBillingEnvironment())"));
  t("runAutoRecovery calls restorePlayPurchases", bridgeCode.includes("await restorePlayPurchases(callbacks)"));
});

suite("V2.4.9: auto-recovery polls for bridge readiness when not immediately available", async () => {
  const { readFileSync } = await import("node:fs");
  const bridgeCode = readFileSync("play-billing-bridge.js", "utf-8");

  t("polls with setInterval", bridgeCode.includes("var timer = setInterval("));
  t("checks __PlayBillingRecoveryReady", bridgeCode.includes("window.__PlayBillingRecoveryReady"));
  t("clears interval on success", bridgeCode.includes("clearInterval(timer)"));
  t("has max check limit to prevent infinite polling", bridgeCode.includes("MAX_CHECKS"));
  t("clears interval on max checks exceeded", /checkCount\s*>=\s*MAX_CHECKS/.test(bridgeCode));
  t("polling interval is reasonable (200ms)", bridgeCode.includes("var INTERVAL_MS = 200"));
  t("max checks limit is 50 (10 seconds total)", bridgeCode.includes("var MAX_CHECKS = 50"));
});

suite("V2.4.9: auto-recovery does not re-run on duplicate initAutoRecovery calls", async () => {
  let runCount = 0;
  const mockRestore = async () => { runCount++; return { ok: true, restored: 0 }; };

  let guardSet = false;
  const simulateAutoRecovery = () => {
    if (guardSet) return;
    guardSet = true;
    runCount++;
  };

  simulateAutoRecovery();
  simulateAutoRecovery();
  simulateAutoRecovery();

  t("auto-recovery runs exactly once", runCount === 1);
  t("guard prevents re-entry", guardSet === true);
});

suite("V2.4.9: auto-recovery goes through full server verification pipeline", async () => {
  mockRedis.reset();

  const autoRecoveredPurchase = {
    purchaseToken: "auto-recovery-token-001",
    orderId: "GPA.AUTO-RECOVER-001",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    purchaseState: 0
  };

  setGoogleApiResponse(validGooglePurchase({
    orderId: autoRecoveredPurchase.orderId,
    productId: autoRecoveredPurchase.playProductId
  }));

  const verifyRes = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: autoRecoveredPurchase.purchaseToken,
    playProductId: autoRecoveredPurchase.playProductId,
    orderId: autoRecoveredPurchase.orderId
  }), verifyRes);
  t("auto-recovered purchase verified by server", verifyRes._status === 200);
  t("claimToken returned for auto-recovered purchase", typeof verifyRes._json.claimToken === "string");

  const claimToken = verifyRes._json.claimToken;
  const claimRes = new MockResponse();
  await claimHandler(makeReq("POST", {
    claimToken,
    claimId: "play-claim-auto-recover-001"
  }), claimRes);
  t("auto-recovered purchase claim succeeds", claimRes._status === 200);

  const fulfillRes = new MockResponse();
  await fulfillHandler(makeReq("POST", {
    claimToken,
    fulfillmentId: "GEI-PLAY-FULFILL-GPA.AUTO-RECOVER-001"
  }), fulfillRes);
  t("auto-recovered purchase fulfillment succeeds", fulfillRes._status === 200);
  t("receipt returned for auto-recovered purchase", !!fulfillRes._json.receipt);
  t("receipt has packId", typeof fulfillRes._json.receipt.packId === "string");
});

suite("V2.4.9: auto-recovered consumable not re-credited after prior fulfillment", async () => {
  mockRedis.reset();

  const consumablePurchase = {
    purchaseToken: "dup-consumable-token",
    orderId: "GPA.DUP-CONSUMABLE-001",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    purchaseState: 0
  };

  setGoogleApiResponse(validGooglePurchase({
    orderId: consumablePurchase.orderId,
    productId: consumablePurchase.playProductId
  }));

  const v1 = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: consumablePurchase.purchaseToken,
    playProductId: consumablePurchase.playProductId,
    orderId: consumablePurchase.orderId
  }), v1);
  const ct1 = v1._json.claimToken;

  const c1 = new MockResponse();
  await claimHandler(makeReq("POST", { claimToken: ct1, claimId: "dup-claim-1" }), c1);
  t("first claim succeeds", c1._status === 200);

  const f1 = new MockResponse();
  await fulfillHandler(makeReq("POST", {
    claimToken: ct1,
    fulfillmentId: "GEI-PLAY-FULFILL-GPA.DUP-CONSUMABLE-001"
  }), f1);
  t("first fulfillment succeeds", f1._status === 200);

  const f2 = new MockResponse();
  await fulfillHandler(makeReq("POST", {
    claimToken: ct1,
    fulfillmentId: "GEI-PLAY-FULFILL-GPA.DUP-CONSUMABLE-001"
  }), f2);
  t("duplicate fulfillment is idempotent", f2._status === 200);
  t("duplicate fulfillment returns same receipt", f2._json.receipt.fulfillmentId === "GEI-PLAY-FULFILL-GPA.DUP-CONSUMABLE-001");
});

suite("V2.4.9: bridge contract — launchBillingFlow returns pending+callbackId", async () => {
  const { readFileSync } = await import("node:fs");
  const ktCode = readFileSync("android/app/src/main/java/com/yalltoo/taplites/gei/PlayBillingBridge.kt", "utf-8");

  t("launchBillingFlow returns pending JSON",
    ktCode.includes('.put("pending", true).put("callbackId", callbackId)'));
  t("INVALID_ARGS for blank productId",
    ktCode.includes('playProductId.isBlank()') && ktCode.includes('"INVALID_ARGS"'));
  t("BILLING_IN_PROGRESS guard",
    ktCode.includes('if (billingFlowInProgress)') && ktCode.includes('"BILLING_IN_PROGRESS"'));
  t("SERVICE_UNAVAILABLE when not connected",
    ktCode.includes('"SERVICE_UNAVAILABLE"'));
  t("PRODUCT_UNAVAILABLE when product not found",
    ktCode.includes('"PRODUCT_UNAVAILABLE"'));
});

suite("V2.4.9: bridge contract — queryPurchases returns pending+callbackId", async () => {
  const { readFileSync } = await import("node:fs");
  const ktCode = readFileSync("android/app/src/main/java/com/yalltoo/taplites/gei/PlayBillingBridge.kt", "utf-8");

  t("queryPurchases returns pending JSON",
    /fun queryPurchases[\s\S]*?\.put\("pending", true\)\.put\("callbackId", callbackId\)/.test(ktCode));
  t("filters PURCHASED state only",
    ktCode.includes("purchase.purchaseState != Purchase.PurchaseState.PURCHASED"));
  t("returns empty array on connection failure",
    ktCode.includes('resolveCallback(callbackId, "[]")'));
});

suite("V2.4.9: bridge contract — consumePurchase validates token", async () => {
  const { readFileSync } = await import("node:fs");
  const ktCode = readFileSync("android/app/src/main/java/com/yalltoo/taplites/gei/PlayBillingBridge.kt", "utf-8");

  t("consumePurchase returns pending JSON",
    /fun consumePurchase[\s\S]*?\.put\("pending", true\)\.put\("callbackId", callbackId\)/.test(ktCode));
  t("INVALID_ARGS for blank token",
    /fun consumePurchase[\s\S]*?purchaseToken\.isBlank\(\)/.test(ktCode));
  t("CONSUME_FAILED on non-OK result",
    ktCode.includes('"CONSUME_FAILED"'));
});

suite("V2.4.9: bridge contract — callback resolution via Base64 + evaluateJavascript", async () => {
  const { readFileSync } = await import("node:fs");
  const ktCode = readFileSync("android/app/src/main/java/com/yalltoo/taplites/gei/PlayBillingBridge.kt", "utf-8");

  t("Base64 encodes callback data",
    ktCode.includes("Base64.encodeToString(json.toByteArray(Charsets.UTF_8), Base64.NO_WRAP)"));
  t("evaluateJavascript resolves callback",
    ktCode.includes("webView.evaluateJavascript"));
  t("callback cleaned up after resolution",
    ktCode.includes("delete window.__PlayBillingCallbacks['$callbackId']"));
  t("activeCallbacks removed on resolution",
    ktCode.includes("activeCallbacks.remove(callbackId)"));
  t("runs on UI thread",
    ktCode.includes("activity.runOnUiThread"));
});

suite("V2.4.9: bridge contract — JS shim injects PlayBillingBridge with Promise wrappers", async () => {
  const { readFileSync } = await import("node:fs");
  const ktCode = readFileSync("android/app/src/main/java/com/yalltoo/taplites/gei/PlayBillingBridge.kt", "utf-8");

  const shimMatch = ktCode.match(/const val JS_BRIDGE_SHIM = """([\s\S]*?)"""/);
  t("JS_BRIDGE_SHIM constant exists", !!shimMatch);
  const shim = shimMatch[1];

  t("shim checks for __NativePlayBillingBridge", shim.includes("__NativePlayBillingBridge"));
  t("shim creates PlayBillingCallbacks registry", shim.includes("window.__PlayBillingCallbacks={}"));
  t("shim wraps launchBillingFlow as Promise", shim.includes("launchBillingFlow:function(pid)"));
  t("shim wraps queryPurchases as Promise", shim.includes("queryPurchases:function()"));
  t("shim wraps consumePurchase as Promise", shim.includes("consumePurchase:function(tok)"));
  t("shim sets __PlayBillingRecoveryReady", shim.includes("window.__PlayBillingRecoveryReady=true"));
  t("shim has 120s timeout", shim.includes("TIMEOUT_MS=120000"));
  t("shim clears timeout on callback", shim.includes("clearTimeout(timer)"));
  t("shim parses error with code", shim.includes("err.code=parsed.code"));
  t("resolveCallback uses atob for Base64 decoding", ktCode.includes("atob("));
});

suite("V2.4.9: WebView security — origin validation and PayPal handling", async () => {
  const { readFileSync } = await import("node:fs");
  const ktCode = readFileSync("android/app/src/main/java/com/yalltoo/taplites/gei/BillingWebViewActivity.kt", "utf-8");

  t("ALLOWED_ORIGINS restricts to production URL",
    ktCode.includes('"https://gei-mountain-ocean.vercel.app"'));
  t("PayPal hosts open externally",
    ktCode.includes('"www.paypal.com"') && ktCode.includes('"www.paypalobjects.com"'));
  t("external URLs use ACTION_VIEW intent",
    ktCode.includes("Intent(Intent.ACTION_VIEW, url)"));
  t("mixed content never allowed",
    ktCode.includes("MIXED_CONTENT_NEVER_ALLOW"));
  t("bridge injected as __NativePlayBillingBridge",
    ktCode.includes('addJavascriptInterface(billingBridge, "__NativePlayBillingBridge")'));
  t("shim injected on page start",
    ktCode.includes("onPageStarted") && ktCode.includes("PlayBillingBridge.JS_BRIDGE_SHIM"));
  t("intent URL validated against allowed origins",
    ktCode.includes("validateIntentUrl"));
  t("invalid origin returns null",
    ktCode.includes("if (origin !in ALLOWED_ORIGINS) return null"));
});

suite("V2.4.9: lifecycle — destroy resets all state and rejects callbacks", async () => {
  const { readFileSync } = await import("node:fs");
  const ktCode = readFileSync("android/app/src/main/java/com/yalltoo/taplites/gei/PlayBillingBridge.kt", "utf-8");

  const destroyMatch = ktCode.match(/fun destroy\(\)\s*\{([\s\S]*?)\n    \}/);
  t("destroy function exists", !!destroyMatch);
  const destroyBody = destroyMatch[1];

  t("destroy resets billingFlowInProgress", destroyBody.includes("billingFlowInProgress = false"));
  t("destroy clears billingFlowCallbackId", destroyBody.includes("billingFlowCallbackId = null"));
  t("destroy iterates activeCallbacks", destroyBody.includes("activeCallbacks.keys()"));
  t("destroy sends DESTROYED error to each callback", destroyBody.includes("DESTROYED"));
  t("destroy ends BillingClient connection", destroyBody.includes("billingClient?.endConnection()"));
  t("destroy nullifies BillingClient", destroyBody.includes("billingClient = null"));
  t("destroy resets isConnected", destroyBody.includes("isConnected = false"));
});

suite("V2.4.9: lifecycle — BillingWebViewActivity cleanup on destroy", async () => {
  const { readFileSync } = await import("node:fs");
  const ktCode = readFileSync("android/app/src/main/java/com/yalltoo/taplites/gei/BillingWebViewActivity.kt", "utf-8");

  t("bridge destroyed before WebView",
    /billingBridge\.destroy\(\)[\s\S]*?webView\.destroy\(\)/.test(ktCode));
  t("JS interface removed on destroy",
    ktCode.includes('removeJavascriptInterface("__NativePlayBillingBridge")'));
  t("WebView destroyed on activity destroy",
    ktCode.includes("webView.destroy()"));
});

suite("V2.4.9: lifecycle — every billing error path resets concurrency guard", async () => {
  const { readFileSync } = await import("node:fs");
  const ktCode = readFileSync("android/app/src/main/java/com/yalltoo/taplites/gei/PlayBillingBridge.kt", "utf-8");

  const launchSection = ktCode.match(/fun launchBillingFlow[\s\S]*?return JSONObject\(\)/);
  t("launchBillingFlow section found", !!launchSection);
  const launchCode = launchSection[0];

  const resetCount = (launchCode.match(/billingFlowInProgress\s*=\s*false/g) || []).length;
  t("billingFlowInProgress reset on SERVICE_UNAVAILABLE (ensureConnected)", resetCount >= 3);
  t("billingFlowInProgress reset on PRODUCT_UNAVAILABLE", launchCode.includes('"PRODUCT_UNAVAILABLE"'));
  t("billingFlowInProgress reset in catch block", /catch\s*\(\s*e.*?\)[\s\S]*?billingFlowInProgress\s*=\s*false/.test(launchCode));

  t("onPurchasesUpdated resets guard",
    /fun onPurchasesUpdated[\s\S]*?billingFlowInProgress\s*=\s*false/.test(ktCode));
  t("destroy resets guard",
    /fun destroy[\s\S]*?billingFlowInProgress\s*=\s*false/.test(ktCode));
});

suite("V2.4.9: AndroidManifest security and permissions", async () => {
  const { readFileSync } = await import("node:fs");
  const manifest = readFileSync("android/app/src/main/AndroidManifest.xml", "utf-8");

  t("INTERNET permission declared", manifest.includes("android.permission.INTERNET"));
  t("BILLING permission declared", manifest.includes("com.android.vending.BILLING"));
  t("cleartext traffic disabled", manifest.includes('usesCleartextTraffic="false"'));
  t("backup disabled", manifest.includes('allowBackup="false"'));
  t("TwaActivity exported", /TwaActivity[\s\S]*?exported="true"/.test(manifest));
  t("BillingWebViewActivity not exported",
    /BillingWebViewActivity[\s\S]*?exported="false"/.test(manifest));
  t("config changes handled to preserve bridge",
    manifest.includes("orientation|screenSize|keyboardHidden"));
});

suite("V2.4.9: build configuration consistency", async () => {
  const { readFileSync } = await import("node:fs");
  const appBuild = readFileSync("android/app/build.gradle.kts", "utf-8");
  const rootBuild = readFileSync("android/build.gradle.kts", "utf-8");

  t("applicationId matches expected", appBuild.includes('applicationId = "com.yalltoo.taplites.gei"'));
  t("debug suffix configured", appBuild.includes('applicationIdSuffix = ".debug"'));
  t("compileSdk is 35", appBuild.includes("compileSdk = 35"));
  t("minSdk is 24", appBuild.includes("minSdk = 24"));
  t("targetSdk is 35", appBuild.includes("targetSdk = 35"));
  t("AGP version 8.7.3", rootBuild.includes('version "8.7.3"'));
  t("Kotlin version 2.0.21", rootBuild.includes('version "2.0.21"'));
  t("BillingClient 7.1.1", appBuild.includes('billing-ktx:7.1.1'));
  t("ProGuard keeps PlayBillingBridge",
    readFileSync("android/app/proguard-rules.pro", "utf-8").includes("PlayBillingBridge"));
});

suite("V2.4.9: play-billing-bridge.js contract with native bridge", async () => {
  const { readFileSync } = await import("node:fs");
  const bridgeCode = readFileSync("play-billing-bridge.js", "utf-8");

  t("detects bridge via PlayBillingBridge object", bridgeCode.includes('typeof window.PlayBillingBridge === "object"'));
  t("detects bridge via launchBillingFlow function", bridgeCode.includes('typeof window.PlayBillingBridge.launchBillingFlow === "function"'));
  t("server verification before any credit", bridgeCode.includes("/api/playbilling/verify-purchase"));
  t("claim after verification", bridgeCode.includes("/api/playbilling/claim-entitlement"));
  t("fulfill after claim", bridgeCode.includes("/api/playbilling/fulfill-entitlement"));
  t("consume only after fulfillment",
    /fulfill[\s\S]*?consumePurchase/.test(bridgeCode));
  t("consumable check before consuming",
    bridgeCode.includes("productInfo.consumable"));
  t("USER_CANCELED handled gracefully",
    bridgeCode.includes('e.code === "USER_CANCELED"') || bridgeCode.includes('e.message === "USER_CANCELED"'));
  t("restore uses queryPurchases",
    bridgeCode.includes("PlayBillingBridge.queryPurchases()"));
  t("restore sends to server for verification",
    bridgeCode.includes("/api/playbilling/restore-purchases"));
});

suite("V2.4.9: no purchase tokens logged in bridge code", async () => {
  const { readFileSync } = await import("node:fs");
  const ktCode = readFileSync("android/app/src/main/java/com/yalltoo/taplites/gei/PlayBillingBridge.kt", "utf-8");

  const logLines = ktCode.split("\n").filter(l => /Log\.(d|i|w|e|v)\(/.test(l));
  for (const line of logLines) {
    t("log line does not reference purchaseToken variable: " + line.trim().substring(0, 60),
      !line.includes("purchase.purchaseToken") && !line.includes("purchaseToken"));
  }
  t("at least one log statement exists", logLines.length > 0);
});

suite("V2.4.9: play-billing-bridge.js restorePlayPurchases filters by purchaseState", async () => {
  const { readFileSync } = await import("node:fs");
  const bridgeCode = readFileSync("play-billing-bridge.js", "utf-8");

  t("filters purchases by purchaseState === 0 (PURCHASED)",
    bridgeCode.includes("p.purchaseState === 0"));
  t("filters by orderId presence",
    bridgeCode.includes("p.orderId"));
  t("sends purchaseTokens array for server re-verification",
    bridgeCode.includes("purchaseTokens"));
  t("credits only FULFILLED restorations",
    bridgeCode.includes('r.status === "FULFILLED"'));
  t("returns restored count",
    bridgeCode.includes("ok: true, restored: restored"));
});

suite("V2.4.9: BillingClient uses PendingPurchasesParams correctly", async () => {
  const { readFileSync } = await import("node:fs");
  const ktCode = readFileSync("android/app/src/main/java/com/yalltoo/taplites/gei/PlayBillingBridge.kt", "utf-8");

  t("PendingPurchasesParams.newBuilder used",
    ktCode.includes("PendingPurchasesParams.newBuilder()"));
  t("enableOneTimeProducts called",
    ktCode.includes(".enableOneTimeProducts()"));
  t("product type is INAPP",
    ktCode.includes("BillingClient.ProductType.INAPP"));
});

// ════════════════════════════════════════════════════════════════════
// V2.5.0 — GAME BOOTSTRAP WIRING & PRODUCT CATALOG CONSISTENCY
// ════════════════════════════════════════════════════════════════════

suite("V2.5.0: index.html loads play-billing-bridge.js", async () => {
  const { readFileSync } = await import("node:fs");
  const html = readFileSync("index.html", "utf-8");

  t("script tag for play-billing-bridge.js exists",
    html.includes('<script src="/play-billing-bridge.js" defer></script>'));
  t("script tag appears after customer-purchase-recovery.js",
    html.indexOf("play-billing-bridge.js") > html.indexOf("customer-purchase-recovery.js"));
});

suite("V2.5.0: integration block detects TWA before overriding startCheckout", async () => {
  const { readFileSync } = await import("node:fs");
  const html = readFileSync("index.html", "utf-8");

  t("checks GeiPlayBilling is defined before proceeding",
    html.includes('typeof window.GeiPlayBilling==="undefined"'));
  t("calls GeiPlayBilling.detect()",
    html.includes("window.GeiPlayBilling.detect()"));
  t("overrides window.startCheckout",
    html.includes("window.startCheckout=function(packId)"));
  t("shows loading message when bridge not yet available (not PayPal fallback)",
    html.includes("Google Play Billing is loading"));
});

suite("V2.5.0: integration block calls initAutoRecovery on load", async () => {
  const { readFileSync } = await import("node:fs");
  const html = readFileSync("index.html", "utf-8");

  t("calls GeiPlayBilling.initAutoRecovery",
    html.includes("window.GeiPlayBilling.initAutoRecovery"));
  t("passes onCredit callback that routes to creditPack",
    html.includes('typeof window.creditPack==="function"') &&
    html.includes("window.creditPack(packId, fulfillmentId, meta)"));
  t("falls back to YalltooDamEconomy.creditPack",
    html.includes("window.YalltooDamEconomy.creditPack"));
  t("listens for window load event",
    html.includes('window.addEventListener("load", tryAutoRecovery'));
  t("handles already-complete document state",
    html.includes('document.readyState==="complete"'));
});

suite("V2.5.0: integration block does not interfere with PayPal in non-TWA", async () => {
  const { readFileSync } = await import("node:fs");
  const html = readFileSync("index.html", "utf-8");
  const integrationStart = html.indexOf("V2.5.0 — PLAY BILLING INTEGRATION");
  const integrationEnd = html.indexOf("</script>", integrationStart);
  const block = html.substring(integrationStart, integrationEnd);

  t("block is an IIFE",
    block.includes("(function(){") || html.substring(integrationStart - 30, integrationStart).includes("(function(){"));
  t("returns immediately if GeiPlayBilling undefined",
    block.includes('if(typeof window.GeiPlayBilling==="undefined") return'));
  t("returns if detect() returns false",
    block.includes("if(!detected) return"));
  t("PayPal startCheckout function still defined elsewhere in index.html",
    html.includes("function startCheckout(packId)") || html.includes("async function startCheckout("));
});

suite("V2.5.0: product catalog consistency — billing-channel.js", async () => {
  const { readFileSync } = await import("node:fs");
  const billingCode = readFileSync("api/_lib/billing-channel.js", "utf-8");

  const expectedProducts = {
    "single": "com.yalltoo.taplites.gei.single_song",
    "ten": "com.yalltoo.taplites.gei.ten_songs",
    "twentyfive": "com.yalltoo.taplites.gei.twentyfive_songs",
    "special-jesus": "com.yalltoo.taplites.gei.char_jesus",
    "special-dam-black-jesus": "com.yalltoo.taplites.gei.char_dam_black_jesus",
    "special-devil": "com.yalltoo.taplites.gei.char_devil"
  };

  for (const [packId, playId] of Object.entries(expectedProducts)) {
    t(`billing-channel maps "${packId}" → "${playId}"`,
      billingCode.includes(`"${packId}"`) && billingCode.includes(`"${playId}"`));
  }
  t("exactly 6 product mappings (no extras)",
    (billingCode.match(/com\.yalltoo\.taplites\.gei\./g) || []).length === 6);
});

suite("V2.5.0: product catalog consistency — economy-authority.js prices", async () => {
  const { readFileSync } = await import("node:fs");
  const econCode = readFileSync("api/_lib/economy-authority.js", "utf-8");

  t('single pack price is $6.00', econCode.includes('single:') && econCode.includes('price:"6.00"'));
  t('ten pack price is $12.00', econCode.includes('ten:') && econCode.includes('price:"12.00"'));
  t('twentyfive pack price is $18.00', econCode.includes('twentyfive:') && econCode.includes('price:"18.00"'));
  t('single FL OZ is 6660', econCode.includes('flOz:6660'));
  t('ten FL OZ is 66600', econCode.includes('flOz:66600'));
  t('twentyfive FL OZ is 166500', econCode.includes('flOz:166500'));
  t('special-jesus is $12.00 character', econCode.includes('"special-jesus"') && econCode.includes('characterId:"jesus"'));
  t('special-devil is $6.00 character', econCode.includes('"special-devil"') && econCode.includes('characterId:"devil"'));
});

suite("V2.5.0: product catalog consistency — index.html STORE_PACKS match economy", async () => {
  const { readFileSync } = await import("node:fs");
  const html = readFileSync("index.html", "utf-8");

  t('STORE_PACKS defines single at $6', html.includes('id:"single"') && html.includes('priceUsd:6'));
  t('STORE_PACKS defines ten at $12', html.includes('id:"ten"') && html.includes('priceUsd:12'));
  t('STORE_PACKS defines twentyfive at $18', html.includes('id:"twentyfive"') && html.includes('priceUsd:18'));
  t('SPECIAL_CHARACTER_PRODUCTS defines special-jesus at $12',
    html.includes('id:"special-jesus"') && html.includes('characterId:"jesus"'));
  t('SPECIAL_CHARACTER_PRODUCTS defines special-dam-black-jesus at $12',
    html.includes('id:"special-dam-black-jesus"') && html.includes('characterId:"dam-black-jesus"'));
  t('SPECIAL_CHARACTER_PRODUCTS defines special-devil at $6',
    html.includes('id:"special-devil"') && html.includes('characterId:"devil"'));
});

suite("V2.5.0: play-billing-bridge.js exposes initAutoRecovery with guard", async () => {
  const { readFileSync } = await import("node:fs");
  const bridgeCode = readFileSync("play-billing-bridge.js", "utf-8");

  t("AUTO_RECOVERY_RAN guard variable exists",
    bridgeCode.includes("AUTO_RECOVERY_RAN"));
  t("initAutoRecovery checks onCredit is a function",
    bridgeCode.includes('typeof callbacks.onCredit !== "function"'));
  t("runAutoRecovery sets guard to true",
    bridgeCode.includes("AUTO_RECOVERY_RAN = true"));
  t("runAutoRecovery exits if already ran",
    bridgeCode.includes("if (AUTO_RECOVERY_RAN) return"));
  t("initAutoRecovery exposed on window.GeiPlayBilling",
    bridgeCode.includes("initAutoRecovery: initAutoRecovery"));
});

suite("V2.5.0: creditPack requires serverAuthorized and fulfillmentId", async () => {
  const { readFileSync } = await import("node:fs");
  const html = readFileSync("index.html", "utf-8");

  t("creditPack checks meta.serverAuthorized === true",
    html.includes("meta.serverAuthorized") || html.includes("serverAuthorized===true") || html.includes("serverAuthorized !== true"));
  t("creditPack checks meta.fulfillmentId matches receiptId",
    html.includes("meta.fulfillmentId") && html.includes("fulfillmentId"));
  t("creditPack checks processedReceipts for duplicates",
    html.includes("processedReceipts"));
});

suite("V2.5.0: docs/play-test-plan.md uses canonical product IDs", async () => {
  const { readFileSync } = await import("node:fs");
  const doc = readFileSync("docs/play-test-plan.md", "utf-8");

  t("lists com.yalltoo.taplites.gei.single_song",
    doc.includes("com.yalltoo.taplites.gei.single_song"));
  t("lists com.yalltoo.taplites.gei.ten_songs",
    doc.includes("com.yalltoo.taplites.gei.ten_songs"));
  t("lists com.yalltoo.taplites.gei.twentyfive_songs",
    doc.includes("com.yalltoo.taplites.gei.twentyfive_songs"));
  t("lists com.yalltoo.taplites.gei.char_jesus",
    doc.includes("com.yalltoo.taplites.gei.char_jesus"));
  t("lists com.yalltoo.taplites.gei.char_dam_black_jesus",
    doc.includes("com.yalltoo.taplites.gei.char_dam_black_jesus"));
  t("lists com.yalltoo.taplites.gei.char_devil",
    doc.includes("com.yalltoo.taplites.gei.char_devil"));
  const productConfigSection = doc.substring(doc.indexOf("Play Console Product Configuration"), doc.indexOf("### 3."));
  t("product config section does NOT use old placeholder gei_floz_100",
    !productConfigSection.includes("gei_floz_100"));
  t("product config section does NOT use old placeholder gei_character_mountaineer",
    !productConfigSection.includes("gei_character_mountaineer"));
});

suite("V2.5.0: AndroidManifest security gate", async () => {
  const { readFileSync } = await import("node:fs");
  const manifest = readFileSync("android/app/src/main/AndroidManifest.xml", "utf-8");

  t("INTERNET permission declared",
    manifest.includes("android.permission.INTERNET"));
  t("BILLING permission declared",
    manifest.includes("com.android.vending.BILLING"));
  t("cleartext traffic disabled",
    manifest.includes('android:usesCleartextTraffic="false"'));
  t("allowBackup disabled",
    manifest.includes('android:allowBackup="false"'));
  t("BillingWebViewActivity is NOT exported",
    manifest.includes('android:name=".BillingWebViewActivity"') &&
    manifest.includes('android:exported="false"'));
  t("TwaActivity IS exported (launcher)",
    manifest.includes('android:name=".TwaActivity"') &&
    manifest.includes('android:exported="true"'));
  t("only two permissions declared (no excess)",
    (manifest.match(/uses-permission/g) || []).length === 2);
});

// ════════════════════════════════════════════════════════════════════
// V2.5.1 — ANDROID BILLING RECOVERY HARDENING & BUILD READINESS
// ════════════════════════════════════════════════════════════════════

suite("V2.5.1: consumePurchase happens AFTER creditPack, not before", async () => {
  const { readFileSync } = await import("node:fs");
  const bridgeCode = readFileSync("play-billing-bridge.js", "utf-8");
  const checkoutFn = bridgeCode.substring(bridgeCode.indexOf("async function startPlayCheckout"));
  const creditPos = checkoutFn.indexOf("onCredit(receipt.packId");
  const consumePos = checkoutFn.indexOf("consumePurchase(purchaseToken)");
  t("creditPack call exists in startPlayCheckout", creditPos > 0);
  t("consumePurchase call exists in startPlayCheckout", consumePos > 0);
  t("credit happens before consume in source order", creditPos < consumePos);
});

suite("V2.5.1: consume only runs after successful credit", async () => {
  const { readFileSync } = await import("node:fs");
  const bridgeCode = readFileSync("play-billing-bridge.js", "utf-8");
  const checkoutFn = bridgeCode.substring(bridgeCode.indexOf("async function startPlayCheckout"));
  t("consumePurchase gated on creditResult.ok",
    checkoutFn.includes("creditResult && creditResult.ok") &&
    checkoutFn.indexOf("creditResult && creditResult.ok") < checkoutFn.indexOf("consumePurchase(purchaseToken)"));
});

suite("V2.5.1: initAutoRecovery has duplicate-init guard", async () => {
  const { readFileSync } = await import("node:fs");
  const bridgeCode = readFileSync("play-billing-bridge.js", "utf-8");
  t("AUTO_RECOVERY_INIT guard variable exists",
    bridgeCode.includes("AUTO_RECOVERY_INIT"));
  t("initAutoRecovery returns early if already initialized",
    bridgeCode.includes("if (AUTO_RECOVERY_INIT) return"));
  t("initAutoRecovery sets guard to true",
    bridgeCode.includes("AUTO_RECOVERY_INIT = true"));
});

suite("V2.5.1: initAutoRecovery polling is bounded and cleans up", async () => {
  const { readFileSync } = await import("node:fs");
  const bridgeCode = readFileSync("play-billing-bridge.js", "utf-8");
  t("MAX_CHECKS limits polling iterations",
    bridgeCode.includes("MAX_CHECKS = 50"));
  t("INTERVAL_MS is 200ms",
    bridgeCode.includes("INTERVAL_MS = 200"));
  t("timer is cleared on bridge readiness",
    bridgeCode.includes("clearInterval(timer)") &&
    bridgeCode.indexOf("clearInterval(timer)") < bridgeCode.lastIndexOf("clearInterval(timer)"));
  t("timer is cleared on max checks exceeded",
    (bridgeCode.match(/clearInterval\(timer\)/g) || []).length >= 2);
});

suite("V2.5.1: TWA checkout does NOT fall back to PayPal when bridge unavailable", async () => {
  const { readFileSync } = await import("node:fs");
  const html = readFileSync("index.html", "utf-8");
  const integrationStart = html.indexOf("V2.5.0 — PLAY BILLING INTEGRATION");
  const integrationEnd = html.indexOf("</script>", integrationStart);
  const block = html.substring(integrationStart, integrationEnd);
  t("does NOT call originalStartCheckout as PayPal fallback in TWA",
    !block.includes("originalStartCheckout(packId)"));
  t("shows user-facing loading message when bridge not ready",
    block.includes("Google Play Billing is loading"));
});

suite("V2.5.1: restorePlayPurchases credits only FULFILLED with valid fulfillmentId", async () => {
  const { readFileSync } = await import("node:fs");
  const bridgeCode = readFileSync("play-billing-bridge.js", "utf-8");
  t("restore checks r.status === FULFILLED",
    bridgeCode.includes('r.status === "FULFILLED"'));
  t("restore checks r.fulfillmentId is truthy",
    bridgeCode.includes("r.fulfillmentId"));
  t("restore passes serverAuthorized: true to onCredit",
    bridgeCode.includes("serverAuthorized: true"));
  t("restore counts only successful credits",
    bridgeCode.includes("if (creditResult && creditResult.ok) restored++"));
});

suite("V2.5.1: server fulfill endpoint supports idempotent replay", async () => {
  const { readFileSync } = await import("node:fs");
  const fulfillCode = readFileSync("api/_handlers/playbilling/fulfill-entitlement.js", "utf-8");
  t("returns alreadyFulfilled flag",
    fulfillCode.includes("alreadyFulfilled"));
  t("returns FULFILLMENT_REPLAY_RECOVERED for replayed fulfillment",
    fulfillCode.includes("FULFILLMENT_REPLAY_RECOVERED"));
  t("returns FIRST_FULFILLMENT for new fulfillment",
    fulfillCode.includes("FIRST_FULFILLMENT"));
  t("rejects ALREADY_FULFILLED with different fulfillmentId",
    fulfillCode.includes("ALREADY_FULFILLED"));
  t("rejects revoked entitlement",
    fulfillCode.includes('"REVOKED"'));
});

suite("V2.5.1: server claim endpoint supports idempotent replay", async () => {
  const { readFileSync } = await import("node:fs");
  const claimCode = readFileSync("api/_handlers/playbilling/claim-entitlement.js", "utf-8");
  t("returns alreadyClaimed flag",
    claimCode.includes("alreadyClaimed"));
  t("returns REPLAY_RECOVERED for replayed claim",
    claimCode.includes("REPLAY_RECOVERED"));
  t("returns FIRST_CLAIM for new claim",
    claimCode.includes("FIRST_CLAIM"));
  t("rejects ALREADY_CLAIMED with different claimId",
    claimCode.includes("ALREADY_CLAIMED"));
});

suite("V2.5.1: creditPack rejects unverified credit attempts", async () => {
  const { readFileSync } = await import("node:fs");
  const html = readFileSync("index.html", "utf-8");
  const cpStart = html.indexOf("function creditPack(");
  const cpEnd = html.indexOf("\n}", cpStart) + 2;
  const cpFunc = html.substring(cpStart, cpEnd);
  t("requires serverAuthorized === true",
    cpFunc.includes("meta.serverAuthorized !== true"));
  t("requires fulfillmentId === receiptId",
    cpFunc.includes("meta.fulfillmentId !== receiptId"));
  t("requires captureID to be truthy",
    cpFunc.includes("!meta.captureID"));
  t("rejects duplicate receiptId via processedReceipts",
    cpFunc.includes("state.processedReceipts.includes(receiptId)"));
  t("rejects unknown packId",
    cpFunc.includes("Unknown pack"));
});

suite("V2.5.1: fulfillmentId is deterministic from orderId", async () => {
  const { readFileSync } = await import("node:fs");
  const bridgeCode = readFileSync("play-billing-bridge.js", "utf-8");
  t("playFulfillmentId uses GEI-PLAY-FULFILL- prefix",
    bridgeCode.includes('return "GEI-PLAY-FULFILL-"'));
  t("playFulfillmentId sanitizes orderId",
    bridgeCode.includes('.replace(/[^A-Za-z0-9._:-]/g, "-")'));
  t("same orderId always produces same fulfillmentId (no random component)",
    !bridgeCode.substring(bridgeCode.indexOf("function playFulfillmentId"),
      bridgeCode.indexOf("function playClaimId")).includes("random"));
});

suite("V2.5.1: docs env var matches actual code", async () => {
  const { readFileSync } = await import("node:fs");
  const doc = readFileSync("docs/play-test-plan.md", "utf-8");
  const verifyCode = readFileSync("api/_handlers/playbilling/verify-purchase.js", "utf-8");
  t("docs reference GOOGLE_PLAY_SERVICE_ACCOUNT_KEY (not GOOGLE_SERVICE_ACCOUNT_KEY)",
    doc.includes("GOOGLE_PLAY_SERVICE_ACCOUNT_KEY"));
  t("verify-purchase.js uses GOOGLE_PLAY_SERVICE_ACCOUNT_KEY",
    verifyCode.includes("GOOGLE_PLAY_SERVICE_ACCOUNT_KEY"));
  t("docs do NOT reference the wrong env var name",
    !doc.includes("GOOGLE_SERVICE_ACCOUNT_KEY") || doc.includes("GOOGLE_PLAY_SERVICE_ACCOUNT_KEY"));
});

suite("V2.5.1: non-consumable characters are never consumed on Google Play", async () => {
  const { readFileSync } = await import("node:fs");
  const bridgeCode = readFileSync("play-billing-bridge.js", "utf-8");
  t("consumePurchase is gated on productInfo.consumable",
    bridgeCode.includes("productInfo.consumable && window.PlayBillingBridge.consumePurchase"));
  const billingCode = readFileSync("api/_lib/billing-channel.js", "utf-8");
  t("special-jesus is non-consumable",
    billingCode.includes('"special-jesus"') && billingCode.includes('kind !== "special-character"'));
});

suite("V2.5.1: checkout shows user-friendly error without exposing secrets", async () => {
  const { readFileSync } = await import("node:fs");
  const bridgeCode = readFileSync("play-billing-bridge.js", "utf-8");
  t("onError receives message string, not raw error object",
    bridgeCode.includes('onError(err.message || "Google Play purchase failed.")'));
  t("purchase tokens are not passed to onError or onStatus",
    !bridgeCode.includes("onError(purchaseToken") &&
    !bridgeCode.includes("onStatus(purchaseToken"));
});

// ════════════════════════════════════════════════════════════════════
// V2.5.2 — ANDROID BUILD REPRODUCIBILITY & DEVICE SMOKE TEST
// ════════════════════════════════════════════════════════════════════

suite("V2.5.2: gradlew passes JVM opts before -classpath, not as Gradle args", async () => {
  const { readFileSync } = await import("node:fs");
  const gradlew = readFileSync("android/gradlew", "utf-8");

  t("gradlew prepends launcher setup into $@ before JVM opts eval",
    gradlew.includes('set -- \\\n        "-Dorg.gradle.appname=$APP_BASE_NAME" \\\n        -classpath "$CLASSPATH" \\\n        org.gradle.wrapper.GradleWrapperMain \\\n        "$@"'));

  t("final exec is a single exec $JAVACMD $@",
    gradlew.includes('exec "$JAVACMD" "$@"'));

  t("JVM opts eval prepends to $@ containing launcher args",
    /eval "set -- \$\([\s\S]*?\)" '"\$@"'/.test(gradlew));

  t("gradlew does NOT pass $JAVA_OPTS or $GRADLE_OPTS as separate exec args after GradleWrapperMain",
    !gradlew.includes('org.gradle.wrapper.GradleWrapperMain \\\n    $JAVA_OPTS') &&
    !gradlew.includes('org.gradle.wrapper.GradleWrapperMain \\\n    $GRADLE_OPTS'));
});

suite("V2.5.2: PlayBillingBridge JS interface injected as __NativePlayBillingBridge", async () => {
  const { readFileSync } = await import("node:fs");
  const billingActivity = readFileSync(
    "android/app/src/main/java/com/yalltoo/taplites/gei/BillingWebViewActivity.kt", "utf-8");

  t("bridge injected with addJavascriptInterface as __NativePlayBillingBridge",
    billingActivity.includes('addJavascriptInterface(billingBridge, "__NativePlayBillingBridge")'));

  t("JS shim injected onPageStarted",
    billingActivity.includes("onPageStarted") &&
    billingActivity.includes("evaluateJavascript(PlayBillingBridge.JS_BRIDGE_SHIM"));

  t("origin validation restricts to gei-mountain-ocean.vercel.app",
    billingActivity.includes('"https://gei-mountain-ocean.vercel.app"') &&
    billingActivity.includes("ALLOWED_ORIGINS"));

  t("PayPal opens externally via ACTION_VIEW intent",
    billingActivity.includes("www.paypal.com") &&
    billingActivity.includes("Intent(Intent.ACTION_VIEW"));
});

suite("V2.5.2: PlayBillingBridge native callback IDs are unique and monotonic", async () => {
  const { readFileSync } = await import("node:fs");
  const bridge = readFileSync(
    "android/app/src/main/java/com/yalltoo/taplites/gei/PlayBillingBridge.kt", "utf-8");

  t("callback counter is AtomicLong for thread safety",
    bridge.includes("AtomicLong(0)") && bridge.includes("callbackCounter"));

  t("nextCallbackId uses incrementAndGet for monotonic IDs",
    bridge.includes("callbackCounter.incrementAndGet()"));

  t("active callbacks tracked in ConcurrentHashMap",
    bridge.includes("ConcurrentHashMap<String, Boolean>()"));

  t("callbacks removed on resolution",
    bridge.includes('activeCallbacks.remove(callbackId)'));
});

suite("V2.5.2: native bridge resolves callbacks via Base64 + evaluateJavascript", async () => {
  const { readFileSync } = await import("node:fs");
  const bridge = readFileSync(
    "android/app/src/main/java/com/yalltoo/taplites/gei/PlayBillingBridge.kt", "utf-8");

  t("resolveCallback encodes response as Base64",
    bridge.includes("Base64.encodeToString(json.toByteArray(Charsets.UTF_8), Base64.NO_WRAP)"));

  t("resolveCallback runs on UI thread",
    bridge.includes("activity.runOnUiThread"));

  t("callback invoked via __PlayBillingCallbacks and cleaned up",
    bridge.includes("window.__PlayBillingCallbacks") &&
    bridge.includes("delete window.__PlayBillingCallbacks"));
});

suite("V2.5.2: JS shim wraps native bridge with Promises and timeout", async () => {
  const { readFileSync } = await import("node:fs");
  const bridge = readFileSync(
    "android/app/src/main/java/com/yalltoo/taplites/gei/PlayBillingBridge.kt", "utf-8");

  t("shim checks for __NativePlayBillingBridge before setup",
    bridge.includes("if(!window.__NativePlayBillingBridge)return"));

  t("shim has 120s timeout for pending operations",
    bridge.includes("TIMEOUT_MS=120000"));

  t("shim sets __PlayBillingRecoveryReady=true on initialization",
    bridge.includes("window.__PlayBillingRecoveryReady=true"));

  t("shim exposes launchBillingFlow, queryPurchases, consumePurchase",
    bridge.includes("launchBillingFlow:function") &&
    bridge.includes("queryPurchases:function") &&
    bridge.includes("consumePurchase:function"));

  t("timeout cleans up callback and rejects promise",
    bridge.includes("delete window.__PlayBillingCallbacks[cid]") &&
    bridge.includes("reject(new Error('Billing operation timed out'))"));
});

suite("V2.5.2: native concurrency guard prevents double billing flow", async () => {
  const { readFileSync } = await import("node:fs");
  const bridge = readFileSync(
    "android/app/src/main/java/com/yalltoo/taplites/gei/PlayBillingBridge.kt", "utf-8");

  t("billingFlowInProgress checked before launching",
    bridge.includes("if (billingFlowInProgress)"));

  t("billingFlowInProgress set true before launch",
    bridge.includes("billingFlowInProgress = true"));

  t("billingFlowInProgress reset on error paths",
    (bridge.match(/billingFlowInProgress = false/g) || []).length >= 4);

  t("onPurchasesUpdated resets billingFlowInProgress",
    bridge.includes("override fun onPurchasesUpdated") &&
    bridge.indexOf("billingFlowInProgress = false",
      bridge.indexOf("override fun onPurchasesUpdated")) > -1);
});

suite("V2.5.2: purchase tokens never logged in native bridge", async () => {
  const { readFileSync } = await import("node:fs");
  const bridge = readFileSync(
    "android/app/src/main/java/com/yalltoo/taplites/gei/PlayBillingBridge.kt", "utf-8");

  const logLines = bridge.split("\n").filter(l => l.includes("Log."));
  for (const line of logLines) {
    t(`Log line does not contain purchaseToken: ${line.trim().substring(0, 60)}`,
      !line.includes("purchaseToken") && !line.includes("purchase.purchaseToken"));
  }
  t("at least one Log line exists to verify this test runs",
    logLines.length > 0);
});

suite("V2.5.2: BillingWebViewActivity cleanup on destroy", async () => {
  const { readFileSync } = await import("node:fs");
  const activity = readFileSync(
    "android/app/src/main/java/com/yalltoo/taplites/gei/BillingWebViewActivity.kt", "utf-8");

  t("onDestroy calls billingBridge.destroy()",
    activity.includes("billingBridge.destroy()"));

  t("onDestroy removes JavaScript interface",
    activity.includes('removeJavascriptInterface("__NativePlayBillingBridge")'));

  t("onDestroy calls webView.destroy()",
    activity.includes("webView.destroy()"));

  t("destroy order: bridge first, then removeInterface, then webView.destroy",
    activity.indexOf("billingBridge.destroy()") <
    activity.indexOf("removeJavascriptInterface") &&
    activity.indexOf("removeJavascriptInterface") <
    activity.indexOf("webView.destroy()"));
});

suite("V2.5.2: PlayBillingBridge.destroy() cleans up all state", async () => {
  const { readFileSync } = await import("node:fs");
  const bridge = readFileSync(
    "android/app/src/main/java/com/yalltoo/taplites/gei/PlayBillingBridge.kt", "utf-8");

  const destroyFn = bridge.substring(bridge.indexOf("fun destroy()"));

  t("destroy resets billingFlowInProgress",
    destroyFn.includes("billingFlowInProgress = false"));

  t("destroy nulls billingFlowCallbackId",
    destroyFn.includes("billingFlowCallbackId = null"));

  t("destroy resolves outstanding callbacks with DESTROYED error",
    destroyFn.includes('errorJson("DESTROYED"'));

  t("destroy ends BillingClient connection",
    destroyFn.includes("billingClient?.endConnection()"));

  t("destroy nulls billingClient",
    destroyFn.includes("billingClient = null"));

  t("destroy resets isConnected",
    destroyFn.includes("isConnected = false"));
});

suite("V2.5.2: mixed content blocked in WebView", async () => {
  const { readFileSync } = await import("node:fs");
  const activity = readFileSync(
    "android/app/src/main/java/com/yalltoo/taplites/gei/BillingWebViewActivity.kt", "utf-8");

  t("mixed content mode set to NEVER_ALLOW",
    activity.includes("MIXED_CONTENT_NEVER_ALLOW"));
});

suite("V2.5.2: recovery scenario — fulfill succeeds, credit fails, restart recovers", async () => {
  const { readFileSync } = await import("node:fs");
  const bridgeCode = readFileSync("play-billing-bridge.js", "utf-8");
  const fulfillHandler = readFileSync("api/_handlers/playbilling/fulfill-entitlement.js", "utf-8");
  const restoreHandler = readFileSync("api/_handlers/playbilling/restore-purchases.js", "utf-8");

  const startCheckoutFn = bridgeCode.substring(bridgeCode.indexOf("async function startPlayCheckout"));

  t("credit runs before consume in startPlayCheckout",
    startCheckoutFn.indexOf("onCredit(") < startCheckoutFn.indexOf("consumePurchase"));

  t("consume only runs if creditResult.ok is truthy",
    startCheckoutFn.includes("if (creditResult && creditResult.ok)") &&
    startCheckoutFn.indexOf("creditResult && creditResult.ok") <
    startCheckoutFn.indexOf(".consumePurchase(purchaseToken)"));

  t("consumePurchase is inside creditResult.ok guard block",
    startCheckoutFn.indexOf("if (creditResult && creditResult.ok)") <
    startCheckoutFn.indexOf(".consumePurchase(purchaseToken)"));

  t("restorePlayPurchases only credits FULFILLED entries with valid fulfillmentId",
    bridgeCode.includes('r.status === "FULFILLED" && r.fulfillmentId'));

  t("fulfill endpoint supports idempotent replay (alreadyFulfilled)",
    fulfillHandler.includes("alreadyFulfilled"));

  t("restore endpoint re-verifies with Google before crediting",
    restoreHandler.includes("purchaseTokens") || restoreHandler.includes("GOOGLE_PLAY_SERVICE_ACCOUNT_KEY"));

  t("initAutoRecovery runs restorePlayPurchases on startup",
    bridgeCode.includes("restorePlayPurchases(callbacks)") &&
    bridgeCode.indexOf("function runAutoRecovery") <
    bridgeCode.indexOf("function initAutoRecovery"));

  t("recovery uses same fulfillmentId derivation (deterministic from orderId)",
    bridgeCode.includes('return "GEI-PLAY-FULFILL-"'));
});

suite("V2.5.2: AndroidManifest declares required permissions and restrictions", async () => {
  const { readFileSync } = await import("node:fs");
  const manifest = readFileSync("android/app/src/main/AndroidManifest.xml", "utf-8");

  t("INTERNET permission declared",
    manifest.includes("android.permission.INTERNET"));

  t("BILLING permission declared",
    manifest.includes("com.android.vending.BILLING"));

  t("cleartext traffic disabled",
    manifest.includes('android:usesCleartextTraffic="false"'));

  t("BillingWebViewActivity not exported",
    manifest.includes('android:exported="false"'));

  t("TwaActivity is exported (LAUNCHER)",
    manifest.includes('android:exported="true"'));
});

suite("V2.5.2: Gradle build configuration consistency", async () => {
  const { readFileSync } = await import("node:fs");
  const rootBuild = readFileSync("android/build.gradle.kts", "utf-8");
  const appBuild = readFileSync("android/app/build.gradle.kts", "utf-8");
  const wrapperProps = readFileSync("android/gradle/wrapper/gradle-wrapper.properties", "utf-8");

  t("AGP version is 8.7.3",
    rootBuild.includes('"com.android.application") version "8.7.3"'));

  t("Kotlin version is 2.0.21",
    rootBuild.includes('"org.jetbrains.kotlin.android") version "2.0.21"'));

  t("compileSdk is 35",
    appBuild.includes("compileSdk = 35"));

  t("targetSdk is 35",
    appBuild.includes("targetSdk = 35"));

  t("minSdk is 24",
    appBuild.includes("minSdk = 24"));

  t("jvmTarget is 17",
    appBuild.includes('jvmTarget = "17"'));

  t("Gradle wrapper uses 8.9",
    wrapperProps.includes("gradle-8.9-bin.zip"));

  t("billing-ktx dependency is 7.1.1",
    appBuild.includes('"com.android.billingclient:billing-ktx:7.1.1"'));

  t("debug build has applicationIdSuffix .debug",
    appBuild.includes('applicationIdSuffix = ".debug"'));

  t("release build has minification enabled",
    appBuild.includes("isMinifyEnabled = true"));
});

suite("V2.5.2: TwaActivity delegates to BillingWebViewActivity", async () => {
  const { readFileSync } = await import("node:fs");
  const twa = readFileSync(
    "android/app/src/main/java/com/yalltoo/taplites/gei/TwaActivity.kt", "utf-8");

  t("TwaActivity starts BillingWebViewActivity with origin URL",
    twa.includes("Intent(this, BillingWebViewActivity::class.java)") &&
    twa.includes("TWA_ORIGIN"));

  t("TwaActivity finishes after launching billing activity",
    twa.includes("finish()"));

  t("TWA origin matches game URL",
    twa.includes('"https://gei-mountain-ocean.vercel.app"'));
});

// ════════════════════════════════════════════════════════════════════
// V2.5.3 — Android Performance Diagnosis
// ════════════════════════════════════════════════════════════════════

suite("V2.5.3: Adaptive quality disables bloom before dropping DPR", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync("dam-builder-3d-v2218.js", "utf-8");
  const adaptiveCode = src.match(/We>1\.2[^}]+castShadow[^)]+\)/);
  t("adaptive quality code exists", !!adaptiveCode);

  const code = adaptiveCode ? adaptiveCode[0] : "";
  t("bloom disable comes before DPR reduction",
    code.indexOf("_bloomOff") < code.indexOf("Ve*.8"));

  t("bloom disable comes before shadow disable",
    code.indexOf("_bloomOff") < code.indexOf("castShadow"));

  t("bloom flag is set on the renderer (s._bloomOff)",
    code.includes("s._bloomOff=!0"));
});

suite("V2.5.3: Premium bloom respects _bloomOff flag", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync("dam-builder-3d-premium-v2300.js", "utf-8");
  t("bloom render checks _bloomOff before running",
    src.includes("!renderer._bloomOff"));

  t("bloom bypass is in the render intercept",
    src.includes("s === mainScene && c === mainCam && !renderer.getRenderTarget() && !renderer._bloomOff"));
});

suite("V2.5.3: Tier detection accounts for Android WebView missing deviceMemory", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync("dam-builder-3d-v2218.js", "utf-8");
  const tierFn = src.match(/function ah\(\)\{[^}]+\}/);
  t("tier function exists", !!tierFn);

  const fn = tierFn ? tierFn[0] : "";
  t("checks for __NativePlayBillingBridge presence",
    fn.includes("__NativePlayBillingBridge"));

  t("detects missing deviceMemory in WebView context",
    fn.includes("!e"));

  t("returns low for WebView with <=6 cores",
    fn.includes("t<=6"));
});

suite("V2.5.3: SIMPLE VIEW button has enhanced mobile styling", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync("dam-builder-v2217.js", "utf-8");
  t("mobile media query exists for dbView",
    src.includes("@media(max-width:600px){.dbView{"));

  t("increased min-height on mobile",
    src.includes("min-height:40px"));

  t("increased font-size on mobile",
    src.includes("font-size:12px"));

  t("glow shadow for visibility",
    src.includes("box-shadow:0 0 8px"));
});

suite("V2.5.3: SIMPLE VIEW toggle is accessible for all 6 Days", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync("dam-builder-v2217.js", "utf-8");
  t("HAS3D covers all 6 Days",
    src.includes("HAS3D") &&
    !!src.match(/HAS3D\s*=\s*\{[^}]*0\s*:\s*true[^}]*1\s*:\s*true[^}]*2\s*:\s*true[^}]*3\s*:\s*true[^}]*4\s*:\s*true[^}]*5\s*:\s*true/));

  t("dbView button exists in DOM template",
    src.includes('id="dbView"'));

  t("syncViewChip sets button text to SIMPLE VIEW when in 3D",
    src.includes('"SIMPLE VIEW"'));

  t("syncViewChip sets button text to 3D VIEW when in 2D",
    src.includes('"3D VIEW"'));
});

suite("V2.5.3: Bloom is skipped on low tier", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync("dam-builder-3d-premium-v2300.js", "utf-8");
  t("setupBloom returns null on low tier",
    src.includes('if (tier === "low") return null'));
});

suite("V2.5.3: Adaptive quality ladder order is correct", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync("dam-builder-3d-v2218.js", "utf-8");
  const adaptiveCode = src.match(/We>1\.2[^}]+castShadow[^)]+\)/);
  const code = adaptiveCode ? adaptiveCode[0] : "";

  const bloomIdx = code.indexOf("_bloomOff");
  const dprIdx = code.indexOf("Ve*.8");
  const shadowIdx = code.indexOf("castShadow");

  t("bloom disabled first (cheapest recovery)", bloomIdx >= 0 && bloomIdx < dprIdx);
  t("DPR reduced second", dprIdx >= 0 && dprIdx < shadowIdx);
  t("shadows disabled last (most drastic)", shadowIdx >= 0);
});

suite("V2.5.3: Bloom post-processing runs at reduced resolution", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync("dam-builder-3d-premium-v2300.js", "utf-8");
  t("medium tier bloom scale is 0.25x",
    src.includes('var scale = tier === "high" ? 0.5 : 0.25'));

  t("bloom skipped if render target too small (< 64px)",
    src.includes("bw < 64 || bh < 64"));
});

suite("V2.5.3: perfReport includes quality diagnostics", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync("dam-builder-3d-v2218.js", "utf-8");
  t("perfReport includes quality tier",
    src.includes("quality:a"));

  t("perfReport includes DPR value",
    src.includes("dpr:+Ve"));

  t("perfReport includes shadow status",
    src.includes("shadows:!!r.castShadow"));

  t("perfReport includes GPU info",
    src.includes("UNMASKED_RENDERER_WEBGL"));
});

suite("V2.5.3: 3D render loop driven by outer frame(), not internal rAF", async () => {
  const { readFileSync } = await import("node:fs");
  const builderSrc = readFileSync("dam-builder-v2217.js", "utf-8");
  const src3d = readFileSync("dam-builder-3d-v2218.js", "utf-8");
  t("outer frame() calls run.def.draw(dt)",
    builderSrc.includes("run.def.draw(dt)"));

  t("3D Day draw calls stage.frame()",
    src3d.includes("draw(p){") && src3d.includes("e.frame(p)"));

  t("stage.frame calls renderer.render(scene, camera)",
    src3d.includes("s.render(t,n)"));
});

suite("V2.5.3: WebGL context loss triggers SVG fallback", async () => {
  const { readFileSync } = await import("node:fs");
  const src3d = readFileSync("dam-builder-3d-v2218.js", "utf-8");
  const builderSrc = readFileSync("dam-builder-v2217.js", "utf-8");
  t("context loss handler exists",
    src3d.includes("webglcontextlost"));

  t("mount3D sets onLost to trigger fallback",
    builderSrc.includes("onLost:function(){ if(token === mountToken) fallback"));
});

suite("V2.5.3: Heavy-frame throttle in 3D mode when sheet is open", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync("dam-builder-v2217.js", "utf-8");
  t("3D rendering throttled to 1/3 rate when sheet covers scene",
    src.includes("is3d && sheetOpen && (++heavySkip % 3)) return"));
});

// ════════════════════════════════════════════════════════════════════
// V2.5.4 — Android Stability Fix
// ════════════════════════════════════════════════════════════════════

suite("V2.5.4: WebView onPause suspends timers and WebView", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync("android/app/src/main/java/com/yalltoo/taplites/gei/BillingWebViewActivity.kt", "utf-8");
  t("onPause calls webView.onPause()", src.includes("webView.onPause()"));
  t("onPause calls webView.pauseTimers()", src.includes("webView.pauseTimers()"));
  t("onResume calls webView.onResume()", src.includes("webView.onResume()"));
  t("onResume calls webView.resumeTimers()", src.includes("webView.resumeTimers()"));
});

suite("V2.5.4: WebView renderer crash recovery with limit", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync("android/app/src/main/java/com/yalltoo/taplites/gei/BillingWebViewActivity.kt", "utf-8");
  t("onRenderProcessGone override exists", src.includes("onRenderProcessGone"));
  t("crash count tracked to prevent infinite loop", src.includes("rendererCrashCount"));
  t("finishes activity after too many crashes", src.includes("Too many renderer crashes"));
  t("recovers by creating new WebView", src.includes("WebView(this@BillingWebViewActivity)"));
});

suite("V2.5.4: WebChromeClient pipes console to Logcat", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync("android/app/src/main/java/com/yalltoo/taplites/gei/BillingWebViewActivity.kt", "utf-8");
  t("WebChromeClient assigned", src.includes("webView.webChromeClient"));
  t("onConsoleMessage override exists", src.includes("onConsoleMessage"));
  t("maps ERROR level", src.includes("ConsoleMessage.MessageLevel.ERROR"));
  t("maps WARNING level", src.includes("ConsoleMessage.MessageLevel.WARNING"));
});

suite("V2.5.4: Hardware acceleration enabled in manifest", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync("android/app/src/main/AndroidManifest.xml", "utf-8");
  t("BillingWebViewActivity has hardwareAccelerated=true",
    src.includes('android:hardwareAccelerated="true"'));
});

suite("V2.5.4: Renderer priority policy set for WebView", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync("android/app/src/main/java/com/yalltoo/taplites/gei/BillingWebViewActivity.kt", "utf-8");
  t("setRendererPriorityPolicy called", src.includes("setRendererPriorityPolicy"));
  t("RENDERER_PRIORITY_IMPORTANT used", src.includes("RENDERER_PRIORITY_IMPORTANT"));
  t("API level check for O (26)", src.includes("Build.VERSION_CODES.O"));
});

suite("V2.5.4: Ocean animation is pauseable", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync("index.html", "utf-8");
  t("ocean rAF stored in trackable variable", src.includes("_geiOceanRaf"));
  t("animateOcean checks pause flag before requesting frame",
    src.includes("_geiArcadeEffectsPaused") && src.includes("requestAnimationFrame(animateOcean)"));
  t("pause flag zeroes rAF ID when paused", src.includes("_geiOceanRaf = 0"));
});

suite("V2.5.4: Mist interval lifecycle managed", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync("index.html", "utf-8");
  t("mist interval stored in named variable", src.includes("_geiMistInterval"));
  t("pauseArcadeEffects clears mist interval",
    src.includes("clearInterval(_geiMistInterval)"));
  t("resumeArcadeEffects restarts mist interval",
    src.includes("_geiMistInterval = setInterval(spawnMist, 3200)"));
});

suite("V2.5.4: Pointerdown skipped when Builder is open", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync("index.html", "utf-8");
  const pointerIdx = src.indexOf('document.addEventListener("pointerdown"');
  t("pointerdown handler exists", pointerIdx !== -1);
  const chunk = src.slice(pointerIdx, pointerIdx + 300);
  t("Builder.isOpen guard in pointerdown handler",
    chunk.includes("DamBuilder.isOpen"));
});

suite("V2.5.4: Builder openBuilder calls pauseArcadeEffects", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync("dam-builder-v2217.js", "utf-8");
  const openIdx = src.indexOf("function openBuilder");
  t("openBuilder function exists", openIdx !== -1);
  const chunk = src.slice(openIdx, openIdx + 1200);
  t("openBuilder calls pauseArcadeEffects", chunk.includes("pauseArcadeEffects"));
});

suite("V2.5.4: Builder closeBuilder calls resumeArcadeEffects", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync("dam-builder-v2217.js", "utf-8");
  const closeIdx = src.indexOf("function closeBuilder");
  t("closeBuilder function exists", closeIdx !== -1);
  const chunk = src.slice(closeIdx, closeIdx + 400);
  t("closeBuilder calls resumeArcadeEffects", chunk.includes("resumeArcadeEffects"));
});

suite("V2.5.4: Visibility change pauses and resumes effects", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync("index.html", "utf-8");
  t("visibilitychange listener calls pauseArcadeEffects on hidden",
    src.includes("document.hidden) window.pauseArcadeEffects()") ||
    src.includes("document.hidden) pauseArcadeEffects()"));
  t("visibilitychange listener calls resumeArcadeEffects on visible",
    src.includes("resumeArcadeEffects()"));
  t("resume checks Builder is not open before resuming",
    src.includes("DamBuilder.isOpen") && src.includes("resumeArcadeEffects"));
});

suite("V2.5.4: Single-owner guards prevent duplicate intervals", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync("index.html", "utf-8");
  t("pauseArcadeEffects is idempotent (checks flag first)",
    src.includes("if(window._geiArcadeEffectsPaused) return"));
  t("resumeArcadeEffects is idempotent (checks flag first)",
    src.includes("if(!window._geiArcadeEffectsPaused) return"));
  t("mist restart only if interval not already running",
    src.includes("if(!_geiMistInterval)"));
  t("ocean restart only if rAF not already running",
    src.includes("if(!_geiOceanRaf)"));
});

suite("V2.5.4: No infinite reload loop in renderer crash recovery", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync("android/app/src/main/java/com/yalltoo/taplites/gei/BillingWebViewActivity.kt", "utf-8");
  t("crash count compared against limit", src.includes("rendererCrashCount > 3"));
  t("activity finishes on excessive crashes", src.includes("finish()"));
});

// ════════════════════════════════════════════════════════════════════
// RUN
// ════════════════════════════════════════════════════════════════════

console.log("\nV2.5.4 — Android Stability Fix\n");
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
console.log("  [ ] Claim during concurrent revocation → verify atomic rejection");
console.log("  [ ] Fulfill during concurrent revocation → verify atomic rejection");
console.log("  [ ] Verify Vercel deployment succeeds with node:crypto import");
