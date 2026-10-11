/* V2.2.20 — server-side security checks that EXECUTE the real payment API handlers (api/paypal/*.js) and the real durable ledger (api/_lib/*.js) against the doubles in security-lab.mjs.
 * Every check is a list of named assertions; a check passes only if every one of its assertions passed. Nothing is hard-coded true.
 *
 *   C03 purchase verification        create-order / capture-order / webhook accept only canonical, completed, matching payments; client-supplied amounts are ignored
 *   C04 replay & duplicate protection capture replay, webhook replay, claim replay, wrong-capture claim
 *   C05 durable fulfillment           claim-before-fulfil order, canonical receipt identity, one FULFILLED transition, replay-safe
 *   C06 economy integrity / tamper    tampered stored records are refused by claim AND fulfil with a frozen incident; inflated client values never reach the ledger
 *   C07 canonical authority           one price/FL OZ table, frozen, used by every endpoint (the webhook included)
 *   C08 reconciliation                every drift class is detected; a clean record passes
 *   C09 incident & recovery           one incident per invoice, recovery refused while drift remains, recoverable after repair — and never auto-credits
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { makeRedis, makePayPal, installLab, call, scriptsPinned } from "./security-lab.mjs";

const root = resolve(new URL("../..", import.meta.url).pathname);
const imp = p => import(resolve(root, p) + "?lab=" + Math.random().toString(36).slice(2));
const A = await imp("api/_lib/economy-authority.js");
const L = await imp("api/_lib/paypal-ledger.js");
const H = {
  create: (await imp("api/paypal/create-order.js")).default, capture: (await imp("api/paypal/capture-order.js")).default, claim: (await imp("api/paypal/claim-entitlement.js")).default,
  fulfill: (await imp("api/paypal/fulfill-entitlement.js")).default, reconcile: (await imp("api/paypal/reconcile-entitlement.js")).default, recover: (await imp("api/paypal/recover-economy-incident.js")).default,
  webhook: (await imp("api/paypal/webhook.js")).default, config: (await imp("api/paypal/config.js")).default
};

function lab(env) { const redis = makeRedis(), paypal = makePayPal(), inst = installLab({ redis, paypal, env }); return { redis, paypal, inst, done: () => inst.restore() }; }
const ents = r => [...r.store.keys()].filter(k => k.startsWith("gei:paypal:entitlement:"));
const incs = r => [...r.store.keys()].filter(k => /^gei:paypal:incident:(?!index)/.test(k));
const rec = (r, inv) => JSON.parse(r.store.get("gei:paypal:entitlement:" + inv));

/* a check = named assertions. */
class Check {
  constructor(id, name) { this.id = id; this.name = name; this.assertions = []; }
  ok(label, cond, detail) { this.assertions.push({ label, pass: !!cond, detail: cond ? undefined : detail }); return !!cond; }
  result() { const failed = this.assertions.filter(a => !a.pass); return { id: this.id, name: this.name, status: failed.length ? "FAIL" : "PASS", assertions: this.assertions.length, failed: failed.map(f => ({ label: f.label, detail: f.detail })) }; }
}
const short = x => { try { return JSON.stringify(x).slice(0, 240); } catch { return String(x); } };

/* a purchase through the real endpoints: create-order → (customer approves) → capture-order. Returns what the client would hold. */
async function buy(L0, packId = "single", requestId = "REQ-" + Math.random().toString(36).slice(2, 12) + "ab") {
  const c = await call(H.create, { body: { packId, requestId } });
  if (c.status !== 200) return { c };
  const cap = await call(H.capture, { body: { orderID: c.body.id, packId } });
  return { c, cap, orderID: c.body.id, invoiceId: c.body.claimToken, captureID: cap.body && cap.body.captureID };
}

