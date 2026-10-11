/* V2.2.20 — SECURITY LAB: isolated test doubles for the REAL payment API handlers and the REAL durable ledger.
 *
 * Nothing here talks to PayPal, Upstash/Redis or any network. `fetch` is replaced by a router that answers
 *   · the (fake) Redis REST URL from an in-memory store that re-implements the five Lua scripts paypal-ledger.js sends, and
 *   · api-m.paypal.com from an in-memory fake PayPal,
 * and refuses (and records) everything else — so "no production data / money touched" is MEASURED, not asserted.
 *
 * The Redis double mirrors the Lua scripts by fingerprint. If anyone edits one of those scripts the fingerprint changes and `scriptsPinned()` fails, which forces a human to re-check that the double
 * still matches the real semantics.
 */
import { createHash } from "node:crypto";

export const FAKE_REDIS_URL = "http://fake-redis.invalid";
const norm = s => String(s).replace(/\s+/g, " ").trim();
const sha = s => createHash("sha256").update(norm(s)).digest("hex").slice(0, 16);

/* fingerprints of the Lua scripts in api/_lib/paypal-ledger.js (normalised whitespace) — the double implements exactly these four semantics */
export const PINNED = {
  incident:    "local existing = redis.call(\"GET\", KEYS[1]) if existing then return {0, existing} end redis.call(\"SET\", KEYS[1], ARGV[1], \"EX\", ARGV[2]) redis.call(\"SET\", KEYS[2], ARGV[3], \"EX\", ARGV[2]) return {1, ARGV[1]}",
  entitlement: "local existing = redis.call(\"GET\", KEYS[2]) if existing then redis.call(\"SET\", KEYS[1], ARGV[1], \"EX\", ARGV[2]) return {0, existing} end redis.call(\"SET\", KEYS[1], ARGV[1], \"EX\", ARGV[2]) redis.call(\"SET\", KEYS[2], ARGV[3], \"EX\", ARGV[2]) return {1, ARGV[3]}"
};
export const PINNED_HASH = Object.fromEntries(Object.entries(PINNED).map(([k, v]) => [k, sha(v)]));

export function makeRedis() {
  const store = new Map(), seenScripts = new Set(), log = [];
  const R = { store, seenScripts, log, evalCount: 0 };
  R.get = k => store.has(k) ? store.get(k) : null;
  R.command = cmd => {
    log.push(cmd[0]);
    if (cmd[0] === "GET") return R.get(cmd[1]);
    if (cmd[0] === "SET") { store.set(cmd[1], cmd[2]); return "OK"; }
    if (cmd[0] !== "EVAL") throw new Error("fake redis: unsupported command " + cmd[0]);
    R.evalCount++;
    const [, script, nkeys, ...rest] = cmd, keys = rest.slice(0, nkeys), a = rest.slice(nkeys), s = norm(script); seenScripts.add(sha(script));
    if (s === norm(PINNED.incident)) { const ex = R.get(keys[0]); if (ex) return [0, ex]; store.set(keys[0], a[0]); store.set(keys[1], a[2]); return [1, a[0]]; }
    if (s === norm(PINNED.entitlement)) { const ex = R.get(keys[1]); if (ex) { store.set(keys[0], a[0]); return [0, ex]; } store.set(keys[0], a[0]); store.set(keys[1], a[2]); return [1, a[2]]; }
    if (s.includes("obj.claimedAt = ARGV[2]")) {            // claimEntitlement: ARGV = captureID, now, claimId, ttl
      const raw = R.get(keys[0]); if (!raw) return [0, "NOT_FOUND"]; const o = JSON.parse(raw);
      if (o.captureID !== a[0]) return [0, "CAPTURE_MISMATCH"];
      if (o.claimedAt) return o.claimId === a[2] ? [2, raw] : [0, "ALREADY_CLAIMED"];
      o.claimedAt = a[1]; o.claimId = a[2]; const u = JSON.stringify(o); store.set(keys[0], u); return [1, u];
    }
    if (s.includes("obj.fulfilledAt = ARGV[2]")) {          // fulfillEntitlement: ARGV = captureID, now, fulfillmentId, ttl
      const raw = R.get(keys[0]); if (!raw) return [0, "NOT_FOUND"]; const o = JSON.parse(raw);
      if (o.captureID !== a[0]) return [0, "CAPTURE_MISMATCH"];
      if (!o.claimedAt) return [0, "NOT_CLAIMED"];
      if (o.fulfilledAt) return o.fulfillmentId === a[2] ? [2, raw] : [0, "ALREADY_FULFILLED"];
      o.fulfilledAt = a[1]; o.fulfillmentId = a[2]; o.status = "FULFILLED"; const u = JSON.stringify(o); store.set(keys[0], u); return [1, u];
    }
    throw new Error("fake redis: an EVAL script the double does not know — update tools/v2-chaos/security-lab.mjs and re-pin");
  };
  return R;
}

