/* V2.1.88 — DAM FRIENDLY SOUNDTRACK DIRECTOR ENGINE
 * Global background soundtrack layer for DAM-ITE / Tap Lites.
 *
 * - 100% procedural Web Audio (no audio files, no commercial songs).
 * - Shares the game's single AudioContext via getAudio() (index.html). It only creates
 *   its own context if the core audio engine is missing entirely.
 * - Music owns a private bus: theme → mix (activity) → duck → user → tone → safety limiter
 *   → destination. It never goes through, and never spends, the gameplay voice budget
 *   (GEI_TAP_PERFORMANCE), so taps / signatures / rewards keep full priority.
 * - Activity-decay mixer + event ducking + gradual idle lift with a hard ceiling:
 *   music always stays underneath important game audio.
 * - Presentation/audio only. Never reads or writes FL OZ, XP, progression, purchases,
 *   entitlements or saves. Persists only damMusicEnabled / damMusicVolume / theme bag.
 */
(function(){
  "use strict";
  if(window.__GEI_DAM_FRIENDLY_SOUNDTRACK__) return;

  var VERSION = "V2.1.88";
  var KEYS = Object.freeze({
    enabled:"damMusicEnabled", volume:"damMusicVolume",
    bag:"damMusicThemeBag", last:"damMusicLastTheme"
  });

  /* ---------------------------------------------------------------------------
     MIX RULES — levels are "music level" units (spec ranges). outputScale maps them
     to real gain on the music bus so the soundtrack sits well under game SFX.
  --------------------------------------------------------------------------- */
  var MIX = Object.freeze({
    defaultVolume:.35,
    active:[.18,.28],          // player tapping
    calm:[.30,.40],            // player stopped tapping
    idle:[.40,.48],            // player fully idle ("hey… come back and play")
    duckFloor:.10,             // ducking never goes below this — music is never cut
    idleCeiling:.48,           // gradual idle lift can never exceed this (at default volume)
    gameAudioCap:.36,          // while game SFX are sounding, idle lift is held under this
    absoluteCeiling:.60,       // hard stop, whatever the user volume
    idleAfterS:18,             // calm → idle lift begins
    idleLiftS:40,              // seconds to glide from idle[0] to idle[1]
    idleSettleAfterS:180,      // after 3 idle minutes, breathe back down…
    idleSettleLevel:.38,       // …to a relaxed lobby level
    halfLifeS:2.4,             // activityScore half-life
    riseTau:2.6,               // slow, polite rise
    fallTau:.22,               // fast, clean dip when play resumes
    outputScale:.19,
    themeMaxMinutes:7          // long sessions glide to a fresh tune
  });

  var ACTIVITY = Object.freeze({ tap:.16, button:.10, game:.14, reward:.22, key:.12 });

  /* Duck targets (music level) + hold seconds. Priority order per spec §17:
     1 critical UI · 2 signature moments · 3 reward/completion · 4 gameplay/tap
     5 ambient/nature (never ducks) · 6 background music (yields to all). */
  var DUCK = Object.freeze({
    critical: {p:1,level:.14,hold:.35},
    confirm:  {p:1,level:.17,hold:.22},
    signature:{p:2,level:.10,hold:1.5},
    character:{p:2,level:.12,hold:.9},
    moment:   {p:2,level:.12,hold:1.2},
    mission:  {p:3,level:.10,hold:1.7},
    reward:   {p:3,level:.12,hold:1.0},
    store:    {p:3,level:.16,hold:.45},
    splash:   {p:4,level:.15,hold:.45},
    tap:      {p:4,level:.18,hold:.12}
  });
  var PRIORITIES = Object.freeze(["critical-ui","signature-moments","reward-completion","gameplay-tap","ambient-nature","background-music"]);

  /* ---------------------------------------------------------------------------
     MUSIC THEORY
  --------------------------------------------------------------------------- */
  var SCALE = [0,2,4,5,7,9,11];                          // bright major only — kid friendly
  var REG = Object.freeze({ bass:[43,57], pad:[55,67], lead:[67,88], pluck:[72,88], shimmer:[84,98] });
  function mod(a,n){ return ((a % n) + n) % n; }
  function degMidi(root,d){ return root + 12*Math.floor(d/7) + SCALE[mod(d,7)]; }
  function inWindow(m,lo){ return lo + mod(m - lo, 12); }
  function mtof(m){ return 440 * Math.pow(2,(m-69)/12); }
  function rnd(a,b){ return a + Math.random()*(b-a); }
  function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
  function clamp(v,a,b){ return v < a ? a : v > b ? b : v; }
  function lerp(a,b,t){ return a + (b-a)*t; }
  function ease(t){ t = clamp(t,0,1); return t*t*(3-2*t); }
  function chordTones(root,c,seventh,ninth){
    var t = [degMidi(root,c), degMidi(root,c+2), degMidi(root,c+4)];
    if(seventh) t.push(degMidi(root,c+6));
    if(ninth) t.push(degMidi(root,c+8));
    return t;
  }

  /* ---------------------------------------------------------------------------
     THEMES — motifs are chord-relative scale steps ([degree, beats], null = rest),
     one 4/4 bar each. Melody follows the harmony, so every note stays consonant.
  --------------------------------------------------------------------------- */
  var THEMES = Object.freeze([
    { id:"dam-daydream", name:"DAM Daydream", emoji:"☁️", bpm:76, root:65, swing:.10,
      sevenths:true, lush:false,
      progs:[[0,5,1,4],[0,2,3,4],[3,4,2,5],[0,5,3,4]],
      motifs:[ [[4,1.5],[2,.5],[0,1],[2,1]], [[2,.5],[4,.5],[5,1],[4,1],[null,1]],
               [[7,1],[6,.5],[4,.5],[2,2]], [[0,.5],[2,.5],[4,.5],[6,.5],[4,2]] ],
      cadences:[ [[2,1],[1,1],[0,2]], [[4,1],[2,1],[0,2]] ],
      lead:["ep","flute"], bass:"half", pluck:null, perc:null, shimmer:.25, air:.1 },

    { id:"water-wander", name:"Water Wander", emoji:"💧", bpm:88, root:62, swing:0,
      sevenths:false, lush:false,
      progs:[[0,3,5,4],[0,4,5,3],[3,0,1,4],[5,3,0,4]],
      motifs:[ [[0,1],[1,.5],[2,.5],[4,2]], [[4,.5],[3,.5],[2,1],[1,1],[2,1]],
               [[2,1.5],[4,.5],[5,1],[4,1]], [[7,1],[4,1],[2,1],[4,1]] ],
      cadences:[ [[1,1],[2,1],[0,2]], [[4,.5],[2,.5],[1,1],[0,2]] ],
      lead:["flute","ocarina"], bass:"half", pluck:"flow", perc:null, shimmer:.35, air:.15 },

    { id:"mountain-morning", name:"Mountain Morning", emoji:"🌄", bpm:96, root:67, swing:.06,
      sevenths:false, lush:false,
      progs:[[0,3,0,4],[5,3,0,4],[0,2,3,3],[3,4,0,0]],
      motifs:[ [[0,.5],[2,.5],[4,1],[4,.5],[5,.5],[4,1]], [[7,1],[5,.5],[4,.5],[2,2]],
               [[4,1],[2,1],[3,.5],[2,.5],[0,1]], [[2,.5],[4,.5],[7,1.5],[null,.5],[4,1]] ],
      cadences:[ [[2,1],[1,.5],[0,2.5]], [[4,1],[2,1],[0,2]] ],
      lead:["ocarina","ep"], bass:"walk", pluck:"strum", perc:"tick", shimmer:.18, air:0 },

    { id:"happy-hydraulics", name:"Happy Hydraulics", emoji:"⚙️", bpm:108, root:60, swing:.12,
      sevenths:false, lush:false,
      progs:[[0,1,4,0],[0,3,4,3],[5,1,4,0],[0,5,3,4]],
      motifs:[ [[0,.5],[0,.5],[4,.5],[null,.5],[2,.5],[4,.5],[5,1]], [[4,.5],[5,.5],[4,.5],[2,.5],[0,1],[null,1]],
               [[7,.5],[null,.5],[4,.5],[null,.5],[2,.5],[4,.5],[2,1]], [[2,.5],[3,.5],[4,1],[4,.5],[2,.5],[0,1]] ],
      cadences:[ [[4,.5],[2,.5],[0,1],[null,2]], [[2,.5],[1,.5],[0,1.5],[null,1.5]] ],
      lead:["marimba","glock"], bass:"bounce", pluck:"bounce", perc:"shaker", shimmer:.3, air:0, bubbles:true },

    { id:"ocean-breeze", name:"Ocean Breeze", emoji:"🌊", bpm:70, root:63, swing:0,
      sevenths:true, lush:true,
      progs:[[0,3,0,3],[5,3,0,4],[1,4,0,0],[0,2,3,4]],
      motifs:[ [[4,2],[2,1],[null,1]], [[2,1],[4,1],[6,2]], [[7,1.5],[6,.5],[4,2]], [[null,1],[2,1],[1,1],[2,1]] ],
      cadences:[ [[2,2],[0,2]], [[4,1],[2,1],[0,2]] ],
      lead:["flute","ep"], bass:"half", pluck:null, perc:null, shimmer:.4, air:.35 },

    { id:"splash-club", name:"Splash Club", emoji:"💦", bpm:116, root:57, swing:.08,
      sevenths:false, lush:false,
      progs:[[0,4,5,3],[3,4,0,5],[0,3,1,4],[5,3,4,0]],
      motifs:[ [[0,.5],[2,.5],[4,.5],[2,.5],[5,1],[4,1]], [[4,.5],[4,.5],[5,.5],[4,.5],[2,1],[0,1]],
               [[7,.5],[6,.5],[4,.5],[2,.5],[4,2]], [[2,1],[null,.5],[2,.5],[4,.5],[5,.5],[4,1]] ],
      cadences:[ [[4,.5],[2,.5],[1,.5],[2,.5],[0,2]], [[2,1],[1,1],[0,2]] ],
      lead:["ep","marimba"], bass:"bounce", pluck:"arp8", perc:"shaker", shimmer:.28, air:0, bubbles:true },

    { id:"cloud-elevator", name:"Cloud Elevator", emoji:"🛗", bpm:72, root:58, swing:.12,
      sevenths:true, lush:true,
      progs:[[0,1,2,3],[3,4,2,5],[0,3,1,4],[1,2,3,4]],
      motifs:[ [[2,1],[4,1],[6,1.5],[4,.5]], [[4,.5],[2,.5],[0,1],[null,2]],
               [[6,1],[4,1],[2,1],[1,1]], [[0,.5],[2,.5],[4,.5],[7,1.5],[null,1]] ],
      cadences:[ [[4,1],[2,1],[0,2]], [[2,1.5],[1,.5],[0,2]] ],
      lead:["ep","glock"], bass:"half", pluck:null, perc:null, shimmer:.3, air:.2 },

    { id:"little-dam-adventure", name:"Little DAM Adventure", emoji:"🧭", bpm:100, root:64, swing:.05,
      sevenths:false, lush:false,
      progs:[[0,4,3,4],[5,4,3,4],[0,2,5,3],[3,4,0,0]],
      motifs:[ [[0,.5],[3,.5],[4,1],[7,1],[4,1]], [[4,.5],[5,.5],[4,.5],[3,.5],[2,1],[0,1]],
               [[0,1],[4,1],[3,.5],[2,.5],[3,1]], [[7,.5],[4,.5],[2,.5],[4,.5],[5,1],[4,1]] ],
      cadences:[ [[4,1],[3,.5],[2,.5],[0,2]], [[1,1],[2,1],[0,2]] ],
      lead:["ocarina","flute"], bass:"walk", pluck:"flow", perc:"tick", shimmer:.22, air:.05 }
  ]);
  var THEME_BY_ID = {};
  THEMES.forEach(function(t){ THEME_BY_ID[t.id] = t; });

  /* Soft lobby bed that holds under the splash visuals after the intro phrase. */
  var SPLASH_LOBBY = Object.freeze({
    id:"splash-lobby", name:"Welcome", emoji:"✨", bpm:72, root:60, swing:0,
    sevenths:true, lush:true, progs:[[0,3]],
    motifs:[[[null,4]]], cadences:[[[null,4]]],
    lead:[], bass:"half", pluck:null, perc:null, shimmer:.7, air:.3, lobby:true
  });

  /* Timbres: PeriodicWave harmonic recipes + ADSR. Bright, round, nothing harsh. */
  var TIMBRES = Object.freeze({
    ep:     {h:[0,1,.42,.14,.07,.03,.015], a:.008, d:.55, s:.35, r:.5,  peak:.9},
    flute:  {h:[0,1,.14,.06,.02],          a:.07,  d:.3,  s:.8,  r:.25, peak:.75},
    ocarina:{h:[0,1,.03,.18,.01,.05],      a:.05,  d:.3,  s:.72, r:.22, peak:.75},
    marimba:{h:[0,1,0,0,.32,0,0,0,0,0,.06],a:.004, d:.3,  s:0,   r:.25, peak:1},
    glock:  {h:[0,1,0,.22,0,0,.08],        a:.003, d:.9,  s:0,   r:.6,  peak:.7},
    warm:   {h:[0,1,.28,.1,.05,.02],       a:.45,  d:.8,  s:.85, r:.9,  peak:.55},
    bass:   {h:[0,1,.18,.05,.02],          a:.02,  d:.35, s:.6,  r:.18, peak:.9},
    pluck:  {h:[0,1,.3,.12,.06,.03],       a:.004, d:.18, s:0,   r:.15, peak:.8}
  });
  var CHANNELS = Object.freeze({
    lead:   {gain:.34, type:"lowpass",  freq:4200, pan:0},
    pad:    {gain:.12, type:"lowpass",  freq:1400, pan:0},
    bass:   {gain:.26, type:"lowpass",  freq:480,  pan:0},
    pluck:  {gain:.13, type:"lowpass",  freq:3800, pan:-.25},
    perc:   {gain:.10, type:"highpass", freq:4800, pan:.22},
    shimmer:{gain:.12, type:"lowpass",  freq:7000, pan:.3}
  });
  var MAX_VOICES = 22;        // hard cap for melody/pad/bass
  var SOFT_VOICES = 14;       // decoration (pluck/perc/shimmer) yields first

  /* ---------------------------------------------------------------------------
     STATE
  --------------------------------------------------------------------------- */
  var S = {
    installed:false, initialized:false, playing:false, enabled:true, volume:MIX.defaultVolume,
    ctx:null, ownsContext:false, bus:null, waves:null, noise:null,
    phase:"idle",                 // idle → intro → lobby → theme
    player:null, lobby:null, intro:null, introEndsAt:0,
    currentTheme:null, themeStartedAt:0, history:[],
    activity:0, lastActivityAt:performance.now(), lastTick:performance.now(),
    mixLevel:.30, mixTarget:.30, duckMult:1, duckLevel:1, duckUntil:0, duckKind:"",
    gameState:"splash", flowTier:"calm", comboLiftUntil:0, lastComboLift:0, rewardAnswerAt:0,
    timer:null, hidden:!!document.hidden, voices:0, peakVoices:0, notes:0, bars:0,
    counters:{ducks:0,crossfades:0,starts:0,contextsCreated:0,activity:0,wrapped:0,errors:0},
    debugIdleOffset:0, meter:null, unlockBound:false, duckLog:{}
  };

  /* ---------------------------------------------------------------------------
     PREFERENCES (safe parse, graceful fallback, written only on player change)
  --------------------------------------------------------------------------- */
  function lsGet(k){ try{ return window.localStorage.getItem(k); }catch(e){ return null; } }
  function lsSet(k,v){ try{ window.localStorage.setItem(k,v); }catch(e){} }
  function loadPrefs(){
    var en = lsGet(KEYS.enabled);
    S.enabled = !(en === "false" || en === "0" || en === "off");
    var v = parseFloat(lsGet(KEYS.volume));
    S.volume = isFinite(v) ? clamp(v,0,1) : MIX.defaultVolume;
  }

  /* ---------------------------------------------------------------------------
     RANDOM SOUNDTRACK BAG — every theme plays before any repeats, never twice in a row
  --------------------------------------------------------------------------- */
  function shuffle(a){ for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)), t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
  function nextThemeId(avoid){
    var ids = THEMES.map(function(t){ return t.id; });
    var bag = [];
    try{ bag = JSON.parse(lsGet(KEYS.bag) || "[]"); }catch(e){ bag = []; }
    if(!Array.isArray(bag)) bag = [];
    bag = bag.filter(function(id){ return THEME_BY_ID[id]; });
    var last = avoid || lsGet(KEYS.last) || "";
    if(!bag.length) bag = shuffle(ids.slice());
    if(bag[0] === last){
      if(bag.length > 1){ bag.push(bag.shift()); }
      else { bag = shuffle(ids.filter(function(id){ return id !== last; })); }
    }
    var id = bag.shift();
    lsSet(KEYS.bag, JSON.stringify(bag));
    lsSet(KEYS.last, id);
    return id;
  }

  /* ---------------------------------------------------------------------------
     AUDIO GRAPH — one shared context, one private music bus
  --------------------------------------------------------------------------- */
  function sharedContext(){
    try{
      if(typeof getAudio === "function"){ var c = getAudio(); if(c) return c; }   // index.html core engine (gesture-safe)
    }catch(e){}
    try{
      if(!S.ctx){
        var AC = window.AudioContext || window.webkitAudioContext; if(!AC) return null;
        S.ctx = new AC(); S.ownsContext = true; S.counters.contextsCreated++;
      }
      if(S.ctx.state === "suspended") S.ctx.resume();
      return S.ctx;
    }catch(e){ return null; }
  }
  function ensureGraph(){
    var ctx = sharedContext(); if(!ctx) return null;
    if(S.bus && S.bus.ctx === ctx) return S.bus;
    S.ctx = ctx;
    try{
      var b = {ctx:ctx};
      b.input = ctx.createGain();       b.input.gain.value = 1;
      b.mix = ctx.createGain();         b.mix.gain.value = 0.0001;
      b.duck = ctx.createGain();        b.duck.gain.value = 1;
      b.user = ctx.createGain();        b.user.gain.value = 0.0001;
      b.hp = ctx.createBiquadFilter();  b.hp.type = "highpass";  b.hp.frequency.value = 95;  b.hp.Q.value = .5;   // no giant bass
      b.tone = ctx.createBiquadFilter();b.tone.type = "lowpass"; b.tone.frequency.value = 7200; b.tone.Q.value = .4; // leaves room for tap highs
      b.shelf = ctx.createBiquadFilter();b.shelf.type = "highshelf"; b.shelf.frequency.value = 5200; b.shelf.gain.value = -4; // no harsh spikes
      b.limit = ctx.createDynamicsCompressor();
      b.limit.threshold.value = -20; b.limit.knee.value = 10; b.limit.ratio.value = 4; b.limit.attack.value = .008; b.limit.release.value = .3;
      b.input.connect(b.mix); b.mix.connect(b.duck); b.duck.connect(b.user); b.user.connect(b.hp);
      b.hp.connect(b.tone); b.tone.connect(b.shelf); b.shelf.connect(b.limit); b.limit.connect(ctx.destination);
      S.bus = b;
      S.waves = {};
      Object.keys(TIMBRES).forEach(function(k){
        var h = TIMBRES[k].h, re = new Float32Array(h.length), im = new Float32Array(h);
        S.waves[k] = ctx.createPeriodicWave(re, im);
      });
      S.noise = null;
      try{ if(typeof GEI_TAP_PERFORMANCE !== "undefined") S.noise = GEI_TAP_PERFORMANCE.sharedNoise(ctx, 1); }catch(e){}
      if(!S.noise){
        var n = Math.floor(ctx.sampleRate*2), buf = ctx.createBuffer(1,n,ctx.sampleRate), d = buf.getChannelData(0);
        for(var i=0;i<n;i++) d[i] = Math.random()*2-1;
        S.noise = buf;
      }
      return b;
    }catch(e){ S.counters.errors++; S.bus = null; return null; }
  }
  function outGain(){ return clamp(S.volume / MIX.defaultVolume, 0, 3) * MIX.outputScale; }

  function makeChannels(dest){
    var ctx = S.ctx, ch = {};
    Object.keys(CHANNELS).forEach(function(k){
      var c = CHANNELS[k], g = ctx.createGain(), f = ctx.createBiquadFilter(), p = null;
      g.gain.value = c.gain; f.type = c.type; f.frequency.value = c.freq; f.Q.value = .5;
      g.connect(f);
      try{ if(ctx.createStereoPanner){ p = ctx.createStereoPanner(); p.pan.value = c.pan; f.connect(p); p.connect(dest); } else f.connect(dest); }
      catch(e){ f.connect(dest); }
      ch[k] = {in:g, filter:f, pan:p, core:(k === "lead" || k === "pad" || k === "bass")};
    });
    return ch;
  }
  function dropChannels(ch){
    if(!ch) return;
    Object.keys(ch).forEach(function(k){ try{ ch[k].in.disconnect(); ch[k].filter.disconnect(); if(ch[k].pan) ch[k].pan.disconnect(); }catch(e){} });
  }

  /* One voice = 1 oscillator + 1 gain, auto-disconnected when it ends. */
  function voice(ch, midi, t, dur, vel, timbre, opts){
    if(!ch || S.voices >= (ch.core ? MAX_VOICES : SOFT_VOICES)) return false;
    opts = opts || {};
    var ctx = S.ctx, T = TIMBRES[timbre] || TIMBRES.ep;
    try{
      var o = ctx.createOscillator(), g = ctx.createGain(), pk = Math.max(.0002, T.peak*vel);
      if(S.waves && S.waves[timbre]) o.setPeriodicWave(S.waves[timbre]); else o.type = "sine";
      var f = mtof(midi);
      if(opts.glideFrom){ o.frequency.setValueAtTime(f*opts.glideFrom, t); o.frequency.exponentialRampToValueAtTime(f, t+(opts.glideTime||.05)); }
      else o.frequency.setValueAtTime(f, t);
      o.detune.value = rnd(-4,4);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(pk, t+T.a);
      if(T.s > 0) g.gain.setTargetAtTime(pk*T.s, t+T.a, T.d/3);
      else g.gain.setTargetAtTime(0.0001, t+T.a, T.d/3);
      g.gain.setTargetAtTime(0.0001, t+Math.max(T.a, dur), T.r/4);
      o.connect(g); g.connect(ch.in);
      var end = t + Math.max(T.a, dur) + T.r*1.2 + .05;
      o.start(t); o.stop(end);
      S.voices++; S.notes++; if(S.voices > S.peakVoices) S.peakVoices = S.voices;
      o.onended = function(){ S.voices = Math.max(0, S.voices-1); try{ o.disconnect(); g.disconnect(); }catch(e){} };
      return true;
    }catch(e){ S.counters.errors++; return false; }
  }
  function noiseVoice(ch, t, dur, gain, from, to, filterType, q){
    if(!ch || S.voices >= SOFT_VOICES || !S.noise) return false;
    var ctx = S.ctx;
    try{
      var src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      src.buffer = S.noise; f.type = filterType || "bandpass"; f.Q.value = q || .7;
      f.frequency.setValueAtTime(from, t); f.frequency.exponentialRampToValueAtTime(Math.max(40,to||from), t+dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(gain, t+dur*.4); g.gain.setTargetAtTime(0.0001, t+dur*.55, dur*.15);
      src.connect(f); f.connect(g); g.connect(ch.in);
      var off = Math.max(0, Math.random()*(S.noise.duration - dur - .1));
      src.start(t, off, Math.min(S.noise.duration-off, dur+.3)); src.stop(t+dur+.3);
      S.voices++; S.notes++; if(S.voices > S.peakVoices) S.peakVoices = S.voices;
      src.onended = function(){ S.voices = Math.max(0, S.voices-1); try{ src.disconnect(); f.disconnect(); g.disconnect(); }catch(e){} };
      return true;
    }catch(e){ S.counters.errors++; return false; }
  }
  /* Hydraulic identity: bell-like droplet with a tiny upward "bloop". */
  function droplet(ch, midi, t, vel){ return voice(ch, midi, t, .08, vel, "glock", {glideFrom:.8, glideTime:.035}); }
  function bubbles(ch, root, t, count){
    var base = inWindow(degMidi(root,0), REG.shimmer[0]);
    for(var i=0;i<count;i++) voice(ch, base + [0,4,7,12,16][i%5], t + i*.07, .05, .35, "marimba", {glideFrom:.7, glideTime:.03});
  }

  /* ---------------------------------------------------------------------------
     THEME PLAYER — bar-by-bar look-ahead scheduling (cheap on mobile)
  --------------------------------------------------------------------------- */
  function Player(theme, startAt){
    this.theme = theme;
    this.out = S.ctx.createGain(); this.out.gain.value = 0.0001;
    this.out.connect(S.bus.input);
    this.ch = makeChannels(this.out);
    this.nextBar = startAt; this.barInPhrase = 0; this.phrases = 0; this.phrase = null;
    this.lastLead = 76; this.lastProg = -1; this.stopped = false;
    this.leadIdx = Math.floor(Math.random()*Math.max(1,theme.lead.length));
    this.octave = Math.random() < .25 ? 12 : 0;             // session micro-variation: octave
    this.ending = Math.floor(Math.random()*theme.cadences.length); // session micro-variation: ending
  }
  Player.prototype.fadeIn = function(t, tau){ var g = this.out.gain; g.cancelScheduledValues(t); g.setValueAtTime(Math.max(.0001,g.value), t); g.setTargetAtTime(1, t, tau||.7); };
  Player.prototype.fadeOut = function(t, tau){ var g = this.out.gain; g.cancelScheduledValues(t); g.setValueAtTime(Math.max(.0001,g.value), t); g.setTargetAtTime(0.0001, t, tau||.5); };
  Player.prototype.stop = function(afterMs){
    var self = this; self.stopped = true;
    setTimeout(function(){ dropChannels(self.ch); try{ self.out.disconnect(); }catch(e){} self.ch = null; }, afterMs || 0);
  };

  function variedMotif(src, expressive){
    var m = src.map(function(n){ return [n[0], n[1]]; });
    if(Math.random() < .22){                                   // subtle rest on a weak note
      var i = 1 + Math.floor(Math.random()*Math.max(1,m.length-1));
      if(m[i] && m[i][0] !== null && m.length > 2) m[i][0] = null;
    }
    if(Math.random() < (expressive ? .4 : .2)){               // passing-note ornament
      for(var j=0;j<m.length;j++){
        if(m[j][0] !== null && m[j][1] >= 1){ var d = m[j][0], b = m[j][1]; m.splice(j,1,[d,b/2],[d+(Math.random()<.5?1:-1),b/2]); break; }
      }
    }
    if(Math.random() < .25){                                   // different ending note
      var last = m[m.length-1]; if(last && last[0] !== null) last[0] = pick([0,2,4,7]);
    }
    return m;
  }
  function newPhrase(p){
    var th = p.theme, idx;
    do{ idx = Math.floor(Math.random()*th.progs.length); }while(th.progs.length > 1 && idx === p.lastProg && Math.random() < .75);
    p.lastProg = idx;
    var form = pick(["AABA","ABAC","ABAB","AABC","ABCA"]), bank = shuffle(th.motifs.slice()), map = {A:bank[0], B:bank[1]||bank[0], C:bank[2]||bank[0]};
    var bars = form.split("").map(function(k){ return map[k]; });
    if(Math.random() < .7) bars[bars.length-1] = th.cadences[(p.ending + p.phrases) % th.cadences.length];
    if(p.phrases > 0 && p.phrases % 2 === 0 && th.lead.length) p.leadIdx = (p.leadIdx + 1) % th.lead.length;   // new timbre for the next section
    p.phrase = {
      prog: th.progs[idx], bars: bars,
      breath: !th.lobby && p.phrases > 1 && Math.random() < .14,   // melody rests, bed breathes
      octave: p.octave + (S.gameState === "play" && idleSeconds() > MIX.idleAfterS && Math.random() < .4 ? 12 : 0)
    };
    p.phrases++;
  }
  function arrangement(p){
    var th = p.theme, st = S.gameState, busy = S.activity > .45, idle = idleSeconds() > MIX.idleAfterS;
    var a = { lead:!!th.lead.length, leadVel:.9, pluck:th.pluck, perc:th.perc, percVel:1, shimmer:th.shimmer, air:th.air, padBright:false, lift:false };
    if(st === "menu"){ a.perc = null; a.pluck = null; a.leadVel = .75; a.shimmer *= .6; }
    if(st === "store"){ a.perc = a.perc || "tick"; a.pluck = a.pluck || "bounce"; a.leadVel = .8; }
    if(busy){ a.shimmer = 0; a.air = 0; a.percVel = .6; a.leadVel *= .82; }      // thinner while tapping → taps stay clear
    if(idle && st !== "menu"){ a.shimmer = Math.min(.9, a.shimmer*1.8); a.padBright = true; a.leadVel = .95; }
    if(performance.now() < S.comboLiftUntil){ a.lift = true; a.pluck = a.pluck || "arp8"; }
    return a;
  }
  function renderBar(p, t0){
    var th = p.theme, beat = 60/th.bpm, bar = beat*4, root = th.root;
    if(!p.phrase || p.barInPhrase === 0) newPhrase(p);
    var chord = p.phrase.prog[p.barInPhrase], arr = arrangement(p), ch = p.ch;
    var isLast = p.barInPhrase === p.phrase.prog.length-1;
    function when(b){ var sw = (mod(b,1) === .5) ? th.swing*beat*.33 : 0; return t0 + b*beat + sw + rnd(-.008,.008); }

    /* PAD — soft "elevator" chord movement */
    try{ ch.pad.filter.frequency.setTargetAtTime(arr.padBright ? 2200 : 1400, t0, 1.2); }catch(e){}
    chordTones(root, chord, th.sevenths, th.lush && (chord === 0 || chord === 3)).forEach(function(m){
      voice(ch.pad, inWindow(m, REG.pad[0]), t0, bar + .25, rnd(.8,.95), "warm");
    });
    /* BASS — gentle, no heavy low end */
    var bR = inWindow(degMidi(root,chord), REG.bass[0]), b5 = inWindow(degMidi(root,chord+4), REG.bass[0]), b3 = inWindow(degMidi(root,chord+2), REG.bass[0]);
    if(th.bass === "walk"){ [[0,bR],[1,b3],[2,b5],[3,inWindow(degMidi(root,chord+5),REG.bass[0])]].forEach(function(n,i){ voice(ch.bass, n[1], when(n[0]), beat*.85, i ? .7 : .9, "bass"); }); }
    else if(th.bass === "bounce"){ [[0,bR,.8],[1.5,bR+12,.3],[2,b5,.6],[3.5,bR,.3]].forEach(function(n,i){ voice(ch.bass, n[1], when(n[0]), beat*n[2], i ? .6 : .9, "bass"); }); }
    else { voice(ch.bass, bR, when(0), beat*1.8, .9, "bass"); voice(ch.bass, Math.random() < .5 ? b5 : bR, when(2), beat*1.7, .7, "bass"); }

    /* LEAD — chord-relative motif, voice-led to the previous note */
    if(arr.lead && !p.phrase.breath){
      var motif = variedMotif(p.phrase.bars[p.barInPhrase] || th.motifs[0], arr.padBright);
      var timbre = th.lead[p.leadIdx % th.lead.length] || "ep";
      if(S.gameState === "store" && th.lead.indexOf("marimba") < 0) timbre = Math.random() < .5 ? "marimba" : timbre;
      var raw = [], pos = 0, first = null;
      motif.forEach(function(n){ if(n[0] !== null){ var m = degMidi(root, chord + n[0]); raw.push([m,pos,n[1]]); if(first === null) first = m; } pos += n[1]; });
      if(raw.length){
        var target = p.lastLead, shift = 0;
        while(first + shift < target - 6) shift += 12;
        while(first + shift > target + 6) shift -= 12;
        var hi = Math.max.apply(null, raw.map(function(r){ return r[0]; })) + shift;
        var lo = Math.min.apply(null, raw.map(function(r){ return r[0]; })) + shift;
        while(hi > REG.lead[1]){ shift -= 12; hi -= 12; lo -= 12; }
        while(lo < REG.lead[0]){ shift += 12; hi += 12; lo += 12; }
        var oct = (p.phrase.octave && hi + 12 <= REG.lead[1] + 5) ? 12 : 0;
        raw.forEach(function(r,i){
          var accent = mod(r[1],2) === 0 ? 1 : .86;
          voice(ch.lead, r[0]+shift+oct, when(r[1]), r[2]*beat*.92, arr.leadVel*accent*rnd(.88,1), timbre);
          if(i === raw.length-1) p.lastLead = r[0]+shift;
        });
      }
    }
    /* PLUCK / ARP — bouncing notes */
    if(arr.pluck){
      var tones = chordTones(root, chord, false).map(function(m){ return inWindow(m, REG.pluck[0]); }).sort(function(a,b){ return a-b; });
      tones.push(tones[0]+12);
      var pat = arr.lift ? "sparkle" : arr.pluck, steps = [];
      if(pat === "flow") steps = [0,1,2,3,2,1,2,1].map(function(k,i){ return [i*.5, tones[k]]; });
      else if(pat === "arp8") steps = [0,1,2,3,0,1,2,3].map(function(k,i){ return [i*.5, tones[k]]; });
      else if(pat === "bounce") steps = [[0,tones[0]],[.75,tones[2]],[1.5,tones[1]],[2,tones[0]],[2.75,tones[2]],[3.5,tones[3]]];
      else if(pat === "strum") steps = [[1,tones[1]],[1.02,tones[2]],[3,tones[0]],[3.02,tones[2]]];
      else if(pat === "sparkle") for(var s=0;s<16;s++) steps.push([s*.25, tones[s%4] + (s>7?12:0)]);
      steps.forEach(function(st,i){ voice(ch.pluck, Math.min(REG.pluck[1]+12, st[1]), when(st[0]), beat*.3, (i%2 ? .55 : .75)*(pat === "sparkle" ? .6 : 1), pat === "flow" ? "marimba" : "pluck"); });
    }
    /* PERC — soft shaker / wood tick, never a beat that competes with taps */
    if(arr.perc === "shaker"){ for(var e=0;e<8;e++) noiseVoice(ch.perc, when(e*.5), .045, (e%2 ? .5 : .28)*arr.percVel, 7200, 6800, "highpass", .7); }
    else if(arr.perc === "tick"){ voice(ch.perc, 96, when(1), .03, .35*arr.percVel, "marimba"); voice(ch.perc, 96, when(3), .03, .35*arr.percVel, "marimba"); }
    /* SHIMMER — water droplets, bubbles, air movement */
    if(arr.shimmer && Math.random() < arr.shimmer){
      var dm = inWindow(degMidi(root, chord + pick([0,2,4,7])), REG.shimmer[0]);
      droplet(ch.shimmer, dm, when(pick([.5,1.5,2.5,3,3.5])), rnd(.35,.55));
    }
    if(arr.air && Math.random() < arr.air) noiseVoice(ch.shimmer, t0, bar*.9, .05, 700, 1500, "bandpass", .9);
    /* FILL — occasional little run into the next phrase */
    if(isLast && Math.random() < .3){
      if(th.bubbles || Math.random() < .4) bubbles(ch.shimmer, root, when(3.25), 4);
      else [0,2,4].forEach(function(k,i){ voice(ch.pluck, inWindow(degMidi(root,chord+k), REG.pluck[0]), when(3+i*.33), beat*.25, .5, "pluck"); });
    }
    /* REWARD — bright musical answer after the reward sound has played */
    if(S.rewardAnswerAt && performance.now() >= S.rewardAnswerAt){
      S.rewardAnswerAt = 0;
      [0,2,4,7].forEach(function(k,i){ voice(ch.shimmer, inWindow(degMidi(root,k), REG.shimmer[0]-5), when(i*.25), .2, .45, "glock"); });
    }
    p.barInPhrase = (p.barInPhrase + 1) % p.phrase.prog.length;
    p.nextBar = t0 + bar; S.bars++;
  }

  /* ---------------------------------------------------------------------------
     SPLASH INTRO THEME — WELCOME → GAME WORLD → PLAY
     C major so it resolves into the existing splash crescendo (C-major arpeggio at 7.7 s).
     0–1 s air + droplets · 1–2 s first notes · 2–5 s melody · 5–7 s resolving phrase.
  --------------------------------------------------------------------------- */
  var INTRO = Object.freeze({
    bpm:90,
    events:[
      ["air",0,4.5,.07],["drop",.5,91,.5],["drop",1.1,88,.45],
      ["lead",1.5,76,.5,"glock"],["lead",2,79,.5,"glock"],["lead",2.5,84,1,"ep"],["lead",3.5,83,.5,"ep"],["lead",4,81,.5,"ep"],
      ["lead",4.5,79,1,"ep"],["lead",5.5,76,.5,"ep"],["lead",6,77,.5,"ep"],["lead",6.5,81,1,"ep"],["lead",7.5,79,.5,"ep"],
      ["lead",8,77,.5,"ep"],["lead",8.5,76,.5,"ep"],["lead",9,74,1,"ep"],["lead",10,76,.5,"glock"],["lead",10.5,72,2.5,"ep"],
      ["pad",1.5,[60,64,67,71,74],2.5],["pad",4,[57,60,64,67],2],["pad",6,[57,60,64,65],2],["pad",8,[55,60,62,67],1],
      ["pad",9,[55,59,62,65],1.5],["pad",10.5,[60,64,67,71,74],3.5],
      ["bass",1.5,48,2.5],["bass",4,45,2],["bass",6,41,2],["bass",8,43,2.5],["bass",10.5,48,3],
      ["drop",3,88,.4],["drop",5,93,.35],["drop",7,91,.4],["bubbles",10.5,4],["drop",12,96,.3]
    ],
    lengthBeats:13.5, shortFrom:6
  });
  function playIntro(short){
    var ctx = S.ctx, beat = 60/INTRO.bpm, start = ctx.currentTime + .08, from = short ? INTRO.shortFrom : 0;
    var out = ctx.createGain(); out.gain.value = 1.9; out.connect(S.bus.input);   // first impression: a touch more present
    var ch = makeChannels(out);
    INTRO.events.forEach(function(e){
      if(e[1] < from && e[0] !== "air") return;
      var t = start + Math.max(0, e[1]-from)*beat;
      if(e[0] === "lead") voice(ch.lead, e[2], t, e[3]*beat*.95, .85, e[4]);
      else if(e[0] === "pad") e[2].forEach(function(m){ voice(ch.pad, m, t, e[3]*beat+.2, .85, "warm"); });
      else if(e[0] === "bass") voice(ch.bass, e[2], t, e[3]*beat*.9, .7, "bass");
      else if(e[0] === "drop") droplet(ch.shimmer, e[2], t, e[3]);
      else if(e[0] === "bubbles") bubbles(ch.shimmer, 60, t, e[2]);
      else if(e[0] === "air") noiseVoice(ch.shimmer, t, (short ? 2 : e[2])*beat, e[3], 600, 1500, "bandpass", .8);
    });
    S.intro = {out:out, ch:ch, short:!!short, startedAt:start};
    S.introEndsAt = start + (INTRO.lengthBeats - from)*beat;
    return S.introEndsAt - start;
  }
  function releaseIntro(){
    if(!S.intro) return;
    var it = S.intro, t = S.ctx.currentTime; S.intro = null;
    try{ it.out.gain.cancelScheduledValues(t); it.out.gain.setValueAtTime(Math.max(.0001,it.out.gain.value),t); it.out.gain.setTargetAtTime(.0001,t,.6); }catch(e){}
    setTimeout(function(){ dropChannels(it.ch); try{ it.out.disconnect(); }catch(e){} }, 4200);
  }

  /* Small transition gesture between themes: air swell + rising droplets in the new key. */
  function transitionGesture(theme, t){
    var ch = S.transitionCh;
    if(!ch){ S.transitionCh = ch = makeChannels(S.bus.input); }
    noiseVoice(ch.shimmer, t, 1.4, .06, 500, 1700, "bandpass", .8);
    [0,2,4,7].forEach(function(k,i){ droplet(ch.shimmer, inWindow(degMidi(theme.root,k), REG.shimmer[0]-5), t + .18 + i*.14, .4 - i*.04); });
  }

  /* ---------------------------------------------------------------------------
     DIRECTOR
  --------------------------------------------------------------------------- */
  function startTheme(id, opts){
    opts = opts || {};
    var theme = THEME_BY_ID[id] || THEMES[0], ctx = S.ctx, t = ctx.currentTime;
    var old = S.player, oldLobby = S.lobby;
    var begin = t + (opts.instant ? .1 : .95);
    if(!opts.instant) transitionGesture(theme, t + .05);
    var p = new Player(theme, begin);
    p.fadeIn(begin - .2, opts.instant ? .3 : .75);
    S.player = p; S.lobby = null; S.phase = "theme";
    if(old){ old.fadeOut(t, .5); old.stop(4200); S.counters.crossfades++; }
    if(oldLobby){ oldLobby.fadeOut(t, .6); oldLobby.stop(4200); S.counters.crossfades++; }
    releaseIntro();
    S.currentTheme = theme.id; S.themeStartedAt = performance.now();
    S.history.push(theme.id); if(S.history.length > 12) S.history.shift();
    showNowPlaying(theme);
    return theme.id;
  }
  function startLobby(){
    if(S.lobby) return;
    var t = S.ctx.currentTime, p = new Player(SPLASH_LOBBY, t + .3);
    p.fadeIn(t + .1, 1.2); S.lobby = p; S.phase = "lobby";
    if(S.intro){ var it = S.intro; setTimeout(function(){ if(S.intro === it) releaseIntro(); }, 2500); }
  }
  function splashVisible(){
    var s = document.getElementById("geiSplash");
    return !!(s && s.isConnected && !s.classList.contains("isDone") && s.style.display !== "none");
  }
  function visible(el){ if(!el) return false; try{ var cs = getComputedStyle(el); return cs.display !== "none" && cs.visibility !== "hidden" && parseFloat(cs.opacity||"1") > .05; }catch(e){ return false; } }
  function readGameState(){
    if(splashVisible()) return "splash";
    var store = document.getElementById("storePanel");
    if(store && store.classList.contains("open")) return "store";
    var pre = document.getElementById("preGameCard");
    if(pre && pre.classList.contains("show")) return "menu";
    try{ if(typeof anyPanelOpen === "function" && anyPanelOpen()) return "menu"; }catch(e){}
    return "play";
  }
  function readFlowTier(){
    var w = document.getElementById("world");
    return (w && w.getAttribute("data-flow-tier")) || "calm";
  }
  function gameAudioActive(){
    try{ if(typeof GEI_TAP_PERFORMANCE !== "undefined" && GEI_TAP_PERFORMANCE.voices) return GEI_TAP_PERFORMANCE.voices() > 0; }catch(e){}
    return false;
  }
  function idleSeconds(){ return (performance.now() - S.lastActivityAt)/1000 + S.debugIdleOffset; }

  /* Activity-decay mixer → target music level (spec §4/§5 + ceiling recommendation). */
  function computeMixTarget(){
    var s = S.activity, idle = idleSeconds(), level;
    if(s > .25){
      level = lerp(MIX.active[1], MIX.active[0], clamp((s-.25)/.6,0,1));
    }else if(idle < MIX.idleAfterS){
      var calm = lerp(MIX.calm[0], MIX.calm[1], ease((idle-1.2)/(MIX.idleAfterS-1.2)));
      level = lerp(calm, MIX.active[1], s/.25);
    }else if(idle < MIX.idleSettleAfterS){
      level = lerp(MIX.idle[0], MIX.idle[1], ease((idle-MIX.idleAfterS)/MIX.idleLiftS));
    }else{
      level = lerp(MIX.idle[1], MIX.idleSettleLevel, ease((idle-MIX.idleSettleAfterS)/60));
    }
    if(gameAudioActive()) level = Math.min(level, MIX.gameAudioCap);   // stay underneath game audio
    if(S.gameState === "menu") level = Math.min(level, MIX.calm[1]);
    return Math.min(level, MIX.idleCeiling);                            // idle lift ceiling
  }

  function applyLevels(dt){
    var b = S.bus; if(!b) return;
    var t = S.ctx.currentTime;
    S.mixTarget = computeMixTarget();
    var tau = S.mixTarget < S.mixLevel ? MIX.fallTau : MIX.riseTau;
    S.mixLevel += (S.mixTarget - S.mixLevel) * (1 - Math.exp(-dt/tau));
    var g = Math.min(S.mixLevel * outGain(), MIX.absoluteCeiling * MIX.outputScale);
    if(Math.abs(g - (S.appliedMix||0)) > .0008){ try{ b.mix.gain.setTargetAtTime(Math.max(.0001,g), t, .08); }catch(e){} S.appliedMix = g; }
    /* frequency-aware mix: while tapping, soften the top end so tap/water detail cuts through */
    var tone = lerp(7200, 3200, clamp(S.activity/.8,0,1));
    if(Math.abs(tone - (S.appliedTone||0)) > 60){ try{ b.tone.frequency.setTargetAtTime(tone, t, .25); }catch(e){} S.appliedTone = tone; }
    /* duck release */
    if(S.duckMult < 1 && performance.now() > S.duckUntil){
      S.duckMult = 1; S.duckKind = "";
      try{ b.duck.gain.cancelScheduledValues(t); b.duck.gain.setValueAtTime(Math.max(.0001,b.duck.gain.value), t); b.duck.gain.setTargetAtTime(1, t, .32); }catch(e){}
    }
  }

  function duck(kind){
    var d = DUCK[kind]; if(!d || !S.bus || !S.playing) return false;
    var nowMs = performance.now(), t = S.ctx.currentTime;
    var mult = clamp(Math.max(d.level, MIX.duckFloor) / Math.max(.05, S.mixLevel), .2, 1);
    S.duckUntil = Math.max(S.duckUntil, nowMs + d.hold*1000);
    if(mult < S.duckMult - .01 || S.duckMult === 1){
      if(mult < 1){
        S.duckMult = Math.min(S.duckMult, mult); S.duckKind = kind;
        try{ S.bus.duck.gain.cancelScheduledValues(t); S.bus.duck.gain.setValueAtTime(Math.max(.0001,S.bus.duck.gain.value), t); S.bus.duck.gain.setTargetAtTime(S.duckMult, t, .035); }catch(e){}
      }
    }
    S.counters.ducks++; S.duckLog[kind] = (S.duckLog[kind]||0) + 1;
    return true;
  }
  function activity(kind){
    var add = ACTIVITY[kind] || ACTIVITY.game;
    S.activity = Math.min(1, S.activity + add);
    S.lastActivityAt = performance.now(); S.debugIdleOffset = 0;
    S.counters.activity++;
  }
  /* Public notification entry: counts as activity and ducks by category. */
  var lastNotify = {};
  function notify(kind){
    var n = performance.now();
    if(lastNotify[kind] && n - lastNotify[kind] < 60) return;
    lastNotify[kind] = n;
    if(kind === "tap") activity("tap");
    else if(kind === "confirm" || kind === "store") activity("button");
    else if(kind === "reward" || kind === "mission"){ activity("reward"); S.rewardAnswerAt = n + 1500; }
    else activity("game");
    duck(kind);
  }

  function tick(){
    var n = performance.now(), dt = Math.min(.5, (n - S.lastTick)/1000); S.lastTick = n;
    S.activity *= Math.pow(.5, dt/MIX.halfLifeS);
    if(S.activity < .001) S.activity = 0;
    if(!S.playing || !S.ctx || S.hidden) return;
    try{
      if(S.ctx.state !== "running") return;
      if(!S._stateAt || n - S._stateAt > 400){
        S._stateAt = n; S.gameState = readGameState();
        var tier = readFlowTier();
        if((tier === "rapid" || tier === "frenzy") && S.flowTier !== tier && n - S.lastComboLift > 8000){ S.comboLiftUntil = n + 2600; S.lastComboLift = n; }
        S.flowTier = tier;
      }
      applyLevels(dt);
      var t = S.ctx.currentTime;
      /* phase flow: intro → (lobby while splash is up) → gameplay theme */
      if(S.phase === "intro"){
        var remaining = S.introEndsAt - t;
        if(remaining < .8 || (S.intro && !S.intro.short && !splashVisible() && remaining > 2.5 && t - S.intro.startedAt > 1.5)){
          if(splashVisible()) startLobby(); else startTheme(nextThemeId());
        }
      }else if(S.phase === "lobby" && !splashVisible()){
        startTheme(nextThemeId());
      }else if(S.phase === "theme" && S.themeStartedAt && n - S.themeStartedAt > MIX.themeMaxMinutes*60000 && idleSeconds() < 30){
        startTheme(nextThemeId(S.currentTheme));
      }
      var look = t + .3;
      [S.lobby, S.player].forEach(function(p){
        if(!p || p.stopped) return;
        if(p.nextBar < t - .5) p.nextBar = t + .05;            // recover after a stall (tab throttle etc.)
        if(p.nextBar < look) renderBar(p, p.nextBar);
      });
    }catch(e){ S.counters.errors++; }
  }
  function ensureTimer(){ if(!S.timer) S.timer = setInterval(tick, 110); }
  function stopTimer(){ if(S.timer){ clearInterval(S.timer); S.timer = null; } }

  function fadeUser(on, tau){
    if(!S.bus) return;
    var t = S.ctx.currentTime, g = S.bus.user.gain;
    try{ g.cancelScheduledValues(t); g.setValueAtTime(Math.max(.0001,g.value), t); g.setTargetAtTime(on ? 1 : .0001, t, tau || .25); }catch(e){}
  }

  /* Start from a valid user gesture (or an already-running shared context). */
  function start(fromGesture){
    if(!S.enabled) return false;
    if(S.playing) return true;
    var b = ensureGraph(); if(!b) return false;
    if(S.ctx.state !== "running" && !fromGesture) return false;
    S.initialized = true; S.playing = true; S.counters.starts++;
    S.mixLevel = MIX.calm[0]; S.appliedMix = 0;
    b.mix.gain.value = Math.max(.0001, S.mixLevel*outGain());
    fadeUser(true, .4);
    if(!S.player && !S.lobby && S.phase === "idle"){
      S.phase = "intro";
      playIntro(!splashVisible());
    }else if(!S.player && S.phase !== "intro"){
      startTheme(S.currentTheme || nextThemeId(), {instant:true});
    }else if(S.player){
      S.player.nextBar = S.ctx.currentTime + .1;
    }
    ensureTimer();
    syncUi();
    return true;
  }
  function pause(){
    if(!S.playing) return false;
    S.playing = false;
    fadeUser(false, .2);
    stopTimer();                       // nothing keeps running while music is off
    syncUi();
    return true;
  }
  function resume(){
    if(!S.enabled) return false;
    if(S.playing) return true;
    if(!S.initialized) return start(true);
    try{ if(S.ctx && S.ctx.state === "suspended") S.ctx.resume(); }catch(e){}
    S.playing = true;
    if(S.player) S.player.nextBar = S.ctx.currentTime + .12;
    if(S.lobby) S.lobby.nextBar = S.ctx.currentTime + .12;
    fadeUser(true, .5); ensureTimer(); syncUi();
    return true;
  }
  function setEnabled(on){
    on = !!on; S.enabled = on; lsSet(KEYS.enabled, on ? "true" : "false");
    if(on){ if(!S.initialized) start(true); else resume(); }
    else pause();
    syncUi();
    return S.enabled;
  }
  function toggle(){ return setEnabled(!S.enabled); }
  function setVolume(v){
    v = parseFloat(v); if(!isFinite(v)) return S.volume;
    S.volume = clamp(v,0,1); lsSet(KEYS.volume, String(Math.round(S.volume*100)/100));
    S.appliedMix = -1;
    syncUi();
    return S.volume;
  }
  function next(){
    if(!S.playing || !S.bus) return null;
    return startTheme(nextThemeId(S.currentTheme));
  }

  /* ---------------------------------------------------------------------------
     BROWSER AUTOPLAY SAFETY — never fight the policy; wait for the first gesture.
  --------------------------------------------------------------------------- */
  var UNLOCK_EVENTS = ["pointerdown","touchend","click","keydown"];
  function onUnlock(e){
    if(e && e.target && e.target.closest && e.target.closest("#damMusicBtn,#damMusicPop")) return;   // the button handles itself
    if(!S.enabled){ unbindUnlock(); return; }
    sharedContext();                   // resume inside the gesture (iOS/Chrome policy)
    start(true);
    if(S.ctx && S.ctx.state === "running") unbindUnlock();
  }
  function bindUnlock(){ if(S.unlockBound) return; S.unlockBound = true; UNLOCK_EVENTS.forEach(function(ev){ window.addEventListener(ev, onUnlock, {capture:true, passive:true}); }); }
  function unbindUnlock(){ if(!S.unlockBound) return; S.unlockBound = false; UNLOCK_EVENTS.forEach(function(ev){ window.removeEventListener(ev, onUnlock, {capture:true}); }); }

  /* ---------------------------------------------------------------------------
     ACTIVITY + DUCKING HOOKS — wrap existing sound functions without changing them
  --------------------------------------------------------------------------- */
  function onPointer(e){
    var t = e.target;
    if(t && t.closest){
      if(t.closest("#damMusicBtn,#damMusicPop")) return;
      if(t.closest("#storePanel,#dmStoreFloatBtn,#songVaultStoreBtn")){ notify("store"); return; }
      if(t.closest("button,a,[role=button],input,select,label,summary")){ notify("confirm"); return; }
    }
    notify("tap");
  }
  function onKey(e){ if(e && (e.key === " " || e.key === "Enter")) activity("key"); }

  function wrapGlobal(name, kind){
    try{
      var fn = window[name];
      if(typeof fn !== "function" || fn.__v2188Wrapped) return false;
      var wrapped = function(){
        var out = fn.apply(this, arguments);
        try{ if(out !== false) notify(kind); }catch(e){}
        return out;
      };
      wrapped.__v2188Wrapped = true; wrapped.__v2188Original = fn;
      window[name] = wrapped;
      if(window[name] !== wrapped) return false;
      S.counters.wrapped++;
      return true;
    }catch(e){ return false; }
  }
  /* damVoice/damNoise carry UI clicks (gesture:true) and big hydraulic hits (splash,
     pressure, release). Ambient/living-world sounds are quiet and never duck music. */
  function wrapPrimitive(name){
    try{
      var fn = window[name];
      if(typeof fn !== "function" || fn.__v2188Wrapped) return false;
      var wrapped = function(o){
        var out = fn.apply(this, arguments);
        try{
          if(out && o){
            if(o.gesture) duck("confirm");
            else if((o.gain || 0) >= .028) duck("splash");
          }
        }catch(e){}
        return out;
      };
      wrapped.__v2188Wrapped = true; wrapped.__v2188Original = fn;
      window[name] = wrapped;
      if(window[name] !== wrapped) return false;
      S.counters.wrapped++;
      return true;
    }catch(e){ return false; }
  }
  var HOOKS = Object.freeze([
    ["playWaterTap","tap"], ["geiDamNationTapSound","tap"],
    ["playTimerWarningSound","critical"],
    ["geiDamNationVoice","character"], ["playPunSound","character"],
    ["triggerDamItePersonality","character"], ["geiDamNationMoment","character"],
    ["playDayRewardSound","reward"], ["playFreeSpinSound","reward"], ["playSongUnlockSound","reward"], ["playBonusSpinSounds","reward"],
    ["playLoopCompleteSound","mission"], ["playLevelFanfare","mission"],
    ["playDamBreakSound","moment"], ["playFlowSound","splash"], ["playOceanSound","splash"]
  ]);
  function installHooks(){
    HOOKS.forEach(function(h){ wrapGlobal(h[0], h[1]); });
    wrapPrimitive("damVoice"); wrapPrimitive("damNoise");
    /* Signature moments: wrap the public show() and duck when a moment actually plays. */
    var tries = 0;
    (function sig(){
      var api = window.__GEI_V2156_SIGNATURE_MOMENTS__;
      if(api && typeof api.show === "function" && !api.show.__v2188Wrapped && typeof api.getCount === "function"){
        var orig = api.show;
        var w = function(){
          var before = api.getCount(), r = orig.apply(this, arguments);
          try{ if(r && api.getCount() > before) notify("signature"); }catch(e){}
          return r;
        };
        w.__v2188Wrapped = true; w.__v2188Original = orig;
        try{ api.show = w; S.counters.wrapped++; }catch(e){}
        return;
      }
      if(++tries < 40) setTimeout(sig, 100);
    })();
  }

  /* ---------------------------------------------------------------------------
     UI — tiny 🎵 control + fading NOW PLAYING chip
  --------------------------------------------------------------------------- */
  function css(){
    if(document.getElementById("damSoundtrack2188Style")) return;
    var s = document.createElement("style");
    s.id = "damSoundtrack2188Style";
    s.textContent =
      "#damMusicBtn{position:relative;z-index:2;min-width:44px;min-height:44px;transition:filter .2s,opacity .2s}"+
      "#damMusicBtn.off{filter:saturate(.25) brightness(.8);opacity:.78}"+
      "#damMusicBtn:focus-visible{outline:3px solid var(--gold,#ffd27a);outline-offset:2px}"+
      "#damMusicPop{position:fixed;z-index:10020;width:212px;padding:10px 12px;border-radius:16px;background:rgba(6,7,13,.84);"+
      "border:1px solid rgba(255,255,255,.16);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 14px 44px rgba(0,0,0,.4);"+
      "color:#eafcff;font:800 10px/1.2 system-ui,sans-serif;letter-spacing:.1em;opacity:0;transform:translateY(-4px);pointer-events:none;transition:opacity .2s,transform .25s}"+
      "#damMusicPop.show{opacity:1;transform:none;pointer-events:auto}"+
      "#damMusicPop .row{display:flex;align-items:center;gap:8px;margin-top:8px}"+
      "#damMusicPop .row:first-child{margin-top:0}"+
      "#damMusicPop .tune{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#bfefff}"+
      "#damMusicPop input[type=range]{flex:1;accent-color:#2fd2ff;min-width:0}"+
      "#damMusicPop button{border:1px solid rgba(255,255,255,.2);background:rgba(47,210,255,.14);color:#fff;border-radius:999px;padding:6px 10px;font:800 10px system-ui,sans-serif;letter-spacing:.08em;cursor:pointer}"+
      ".dam2188Now{position:fixed;left:12px;top:16%;z-index:9985;padding:7px 11px;border-radius:12px;background:rgba(6,7,13,.56);"+
      "border:1px solid rgba(255,255,255,.13);backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px);pointer-events:none;"+
      "font:800 8px/1.25 system-ui,sans-serif;letter-spacing:.14em;color:rgba(234,252,255,.62);opacity:0;transform:translateX(-6px);transition:opacity .35s,transform .45s}"+
      ".dam2188Now b{display:block;margin-top:3px;font-size:11px;letter-spacing:.06em;color:#eafcff}"+
      ".dam2188Now.show{opacity:1;transform:none}"+
      ".dam2188Note{position:fixed;z-index:9984;pointer-events:none;font-size:13px;opacity:0;animation:dam2188Note 1.6s ease-out forwards}"+
      "@keyframes dam2188Note{0%{opacity:0;transform:translate(0,4px) scale(.7)}20%{opacity:.85}100%{opacity:0;transform:translate(var(--dx,10px),-34px) scale(1.05)}}"+
      "@media (prefers-reduced-motion:reduce){.dam2188Note{display:none}.dam2188Now,#damMusicPop{transition:none}}";
    document.head.appendChild(s);
  }
  var ui = {btn:null, pop:null, now:null, popTimer:null, pressTimer:null, longPressed:false};
  function ensureButton(){
    if(ui.btn && ui.btn.isConnected) return ui.btn;
    var host = document.querySelector(".hudRight"); if(!host) return null;
    var b = document.getElementById("damMusicBtn");
    if(!b){
      b = document.createElement("button");
      b.id = "damMusicBtn"; b.type = "button"; b.className = "iconBtn";
      var fs = document.getElementById("fullscreenBtn");
      if(fs && fs.parentNode === host) host.insertBefore(b, fs); else host.appendChild(b);
      b.addEventListener("click", function(e){
        e.preventDefault(); e.stopPropagation();
        if(ui.longPressed){ ui.longPressed = false; return; }
        var on = toggle();
        if(on) openPop(3600); else closePop();
      });
      b.addEventListener("pointerdown", function(){
        ui.longPressed = false; clearTimeout(ui.pressTimer);
        ui.pressTimer = setTimeout(function(){ ui.longPressed = true; openPop(6000); }, 480);
      });
      ["pointerup","pointerleave","pointercancel"].forEach(function(ev){ b.addEventListener(ev, function(){ clearTimeout(ui.pressTimer); }); });
      b.addEventListener("contextmenu", function(e){ e.preventDefault(); ui.longPressed = true; openPop(6000); });
    }
    ui.btn = b; return b;
  }
  function ensurePop(){
    if(ui.pop) return ui.pop;
    var p = document.createElement("div");
    p.id = "damMusicPop"; p.setAttribute("role","dialog"); p.setAttribute("aria-label","Music settings");
    p.innerHTML = '<div class="row"><span>🎵</span><span class="tune" id="damMusicPopTune">MUSIC</span></div>'+
      '<div class="row"><span aria-hidden="true">🔈</span><input type="range" min="0" max="100" step="1" id="damMusicVol" aria-label="Music volume"><span aria-hidden="true">🔊</span></div>'+
      '<div class="row"><button type="button" id="damMusicNext">🎲 NEW TUNE</button><button type="button" id="damMusicPower">OFF</button></div>';
    document.body.appendChild(p);
    var vol = p.querySelector("#damMusicVol");
    vol.addEventListener("input", function(){ setVolume(vol.value/100); keepPop(); });
    p.querySelector("#damMusicNext").addEventListener("click", function(e){ e.stopPropagation(); if(!S.enabled) setEnabled(true); next(); keepPop(); });
    p.querySelector("#damMusicPower").addEventListener("click", function(e){ e.stopPropagation(); toggle(); keepPop(); });
    p.addEventListener("pointerdown", function(e){ e.stopPropagation(); keepPop(); });
    document.addEventListener("pointerdown", function(e){
      if(!ui.pop || !ui.pop.classList.contains("show")) return;
      if(e.target && e.target.closest && e.target.closest("#damMusicPop,#damMusicBtn")) return;
      closePop();
    }, true);
    ui.pop = p; return p;
  }
  function placePop(){
    if(!ui.pop || !ui.btn) return;
    var r = ui.btn.getBoundingClientRect(), w = 212;
    ui.pop.style.top = Math.round(r.bottom + 8) + "px";
    ui.pop.style.left = Math.round(clamp(r.right - w, 8, window.innerWidth - w - 8)) + "px";
  }
  function openPop(ms){ ensurePop(); placePop(); syncUi(); ui.pop.classList.add("show"); keepPop(ms); }
  function keepPop(ms){ clearTimeout(ui.popTimer); ui.popTimer = setTimeout(closePop, ms || 4200); }
  function closePop(){ clearTimeout(ui.popTimer); if(ui.pop) ui.pop.classList.remove("show"); }
  function syncUi(){
    var b = ensureButton();
    if(b){
      b.textContent = S.enabled ? "🎵" : "🔇";
      b.classList.toggle("off", !S.enabled);
      b.setAttribute("aria-pressed", S.enabled ? "true" : "false");
      b.setAttribute("aria-label", S.enabled ? "Music on. Tap to turn off, long-press for volume" : "Music off. Tap to turn on");
      b.title = S.enabled ? "Music on" : "Music off";
    }
    if(ui.pop){
      var th = THEME_BY_ID[S.currentTheme];
      ui.pop.querySelector("#damMusicPopTune").textContent = !S.enabled ? "MUSIC OFF" : th ? th.emoji + " " + th.name.toUpperCase() : "WELCOME";
      var vol = ui.pop.querySelector("#damMusicVol"); if(document.activeElement !== vol) vol.value = Math.round(S.volume*100);
      ui.pop.querySelector("#damMusicPower").textContent = S.enabled ? "OFF" : "ON";
    }
  }
  function introBusy(){
    var b = document.getElementById("tl2185IntroBadge");
    return !!(b && b.classList.contains("show")) || splashVisible();
  }
  function showNowPlaying(theme, tries){
    tries = tries || 0;
    if(introBusy() && tries < 12){ setTimeout(function(){ showNowPlaying(theme, tries+1); }, 400); return; }
    if(S.currentTheme !== theme.id) return;
    var n = ui.now;
    if(!n){ n = ui.now = document.createElement("div"); n.className = "dam2188Now"; n.id = "dam2188NowPlaying"; n.setAttribute("aria-live","polite"); document.body.appendChild(n); }
    n.innerHTML = "🎵 NOW PLAYING<b></b>"; n.querySelector("b").textContent = theme.emoji + " " + theme.name;
    n.classList.remove("show"); void n.offsetWidth; n.classList.add("show");
    clearTimeout(n.__t); n.__t = setTimeout(function(){ n.classList.remove("show"); }, 2800);
    syncUi();
    try{
      if(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      var r = n.getBoundingClientRect();
      ["♪","♫","♪"].forEach(function(ch,i){
        var p = document.createElement("span");
        p.className = "dam2188Note"; p.textContent = ch;
        p.style.left = Math.round(r.right - 14 + i*9) + "px"; p.style.top = Math.round(r.top + 4) + "px";
        p.style.setProperty("--dx", (8 + i*7) + "px"); p.style.animationDelay = (i*.18) + "s";
        p.style.color = ["#2fd2ff","#ff9df2","#eafcff"][i];
        document.body.appendChild(p);
        setTimeout(function(){ p.remove(); }, 2200);
      });
    }catch(e){}
  }

  /* ---------------------------------------------------------------------------
     LIFECYCLE — hidden tab pauses scheduling; timers never outlive the page
  --------------------------------------------------------------------------- */
  function onVisibility(){
    S.hidden = !!document.hidden;
    if(!S.initialized) return;
    if(S.hidden){ if(S.playing) fadeUser(false, .15); stopTimer(); }
    else if(S.enabled && S.playing){
      try{ if(S.ctx && S.ctx.state === "suspended") S.ctx.resume(); }catch(e){}
      var t = S.ctx.currentTime;
      if(S.player) S.player.nextBar = t + .15;
      if(S.lobby) S.lobby.nextBar = t + .15;
      S.lastTick = performance.now();
      fadeUser(true, .6); ensureTimer();
    }
  }
  function destroy(){
    stopTimer(); unbindUnlock();
    [S.player, S.lobby].forEach(function(p){ if(p){ try{ p.fadeOut(S.ctx.currentTime,.05); }catch(e){} p.stop(0); } });
    S.player = S.lobby = null; releaseIntro();
    if(S.transitionCh){ dropChannels(S.transitionCh); S.transitionCh = null; }
    if(S.ownsContext && S.ctx){ try{ S.ctx.close(); }catch(e){} }
    S.playing = false;
  }

  /* ---------------------------------------------------------------------------
     SELF TEST + PUBLIC STATE (window.DAMSoundtrack is the single source of truth)
  --------------------------------------------------------------------------- */
  function selfTest(){
    return {
      version:VERSION, installed:S.installed, initialized:S.initialized, playing:S.playing, enabled:S.enabled,
      phase:S.phase, currentTheme:S.currentTheme, themes:THEMES.length,
      sharedContext: S.ctx ? !S.ownsContext : null,
      contextsCreatedByDirector:S.counters.contextsCreated,
      activeVoices:S.voices, peakVoices:S.peakVoices, maxVoices:MAX_VOICES, bars:S.bars,
      mixLevel:+S.mixLevel.toFixed(3), mixTarget:+S.mixTarget.toFixed(3), duckMult:+S.duckMult.toFixed(3),
      ceilingRespected:S.mixTarget <= MIX.idleCeiling + 1e-9,
      hooksWrapped:S.counters.wrapped, errors:S.counters.errors,
      presentationOnly:true, gameplayStateChanged:false, rewardEconomyChanged:false
    };
  }
  var api = {
    version:VERSION,
    get enabled(){ return S.enabled; },
    get musicVolume(){ return S.volume; },
    get currentTheme(){ return S.currentTheme; },
    get initialized(){ return S.initialized; },
    get playing(){ return S.playing; },
    get activityScore(){ return +S.activity.toFixed(3); },
    get idleSeconds(){ return +idleSeconds().toFixed(1); },
    get phase(){ return S.phase; },
    get gameState(){ return S.gameState; },
    get mixLevel(){ return S.mixLevel; },
    get mixTarget(){ return S.mixTarget; },
    get duckMultiplier(){ return S.duckMult; },
    get history(){ return S.history.slice(); },
    themes:THEMES.map(function(t){ return {id:t.id, name:t.name, bpm:t.bpm}; }),
    mix:MIX, duckRules:DUCK, priorities:PRIORITIES, storageKeys:KEYS,
    start:function(){ return start(true); }, pause:pause, resume:resume, toggle:toggle,
    setEnabled:setEnabled, setVolume:setVolume, next:next, duck:duck, notify:notify,
    selfTest:selfTest, destroy:destroy,
    debug:{
      simulateIdle:function(sec){ S.activity = 0; S.debugIdleOffset = Math.max(0, +sec || 0); },
      stats:function(){ return {voices:S.voices, peakVoices:S.peakVoices, notes:S.notes, bars:S.bars, counters:JSON.parse(JSON.stringify(S.counters)), ducksByKind:JSON.parse(JSON.stringify(S.duckLog)), duckKind:S.duckKind, ctxState:S.ctx ? S.ctx.state : "none", timerActive:!!S.timer}; },
      bus:function(){ return S.bus; },
      settle:function(){ S.mixLevel = computeMixTarget(); S.appliedMix = -1; applyLevels(.11); return S.mixLevel; },
      meter:function(){
        if(!S.bus) return null;
        if(!S.meter){ S.meter = S.ctx.createAnalyser(); S.meter.fftSize = 2048; S.bus.limit.connect(S.meter); }
        var d = new Float32Array(S.meter.fftSize); S.meter.getFloatTimeDomainData(d);
        var pk = 0; for(var i=0;i<d.length;i++){ var a = Math.abs(d[i]); if(a > pk) pk = a; }
        return pk;
      },
      nextThemeId:nextThemeId,
      play:function(id){ if(!S.playing || !THEME_BY_ID[id]) return null; return startTheme(id); }
    }
  };

  function install(){
    if(S.installed) return;
    S.installed = true;
    loadPrefs(); css(); ensureButton(); syncUi();
    installHooks();
    document.addEventListener("pointerdown", onPointer, {capture:true, passive:true});
    document.addEventListener("keydown", onKey, {capture:true, passive:true});
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", function(e){ if(!e.persisted) destroy(); else { stopTimer(); } });
    window.addEventListener("pageshow", function(e){ if(e.persisted && S.playing && !document.hidden) ensureTimer(); });
    window.addEventListener("resize", placePop, {passive:true});
    if(S.enabled){
      /* If the shared context is already running (a prior gesture), start now; otherwise wait politely. */
      var ready = false;
      try{ ready = typeof audioCtx !== "undefined" && audioCtx && audioCtx.state === "running"; }catch(e){}
      if(ready) start(true); else bindUnlock();
    }
  }

  window.DAMSoundtrack = api;
  window.__GEI_DAM_FRIENDLY_SOUNDTRACK__ = api;
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", install, {once:true});
  else install();
})();
