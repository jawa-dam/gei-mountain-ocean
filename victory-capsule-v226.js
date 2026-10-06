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
 * Presentation only: never reads or writes progress, FL OZ, XP, purchases, entitlements, ownership or storage, and never
 * creates a second reward / character / progression system. Audio reuses damVoice / damNoise (SFX bus → master volume +
 * mute) and is a couple of tiny cues. prefers-reduced-motion: no motion, a glowing path station → next stop, 0.38 s.
 */
(function(){
  "use strict";
  if(window.__GEI_VICTORY_CAPSULE__) return;
  var VERSION = "V2.2.6";
  var FLOW_MS = 460, FLOW_MS_REDUCED = 360;

  var STATIONS = [ ["⛰️","Mountain"], ["🧱","Dam"], ["🌊","Millpond"], ["🚪","Sluice Gate"], ["⚙️","Waterwheel"], ["🏭","Mill"] ];
  var SAY = ["WE DID IT!","FLOWING FORWARD!","NEXT STOP!","YES!"];
  var STEM = [
    "STEM: Gravity moves water downhill.",
    "STEM: Dams store water and hold back its pressure.",
    "STEM: A reservoir keeps water ready for later.",
    "STEM: A sluice gate controls how fast water flows.",
    "STEM: Moving water can turn a wheel and make energy.",
    "STEM: Machines use that energy to do work."
  ];

  var S = { card:null, inner:null, btn:null, shown:false, flowing:false, flowDone:false, passing:false, timers:[], open:false, mounted:false, stemI:0 };

  function $(id){ return document.getElementById(id); }
  function q(sel, ctx){ return (ctx || document).querySelector(sel); }
  function reduced(){ try{ return matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } }
  function later(fn, ms){ var id = setTimeout(function(){ var i = S.timers.indexOf(id); if(i >= 0) S.timers.splice(i, 1); try{ fn(); }catch(e){} }, ms); S.timers.push(id); return id; }
  function clearTimers(){ S.timers.forEach(clearTimeout); S.timers = []; }
  function el(tag, cls, text){ var e = document.createElement(tag); if(cls) e.className = cls; if(text != null) e.textContent = text; return e; }
  function st(){ try{ return typeof state !== "undefined" ? state : null; }catch(e){ return null; } }
  function muted(){ try{ return !!(window.GEI_AUDIO && window.GEI_AUDIO.muted); }catch(e){ return false; } }
  function fmtN(n){ try{ return typeof fmt === "function" ? fmt(n) : String(n); }catch(e){ return String(n); } }

  /* ---------- audio: two tiny cues, the game's own synth voices ---------- */
  function sound(kind, gesture){
    if(muted()) return;
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

      /* ===== station strip: the whole cycle, stamped; the NEXT stop waits at the end ===== */
      I+" .hvcBar{flex:none;display:flex;align-items:center;gap:0;height:clamp(28px,5cqh,40px);padding:0 2px}",
      I+" .hvcNode{flex:none;position:relative;width:clamp(24px,min(8.2cqw,5.2cqh),36px);height:clamp(24px,min(8.2cqw,5.2cqh),36px);border-radius:50%;display:grid;place-items:center;box-sizing:border-box;"+
        "font-size:clamp(12px,min(4.1cqw,2.7cqh),18px);line-height:1;background:rgba(2,10,24,.5);border:1.5px solid rgba(255,255,255,.28);z-index:1}",
      I+" .hvcNode.d{border-color:var(--gold);background:linear-gradient(145deg,"+mix("var(--gold)",30)+",rgba(2,10,24,.55));box-shadow:0 0 10px "+mix("var(--gold)",45)+"}",
      I+" .hvcNode.n{border-style:dashed;border-color:"+mix("var(--foam)",65)+";opacity:.85}",
      I+" .hvcNode.n.lit{opacity:1;border-style:solid;border-color:var(--foam);background:radial-gradient(circle,"+mix("var(--water-bright)",70)+",rgba(2,10,24,.5));box-shadow:0 0 18px var(--water-bright)}",
      I+" .hvcCon{flex:1 1 0;min-width:4px;height:5px;margin:0 -1px;border-radius:3px;background:rgba(255,255,255,.16);position:relative;overflow:hidden}",
      I+" .hvcCon.d{background:"+mix("var(--gold)",35)+"}",
      I+" .hvcCon i{position:absolute;inset:0;border-radius:3px;background:linear-gradient(90deg,var(--water-bright),var(--foam));transform:scaleX(0);transform-origin:0 50%;box-shadow:0 0 8px var(--water-bright)}",

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
      I+".hvcFlowing .hvcCon i{transform:scaleX(1);transition:transform .22s ease-out calc(var(--i)*36ms)}",
      I+".hvcFlowing .hvcNode.d{animation:hvcWake .3s ease-out calc(var(--i)*36ms)}",
      I+".hvcFlowing .hvcBar{filter:drop-shadow(0 0 6px "+mix("var(--water-bright)",70)+")}",
      I+".hvcPath .hvcCon i{transform:scaleX(1)}",
      I+".hvcFlowing .lcBtn{animation:none;filter:brightness(1.1)}",

      /* ===== entry celebration: fast, non-blocking (CONTINUE works from t = 0) ===== */
      C+".hvcIn #levelInner .lcLevel{animation:hvcPop .5s cubic-bezier(.34,1.56,.64,1) .05s both}",
      C+".hvcIn #levelInner .hvcSub{animation:hvcFade .4s ease .25s both}",
      C+".hvcIn #levelInner .hvcHero{animation:hvcHero .55s cubic-bezier(.34,1.56,.64,1) .1s both}",
      C+".hvcIn #levelInner .hvcMedal{animation:hvcSpin .7s cubic-bezier(.34,1.56,.64,1) .35s both}",
      C+".hvcIn #levelInner .hvcNode.d{animation:hvcStamp .32s cubic-bezier(.34,1.56,.64,1) calc(.3s + var(--i)*60ms) both}",
      C+".hvcIn #levelInner .hvcRewards .lcOz{animation:hvcPop .45s cubic-bezier(.34,1.56,.64,1) .5s both}",
      C+".hvcIn #levelInner .hvcRewards .lcRescue{animation:hvcPop .45s cubic-bezier(.34,1.56,.64,1) .68s both}",
      C+".hvcIn #levelInner .hvcNext,"+C+".hvcIn #levelInner .hvcStem{animation:hvcFade .4s ease .85s both}",

      "@keyframes hvcLine{to{background-position:200% 0,0 0}}",
      "@keyframes hvcBtn{0%,100%{box-shadow:0 0 22px "+mix("var(--gold)",50)+",inset 0 1px 0 rgba(255,255,255,.7)}50%{box-shadow:0 0 34px "+mix("var(--gold)",80)+",inset 0 1px 0 rgba(255,255,255,.7)}}",
      "@keyframes hvcPop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}",
      "@keyframes hvcFade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}",
      "@keyframes hvcHero{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:none}}",
      "@keyframes hvcSpin{from{opacity:0;transform:rotate(-200deg) scale(.2)}to{opacity:1;transform:none}}",
      "@keyframes hvcStamp{from{opacity:0;transform:scale(1.8)}to{opacity:1;transform:none}}",
      "@keyframes hvcWake{0%{transform:scale(1)}45%{transform:scale(1.25);box-shadow:0 0 18px var(--water-bright)}100%{transform:scale(1)}}",
      "@keyframes hvcFlood{0%{opacity:.95;transform:translateY(100%)}60%{opacity:.9}100%{opacity:0;transform:translateY(-35%)}}",
      "@keyframes hvcDissolve{to{opacity:0;transform:translateY(-14px) scale(.95);filter:blur(2px)}}",

      /* ===== two-zone composition for wide / landscape containers ===== */
      "@container hvc (min-aspect-ratio:6/5){"+
        I+"{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(0,1fr);grid-template-rows:auto auto auto auto 1fr;column-gap:clamp(12px,2.4cqw,24px);row-gap:clamp(5px,1.6cqh,12px);max-width:min(900px,100%);align-items:start}"+
        I+" .hvcHero{grid-column:1;grid-row:1/-1;height:auto;align-self:stretch;min-height:0}"+
        I+" .hvcHead{padding:0 40px}"+
        I+" .lcLevel{font-size:clamp(1rem,min(1.75cqw,5cqh),1.55rem)}"+
        I+" .hvcHead{grid-column:2;grid-row:1}"+
        I+" .hvcBar{grid-column:2;grid-row:2}"+
        I+" .hvcRewards{grid-column:2;grid-row:3}"+
        I+" .hvcNext{grid-column:2;grid-row:4}"+
        I+" .hvcStem{grid-column:2;grid-row:5;display:none}"+
        I+" .hvcDock{grid-column:2;grid-row:5;align-self:end}"+
        I+" .hvcPanel{left:calc(var(--hvc-left,0px) + 10px)}"+
      "}",
      "@container hvc (max-width:340px){"+I+" .hvcHead{padding:0 38px}"+I+" .lcLevel{font-size:.92rem}"+I+" .hvcSub{letter-spacing:.06em}}",

      /* ===== reduced motion: static, a glowing path from the finished station to the next stop ===== */
      "@media (prefers-reduced-motion:reduce){"+
        I+"::before,"+I+" .hvcHero::after,"+I+" .lcBtn{animation:none!important}"+
        C+".hvcIn #levelInner *{animation:none!important}"+
        C+".hvcDissolve #levelInner,"+C+".hvcDissolve .hvcFlood i{animation:none!important}"+
        I+" .hvcCon i{transition:none!important}"+
        I+".hvcFlowing .hvcNode.d{animation:none}"+
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
    var sub = el("div", "hvcSub", "HYDRAULIC CYCLE MASTERED"); sub.id = "hvcSub"; head.appendChild(sub);
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

    var bar = el("div", "hvcBar"); bar.id = "hvcBar"; bar.setAttribute("aria-hidden", "true");
    STATIONS.forEach(function(s, i){
      var n = el("span", "hvcNode d", s[0]); n.style.setProperty("--i", i); n.title = s[1]; bar.appendChild(n);
      var c = el("span", "hvcCon" + (i < STATIONS.length - 1 ? " d" : "")); c.style.setProperty("--i", i); c.appendChild(el("i")); bar.appendChild(c);
    });
    var nextNode = el("span", "hvcNode n", "🎡"); nextNode.id = "hvcNextNode"; bar.appendChild(nextNode);

    var rewards = el("div", "hvcRewards");
    var oz = q(".lcOz", inner), resc = $("lcRescue");
    if(oz) rewards.appendChild(oz);
    if(resc) rewards.appendChild(resc);

    var next = el("div", "hvcNext"); next.id = "hvcNext";
    var stem = el("div", "hvcStem"); stem.id = "hvcStem";
    var dock = el("div", "hvcDock"); dock.appendChild(btn);
    var panel = el("div", "hvcPanel"); panel.id = "hvcPanel"; panel.setAttribute("role", "note"); panel.setAttribute("aria-hidden", "true");

    /* the hidden originals stay where they are, before the capsule groups */
    [head, hero, bar, rewards, next, stem, dock, panel].forEach(function(n){ inner.appendChild(n); });
    var flood = el("div", "hvcFlood"); flood.setAttribute("aria-hidden", "true"); flood.appendChild(el("i")); card.appendChild(flood);

    S.card = card; S.inner = inner; S.btn = btn; S.mounted = true;

    info.addEventListener("click", function(e){ e.stopPropagation(); togglePanel(); });
    panel.addEventListener("click", function(e){ e.stopPropagation(); closePanel(); });
    inner.addEventListener("keydown", function(e){
      if(e.key === "Escape" && S.open){ e.preventDefault(); e.stopPropagation(); closePanel(); try{ info.focus({ preventScroll:true }); }catch(x){} }
    }, true);
    btn.addEventListener("click", onContinue, true);
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
    $("hvcSub").textContent = milestone && chapter ? chapter : "HYDRAULIC CYCLE MASTERED";

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
    if(c && c.img) img.src = c.img; else img.removeAttribute("src");
    say.lastChild.textContent = SAY[Math.floor(Math.random() * SAY.length)];

    buildPanel();
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
    void S.card.offsetWidth;
    if(!reduced()) S.card.classList.add("hvcIn");
    var say = $("hvcSay");
    later(function(){ say.classList.add("on"); }, 650);
    later(function(){ say.classList.remove("on"); }, 2700);
    later(function(){ sound("reward"); }, 520);     // plays only if audio is already unlocked (no gesture)
  }
  function onHide(){
    clearTimers();
    document.documentElement.classList.remove("hvcOpen");
    S.flowing = false; S.passing = false;
    closePanel();
    S.card.classList.remove("hvcDissolve", "hvcIn"); S.inner.classList.remove("hvcFlowing", "hvcPath");
    var say = $("hvcSay"); if(say) say.classList.remove("on");
  }

  /* ---------- FLOW FORWARD ---------- */
  function release(){
    /* hand the click back to the ORIGINAL chain (WOW scene → Dam Map milestone → Bonus Waterwheel). Idempotent per card. */
    clearTimers();
    S.flowing = false; S.flowDone = true; S.passing = true;
    S.btn.removeAttribute("aria-busy");
    try{ S.btn.click(); }finally{ S.passing = false; }
  }
  function flow(){
    S.flowing = true;
    S.btn.setAttribute("aria-busy", "true");
    closePanel();
    var nn = $("hvcNextNode");
    if(reduced()){
      S.inner.classList.add("hvcPath");
      if(nn) nn.classList.add("lit");
      later(release, FLOW_MS_REDUCED);
      return;
    }
    S.inner.classList.add("hvcFlowing");
    sound("flow", true);
    later(function(){ if(nn) nn.classList.add("lit"); sound("next", true); }, 250);
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
    flow:function(){ if(S.mounted && !S.flowing && !S.flowDone) flow(); }, isFlowing:function(){ return S.flowing; },
    state:function(){ return { mounted:S.mounted, shown:S.shown, flowing:S.flowing, flowDone:S.flowDone, details:S.open }; }
  });

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ install(0); }, { once:true });
  else install(0);
})();
