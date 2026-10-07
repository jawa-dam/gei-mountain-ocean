/* V2.2.6 — HYDRAULIC VICTORY CAPSULE 💧🏆  "LEVEL COMPLETE → FLOW FORWARD"
 *
 * The Level Complete card (index.html #levelCard / showLevelComplete) used to be a tall, scrolling report
 * (.levelInner overflow:auto: eyebrow, title, stage, name, congrats, FL OZ, rescue card, quip, journey chain, wallet box,
 * CONTINUE, note). On a phone the player had to scroll to reach CONTINUE.
 *
 * This module recomposes the SAME elements into a compact capsule that is sized from the available viewport:
 *
 *   PRIMARY   🏆 LEVEL N COMPLETE! · hero (dam + mill + the player's active character) · 💧 +666 FL OZ · [🛟 rescue chip] ·
 *             NEXT → 🎡 BONUS WATERWHEEL · CONTINUE →
 *   SECONDARY the six-station strip (all stamped), a one-line STEM micro lesson (only when there is room), a short
 *             character chip ("WE DID IT!")
 *   OPTIONAL  ⓘ DETAILS overlay — wallet, store hint, rescue water, humor line, milestone stats, STEM. It overlays the
 *             hero area; it can never push CONTINUE down and CONTINUE stays tappable underneath it.
 *
 * Layout: the capsule NEVER scrolls (overflow hidden, no overflow-y:auto). The hero flexes to whatever height is left
 * (CSS container units on #levelCard, which already respects safe-area insets and the game's own stage size). Wide /
 * landscape containers switch to a two-zone grid (hero left, info + CONTINUE right). On portrait screens the capsule
 * sits at the bottom of the screen = thumb zone.
 *
 * FLOW FORWARD: CONTINUE does not just close the card. Water runs through the six stations, the NEXT stop lights up, the
 * capsule dissolves into a rising water wipe, and ~0.75 s later the ORIGINAL handler runs (WOW scene → Dam Map milestone →
 * Bonus Waterwheel → next level are all untouched; this module only delays the first click once per card). A second tap
 * skips the flow instantly; nothing waits for an animation, a voice line or a reward pop before CONTINUE works.
 *
 * MILESTONE FLOW ENGINE (V2.2.4 enhancement): every MILESTONE_SIZE (6) levels form a milestone, derived dynamically from the
 * game's own state.level (milestoneFor()). The old six-station strip became a MINIATURE DAM — six water tanks that fill as the
 * milestone's levels are completed (fill animates in AFTER the completion state shows), with "MILESTONE n · LEVEL x/6", a
 * "N MORE TO GO!" countdown (count is always computed, only the supporting phrase is randomised), an escalating excitement ramp
 * (calm → full celebration) and, on the last level of a milestone, charge → water rises → dam releases → MILESTONE COMPLETE →
 * NEXT CHALLENGE UNLOCKED, handed on to the existing Dam Map milestone screen (its flow paths light up, water flows to the next level).
 *
 * Presentation only: never reads or writes progress, FL OZ, XP, purchases, entitlements, ownership or storage, and never
 * creates a second reward / character / progression system. Audio reuses damVoice / damNoise (SFX bus → master volume +
 * mute) and is a couple of tiny cues. prefers-reduced-motion: no motion, a glowing path station → next stop, 0.38 s.
 */
