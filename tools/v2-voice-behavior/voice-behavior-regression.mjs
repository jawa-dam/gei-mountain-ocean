/* DAM-ITE VOICE LAYER — behavioural regression (V2.2.20).
 * Replaces seven source-WORDING checks that had gone stale while the product behaved correctly (see tools/v2220-certification/ARCADE-TRIAGE.md):
 *   v2195 "Female default"           → V1 default mode, resolved by the Voice Director (the module that owns it), with empty storage
 *   v2195 touch-friendly button      → V2 the visible voice button is a real ≥ 44 px target (the old regex pinned a CSS string)
 *   v2200 "accessible dialog"        → V3 the Showcase UI was retired in V2.2.04 (openPanel() returns false): open() must show no dialog at all
 *   v2198 "new-player pacing"        → V4 new players hear the first-entry voice and every event; returning players hear the return voice and are thinned out, cycle moments always play
 *   v2196/v2197/v2202 + v2198/v2199/v2200/v2201/v2195 "presentation-only" (doc-comment wording) → V5 exercising every public voice API changes no balance, level, XP, tap count, unlock, receipt or save key
 *   v2193 "female voice fallback"    → V6 when the recording cannot play, the spoken fallback uses speechSynthesis with a raised pitch and an English voice
 *   node tools/v2-voice-behavior/voice-behavior-regression.mjs
 */
import { boot, sleep, done } from "../v2217-dam-builder/harness.mjs";
let passed = 0, failed = 0;
const check = (n, ok, d) => { if (ok) { passed++; console.log("  ✓ " + n); } else { failed++; console.log("  ✗ " + n + (d !== undefined ? "\n      " + JSON.stringify(d).slice(0, 500) : "")); } };
const SAVE = "yalltooDamGame.v2";
const seed = JSON.stringify({ version:2, level:1, levelFlOz:222, totalFlOz:1222, completedLevels:0, loopCount:0, currentStep:2, unlockedCharacters:["yall-too-beaver"], processedReceipts:["RCPT-TEST-0001"], purchaseHistory:[] });
const h = await boot({ query:"?b3d=off", storage:{ [SAVE]:seed } });

console.log("V1–V3 defaults, targets, retired UI");
const v = await h.page.evaluate(async () => {
  const vis = e => { const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.display !== "none" && cs.visibility !== "hidden"; };
  const modeKey = localStorage.getItem("geiMilestoneVoiceMode");
  const btn = document.getElementById("v2195VoiceButton"), r = btn && btn.getBoundingClientRect();
  const dlg = () => [...document.querySelectorAll("[role=dialog]")].filter(vis).map(e => e.id || e.className), was = dlg();
  let show; try { show = window.GEI_VOICE_SHOWCASE.open(); } catch (e) { show = "threw " + e.message; }
  await new Promise(r => setTimeout(r, 300));
  return { stored:modeKey, mode:GEI_VOICE_DIRECTOR.getMode(), modes:GEI_VOICE_DIRECTOR.modes, uiModes:GEI_VOICE_UI.modes, btn:r && { w:r.width, h:r.height, vis:vis(btn) }, show, opened:dlg().filter(x => !was.includes(x)) };
});
check("V1 with nothing stored the voice mode is FEMALE, and the four modes are female / male / random / off", v.stored === null && v.mode === "female" && JSON.stringify(v.modes) === JSON.stringify(["female", "male", "random", "off"]) && JSON.stringify(v.uiModes) === JSON.stringify(v.modes), v);
check("V2 the voice button is visible and a real touch target (≥ 44 px)", v.btn && v.btn.vis && v.btn.h >= 43.5 && v.btn.w >= 43.5, v.btn);
check("V3 the retired Showcase UI: open() returns false and shows no dialog (nothing unnamed or half-open is left on screen)", v.show === false && v.opened.length === 0, { show:v.show, opened:v.opened });