/* a fake PayPal. Orders are created by the real create-order handler (or seeded by a test) and captured by the real capture-order handler. */
export function makePayPal(opts = {}) {
  const P = { orders: new Map(), calls: [], hooks: { createEcho: null, captureStatus: "COMPLETED", webhookSig: true, orderPatch: null } };
  P.seed = (id, o) => { P.orders.set(id, o); return o; };
  P.route = (url, init = {}) => {
    const u = new URL(url), m = init.method || "GET", p = u.pathname; P.calls.push(m + " " + p);
    const json = (status, body) => ({ ok: status >= 200 && status < 300, status, json: async () => body });
    if (p === "/v1/oauth2/token") return json(200, { access_token: "FAKE-TOKEN" });
    if (p === "/v1/notifications/verify-webhook-signature") return json(200, { verification_status: P.hooks.webhookSig ? "SUCCESS" : "FAILURE" });
    if (p === "/v2/checkout/orders" && m === "POST") {
      const body = JSON.parse(init.body), id = "ORDER-" + (P.orders.size + 1), unit = body.purchase_units[0];
      let echo = { id, status: "CREATED", purchase_units: [{ custom_id: unit.custom_id, invoice_id: unit.invoice_id, amount: { ...unit.amount } }] };
      if (P.hooks.createEcho) echo = P.hooks.createEcho(echo) || echo;
      P.orders.set(id, echo); return json(201, echo);
    }
    let mm = p.match(/^\/v2\/checkout\/orders\/([^/]+)\/capture$/);
    if (mm && m === "POST") {
      const o = P.orders.get(mm[1]); if (!o) return json(404, { message: "not found" });
      if (P.hooks.captureStatus === "ERROR") return json(500, { message: "capture failed" });
      const cap = { id: "CAP-" + mm[1], status: P.hooks.captureStatus };
      if (!o.purchase_units[0].payments) o.purchase_units[0].payments = { captures: [] };
      if (!o.purchase_units[0].payments.captures.length) o.purchase_units[0].payments.captures.push(cap);
      o.status = P.hooks.captureStatus === "COMPLETED" ? "COMPLETED" : "PENDING";
      return json(201, JSON.parse(JSON.stringify(o)));
    }
    mm = p.match(/^\/v2\/checkout\/orders\/([^/]+)$/);
    if (mm && m === "GET") { const o = P.orders.get(mm[1]); if (!o) return json(404, { message: "not found" }); return json(200, JSON.parse(JSON.stringify(P.hooks.orderPatch ? (P.hooks.orderPatch(o) || o) : o))); }
    return json(404, { message: "fake paypal: unknown route " + m + " " + p });
  };
  return P;
}

/* install fetch + env; returns a restore function and the measurement of everything that was NOT answered by a double */
export function installLab({ redis, paypal, env = {} }) {
  const prevFetch = globalThis.fetch, prevEnv = {}, blocked = [];
  const E = { UPSTASH_REDIS_REST_URL: FAKE_REDIS_URL, UPSTASH_REDIS_REST_TOKEN: "fake-token", KV_REST_API_URL: "", KV_REST_API_TOKEN: "", PAYPAL_CLIENT_ID: "FAKE-ID", PAYPAL_CLIENT_SECRET: "FAKE-SECRET", PAYPAL_ENV: "live", PAYPAL_WEBHOOK_ID: "FAKE-WH", ...env };
  for (const k of Object.keys(E)) { prevEnv[k] = process.env[k]; if (E[k] === undefined || E[k] === null) delete process.env[k]; else process.env[k] = E[k]; }
  globalThis.fetch = async (url, init = {}) => {
    const s = String(url);
    if (s.startsWith(FAKE_REDIS_URL)) {
      let result; try { result = redis.command(JSON.parse(init.body)); } catch (e) { return { ok: true, status: 200, json: async () => ({ error: e.message }) }; }
      return { ok: true, status: 200, json: async () => ({ result }) };
    }
    if (s.startsWith("https://api-m.paypal.com/")) return paypal.route(s, init);
    blocked.push(s); throw new Error("security lab: network access blocked → " + s);
  };
  return { blocked, restore() { globalThis.fetch = prevFetch; for (const k of Object.keys(prevEnv)) { if (prevEnv[k] === undefined) delete process.env[k]; else process.env[k] = prevEnv[k]; } } };
}

/* call a Vercel-style handler */
export async function call(handler, { method = "POST", body = {}, headers = {} } = {}) {
  const out = { status: 200, headers: {}, body: null };
  const res = { setHeader(k, v) { out.headers[k] = v; return res; }, status(n) { out.status = n; return res; }, json(b) { out.body = b; return res; } };
  const origErr = console.error, origLog = console.log; console.error = () => {}; console.log = () => {};
  try { await handler({ method, body, headers }, res); } catch (e) { out.threw = e && e.message || String(e); } finally { console.error = origErr; console.log = origLog; }
  return out;
}

/* the four Lua scripts, as they stand in api/_lib/paypal-ledger.js, must hash to what the double was written against */
export const LEDGER_SCRIPT_HASHES = [PINNED_HASH.incident, PINNED_HASH.entitlement, "d3ab6693146562c4" /* claim */, "c1dc5a786d24153a" /* fulfill */];
export function scriptsPinned(ledgerSource) {
  const found = [...ledgerSource.matchAll(/const script = `([\s\S]*?)`;/g)].map(m => sha(m[1]));
  return { ok: found.length === 4 && found.every((h, i) => h === LEDGER_SCRIPT_HASHES[i]), found, expected: LEDGER_SCRIPT_HASHES };
}