(function(){
  "use strict";
  if(window.__GEI_VICTORY_CAPSULE__) return;
  var VERSION = "V2.2.6";
  var FLOW_MS = 460, FLOW_MS_REDUCED = 360;

  /* ---------- milestone model: derived from the game's level, never stored, never hard-coded per milestone ---------- */
  var MILESTONE_SIZE = 6;
  /* optional identity per milestone number (1-based); extend with window.__GEI_VICTORY_CAPSULE__.registerMilestone(id, {title, badge, nextChallenge}) */
  var MILESTONE_META = { 1:{ title:"FOUNDATION" }, 6:{ title:"DAM-ITE" }, 11:{ title:"MASTER CONTROL" } };
  function milestoneFor(level){
    level = Math.max(1, Math.floor(Number(level)) || 1);
    var index = Math.floor((level - 1) / MILESTONE_SIZE);
    var start = index * MILESTONE_SIZE + 1, end = start + MILESTONE_SIZE - 1;
    return { level:level, size:MILESTONE_SIZE, index:index, number:index + 1, start:start, end:end, within:level - start + 1, remaining:end - level,
      complete:level === end, nextNumber:index + 2, nextStart:end + 1, nextEnd:end + MILESTONE_SIZE, meta:MILESTONE_META[index + 1] || null };
  }
  /* headline = always the exact count; the supporting line is picked from a small pool (never the same twice in a row) */
  var HEAD_ICON = { 5:"💧", 4:"🌊", 3:"⚡", 2:"🚀" };
  var SUPPORT = {
    5:[ function(m){ return "Complete " + m.remaining + " more levels to unlock the next challenge!"; }, "The flow is just getting started!", "Keep building the flow!" ],
    4:[ "Keep the water moving!", "The dam is filling!", "Keep the flow moving!" ],
    3:[ "You're gaining momentum!", "You're building momentum!", "The next challenge is closer!" ],
    2:[ "The next challenge is getting closer!", "Almost there!", "Keep pushing the flow!" ],
    1:[ "Your next challenge is waiting!", "One level away!", "The dam is almost full!" ],
    0:[ "NEXT CHALLENGE UNLOCKED!", "You filled the dam!", function(m){ return "Levels " + m.nextStart + "–" + m.nextEnd + " are next!"; } ]
  };
  var GUIDE_SAY = { 5:["WE JUST STARTED!"], 4:["THE DAM IS FILLING!"], 3:["WE'RE GETTING CLOSER!"], 2:["ALMOST THERE!"], 1:["ONE MORE!"], 0:["WE DID IT!"] };
  function remKey(m){ return Math.max(0, Math.min(5, m.remaining)); }
  function headline(m){
    if(m.complete) return "🏆 MILESTONE COMPLETE!";
    if(m.remaining === 1) return "🔥 ONE MORE!";
    return (HEAD_ICON[Math.min(5, m.remaining)] || "💧") + " " + m.remaining + " MORE TO GO!";
  }
  var lastPick = {};
  function pick(pool, m, tag){
    var i = Math.floor(Math.random() * pool.length);
    if(pool.length > 1 && lastPick[tag] === i) i = (i + 1) % pool.length;
    lastPick[tag] = i;
    var v = pool[i]; return typeof v === "function" ? v(m) : v;
  }
  var STEM = [
    "STEM: Gravity moves water downhill.",
    "STEM: Dams store water and hold back its pressure.",
    "STEM: A reservoir keeps water ready for later.",
    "STEM: A sluice gate controls how fast water flows.",
    "STEM: Moving water can turn a wheel and make energy.",
    "STEM: Machines use that energy to do work."
  ];

  var S = { card:null, inner:null, btn:null, shown:false, flowing:false, flowDone:false, passing:false, timers:[], open:false, mounted:false, stemI:0, m:null, lastSeg:null, charId:"" };

  function $(id){ return document.getElementById(id); }
  function q(sel, ctx){ return (ctx || document).querySelector(sel); }
  function reduced(){ try{ return matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } }
  function later(fn, ms){ var id = setTimeout(function(){ var i = S.timers.indexOf(id); if(i >= 0) S.timers.splice(i, 1); try{ fn(); }catch(e){} }, ms); S.timers.push(id); return id; }
  function clearTimers(){ S.timers.forEach(clearTimeout); S.timers = []; }
  function el(tag, cls, text){ var e = document.createElement(tag); if(cls) e.className = cls; if(text != null) e.textContent = text; return e; }
  function st(){ try{ return typeof state !== "undefined" ? state : null; }catch(e){ return null; } }
  function muted(){ try{ return !!(window.GEI_AUDIO && window.GEI_AUDIO.muted); }catch(e){ return false; } }
  function fmtN(n){ try{ return typeof fmt === "function" ? fmt(n) : String(n); }catch(e){ return String(n); } }

  /* ---------- audio: the capsule only announces what is on screen; achievement-audio-director-v227.js decides what to hear.
     Without the director the original two tiny synth cues remain. ---------- */
  function emit(type, detail){
    if(window.__GEI_ACHIEVEMENT_DIRECTOR__){ try{ var d = { type:type }; if(detail) for(var k in detail) d[k] = detail[k]; window.dispatchEvent(new CustomEvent("gei:achievement", { detail:d })); }catch(e){} return; }
    sound(type === "continue" ? "flow" : type === "arrive" ? "next" : type === "xp" || type === "release" ? "reward" : "", !!(detail && detail.gesture));
  }
  function sound(kind, gesture){
    if(muted() || !kind) return;
    var V = window.damVoice, N = window.damNoise, g = !!gesture;
    try{
      if(kind === "reward" && typeof V === "function"){ V({ freq:1318, time:.09, gain:.008, gesture:g, priority:0 }); V({ freq:1760, time:.12, gain:.006, delay:.07, gesture:g, priority:0 }); }
      else if(kind === "flow" && typeof N === "function") N({ dur:.7, from:300, to:1500, gain:.02, filter:"lowpass", gesture:g });
      else if(kind === "next" && typeof V === "function"){ V({ freq:880, time:.1, gain:.01, gesture:g, priority:0 }); V({ freq:1175, time:.16, gain:.009, delay:.08, gesture:g, priority:0 }); }
    }catch(e){}
  }

  /* ---------- styles ---------- */
  function css(){
    if($("geiVictoryCapsule226Style")) return;
    var s = document.createElement("style");
    s.id = "geiVictoryCapsule226Style";
    var C = "#levelCard", I = "#levelCard #levelInner";
    var mix = function(c, p){ return "color-mix(in srgb," + c + " " + p + "%,transparent)"; };
    s.textContent = [
      /* the card is the measuring container: its size already excludes the safe-area padding and follows the game's stage */
      C+"{container:hvc/size}",
      "@media (orientation:portrait){"+C+"{align-items:flex-end}}",   /* portrait = thumb zone */
      /* the game confines the card to its phone-shaped app column on desktop; on wide viewports lift it to the full stage so the capsule can use the horizontal space */
      "@media (min-width:760px) and (min-aspect-ratio:6/5){"+C+"{position:fixed}}",

      /* ===== capsule shell: NO scrolling, ever ===== */
      I+"{display:flex;flex-direction:column;gap:clamp(6px,1.5cqh,12px);width:100%;max-width:min(480px,100%);height:auto;max-height:100%;overflow:hidden;box-sizing:border-box;"+
        "padding:clamp(12px,2.3cqh,18px) clamp(12px,3.6cqw,18px) clamp(12px,2.1cqh,16px);border-radius:26px;text-align:center;"+
        "box-shadow:0 0 60px "+mix("var(--water-bright)",40)+",0 0 100px "+mix("var(--juicy-magenta)",22)+",inset 0 1px 0 rgba(255,255,255,.45),inset 0 -14px 26px "+mix("var(--water-bright)",12)+"}",
      I+"::before{content:'';position:absolute;left:14px;right:14px;top:0;height:3px;border-radius:0 0 3px 3px;pointer-events:none;"+
        "background:linear-gradient(90deg,transparent,var(--water-bright),var(--foam),var(--water-bright),transparent);background-size:200% 100%;animation:hvcLine 3.2s linear infinite}",
      /* the old stacked report pieces: kept in the DOM for the systems that read them, folded into the capsule or the details overlay */
      I+" > .lcEyebrow,"+I+" .lcCharName,"+I+" .lcCharTitle,"+I+" .lcCongrats,"+I+" .lcQuip,"+I+" .lcChain,"+I+" .lcSong,"+I+" .lcNote{display:none!important}",

      /* while the card is hidden its contents are visibility:hidden (after the fade-out). Otherwise other systems that build "keep clear" rects from visible buttons
         (the surprise-cameo placer ignores an element's own opacity only) would count the hidden capsule's full-width CONTINUE and ⓘ and crowd out the menu. */
      C+":not(.show) #levelInner{visibility:hidden;transition:transform .6s cubic-bezier(.34,1.56,.64,1),visibility 0s linear .5s}",
      C+".show #levelInner{visibility:visible;transition:transform .6s cubic-bezier(.34,1.56,.64,1),visibility 0s}",

      /* the DAM-ITE voice caption is anchored to the bottom of the screen — exactly where the capsule's reward / next stop / CONTINUE live; while the capsule is up it moves to the top edge (it is pointer-events:none either way) */
      "html.hvcOpen .v2197ContextToast{bottom:auto!important;top:calc(env(safe-area-inset-top) + 8px)}",

      /* ===== head ===== */
      I+" .hvcHead{flex:none;position:relative;padding:0 40px}",
      I+" .lcLevel{margin:0;font-size:clamp(1.02rem,min(5.3cqw,5cqh),2rem);line-height:1.1;letter-spacing:.015em;text-transform:uppercase;white-space:nowrap}",
      I+" .lcLevel::before{content:'🏆 '}",
      I+" .hvcSub{margin-top:3px;font-size:clamp(.74rem,min(3.4cqw,2.8cqh),.95rem);font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);text-shadow:0 0 12px "+mix("var(--gold)",50)+"}",
      I+" .hvcInfo{position:absolute;right:-8px;top:-4px;width:44px;height:44px;border:0;padding:0;background:transparent;color:#fff;cursor:pointer;display:grid;place-items:center;z-index:6}",
      I+" .hvcInfo span{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;font:900 15px/1 system-ui,sans-serif;border:1.5px solid rgba(255,255,255,.55);background:rgba(2,10,24,.45)}",

      /* ===== hero: compact station image + the player's character, flexes with the available height ===== */
      I+" .hvcHero{position:relative;flex:0 1 auto;height:clamp(64px,29cqh,250px);min-height:54px;border-radius:20px;overflow:hidden;"+
        "background:radial-gradient(120% 90% at 50% 100%,"+mix("var(--water-bright)",30)+",rgba(3,12,30,.55) 70%);border:1px solid rgba(255,255,255,.26);"+
        "box-shadow:inset 0 0 24px "+mix("var(--water-bright)",26)+",inset 0 -2px 0 "+mix("var(--foam)",30)+"}",
      I+" .hvcHero .lcStage{position:absolute;inset:0;height:auto;max-width:none;margin:0}",
      I+" .hvcHero .lcGlow{inset:-10% 8%}",
      I+" .hvcHero .lcChar{height:88%;max-width:70%;font-size:clamp(2.2rem,12cqh,4.4rem)}",
      I+" .hvcHero .lcCharImg{height:100%;width:auto;max-width:100%}",
      I+" .hvcHero::after{content:'';position:absolute;left:0;right:0;bottom:0;height:7px;pointer-events:none;"+
        "background:linear-gradient(90deg,transparent,"+mix("var(--foam)",70)+",transparent),linear-gradient(0deg,"+mix("var(--water-bright)",55)+",transparent);background-size:200% 100%,100% 100%;animation:hvcLine 4s linear infinite}",
      I+" .hvcMedal{position:absolute;right:8px;top:8px;z-index:4;min-width:38px;height:38px;padding:0 6px;border-radius:19px;display:grid;place-items:center;box-sizing:border-box;"+
        "font:900 14px/1 system-ui,sans-serif;color:#06142a;background:radial-gradient(circle at 35% 28%,#fff,hsl(calc(var(--hvc-h,200)*1deg) 90% 62%) 55%,hsl(calc(var(--hvc-h,200)*1deg) 70% 40%));"+
        "border:2px solid rgba(255,255,255,.8);box-shadow:0 0 14px hsl(calc(var(--hvc-h,200)*1deg) 90% 60% / .75)}",
      I+" .hvcMedal small{display:block;font-size:8px;letter-spacing:.1em;margin-bottom:-1px}",
      I+" .hvcSay{position:absolute;left:8px;top:8px;z-index:5;display:flex;align-items:center;gap:6px;max-width:70%;padding:4px 10px 4px 6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;border-radius:14px;pointer-events:none;"+
        "background:rgba(2,10,24,.78);border:1px solid "+mix("var(--foam)",40)+";color:#fff;font:900 clamp(.72rem,3.1cqw,.9rem)/1.15 system-ui,sans-serif;letter-spacing:.04em;opacity:0;transform:translateY(-4px) scale(.95);transition:opacity .3s ease,transform .3s ease}",
      I+" .hvcSay.on{opacity:1;transform:none}",
      I+" .hvcSay img{width:24px;height:24px;border-radius:50%;object-fit:cover;display:none}",
      C+".milestone .hvcSay img{display:block}",
      /* milestone: the 4 artworks become a compact pile in the hero */
      I+" .hvcHero .milestoneCelebration{position:absolute;inset:0;margin:0;padding:0;border:0;border-radius:0;background:none;box-shadow:none;display:none}",
      C+".milestone #levelInner .hvcHero .milestoneCelebration{display:block}",
      I+" .hvcHero .milestoneTitle,"+I+" .hvcHero .milestoneSub{display:none}",
      I+" .hvcHero .milestoneArt{position:absolute;inset:6px 0 6px 52%;height:auto;max-width:none;margin:0}",
      I+" .hvcHero .milestoneArt img{height:88%;width:auto;max-width:90%;font-size:0;color:transparent}",
      C+".milestone #levelInner .hvcHero .lcStage{display:block;right:46%}",   /* the dam + mill + the player's character stay in the hero on milestones too */

      /* ===== MILESTONE DAM: six water tanks that fill as the milestone's levels are completed ===== */
      I+" .hvcMile{flex:none;display:flex;flex-direction:column;gap:3px}",
      I+" .hvcMileLbl{font-size:clamp(.74rem,min(3.4cqw,2.8cqh),.95rem);font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);text-shadow:0 0 12px "+mix("var(--gold)",50)+";white-space:nowrap}",
      I+" .hvcBar{flex:none;position:relative;display:flex;align-items:center;gap:7px;height:clamp(26px,4.8cqh,36px);padding:0 2px}",
      I+" .hvcDrop{flex:none;font-size:clamp(15px,min(5cqw,3.4cqh),21px);line-height:1;filter:drop-shadow(0 0 6px var(--water-bright));animation:hvcDripIcon 4.6s ease-in-out infinite}",
      I+" .hvcDam{flex:1 1 auto;min-width:0;position:relative;display:grid;grid-template-columns:repeat(6,1fr);gap:3px;height:100%;padding:3px;box-sizing:border-box;border-radius:11px;"+
        "background:linear-gradient(180deg,rgba(2,10,24,.8),rgba(8,24,52,.7));border:1.5px solid rgba(255,255,255,.32);"+
        "box-shadow:inset 0 2px 7px rgba(0,0,0,.55),0 0 var(--hvc-glow,8px) "+mix("var(--water-bright)",55)+"}",
      I+" .hvcSeg{position:relative;overflow:hidden;border-radius:6px;background:rgba(255,255,255,.07);box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)}",
      I+" .hvcSeg::after{content:'';position:absolute;inset:0;pointer-events:none;border-radius:inherit;background:linear-gradient(100deg,rgba(255,255,255,.42),rgba(255,255,255,0) 38%,rgba(255,255,255,0) 70%,rgba(255,255,255,.14))}",
      I+" .hvcWater{position:absolute;inset:0;transform:scaleY(0);transform-origin:50% 100%;border-radius:inherit;background:linear-gradient(180deg,var(--foam) 0,var(--water-bright) 30%,var(--juicy-blue) 100%);transition:transform .75s cubic-bezier(.3,.9,.3,1)}",
      I+" .hvcSeg.f .hvcWater{transform:scaleY(1)}",
      I+" .hvcSet .hvcWater{transition:none!important}",
      /* moving water: a wave crest sliding along the surface + two rising bubbles */
      I+" .hvcWater::before{content:'';position:absolute;left:-14px;right:-14px;top:-1px;height:7px;background:radial-gradient(7px 5px at 7px 5px,var(--foam) 96%,transparent) repeat-x 0 0/14px 7px;opacity:.9;animation:hvcWave var(--hvc-wave,3.2s) linear infinite}",
      I+" .hvcWater::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 30% 82%,rgba(255,255,255,.95) 0 1.3px,transparent 1.9px),radial-gradient(circle at 70% 64%,rgba(255,255,255,.85) 0 1.1px,transparent 1.7px);animation:hvcBub calc(var(--hvc-wave,3.2s)*.8) ease-in infinite}",
      I+" .hvcSeg.lock{animation:hvcLock .8s ease-out}",
      I+" .hvcNode{flex:none;position:relative;width:clamp(26px,min(8.4cqw,5.4cqh),36px);height:clamp(26px,min(8.4cqw,5.4cqh),36px);border-radius:50%;display:grid;place-items:center;box-sizing:border-box;"+
        "font-size:clamp(13px,min(4.2cqw,2.8cqh),18px);line-height:1;background:rgba(2,10,24,.5);border:1.5px dashed "+mix("var(--foam)",65)+";opacity:.85;z-index:1}",
      I+" .hvcNode.lit{opacity:1;border-style:solid;border-color:var(--gold);background:radial-gradient(circle,"+mix("var(--gold)",55)+",rgba(2,10,24,.5));box-shadow:0 0 18px "+mix("var(--gold)",75)+"}",
      /* escalating excitement: wave speed, glow, anticipation pulse */
      C+".hvcT1{--hvc-wave:3.6s;--hvc-glow:6px}",
      C+".hvcT2{--hvc-wave:3s;--hvc-glow:9px}",
      C+".hvcT3{--hvc-wave:2.4s;--hvc-glow:12px}",
      C+".hvcT4{--hvc-wave:1.9s;--hvc-glow:16px}",
      C+".hvcT5{--hvc-wave:1.4s;--hvc-glow:20px}",
      C+".hvcT6{--hvc-wave:1s;--hvc-glow:26px}",
      C+".hvcT4 #levelInner .hvcDam,"+C+".hvcT5 #levelInner .hvcDam{animation:hvcAnt 1.9s ease-in-out infinite}",
      C+".hvcT5 #levelInner .hvcDam{animation-duration:1.1s}",
      C+".hvcT5 #levelInner .hvcSeg.f .hvcWater,"+C+".hvcT6 #levelInner .hvcSeg.f .hvcWater{background:linear-gradient(180deg,#fff 0,var(--foam) 22%,var(--water-bright) 55%,var(--juicy-blue) 100%)}",
      /* the dam is full: charged → water rises → releases */
      I+" .hvcDam::before{content:'';position:absolute;inset:3px;border-radius:7px;pointer-events:none;opacity:0;transform:scaleY(0);transform-origin:50% 100%;z-index:2;"+
        "background:linear-gradient(180deg,#fff,"+mix("var(--gold)",70)+" 30%,"+mix("var(--water-bright)",70)+")}",
      I+" .hvcCharged .hvcSeg.f{box-shadow:inset 0 0 0 1px "+mix("var(--gold)",90)+",0 0 10px "+mix("var(--gold)",80)+"}",
      I+" .hvcRise .hvcDam::before{animation:hvcRise .5s cubic-bezier(.3,.8,.3,1) forwards}",
      I+" .hvcRelease .hvcDam{animation:hvcGush .6s ease-out}",
      I+" .hvcDone .hvcDam{border-color:"+mix("var(--gold)",85)+";box-shadow:inset 0 2px 7px rgba(0,0,0,.45),0 0 26px "+mix("var(--gold)",60)+",0 0 14px "+mix("var(--water-bright)",70)+"}",
      I+" .hvcBurst{position:absolute;left:50%;top:50%;width:0;height:0;pointer-events:none;z-index:7}",
      I+" .hvcBurst i{position:absolute;left:-3px;top:-5px;width:6px;height:10px;border-radius:70% 70% 60% 60%;background:linear-gradient(160deg,#fff,var(--water-bright));box-shadow:0 0 8px var(--water-bright);opacity:0;animation:hvcSplash .95s cubic-bezier(.15,.7,.3,1) forwards}",

      /* ===== countdown message: "5 MORE TO GO!" — a challenge, not a statistic ===== */
      I+" .hvcMsg{flex:none;line-height:1.1}",
      I+" .hvcMsgMain{font-size:clamp(1.02rem,min(5.4cqw,4.2cqh),1.45rem);font-weight:900;letter-spacing:.05em;text-transform:uppercase;color:var(--foam);text-shadow:0 0 14px "+mix("var(--water-bright)",65)+"}",
      I+" .hvcMsgSub{margin-top:2px;font-size:clamp(.72rem,3.1cqw,.88rem);font-weight:800;letter-spacing:.02em;color:rgba(255,255,255,.82)}",
      C+".hvcT5 #levelInner .hvcMsgMain{color:#ffb454;text-shadow:0 0 16px "+mix("#ff8a2a",70)+"}",
      C+".hvcMsDone #levelInner .hvcMsgMain,"+C+".hvcT6 #levelInner .hvcMsgMain{color:var(--gold);text-shadow:0 0 18px "+mix("var(--gold)",80)+"}",
      "@container hvc (max-height:560px){"+I+" .hvcMsgSub{display:none}}",

      /* ===== rewards: chips, not paragraphs ===== */
      I+" .hvcRewards{flex:none;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:6px 8px}",
      I+" .hvcRewards .lcOz{margin:0;padding:5px 14px;border-radius:999px;font-size:clamp(.92rem,min(4.3cqw,3.6cqh),1.2rem);line-height:1.15;white-space:nowrap;background:"+mix("var(--gold)",14)+";border:1.5px solid "+mix("var(--gold)",70)+"}",
      I+" .hvcRewards .lcOz::before{content:'💧 +'}",
      I+" .hvcRewards .lcOzNum{font-size:1.12em;animation:none}",
      I+" .hvcRewards .lcRescue,"+I+" .hvcRewards .lcRescue.tl92Rescue{margin:0;padding:3px 12px 3px 4px;border-radius:999px;display:flex;flex-direction:row!important;align-items:center;text-align:left;gap:6px;background:rgba(255,255,255,.1);border:1.5px solid "+mix("var(--foam)",50)+";max-width:100%;min-height:36px}",
      I+" .hvcRewards .tl92Hint,"+I+" .hvcRewards .iteBadge,"+I+" .hvcRewards .lcRescueAvatar *::before,"+I+" .hvcRewards .lcRescueAvatar *::after{display:none!important}",
      I+" .hvcRewards .tl92Rescue .lcRescueText{text-align:left}",
      I+" .hvcRewards .lcRescue[hidden]{display:none}",
      I+" .hvcRewards .lcRescueAvatar{flex:none;width:30px;height:30px;overflow:hidden}",
      I+" .hvcRewards .lcRescueAvatar .iteAvatar{--iteSize:30px!important}",
      I+" .hvcRewards .lcRescueTitle,"+I+" .hvcRewards .lcRescueWater,"+I+" .hvcRewards .lcRescueNote{display:none}",
      I+" .hvcRewards .lcRescueText{min-width:0}",
      I+" .hvcRewards .lcRescueName{margin:0;font:900 clamp(.78rem,3.4cqw,.92rem)/1.1 system-ui,sans-serif;letter-spacing:.03em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",

      /* ===== next stop + micro lesson ===== */
      I+" .hvcNext{flex:none;font-size:clamp(.82rem,min(3.9cqw,3cqh),1.05rem);font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:var(--foam)}",
      I+" .hvcNext b{color:var(--gold)}",
      I+" .hvcNext small{display:block;margin-top:1px;font-size:.78em;font-weight:800;letter-spacing:.04em;opacity:.8;text-transform:none}",
      I+" .hvcStem{flex:none;display:none;font-size:clamp(.76rem,3.2cqw,.9rem);font-weight:700;color:rgba(255,255,255,.82)}",
      "@container hvc (min-height:660px){"+I+" .hvcStem{display:block}}",

      /* ===== dock: CONTINUE is dominant and always last ===== */
      I+" .hvcDock{flex:none;display:block;padding-top:4px}",
      I+" .lcBtn{display:block;width:100%;min-height:clamp(54px,8.2cqh,66px);padding:0 18px;margin:0;border-radius:18px;font-size:clamp(1.05rem,min(5.2cqw,4.4cqh),1.35rem);letter-spacing:.06em;touch-action:manipulation;"+
        "animation:hvcBtn 2.6s ease-in-out infinite}",
      I+" .lcBtn:focus-visible{outline:3px solid #fff;outline-offset:3px}",

      /* ===== optional details overlay (never moves CONTINUE) ===== */
      I+" .hvcPanel{position:absolute;left:10px;right:10px;top:54px;bottom:calc(var(--hvc-dock,92px) + 12px);z-index:5;display:none;flex-direction:column;gap:6px;padding:10px 12px;border-radius:18px;overflow:hidden;text-align:left;cursor:pointer;"+
        "background:linear-gradient(165deg,rgba(6,18,40,.985),rgba(14,10,40,.985));border:1.5px solid "+mix("var(--water-bright)",55)+";font-size:clamp(.78rem,min(3.5cqw,2.7cqh),.95rem);line-height:1.3}",
      I+" .hvcPanel.on{display:flex}",
      I+" .hvcPanel h3{margin:0;font:900 .8em/1.1 system-ui,sans-serif;letter-spacing:.12em;color:var(--gold)}",
      I+" .hvcPanel p{margin:0;color:rgba(255,255,255,.9)}",
      I+" .hvcPanel p b{color:var(--gold)}",

      /* ===== flow forward ===== */
      C+" .hvcFlood{position:absolute;inset:0;z-index:4;overflow:hidden;pointer-events:none}",
      C+" .hvcFlood i{position:absolute;left:-10%;right:-10%;top:0;height:70%;opacity:0;border-radius:50% 50% 0 0/14% 14% 0 0;transform:translateY(100%);"+
        "background:radial-gradient(60% 40% at 30% 12%,"+mix("var(--foam)",40)+",transparent),radial-gradient(60% 40% at 72% 8%,"+mix("var(--foam)",30)+",transparent),linear-gradient(180deg,"+mix("var(--water-bright)",55)+","+mix("var(--water-bright)",20)+" 60%,transparent)}",
      C+".hvcDissolve .hvcFlood i{animation:hvcFlood .6s cubic-bezier(.3,.7,.3,1) forwards}",
      C+".hvcDissolve #levelInner{animation:hvcDissolve .26s ease-in forwards}",
      I+".hvcFlowing .hvcSeg.f .hvcWater{animation:hvcWake .34s ease-out calc(var(--i)*42ms)}",
      I+".hvcFlowing .hvcBar{filter:drop-shadow(0 0 7px "+mix("var(--water-bright)",75)+")}",
      I+".hvcFlowing .lcBtn{animation:none;filter:brightness(1.1)}",

      /* ===== entry celebration: fast, non-blocking (CONTINUE works from t = 0) ===== */
      C+".hvcIn #levelInner .lcLevel{animation:hvcPop .5s cubic-bezier(.34,1.56,.64,1) .05s both}",
      C+".hvcIn #levelInner .hvcSub{animation:hvcFade .4s ease .25s both}",
      C+".hvcIn #levelInner .hvcHero{animation:hvcHero .55s cubic-bezier(.34,1.56,.64,1) .1s both}",
      C+".hvcIn #levelInner .hvcMedal{animation:hvcSpin .7s cubic-bezier(.34,1.56,.64,1) .35s both}",
      C+".hvcIn #levelInner .hvcMile{animation:hvcFade .4s ease .45s both}",
      C+".hvcIn #levelInner .hvcMsg{animation:hvcPop .45s cubic-bezier(.34,1.56,.64,1) .8s both}",
      C+".hvcMsDone.hvcIn #levelInner .hvcMsg{animation-delay:1.55s}",
      C+".hvcIn #levelInner .hvcRewards .lcOz{animation:hvcPop .45s cubic-bezier(.34,1.56,.64,1) .5s both}",
      C+".hvcIn #levelInner .hvcRewards .lcRescue{animation:hvcPop .45s cubic-bezier(.34,1.56,.64,1) .68s both}",
      C+".hvcIn #levelInner .hvcNext,"+C+".hvcIn #levelInner .hvcStem{animation:hvcFade .4s ease 1s both}",

      "@keyframes hvcLine{to{background-position:200% 0,0 0}}",
      "@keyframes hvcBtn{0%,100%{box-shadow:0 0 22px "+mix("var(--gold)",50)+",inset 0 1px 0 rgba(255,255,255,.7)}50%{box-shadow:0 0 34px "+mix("var(--gold)",80)+",inset 0 1px 0 rgba(255,255,255,.7)}}",
      "@keyframes hvcPop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}",
      "@keyframes hvcFade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}",
      "@keyframes hvcHero{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:none}}",
      "@keyframes hvcSpin{from{opacity:0;transform:rotate(-200deg) scale(.2)}to{opacity:1;transform:none}}",
      C+".hvcWow #levelInner{animation:hvcWowGlow 1.6s ease-out .2s 1}",
      "@keyframes hvcWowGlow{0%,100%{filter:none}35%{filter:brightness(1.18) saturate(1.3) drop-shadow(0 0 18px "+mix("var(--gold)",80)+")}}",
      "@keyframes hvcWave{to{transform:translateX(14px)}}",
      "@keyframes hvcBub{0%{transform:translateY(45%);opacity:0}25%{opacity:1}100%{transform:translateY(-70%);opacity:0}}",
      "@keyframes hvcDripIcon{0%,78%,100%{transform:translateY(0) scale(1);opacity:1}86%{transform:translateY(5px) scale(.85);opacity:.55}93%{transform:translateY(-2px) scale(1.12);opacity:1}}",
      "@keyframes hvcLock{0%{filter:brightness(2.4);transform:scale(1.14);box-shadow:0 0 16px var(--water-bright)}100%{filter:none;transform:none}}",
      "@keyframes hvcAnt{0%,100%{box-shadow:inset 0 2px 7px rgba(0,0,0,.55),0 0 var(--hvc-glow,8px) "+mix("var(--water-bright)",55)+"}50%{box-shadow:inset 0 2px 7px rgba(0,0,0,.55),0 0 calc(var(--hvc-glow,8px)*1.9) "+mix("var(--water-bright)",90)+"}}",
      "@keyframes hvcRise{0%{opacity:.95;transform:scaleY(0)}70%{opacity:.95;transform:scaleY(1)}100%{opacity:0;transform:scaleY(1)}}",
      "@keyframes hvcGush{0%{transform:scale(1)}30%{transform:scale(1.045,1.2)}100%{transform:scale(1)}}",
      "@keyframes hvcSplash{0%{opacity:1;transform:translate(0,0) scale(.7)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.1)}}",
      "@keyframes hvcMsPulse{0%{transform:scale(1)}40%{transform:scale(1.035)}100%{transform:scale(1)}}",
      "@keyframes hvcWake{0%{filter:brightness(1)}45%{filter:brightness(1.7)}100%{filter:brightness(1)}}",
      "@keyframes hvcFlood{0%{opacity:.95;transform:translateY(100%)}60%{opacity:.9}100%{opacity:0;transform:translateY(-35%)}}",
      "@keyframes hvcDissolve{to{opacity:0;transform:translateY(-14px) scale(.95);filter:blur(2px)}}",

      /* ===== two-zone composition for wide / landscape containers ===== */
      "@container hvc (min-aspect-ratio:6/5){"+
        I+"{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(0,1fr);grid-template-rows:auto auto auto auto auto 1fr;column-gap:clamp(12px,2.4cqw,24px);row-gap:clamp(5px,1.6cqh,12px);max-width:min(900px,100%);align-items:start}"+
        I+" .hvcHero{grid-column:1;grid-row:1/-1;height:auto;align-self:stretch;min-height:0}"+
        I+" .hvcHead{padding:0 40px}"+
        I+" .lcLevel{font-size:clamp(1rem,min(1.75cqw,5cqh),1.55rem)}"+
        I+" .hvcHead{grid-column:2;grid-row:1}"+
        I+" .hvcRewards{grid-column:2;grid-row:2}"+
        I+" .hvcMile{grid-column:2;grid-row:3}"+
        I+" .hvcMsg{grid-column:2;grid-row:4}"+
        I+" .hvcNext{grid-column:2;grid-row:5}"+
        I+" .hvcStem{grid-column:2;grid-row:6;display:none}"+
        I+" .hvcDock{grid-column:2;grid-row:6;align-self:end}"+
        I+" .hvcPanel{left:calc(var(--hvc-left,0px) + 10px)}"+
      "}",
      "@container hvc (max-width:340px){"+I+" .hvcHead{padding:0 38px}"+I+" .lcLevel{font-size:.92rem}"+I+" .hvcSub{letter-spacing:.06em}}",

      /* ===== DAM MAP hand-off: the completed path glows, the next journey is announced ===== */
      "#geiDamMapPage.hvcMapFlow .dmwFlow.lit{opacity:1;animation:dmwFlow 1.1s linear infinite}",
      "#geiDamMapPage.hvcMapFlow #dmwSt0{animation:hvcMapNext 1.3s ease-in-out infinite}",
      "#geiDamMapPage .hvcMapDam{display:grid;grid-template-columns:repeat(6,1fr);gap:3px;height:12px;margin:10px auto 2px;max-width:220px;padding:2px;border-radius:7px;background:rgba(2,10,24,.7);border:1px solid rgba(255,255,255,.3)}",
      "#geiDamMapPage .hvcMapDam i{border-radius:3px;background:linear-gradient(180deg,#d8fbff,#2fd2ff 40%,#2a6bff);box-shadow:0 0 6px #2fd2ff}",
      "#geiDamMapPage .hvcMapNext{margin-top:6px;font-weight:900;letter-spacing:.03em;color:#ffd66b;opacity:.95}",
      "@keyframes hvcMapNext{50%{filter:drop-shadow(0 0 16px #5fe6ff) brightness(1.25)}}",

      /* ===== reduced motion: static, a glowing path from the finished station to the next stop ===== */
      "@media (prefers-reduced-motion:reduce){"+
        I+"::before,"+I+" .hvcHero::after,"+I+" .lcBtn{animation:none!important}"+
        C+".hvcIn #levelInner *,"+C+".hvcWow #levelInner{animation:none!important}"+
        C+".hvcDissolve #levelInner,"+C+".hvcDissolve .hvcFlood i{animation:none!important}"+
        "#geiDamMapPage.hvcMapFlow #dmwSt0{animation:none!important}"+
        I+" .hvcWater,"+I+" .hvcWater::before,"+I+" .hvcWater::after,"+I+" .hvcSeg,"+I+" .hvcDam,"+I+" .hvcDam::before,"+I+" .hvcDrop{animation:none!important;transition:none!important}"+
        I+" .hvcWater::after{display:none}"+
        I+".hvcFlowing .hvcSeg.f .hvcWater{animation:none}"+
        I+" .hvcSay{transition:opacity .3s ease;transform:none}"+
      "}"
    ].join("");
    document.head.appendChild(s);
  }

  /* ---------- mount: fold the old pieces into capsule groups (nodes are MOVED, never recreated, so every other system keeps its references) ---------- */
  function mount(){
    var card = $("levelCard"), inner = $("levelInner"), btn = $("lcBtn");
    if(!card || !inner || !btn) return false;
    if(S.mounted && S.inner === inner) return true;
    css();

    var head = el("div", "hvcHead");
    var lvl = $("lcLevel"); if(lvl) head.appendChild(lvl);
    var sub = el("div", "hvcSub", "STATION MASTERED"); sub.id = "hvcSub"; head.appendChild(sub);
    var info = el("button", "hvcInfo"); info.type = "button"; info.id = "hvcInfo";
    info.setAttribute("aria-label", "Show level details"); info.setAttribute("aria-expanded", "false"); info.setAttribute("aria-controls", "hvcPanel");
    info.innerHTML = "<span aria-hidden=\"true\">i</span>";
    head.appendChild(info);

    var hero = el("div", "hvcHero");
    var mc = $("milestoneCelebration"), stage = q(".lcStage", inner);
    if(mc) hero.appendChild(mc);
    if(stage) hero.appendChild(stage);
    var medal = el("div", "hvcMedal"); medal.id = "hvcMedal"; medal.setAttribute("aria-hidden", "true");
    var say = el("div", "hvcSay"); say.id = "hvcSay"; say.setAttribute("aria-hidden", "true");
    say.appendChild(el("img")); say.appendChild(el("span"));
    hero.appendChild(medal); hero.appendChild(say);

    var mile = el("div", "hvcMile");
    var lbl = el("div", "hvcMileLbl"); lbl.id = "hvcMileLbl"; mile.appendChild(lbl);
    var bar = el("div", "hvcBar"); bar.id = "hvcBar"; bar.setAttribute("role", "img");
    bar.appendChild(el("span", "hvcDrop", "💧"));
    var dam = el("div", "hvcDam");
    for(var i = 0; i < MILESTONE_SIZE; i++){ var seg = el("span", "hvcSeg"); seg.style.setProperty("--i", i); seg.appendChild(el("i", "hvcWater")); dam.appendChild(seg); }
    bar.appendChild(dam);
    var goal = el("span", "hvcNode", "🏆"); goal.id = "hvcNextNode"; goal.setAttribute("aria-hidden", "true"); bar.appendChild(goal);
    mile.appendChild(bar);
    var msg = el("div", "hvcMsg"); msg.id = "hvcMsg"; msg.setAttribute("aria-live", "polite");
    msg.appendChild(el("div", "hvcMsgMain")); msg.appendChild(el("div", "hvcMsgSub"));

    var rewards = el("div", "hvcRewards");
    var oz = q(".lcOz", inner), resc = $("lcRescue");
    if(oz) rewards.appendChild(oz);
    if(resc) rewards.appendChild(resc);

    var next = el("div", "hvcNext"); next.id = "hvcNext";
    var stem = el("div", "hvcStem"); stem.id = "hvcStem";
    var dock = el("div", "hvcDock"); dock.appendChild(btn);
    var panel = el("div", "hvcPanel"); panel.id = "hvcPanel"; panel.setAttribute("role", "note"); panel.setAttribute("aria-hidden", "true");

    /* the hidden originals stay where they are, before the capsule groups */
    [head, hero, rewards, mile, msg, next, stem, dock, panel].forEach(function(n){ inner.appendChild(n); });
    var flood = el("div", "hvcFlood"); flood.setAttribute("aria-hidden", "true"); flood.appendChild(el("i")); card.appendChild(flood);

    S.card = card; S.inner = inner; S.btn = btn; S.mounted = true;

    info.addEventListener("click", function(e){ e.stopPropagation(); togglePanel(); });
    panel.addEventListener("click", function(e){ e.stopPropagation(); closePanel(); });
    inner.addEventListener("keydown", function(e){
      if(e.key === "Escape" && S.open){ e.preventDefault(); e.stopPropagation(); closePanel(); try{ info.focus({ preventScroll:true }); }catch(x){} }
    }, true);
    /* capture on the card (ancestor) so FLOW FORWARD runs before the Dam Map / WOW hooks that sit on the button itself */
    inner.addEventListener("click", function(e){ if(e.target === btn || btn.contains(e.target)) onContinue(e); }, true);
    window.addEventListener("resize", function(){ if(S.open) fitPanel(); });

    try{
      new MutationObserver(function(){
        var on = card.classList.contains("show");
        if(on && !S.shown){ S.shown = true; onShow(); }
        else if(!on && S.shown){ S.shown = false; onHide(); }
      }).observe(card, { attributes:true, attributeFilter:["class"] });
    }catch(e){}
    if(card.classList.contains("show")){ S.shown = true; onShow(); }
    return true;
  }

  /* ---------- compose the capsule for the level that was just completed ---------- */
  function compose(){
    var s = st(), level = s && s.level ? s.level : 1;
    var milestone = S.card.classList.contains("milestone");
    var mt = q(".milestoneTitle", S.card), chapter = mt ? mt.textContent.replace(/^[^A-Za-z0-9]+/, "").trim() : "";
    $("hvcSub").textContent = milestone && chapter ? chapter : "STATION MASTERED";
    composeMilestone(level);

    var medal = $("hvcMedal"), digits = String(level).length;
    medal.innerHTML = "<span><small>LV</small>" + level + "</span>";
    medal.style.fontSize = digits > 3 ? "10px" : digits > 2 ? "12px" : "14px";
    S.card.style.setProperty("--hvc-h", String((level * 47) % 360));   // every level's token has its own tint

    var nextEl = $("hvcNext"); nextEl.innerHTML = "";
    nextEl.appendChild(document.createTextNode("NEXT → 🎡 "));
    nextEl.appendChild(el("b", "", "BONUS WATERWHEEL"));
    nextEl.appendChild(el("small", "", "then ⛰️ Level " + fmtN(level + 1)));

    S.stemI = ((level - 1) % STEM.length + STEM.length) % STEM.length;
    $("hvcStem").textContent = STEM[S.stemI];

    var btn = S.btn;
    btn.textContent = "CONTINUE →";
    btn.setAttribute("aria-label", milestone ? "Continue to the Bonus Waterwheel" : "Continue to the Bonus Waterwheel, then Level " + fmtN(level + 1));

    var c = null; try{ c = typeof getActiveCharacter === "function" ? getActiveCharacter() : null; }catch(e){}
    var say = $("hvcSay"), img = q("img", say);
    S.charId = c && c.id ? String(c.id) : "";
    if(c && c.img) img.src = c.img; else img.removeAttribute("src");
    say.lastChild.textContent = pick(GUIDE_SAY[remKey(S.m)], S.m, "say");

    buildPanel();
  }

  /* ---------- the miniature dam: state is derived from the level; the newest tank fills AFTER the completion state shows ---------- */
  function segs(){ return Array.prototype.slice.call(S.inner.querySelectorAll(".hvcSeg")); }
  function fillLatest(quiet){
    var seg = S.lastSeg; if(!seg || seg.classList.contains("f")) return;
    seg.classList.add("f");
    if(!quiet) emit("fill");
    if(!reduced()){ seg.classList.add("lock"); later(function(){ seg.classList.remove("lock"); }, 850); }
  }
  function composeMilestone(level){
    var m = S.m = milestoneFor(level), card = S.card, bar = $("hvcBar"), n = Math.min(m.within, MILESTONE_SIZE);
    for(var k = 1; k <= 6; k++) card.classList.remove("hvcT" + k);
    card.classList.add("hvcT" + Math.max(1, Math.min(6, Math.round(n * 6 / m.size))));
    card.classList.toggle("hvcMsDone", m.complete);
    bar.classList.remove("hvcCharged", "hvcRise", "hvcRelease", "hvcDone");
    bar.classList.add("hvcSet");                                   // jump to the previous state without animating
    segs().forEach(function(seg, i){ seg.classList.remove("f", "lock"); if(i < n - 1) seg.classList.add("f"); });
    void bar.offsetWidth; bar.classList.remove("hvcSet");
    S.lastSeg = segs()[n - 1] || null;
    var goal = $("hvcNextNode"); goal.classList.remove("lit"); goal.textContent = "🏆";
    bar.setAttribute("aria-label", "Milestone " + m.number + ": level " + m.within + " of " + m.size + (m.complete ? " complete, next challenge unlocked" : ", " + m.remaining + " to go"));
    $("hvcMileLbl").textContent = "MILESTONE " + m.number + " · LEVEL " + m.within + "/" + m.size;
    var msg = $("hvcMsg");
    msg.firstChild.textContent = headline(m);
    msg.lastChild.textContent = pick(SUPPORT[remKey(m)], m, "sup" + remKey(m));
  }
  function spawnBurst(){
    var bar = $("hvcBar"); if(!bar || reduced()) return;
    var box = el("div", "hvcBurst");
    for(var i = 0; i < 12; i++){
      var d = el("i"), a = (-170 + i * 15) * Math.PI / 180, r = 40 + Math.random() * 48;
      d.style.setProperty("--dx", Math.round(Math.cos(a) * r * 1.5) + "px"); d.style.setProperty("--dy", Math.round(Math.sin(a) * r) + "px");
      d.style.animationDelay = (Math.random() * .12).toFixed(2) + "s"; box.appendChild(d);
    }
    bar.appendChild(box); later(function(){ if(box.parentNode) box.parentNode.removeChild(box); }, 1200);
  }
  /* last level of a milestone: charged → water rises → dam releases → celebration → NEXT CHALLENGE UNLOCKED */
  function unlockMoment(){
    var bar = $("hvcBar"), goal = $("hvcNextNode"), card = S.card;
    bar.classList.add("hvcCharged");
    if(reduced()){ bar.classList.add("hvcDone"); goal.textContent = "🔓"; goal.classList.add("lit"); later(function(){ emit("rise"); }, 300); later(function(){ emit("release"); }, 750); return; }
    later(function(){ bar.classList.add("hvcRise"); emit("rise"); }, 300);
    later(function(){
      bar.classList.add("hvcRelease", "hvcDone"); goal.textContent = "🔓"; goal.classList.add("lit");
      spawnBurst(); emit("release");
      var msg = $("hvcMsg"); msg.style.animation = "hvcMsPulse .6s ease-out"; later(function(){ msg.style.animation = ""; }, 700);
    }, 750);
  }

  function buildPanel(){
    var p = $("hvcPanel"); p.innerHTML = "";
    p.appendChild(el("h3", "", "📋 DETAILS"));
    function row(text, strongPrefix){
      text = (text || "").trim(); if(!text) return;
      var r = el("p"); if(strongPrefix){ r.appendChild(el("b", "", strongPrefix + " ")); }
      r.appendChild(document.createTextNode(text)); p.appendChild(r);
    }
    row(q(".lcSongTitle", S.card) && q(".lcSongTitle", S.card).textContent, "💧");
    row(q(".lcSongArtist", S.card) && q(".lcSongArtist", S.card).textContent);
    var resc = $("lcRescue");
    if(resc && !resc.hidden){ row(($("lcRescueName") || {}).textContent, "🛟"); row(($("lcRescueWater") || {}).textContent); row((q(".lcRescueNote", resc) || {}).textContent); }
    Array.prototype.forEach.call(S.card.querySelectorAll(".milestoneSub"), function(m){ if(S.card.classList.contains("milestone")) row(m.textContent, "🏆"); });
    if(S.m){ var mm = S.m; row("MILESTONE " + mm.number + (mm.meta && mm.meta.title ? " · " + mm.meta.title : "") + " · LEVELS " + mm.start + "–" + mm.end + " · " + (mm.complete ? "COMPLETE" : mm.remaining + " TO GO"), "🌊"); }
    row(($("lcQuip") || {}).textContent);
    row(($("lcNote") || {}).textContent);
    row(STEM[S.stemI]);
  }

  function fitPanel(){
    var dock = q(".hvcDock", S.inner), hero = q(".hvcHero", S.inner);
    if(dock) S.inner.style.setProperty("--hvc-dock", dock.offsetHeight + "px");
    if(hero) S.inner.style.setProperty("--hvc-left", "0px");
  }
  function openPanel(){ fitPanel(); var p = $("hvcPanel"); p.classList.add("on"); p.setAttribute("aria-hidden", "false"); $("hvcInfo").setAttribute("aria-expanded", "true"); S.open = true; return true; }
  function closePanel(){ var p = $("hvcPanel"); if(!p) return false; p.classList.remove("on"); p.setAttribute("aria-hidden", "true"); var i = $("hvcInfo"); if(i) i.setAttribute("aria-expanded", "false"); S.open = false; return true; }
  function togglePanel(){ return S.open ? !closePanel() : openPanel(); }

  /* ---------- show / hide ---------- */
  function onShow(){
    clearTimers();
    document.documentElement.classList.add("hvcOpen");
    S.flowing = false; S.flowDone = false; S.passing = false;
    closePanel();
    S.card.classList.remove("hvcDissolve", "hvcIn"); S.inner.classList.remove("hvcFlowing", "hvcPath");
    var nn = $("hvcNextNode"); if(nn) nn.classList.remove("lit");
    S.btn.removeAttribute("aria-busy");
    compose();
    /* audio timeline, locked to the visual one (CSS delays: medal .35 s, FL OZ .5 s, message .8 s); every cue is optional and never gates CONTINUE */
    var D = window.__GEI_ACHIEVEMENT_DIRECTOR__, plan = null;
    if(D){ try{ plan = D.begin({ level:S.m.level, milestone:S.m, characterId:S.charId }); }catch(e){} }
    S.card.classList.toggle("hvcWow", !!(plan && plan.rare));
    if(plan) S.card.setAttribute("data-hvc-audio-tier", plan.tier); else S.card.removeAttribute("data-hvc-audio-tier");
    void S.card.offsetWidth;
    if(!reduced()) S.card.classList.add("hvcIn");
    if(reduced()){ fillLatest(true); later(function(){ emit("fill"); }, 750); if(S.m.complete) later(unlockMoment, 1250); }   // visuals are instant, the audio timeline is unchanged
    else{ later(function(){ fillLatest(); }, 750); if(S.m.complete) later(unlockMoment, 1250); }
    later(function(){ emit("show"); }, 200);
    later(function(){ emit("badge"); }, 350);
    later(function(){ emit("xp"); }, 500);
    later(function(){ emit("message"); }, 800);
    var say = $("hvcSay");
    later(function(){ say.classList.add("on"); }, 650);
    later(function(){ say.classList.remove("on"); }, 2700);

  }
  function onHide(){
    clearTimers();
    document.documentElement.classList.remove("hvcOpen");
    S.flowing = false; S.passing = false;
    closePanel();
    S.card.classList.remove("hvcDissolve", "hvcIn"); S.inner.classList.remove("hvcFlowing", "hvcPath");
    var say = $("hvcSay"); if(say) say.classList.remove("on");
    unmarkMap();
    emit("hide");
  }

  /* ---------- FLOW FORWARD ---------- */
  function release(){
    /* hand the click back to the ORIGINAL chain (WOW scene → Dam Map milestone → Bonus Waterwheel). Idempotent per card. */
    clearTimers();
    S.flowing = false; S.flowDone = true; S.passing = true;
    S.btn.removeAttribute("aria-busy");
    try{ S.btn.click(); }finally{ S.passing = false; }
    if(S.m && S.m.complete) markMap(S.m);
  }

  /* ---------- hand the milestone to the existing DAM MAP: its water paths light up and the next journey is announced ---------- */
  var mapObs = null;
  function markMap(m, tries){
    var page = $("geiDamMapPage"), box = $("geiMapMilestone");
    if(!page || !box) return;
    if(!box.classList.contains("show")){ if((tries || 0) < 12) setTimeout(function(){ markMap(m, (tries || 0) + 1); }, 60); return; }
    page.classList.add("hvcMapFlow");
    var line = box.querySelector(".dmwMsLine");
    if(line && !box.querySelector(".hvcMapNext")){
      var n = el("div", "hvcMapNext"); n.textContent = "💧 Water flows on to Level " + m.nextStart + " · Milestone " + m.nextNumber + " unlocked";
      var dam = el("div", "hvcMapDam"); for(var i = 0; i < m.size; i++) dam.appendChild(el("i"));
      line.appendChild(dam); line.appendChild(n);
    }
    if(!mapObs){ try{ mapObs = new MutationObserver(function(){ if(!page.classList.contains("show")) unmarkMap(); }); mapObs.observe(page, { attributes:true, attributeFilter:["class"] }); }catch(e){} }
  }
  function unmarkMap(){ var p = $("geiDamMapPage"); if(p && p.classList.contains("hvcMapFlow")) p.classList.remove("hvcMapFlow"); }   // guarded: classList.remove always queues a mutation, which would re-trigger the observer forever
  function flow(){
    S.flowing = true;
    S.btn.setAttribute("aria-busy", "true");
    closePanel();
    var nn = $("hvcNextNode"), done = S.m && S.m.complete;
    fillLatest(true);                                   // a tap never leaves the dam showing a stale count
    if(reduced()){
      emit("continue", { gesture:true }); later(function(){ emit("arrive", { gesture:true }); }, 200);
      S.inner.classList.add("hvcPath");
      if(done && nn) nn.classList.add("lit");
      later(release, FLOW_MS_REDUCED);
      return;
    }
    S.inner.classList.add("hvcFlowing");
    emit("continue", { gesture:true });
    later(function(){ if(done && nn) nn.classList.add("lit"); emit("arrive", { gesture:true }); }, 250);
    later(function(){ S.card.classList.add("hvcDissolve"); }, 260);
    later(release, FLOW_MS);
  }
  function onContinue(e){
    if(S.passing || S.flowDone) return;               // our own hand-off, or already played for this card
    e.preventDefault(); e.stopImmediatePropagation();
    if(S.flowing){ release(); return; }                // a second tap skips the flow immediately
    flow();
  }

  function install(tries){
    if(mount()) return;
    if((tries || 0) < 60) setTimeout(function(){ install((tries || 0) + 1); }, 200);
  }

  window.__GEI_VICTORY_CAPSULE__ = Object.freeze({
    version:VERSION, presentationOnly:true,
    compose:function(){ if(S.mounted) compose(); }, openDetails:function(){ return S.mounted && openPanel(); }, closeDetails:function(){ return S.mounted && closePanel(); },
    milestoneFor:milestoneFor, milestoneSize:MILESTONE_SIZE,
    registerMilestone:function(id, meta){ if(Number(id) >= 1 && meta && typeof meta === "object") MILESTONE_META[Math.floor(Number(id))] = meta; },
    milestone:function(){ return S.m; },
    flow:function(){ if(S.mounted && !S.flowing && !S.flowDone) flow(); }, isFlowing:function(){ return S.flowing; },
    state:function(){ return { mounted:S.mounted, shown:S.shown, flowing:S.flowing, flowDone:S.flowDone, details:S.open }; }
  });

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ install(0); }, { once:true });
  else install(0);
})();