console.log("V4 adaptive pacing");
const pace = await h.page.evaluate(() => {
  const A = GEI_ADAPTIVE_VOICE, calls = []; const stub = { firstEntry(){ calls.push("first"); return true; }, returnEntry(){ calls.push("return"); return true; }, fullCycle(){ calls.push("cycle"); return true; }, characterMoment(){ calls.push("char"); return true; } };
  const keep = window.GEI_CONTEXTUAL_VOICE, rnd = Math.random, hist = localStorage.getItem("geiDamIteContextVoiceV2197"), ses = sessionStorage.getItem("geiDamIteAdaptiveVoiceSessionV2198"), prof = localStorage.getItem("geiDamIteAdaptiveVoiceV2198");
  window.GEI_CONTEXTUAL_VOICE = stub; const reset = (history) => { sessionStorage.setItem("geiDamIteAdaptiveVoiceSessionV2198", JSON.stringify({ sessions:1 })); if (history) localStorage.setItem("geiDamIteContextVoiceV2197", "1"); else localStorage.removeItem("geiDamIteContextVoiceV2197"); calls.length = 0; };
  const out = {};
  try {
    A.setProfile("adaptive");
    reset(false); out.newEntry = [A.firstEntry(), calls.slice()];
    reset(true); out.retEntry = [A.firstEntry(), calls.slice()];
    Math.random = () => 0.9; reset(false); out.newChar = [A.character(), calls.slice()];
    Math.random = () => 0.9; reset(true); out.retCharHigh = [A.character(), calls.slice()];
    Math.random = () => 0.1; reset(true); out.retCharLow = [A.character(), calls.slice()];
    Math.random = () => 0.9; reset(true); out.retCycle = [A.cycleComplete(), calls.slice()];
    A.setProfile("off"); reset(false); out.off = [A.firstEntry(), A.character(), A.cycleComplete(), calls.slice()];
  } finally { Math.random = rnd; window.GEI_CONTEXTUAL_VOICE = keep; if (hist === null) localStorage.removeItem("geiDamIteContextVoiceV2197"); else localStorage.setItem("geiDamIteContextVoiceV2197", hist); if (ses === null) sessionStorage.removeItem("geiDamIteAdaptiveVoiceSessionV2198"); else sessionStorage.setItem("geiDamIteAdaptiveVoiceSessionV2198", ses); if (prof === null) localStorage.removeItem("geiDamIteAdaptiveVoiceV2198"); else localStorage.setItem("geiDamIteAdaptiveVoiceV2198", prof); }
  return out;
});
check("V4a a new player is greeted with the FIRST-entry voice", pace.newEntry[0] === true && pace.newEntry[1].join() === "first", pace.newEntry);
check("V4b a returning player gets the RETURN voice instead", pace.retEntry[0] === true && pace.retEntry[1].join() === "return", pace.retEntry);
check("V4c a new player hears character moments even on an unlucky roll", pace.newChar[0] === true && pace.newChar[1].join() === "char", pace.newChar);
check("V4d a returning player is thinned out (roll 0.9 → suppressed, roll 0.1 → plays)", pace.retCharHigh[0] === false && pace.retCharHigh[1].length === 0 && pace.retCharLow[0] === true && pace.retCharLow[1].join() === "char", [pace.retCharHigh, pace.retCharLow]);
check("V4e a completed CYCLE always plays, even for a returning player on an unlucky roll", pace.retCycle[0] === true && pace.retCycle[1].join() === "cycle", pace.retCycle);
check("V4f profile OFF silences everything", pace.off[0] === false && pace.off[1] === false && pace.off[2] === false && pace.off[3].length === 0, pace.off);