const results = [];
export async function runServerChecks() {
  const lib = readFileSync(resolve(root, "api/_lib/paypal-ledger.js"), "utf8");
  const pin = scriptsPinned(lib);
  let blockedTotal = [];
  const mk = (id, name) => new Check(id, name);

  /* ============================================================ C03 purchase verification */
  { const c = mk("C03", "purchase verification (create-order / capture-order / webhook)"); const t = lab();
    try {
      c.ok("the Redis double matches the ledger's four Lua scripts (fingerprints pinned)", pin.ok, pin);
      const o = await call(H.create, { body: { packId: "single", requestId: "REQ-ABCDEFGH1", amount: "0.01", flOz: 999999, currency: "EUR", price: "0.01" } });
      c.ok("create-order: ignores client-supplied amount / flOz / currency — PayPal is asked for the canonical USD 6.00", o.status === 200 && t.paypal.orders.get(o.body.id).purchase_units[0].amount.value === "6.00" && t.paypal.orders.get(o.body.id).purchase_units[0].amount.currency_code === "USD", o);
      c.ok("create-order: claim token is derived from the server-validated request id", o.body && o.body.claimToken === "GEI-REQ-ABCDEFGH1", o.body);
      c.ok("create-order: unknown pack → 400", (await call(H.create, { body: { packId: "gold", requestId: "REQ-ABCDEFGH2" } })).status === 400);
      c.ok("create-order: missing / malformed request id → 400", (await call(H.create, { body: { packId: "single" } })).status === 400 && (await call(H.create, { body: { packId: "single", requestId: "x" } })).status === 400);
      c.ok("create-order: GET → 405", (await call(H.create, { method: "GET" })).status === 405);
      t.paypal.hooks.createEcho = e => { e.purchase_units[0].amount.value = "0.01"; return e; };
      c.ok("create-order: if PayPal echoes a different amount the order is refused (502)", (await call(H.create, { body: { packId: "ten", requestId: "REQ-ABCDEFGH3" } })).status === 502);
      t.paypal.hooks.createEcho = null;

      const b = await buy(t, "ten");
      c.ok("capture-order: a genuine completed payment records a FULFILLABLE entitlement for the canonical FL OZ (66600)", b.cap.status === 200 && b.cap.body.flOz === 66600 && b.cap.body.fulfillmentStatus === "FULFILLABLE" && ents(t.redis).length === 1, b.cap);
      const before = ents(t.redis).length;
      t.paypal.seed("ORDER-X1", { id: "ORDER-X1", status: "COMPLETED", purchase_units: [{ custom_id: "twentyfive", invoice_id: "GEI-REQ-TAMPER001", amount: { currency_code: "USD", value: "0.01" }, payments: { captures: [{ id: "CAP-X1", status: "COMPLETED" }] } }] });
      const tam = await call(H.capture, { body: { orderID: "ORDER-X1", packId: "twentyfive" } });
      c.ok("capture-order: a 0.01 USD payment claiming the 25-song pack is rejected (400) and records nothing", tam.status === 400 && ents(t.redis).length === before, tam);
      t.paypal.seed("ORDER-X2", { id: "ORDER-X2", status: "COMPLETED", purchase_units: [{ custom_id: "single", invoice_id: "GEI-REQ-TAMPER002", amount: { currency_code: "USD", value: "6.00" }, payments: { captures: [{ id: "CAP-X2", status: "COMPLETED" }] } }] });
      const swap = await call(H.capture, { body: { orderID: "ORDER-X2", packId: "ten" } });
      c.ok("capture-order: paying for the 1-song pack but claiming the 10-song pack is rejected", swap.status === 400 && ents(t.redis).length === before, swap);
      t.paypal.seed("ORDER-X3", { id: "ORDER-X3", status: "COMPLETED", purchase_units: [{ custom_id: "single", invoice_id: "GEI-REQ-TAMPER003", amount: { currency_code: "EUR", value: "6.00" }, payments: { captures: [{ id: "CAP-X3", status: "COMPLETED" }] } }] });
      c.ok("capture-order: a EUR payment is rejected", (await call(H.capture, { body: { orderID: "ORDER-X3", packId: "single" } })).status === 400 && ents(t.redis).length === before);
      t.paypal.hooks.captureStatus = "PENDING";
      const o2 = await call(H.create, { body: { packId: "single", requestId: "REQ-PENDING001" } }), pend = await call(H.capture, { body: { orderID: o2.body.id, packId: "single" } });
      c.ok("capture-order: a capture that is not COMPLETED yields 409 and records nothing", pend.status === 409 && ents(t.redis).length === before, pend);
      t.paypal.hooks.captureStatus = "COMPLETED";
      c.ok("capture-order: missing order id / unknown pack → 400", (await call(H.capture, { body: { packId: "single" } })).status === 400 && (await call(H.capture, { body: { orderID: "O", packId: "nope" } })).status === 400);
      c.ok("capture-order: GET → 405", (await call(H.capture, { method: "GET" })).status === 405);
      t.inst.restore(); const t2 = lab({ PAYPAL_ENV: "sandbox" });
      c.ok("create-order / config refuse to run unless PAYPAL_ENV is live", (await call(H.create, { body: { packId: "single", requestId: "REQ-SANDBOX001" } })).status === 500 && (await call(H.config, { method: "GET" })).status === 503);
      t2.done(); const t3 = lab({ PAYPAL_CLIENT_SECRET: null });
      c.ok("without credentials checkout cannot start", (await call(H.create, { body: { packId: "single", requestId: "REQ-NOCREDS001" } })).status === 500);
      t3.done();
      /* webhook */
      const t4 = lab(); const ev = (type, id, cap, order) => ({ id, event_type: type, resource: { id: cap, supplementary_data: { related_ids: { order_id: order } } } });
      const o3 = await call(H.create, { body: { packId: "single", requestId: "REQ-WEBHOOK001" } }); t4.paypal.orders.get(o3.body.id).status = "COMPLETED"; t4.paypal.orders.get(o3.body.id).purchase_units[0].payments = { captures: [{ id: "CAP-WH1", status: "COMPLETED" }] };
      const w = await call(H.webhook, { body: ev("PAYMENT.CAPTURE.COMPLETED", "WH-EVT-1", "CAP-WH1", o3.body.id), headers: {} });
      c.ok("webhook: a genuine, signature-verified capture at the CANONICAL price is recorded as an entitlement", w.status === 200 && w.body && w.body.fulfillment && w.body.fulfillment.packId === "single" && ents(t4.redis).length === 1, w);
      t4.paypal.hooks.webhookSig = false;
      const bad = await call(H.webhook, { body: ev("PAYMENT.CAPTURE.COMPLETED", "WH-EVT-2", "CAP-WH1", o3.body.id) });
      c.ok("webhook: an invalid signature is rejected (400)", bad.status === 400, bad);
      t4.paypal.hooks.webhookSig = true;
      const o4 = await call(H.create, { body: { packId: "single", requestId: "REQ-WEBHOOK002" } }); const ord = t4.paypal.orders.get(o4.body.id); ord.status = "COMPLETED"; ord.purchase_units[0].amount.value = "0.01"; ord.purchase_units[0].payments = { captures: [{ id: "CAP-WH2", status: "COMPLETED" }] };
      const nW = ents(t4.redis).length, mis = await call(H.webhook, { body: ev("PAYMENT.CAPTURE.COMPLETED", "WH-EVT-3", "CAP-WH2", o4.body.id) });
      c.ok("webhook: a capture whose amount does not match the pack records nothing", mis.status >= 400 && ents(t4.redis).length === nW, mis);
      c.ok("webhook: a denied payment never creates an entitlement", (await call(H.webhook, { body: { id: "WH-EVT-4", event_type: "PAYMENT.CAPTURE.DENIED", resource: { custom_id: "single" } } })).body?.fulfillment?.status === "DENIED" && ents(t4.redis).length === nW);
      blockedTotal.push(...t.inst.blocked, ...t4.inst.blocked); t4.done();
    } catch (e) { c.ok("check ran to completion", false, e && e.stack || String(e)); } finally { try { t.done(); } catch {} }
    results.push(c.result()); }

  /* ============================================================ C04 replay & duplicate protection */
  { const c = mk("C04", "replay and duplicate-credit protection"); const t = lab();
    try {
      const b = await buy(t, "single", "REQ-REPLAY0001"); const rec1 = rec(t.redis, b.invoiceId);
      const again = await call(H.capture, { body: { orderID: b.orderID, packId: "single" } });
      c.ok("capture-order replayed after completion → still exactly one entitlement, same record (not re-created)", again.status === 200 && ents(t.redis).length === 1 && rec(t.redis, b.invoiceId).createdAt === rec1.createdAt, again);
      const r1 = await L.recordEntitlement({ eventId: "capture:" + b.captureID, orderID: b.orderID, captureID: b.captureID, invoiceId: b.invoiceId, packId: "single", flOz: 6660, amount: "6.00", currency: "USD" });
      c.ok("the ledger itself reports created:false on a replayed capture", r1.created === false, r1);
      const cl1 = await call(H.claim, { body: { claimToken: b.invoiceId, captureID: b.captureID, claimId: "CLAIM-ONE-0001" } });
      c.ok("claim: first claim succeeds (FIRST_CLAIM)", cl1.status === 200 && cl1.body.recovery === "FIRST_CLAIM", cl1);
      const cl2 = await call(H.claim, { body: { claimToken: b.invoiceId, captureID: b.captureID, claimId: "CLAIM-ONE-0001" } });
      c.ok("claim: same claim id replayed → REPLAY_RECOVERED, no second claim", cl2.status === 200 && cl2.body.recovery === "REPLAY_RECOVERED" && cl2.body.alreadyClaimed === true, cl2);
      const cl3 = await call(H.claim, { body: { claimToken: b.invoiceId, captureID: b.captureID, claimId: "CLAIM-TWO-0002" } });
      c.ok("claim: a different claim id after the first is refused (409 — nobody else can take the same credit)", cl3.status === 409 && rec(t.redis, b.invoiceId).claimId === "CLAIM-ONE-0001", cl3);
      const cl4 = await call(H.claim, { body: { claimToken: b.invoiceId, captureID: "CAP-OTHER", claimId: "CLAIM-ONE-0001" } });
      c.ok("claim: a claim token paired with another payment's capture id is refused (403)", cl4.status === 403, cl4);
      c.ok("claim: unknown token → 404; missing fields → 400", (await call(H.claim, { body: { claimToken: "GEI-NOPE", captureID: "C", claimId: "CLAIM-ZZZZ-0001" } })).status === 404 && (await call(H.claim, { body: { claimToken: b.invoiceId } })).status === 400);
      /* webhook replay */
      const o = await call(H.create, { body: { packId: "ten", requestId: "REQ-REPLAY0002" } }); const ord = t.paypal.orders.get(o.body.id); ord.status = "COMPLETED"; ord.purchase_units[0].payments = { captures: [{ id: "CAP-RW1", status: "COMPLETED" }] };
      const ev = { id: "WH-REPLAY-1", event_type: "PAYMENT.CAPTURE.COMPLETED", resource: { id: "CAP-RW1", supplementary_data: { related_ids: { order_id: o.body.id } } } };
      const n0 = ents(t.redis).length, w1 = await call(H.webhook, { body: ev }), w2 = await call(H.webhook, { body: ev }), w3 = await call(H.webhook, { body: { ...ev, id: "WH-REPLAY-2" } });
      c.ok("webhook: the same event delivered 3× (even with new event ids) yields ONE entitlement", w1.status === 200 && w2.status === 200 && w3.status === 200 && ents(t.redis).length === n0 + 1 && w1.body.fulfillment.created === true && w2.body.fulfillment.created === false && w3.body.fulfillment.created === false, [w1.body, w2.body, w3.body].map(x => x && x.fulfillment));
      c.ok("webhook + capture-order racing for the same payment still yield one entitlement", (await call(H.capture, { body: { orderID: o.body.id, packId: "ten" } })).status === 200 && ents(t.redis).length === n0 + 1);
      blockedTotal.push(...t.inst.blocked);
    } catch (e) { c.ok("check ran to completion", false, e && e.stack || String(e)); } finally { t.done(); }
    results.push(c.result()); }

  /* ============================================================ C05 durable fulfillment */
  { const c = mk("C05", "durable fulfillment (claim → fulfil, exactly once)"); const t = lab();
    try {
      const b = await buy(t, "twentyfive", "REQ-FULFIL0001"), fid = A.canonicalFulfillmentId(b.captureID);
      const f0 = await call(H.fulfill, { body: { claimToken: b.invoiceId, captureID: b.captureID, fulfillmentId: fid } });
      c.ok("fulfil before claim → 409 (nothing is credited)", f0.status === 409 && !rec(t.redis, b.invoiceId).fulfilledAt, f0);
      await call(H.claim, { body: { claimToken: b.invoiceId, captureID: b.captureID, claimId: "CLAIM-FULFIL-01" } });
      c.ok("fulfil with a receipt id that is not the capture's canonical id → 403", (await call(H.fulfill, { body: { claimToken: b.invoiceId, captureID: b.captureID, fulfillmentId: "GEI-FULFILL-SOMETHING-ELSE" } })).status === 403);
      c.ok("fulfil with a malformed receipt id → 400", (await call(H.fulfill, { body: { claimToken: b.invoiceId, captureID: b.captureID, fulfillmentId: "../etc" } })).status === 400);
      const f1 = await call(H.fulfill, { body: { claimToken: b.invoiceId, captureID: b.captureID, fulfillmentId: fid } });
      const r1 = rec(t.redis, b.invoiceId);
      c.ok("fulfil: first fulfilment → FIRST_FULFILLMENT, durable record FULFILLED with the canonical 166500 FL OZ", f1.status === 200 && f1.body.recovery === "FIRST_FULFILLMENT" && r1.status === "FULFILLED" && r1.flOz === 166500 && f1.body.receipt.authoritative === true, f1);
      const f2 = await call(H.fulfill, { body: { claimToken: b.invoiceId, captureID: b.captureID, fulfillmentId: fid } }), r2 = rec(t.redis, b.invoiceId);
      c.ok("fulfil replayed → FULFILLMENT_REPLAY_RECOVERED and the fulfilment timestamp never moves (one credit)", f2.status === 200 && f2.body.recovery === "FULFILLMENT_REPLAY_RECOVERED" && r2.fulfilledAt === r1.fulfilledAt, [f2.body, r1.fulfilledAt, r2.fulfilledAt]);
      const f3 = await L.fulfillEntitlement(b.invoiceId, b.captureID, "GEI-FULFILL-DIFFERENT-ID-0001");
      c.ok("ledger: a second, different fulfilment id is refused (ALREADY_FULFILLED)", f3.ok === false && f3.reason === "ALREADY_FULFILLED", f3);
      c.ok("fulfil: wrong capture → 403; unknown token → 404", (await call(H.fulfill, { body: { claimToken: b.invoiceId, captureID: "CAP-OTHER", fulfillmentId: A.canonicalFulfillmentId("CAP-OTHER") } })).status === 403 && (await call(H.fulfill, { body: { claimToken: "GEI-NONE", captureID: "CAP-ZZZZZZZZ", fulfillmentId: A.canonicalFulfillmentId("CAP-ZZZZZZZZ") } })).status === 404);
      blockedTotal.push(...t.inst.blocked);
    } catch (e) { c.ok("check ran to completion", false, e && e.stack || String(e)); } finally { t.done(); }
    results.push(c.result()); }

  /* ============================================================ C06 economy integrity & tamper defence */
  { const c = mk("C06", "economy integrity and tamper defence");
    try {
      const inflate = (r, inv) => { const x = rec(r, inv); x.flOz = 666000; r.store.set("gei:paypal:entitlement:" + inv, JSON.stringify(x)); };
      const TAMPERS = {
        "FL OZ inflated 6660 → 666000": x => { x.flOz = 666000; }, "amount lowered 6.00 → 0.01": x => { x.amount = "0.01"; }, "currency changed to EUR": x => { x.currency = "EUR"; },
        "pack swapped single → twentyfive (flOz/amount unchanged)": x => { x.packId = "twentyfive"; }, "audit marked non-authoritative": x => { x.audit.authoritative = false; },
        "authority version downgraded": x => { x.auditVersion = "1.0.0"; }, "fulfilment id not bound to the capture": x => { x.fulfillmentId = "GEI-FULFILL-FORGED-0001"; }
      };
      for (const [label, mut] of Object.entries(TAMPERS)) for (const [stage, handler] of [["claim", H.claim], ["fulfil", H.fulfill]]) {
        const t = lab();
        try {
          const b = await buy(t, "single", "REQ-TMP" + Math.random().toString(36).slice(2, 9)); const x = rec(t.redis, b.invoiceId);
          if (stage === "fulfil") { await call(H.claim, { body: { claimToken: b.invoiceId, captureID: b.captureID, claimId: "CLAIM-TAMPER-001" } }); }
          const y = rec(t.redis, b.invoiceId); mut(y); t.redis.store.set("gei:paypal:entitlement:" + b.invoiceId, JSON.stringify(y));
          const body = stage === "claim" ? { claimToken: b.invoiceId, captureID: b.captureID, claimId: "CLAIM-TAMPER-001" } : { claimToken: b.invoiceId, captureID: b.captureID, fulfillmentId: A.canonicalFulfillmentId(b.captureID) };
          const r = await call(handler, { body }), after = rec(t.redis, b.invoiceId);
          const credited = stage === "claim" ? (!x.claimedAt && !!after.claimedAt) : (after.status === "FULFILLED");
          c.ok("tampered record (" + label + ") → " + stage + " refused with 409 ECONOMY_DRIFT_DETECTED, frozen incident recorded, nothing credited",
            r.status === 409 && r.body && r.body.code === "ECONOMY_DRIFT_DETECTED" && r.body.frozen === true && incs(t.redis).length === 1 && !credited, { status: r.status, threw: r.threw, body: r.body && { code: r.body.code, frozen: r.body.frozen }, incidents: incs(t.redis).length, credited });
        } finally { blockedTotal.push(...t.inst.blocked); t.done(); }
      }
      const t = lab();
      try {
        const bad = async v => { try { await L.recordEntitlement({ eventId: "capture:Z" + Math.random(), orderID: "O", captureID: "C" + Math.random(), invoiceId: "INV" + Math.random(), packId: "single", ...{ flOz: 6660, amount: "6.00", currency: "USD" }, ...v }); return false; } catch (e) { return /authority validation failed/i.test(e.message); } };
        c.ok("ledger refuses a client/forged FL OZ value (66600 for the 1-song pack)", await bad({ flOz: 66600 }));
        c.ok("ledger refuses a forged price, currency and unknown pack", await bad({ amount: "0.01" }) && await bad({ currency: "EUR" }) && await bad({ packId: "free" }));
        c.ok("nothing was written by any refused record", ents(t.redis).length === 0);
        c.ok("special-character packs are cash-only, machine-ineligible and carry 0 FL OZ", ["special-jesus", "special-dam-black-jesus", "special-devil"].every(id => { const p = A.getPack(id); return p.cashOnly === true && p.machineEligible === false && p.flOz === 0 && p.kind === "special-character"; }));
        c.ok("a special-character record with FL OZ attached is not an authoritative entitlement", A.validateEntitlementAuthority({ packId: "special-devil", flOz: 6660, amount: "6.00" }) === false && A.validateEntitlementAuthority({ packId: "special-devil", flOz: 0, amount: "6.00" }) === true);
      } finally { blockedTotal.push(...t.inst.blocked); t.done(); }
    } catch (e) { c.ok("check ran to completion", false, e && e.stack || String(e)); }
    results.push(c.result()); }

  /* ============================================================ C07 canonical authority */
  { const c = mk("C07", "canonical authority (one price / FL OZ table everywhere)"); const t = lab();
    try {
      c.ok("authority table: 1 song = 6.00 USD → 6660 FL OZ · 10 = 12.00 → 66600 · 25 = 18.00 → 166500", A.PACKS.single.price === "6.00" && A.PACKS.single.flOz === 6660 && A.PACKS.ten.price === "12.00" && A.PACKS.ten.flOz === 66600 && A.PACKS.twentyfive.price === "18.00" && A.PACKS.twentyfive.flOz === 166500, A.PACKS);
      c.ok("the table and every pack are frozen (cannot be mutated at run time)", Object.isFrozen(A.PACKS) && Object.values(A.PACKS).every(Object.isFrozen));
      c.ok("authority / reconciliation versions are 2.0.25 / 2.0.26", A.ECONOMY_AUTHORITY_VERSION === "2.0.25" && A.ECONOMY_RECONCILIATION_VERSION === "2.0.26");
      c.ok("fulfilment ids are bound to the capture and sanitised", A.canonicalFulfillmentId("CAP-1") === "GEI-FULFILL-CAP-1" && A.canonicalFulfillmentId("a b/c") === "GEI-FULFILL-a-b-c");
      for (const packId of ["single", "ten", "twentyfive"]) {
        const o = await call(H.create, { body: { packId, requestId: "REQ-CANON-" + packId.toUpperCase().padEnd(8, "0") } }); const ord = t.paypal.orders.get(o.body.id); ord.status = "COMPLETED"; ord.purchase_units[0].payments = { captures: [{ id: "CAP-CANON-" + packId, status: "COMPLETED" }] };
        const w = await call(H.webhook, { body: { id: "WH-CANON-" + packId, event_type: "PAYMENT.CAPTURE.COMPLETED", resource: { id: "CAP-CANON-" + packId, supplementary_data: { related_ids: { order_id: o.body.id } } } } });
        c.ok("webhook accepts the canonical " + packId + " price (" + A.PACKS[packId].price + " USD) that create-order charged and records " + A.PACKS[packId].flOz + " FL OZ", w.status === 200 && w.body.fulfillment && w.body.fulfillment.flOz === A.PACKS[packId].flOz, { status: w.status, body: w.body });
      }
      const o = await call(H.create, { body: { packId: "single", requestId: "REQ-CANON-LEGACY1" } }); const ord = t.paypal.orders.get(o.body.id); ord.status = "COMPLETED"; ord.purchase_units[0].amount.value = "1.00"; ord.purchase_units[0].payments = { captures: [{ id: "CAP-LEGACY", status: "COMPLETED" }] };
      const n = ents(t.redis).length, w = await call(H.webhook, { body: { id: "WH-LEGACY", event_type: "PAYMENT.CAPTURE.COMPLETED", resource: { id: "CAP-LEGACY", supplementary_data: { related_ids: { order_id: o.body.id } } } } });
      c.ok("webhook rejects the retired 1.00 USD price (a stale table would accept it)", w.status >= 400 && ents(t.redis).length === n, { status: w.status, body: w.body });
      blockedTotal.push(...t.inst.blocked);
    } catch (e) { c.ok("check ran to completion", false, e && e.stack || String(e)); } finally { t.done(); }
    results.push(c.result()); }

  /* ============================================================ C08 reconciliation */
  { const c = mk("C08", "authority reconciliation detects every drift class");
    try {
      const clean = () => { const p = A.getPack("single"); return { status: "FULFILLABLE", auditVersion: A.ECONOMY_AUTHORITY_VERSION, audit: A.auditReceipt({ packId: "single", flOz: p.flOz, amount: p.price, currency: "USD" }), packId: "single", flOz: p.flOz, amount: p.price, currency: "USD", productType: "fl-oz", captureID: "CAP-R1", orderID: "O", invoiceId: "I" }; };
      const special = () => { const p = A.getPack("special-devil"); return { ...clean(), packId: "special-devil", flOz: 0, amount: p.price, productType: "special-character", characterId: "devil", audit: A.auditReceipt({ packId: "special-devil", flOz: 0, amount: p.price, currency: "USD", productType: "special-character", characterId: "devil" }) }; };
      c.ok("a clean FL OZ record is authoritative", A.reconcileEntitlementAuthority(clean()).ok === true, A.reconcileEntitlementAuthority(clean()));
      c.ok("a clean special-character record is authoritative", A.reconcileEntitlementAuthority(special()).ok === true, A.reconcileEntitlementAuthority(special()));
      const CASES = [
        ["MISSING_RECORD", () => null], ["UNKNOWN_PACK", () => ({ ...clean(), packId: "free" })], ["CURRENCY_DRIFT", () => ({ ...clean(), currency: "EUR" })], ["AMOUNT_DRIFT", () => ({ ...clean(), amount: "0.01" })],
        ["FL_OZ_DRIFT", () => ({ ...clean(), flOz: 1 })], ["PRODUCT_TYPE_DRIFT", () => ({ ...clean(), productType: "special-character" })], ["CHARACTER_ID_DRIFT", () => ({ ...special(), characterId: "jesus" })],
        ["AUDIT_VERSION_DRIFT", () => ({ ...clean(), auditVersion: "0.0.1" })], ["NON_AUTHORITATIVE_AUDIT", () => { const x = clean(); x.audit.authoritative = false; return x; }],
        ["AUDIT_RECORD_DRIFT", () => { const x = clean(); x.audit.flOz = 1; return x; }], ["FULFILLMENT_ID_DRIFT", () => ({ ...clean(), fulfillmentId: "GEI-FULFILL-OTHER" })]
      ];
      for (const [reason, build] of CASES) { const r = A.reconcileEntitlementAuthority(build()); c.ok(reason + " is detected (ok:false, driftDetected, reason listed)", r.ok === false && r.driftDetected === true && r.reasons.includes(reason), r); }
      c.ok("reconciliation never rewrites the record (detection only)", (() => { const x = { ...clean(), flOz: 1 }, s = JSON.stringify(x); A.reconcileEntitlementAuthority(x); return JSON.stringify(x) === s; })());
    } catch (e) { c.ok("check ran to completion", false, e && e.stack || String(e)); }
    results.push(c.result()); }

  /* ============================================================ C09 incident & recovery */
  { const c = mk("C09", "incident freeze and recovery (never auto-credits)"); const t = lab();
    try {
      const b = await buy(t, "single", "REQ-INCIDENT01"), key = "gei:paypal:entitlement:" + b.invoiceId; const x = rec(t.redis, b.invoiceId); x.flOz = 1; t.redis.store.set(key, JSON.stringify(x));
      const rc = await call(H.reconcile, { body: { claimToken: b.invoiceId, captureID: b.captureID } });
      c.ok("reconcile endpoint: drift → 409, frozen:true, incident recorded", rc.status === 409 && rc.body.frozen === true && incs(t.redis).length === 1, rc);
      const inc1 = JSON.parse(t.redis.store.get("gei:paypal:incident:" + b.invoiceId));
      const rc2 = await call(H.reconcile, { body: { claimToken: b.invoiceId, captureID: b.captureID } }), inc2 = JSON.parse(t.redis.store.get("gei:paypal:incident:" + b.invoiceId));
      c.ok("the same drift reported again keeps ONE incident (same id, same detection time)", incs(t.redis).length === 1 && inc1.incidentId === inc2.incidentId && inc1.detectedAt === inc2.detectedAt && rc2.status === 409, [inc1, inc2]);
      const rv = await call(H.recover, { body: { claimToken: b.invoiceId, captureID: b.captureID } });
      c.ok("recovery is refused while the drift remains (409 DRIFT_REMAINS, still FROZEN)", rv.status === 409 && rv.body.reason === "DRIFT_REMAINS" && rv.body.status === "FROZEN", rv);
      const cl = await call(H.claim, { body: { claimToken: b.invoiceId, captureID: b.captureID, claimId: "CLAIM-INC-0001" } });
      c.ok("…and the frozen entitlement cannot be claimed meanwhile", cl.status === 409 && !rec(t.redis, b.invoiceId).claimedAt, cl);
      const fixed = rec(t.redis, b.invoiceId); fixed.flOz = A.PACKS.single.flOz; t.redis.store.set(key, JSON.stringify(fixed));
      const rv2 = await call(H.recover, { body: { claimToken: b.invoiceId, captureID: b.captureID } }), after = rec(t.redis, b.invoiceId);
      c.ok("after an authoritative repair the incident becomes RECOVERABLE (REVERIFY_BEFORE_CLAIM_OR_FULFILLMENT)", rv2.status === 200 && rv2.body.status === "RECOVERABLE" && rv2.body.action === "REVERIFY_BEFORE_CLAIM_OR_FULFILLMENT", rv2);
      c.ok("recovery never auto-credits: still unclaimed and unfulfilled", !after.claimedAt && !after.fulfilledAt && after.status === "FULFILLABLE", after);
      c.ok("recovery for an invoice with no incident → 404 NO_INCIDENT", (await call(H.recover, { body: { claimToken: "GEI-NOINC", captureID: "C" } })).status === 404);
      c.ok("recovery cannot be driven with another payment's capture id (CAPTURE_MISMATCH, 409)", (await call(H.recover, { body: { claimToken: b.invoiceId, captureID: "CAP-OTHER" } })).body?.reason === "CAPTURE_MISMATCH");
      blockedTotal.push(...t.inst.blocked);
    } catch (e) { c.ok("check ran to completion", false, e && e.stack || String(e)); } finally { t.done(); }
    results.push(c.result()); }

  return { results, blocked: blockedTotal, scriptsPinned: pin.ok };
}
