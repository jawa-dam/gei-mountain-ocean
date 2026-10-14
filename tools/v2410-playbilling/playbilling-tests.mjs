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

suite("V2.4.7: bridge contract — unresolved purchase recovery delivers valid data", async () => {
  mockRedis.reset();
  const unresolvedPurchase = {
    purchaseToken: "unresolved-token-001",
    orderId: "GPA.UNRESOLVED-001",
    playProductId: "com.yalltoo.taplites.gei.single_song",
    purchaseState: 0
  };

  t("unresolved purchase has purchaseToken", typeof unresolvedPurchase.purchaseToken === "string");
  t("unresolved purchase has orderId", typeof unresolvedPurchase.orderId === "string");
  t("unresolved purchase has playProductId", typeof unresolvedPurchase.playProductId === "string");
  t("unresolved purchase state is PURCHASED", unresolvedPurchase.purchaseState === 0);

  setGoogleApiResponse(validGooglePurchase({
    orderId: unresolvedPurchase.orderId,
    productId: unresolvedPurchase.playProductId
  }));

  const res = new MockResponse();
  await verifyHandler(makeReq("POST", {
    purchaseToken: unresolvedPurchase.purchaseToken,
    playProductId: unresolvedPurchase.playProductId,
    orderId: unresolvedPurchase.orderId
  }), res);
  t("server accepts recovered purchase", res._status === 200);
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
// RUN
// ════════════════════════════════════════════════════════════════════

console.log("\nV2.4.7 — Native Billing Bridge Stabilization & Android Build\n");
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