console.log("V5 presentation-only: every public voice API, no economy / progression / purchase / save change");
const SNAP = () => ({ s:{ total:state.totalFlOz, lvl:state.levelFlOz, level:state.level, done:state.completedLevels, step:state.currentStep, taps:state.tapCount, phase:state.phase, rec:state.processedReceipts.length, hist:state.purchaseHistory.length, chars:state.unlockedCharacters.length, songs:state.unlockedSongs.length, skins:state.unlockedSkins.length }, save:localStorage.getItem("yalltooDamGame.v2"), xp:localStorage.getItem("geiXPRewardV1"), builder:localStorage.getItem("geiDamBuilder.v1"), keys:Object.keys(localStorage).sort() });
const before = await h.page.evaluate(SNAP);
const exercised = await h.page.evaluate(async () => {
  const names = [], t = (n, f) => { try { f(); names.push(n); } catch (e) { names.push(n + " THREW " + e.message); } };
  const C = GEI_CONTEXTUAL_VOICE, A = GEI_ADAPTIVE_VOICE, R = GEI_VOICE_REACTIONS, W = GEI_VOICE_REWARDS, D = GEI_VOICE_DISCOVERY, M = GEI_VOICE_MEMORY, S = GEI_VOICE_SHOWCASE, U = GEI_VOICE_UI, V = GEI_VOICE_DIRECTOR;
  t("contextual.firstEntry", () => C.firstEntry({ force:true })); t("contextual.returnEntry", () => C.returnEntry({ force:true })); t("contextual.fullCycle", () => C.fullCycle({ force:true })); t("contextual.characterMoment", () => C.characterMoment({ force:true }));
  t("adaptive.firstEntry", () => A.firstEntry()); t("adaptive.cycleComplete", () => A.cycleComplete()); t("adaptive.character", () => A.character()); t("adaptive.ambient", () => A.ambient()); t("adaptive.refresh", () => A.refresh()); t("adaptive.announceProfileChange", () => A.announceProfileChange());
  t("reactions.refresh", () => R.refresh()); t("reactions.clear", () => R.clear());
  t("rewards.check", () => W.check()); t("rewards.render", () => W.render()); t("rewards.snapshot", () => W.snapshot()); t("rewards.reset", () => W.reset());
  t("discovery.discover", () => D.discover("mountain")); t("discovery.firstDiscovery", () => D.firstDiscovery()); t("discovery.refresh", () => D.refresh()); t("discovery.snapshot", () => D.snapshot()); t("discovery.clear", () => D.clear());
  t("memory.rememberMode", () => M.rememberMode("female")); t("memory.toggleFavorite", () => M.toggleFavorite("mountain")); t("memory.favorites", () => M.favorites()); t("memory.clearFavorites", () => M.clearFavorites()); t("memory.clearMemory", () => M.clearMemory());
  t("showcase.open", () => S.open()); t("showcase.close", () => S.close()); t("showcase.preview", () => S.preview("mountain")); t("ui.open", () => U.open()); t("ui.close", () => U.close());
  t("director.setMode", () => V.setMode("female")); t("director.announce", () => V.announce("mountain", { force:true })); t("director.stop", () => V.stop());
  await new Promise(r => setTimeout(r, 500)); return names;
});
const after = await h.page.evaluate(SNAP);
check("every voice API was actually exercised without throwing (" + exercised.length + " calls)", exercised.length >= 30 && exercised.every(n => !/THREW/.test(n)), exercised.filter(n => /THREW/.test(n)));
const changed = after.keys.filter(k => before.save !== undefined && (!before.keys.includes(k)));
check("balance, level, XP, taps, unlocks, receipts and purchase history are exactly as before", JSON.stringify(after.s) === JSON.stringify(before.s), { before:before.s, after:after.s });
check("the main save, the XP store and the Builder store were not written", after.save === before.save && after.xp === before.xp && after.builder === before.builder, { saveSame:after.save === before.save, xpSame:after.xp === before.xp });
check("the only new storage keys belong to the voice layer (" + changed.join(", ") + ")", changed.every(k => /^gei(DamIte|Beaver|Milestone|Voice)/i.test(k)), changed);

console.log("V6 spoken fallback when the recording cannot play");
const fb = await h.page.evaluate(async () => {
  const utt = []; const synth = { cancel(){}, speak(u){ utt.push({ text:u.text, pitch:u.pitch, rate:u.rate, vol:u.volume, voice:u.voice && u.voice.lang }); }, getVoices(){ return [{ lang:"fr-FR", name:"F" }, { lang:"en-GB", name:"E" }]; } };
  const keepS = window.speechSynthesis, keepU = window.SpeechSynthesisUtterance, keepP = HTMLMediaElement.prototype.play;
  Object.defineProperty(window, "speechSynthesis", { value:synth, configurable:true }); window.SpeechSynthesisUtterance = function (t) { this.text = t; };
  HTMLMediaElement.prototype.play = () => Promise.reject(new Error("blocked"));
  let ok; try { ok = GEI_MILESTONE_VOICE.announce("dam", { direct:true, force:true }); } catch (e) { ok = "threw " + e.message; }
  await new Promise(r => setTimeout(r, 600));
  HTMLMediaElement.prototype.play = keepP; window.SpeechSynthesisUtterance = keepU; Object.defineProperty(window, "speechSynthesis", { value:keepS, configurable:true });
  return { ok, utt };
});
check("a blocked recording falls back to speechSynthesis: spoken label, raised pitch (> 1.05), slower rate (< 1), English voice", fb.utt.length === 1 && /dam/i.test(fb.utt[0].text) && fb.utt[0].pitch > 1.05 && fb.utt[0].rate < 1 && /^en/i.test(fb.utt[0].voice || ""), fb);
check("no page errors", h.errors.length === 0, h.errors);
await h.close();
console.log("\n" + passed + " passed, " + failed + " failed");
await done(); process.exit(failed ? 1 : 0);
