/* GEI 666 — AUDIO IMMERSION ENHANCEMENT v3000
   Better use of existing audio library, randomization, mill/machinery sounds.
   Uses Web Audio API synthesis — no external audio files added.
   Presentation-only: no gameplay, economy, or state changes. */
(function(){
  "use strict";
  if(window.__GEI_V3000_AUDIO__) return;

  var VERSION = "V3000";
  var audioCtx = null;

  function getCtx(){
    if(!audioCtx){
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch(e){ return null; }
    }
    if(audioCtx.state === "suspended") audioCtx.resume().catch(function(){});
    return audioCtx;
  }

  /* Synthesized industrial sounds using Web Audio API */

  function playWaterFlow(duration){
    var ctx = getCtx(); if(!ctx) return;
    var bufSize = ctx.sampleRate * (duration || 1.5);
    var buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    var data = buf.getChannelData(0);
    for(var i = 0; i < bufSize; i++){
      data[i] = (Math.random() * 2 - 1) * 0.08 * (1 - i / bufSize);
    }
    var src = ctx.createBufferSource();
    src.buffer = buf;
    var filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 600;
    filter.Q.value = 2;
    var gain = ctx.createGain();
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (duration || 1.5));
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  }

  function playGearClick(){
    var ctx = getCtx(); if(!ctx) return;
    var osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.value = 180 + Math.random() * 60;
    var gain = ctx.createGain();
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }

  function playPressureHiss(){
    var ctx = getCtx(); if(!ctx) return;
    var bufSize = ctx.sampleRate * 0.4;
    var buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    var data = buf.getChannelData(0);
    for(var i = 0; i < bufSize; i++){
      data[i] = (Math.random() * 2 - 1) * 0.05 * Math.pow(1 - i / bufSize, 2);
    }
    var src = ctx.createBufferSource();
    src.buffer = buf;
    var filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 3000;
    var gain = ctx.createGain();
    gain.gain.value = 0.04;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  }

  function playMillGrind(){
    var ctx = getCtx(); if(!ctx) return;
    var osc1 = ctx.createOscillator();
    osc1.type = "sawtooth";
    osc1.frequency.value = 60 + Math.random() * 20;
    var osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.value = 120 + Math.random() * 30;
    var gain = ctx.createGain();
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.6);
    osc2.stop(ctx.currentTime + 0.6);
  }

  function playWheelCreak(){
    var ctx = getCtx(); if(!ctx) return;
    var osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.3);
    var gain = ctx.createGain();
    gain.gain.setValueAtTime(0.025, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  function playJackpotFanfare(){
    var ctx = getCtx(); if(!ctx) return;
    var notes = [523, 659, 784, 1047];
    notes.forEach(function(freq, i){
      var osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      var gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + i * 0.15 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.5);
    });
  }

  function playLevelUpChime(){
    var ctx = getCtx(); if(!ctx) return;
    var notes = [440, 554, 659, 880];
    notes.forEach(function(freq, i){
      var osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = freq;
      var gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + i * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.6);
    });
  }

  function playSpinClick(){
    var ctx = getCtx(); if(!ctx) return;
    var osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.value = 800 + Math.random() * 200;
    var gain = ctx.createGain();
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  }

  function playWinChime(){
    var ctx = getCtx(); if(!ctx) return;
    var notes = [659, 784];
    notes.forEach(function(freq, i){
      var osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      var gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + i * 0.1 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.3);
    });
  }

  /* Hook into game events for contextual audio */
  function hookGameEvents(){
    /* DAM MACHINE spin */
    var spinBtn = document.getElementById("dmSpinBtn");
    if(spinBtn && !spinBtn._gei666AudioHook){
      spinBtn._gei666AudioHook = true;
      spinBtn.addEventListener("click", function(){
        playPressureHiss();
        playGearClick();
        var clickCount = 0;
        var iv = setInterval(function(){
          playSpinClick();
          clickCount++;
          if(clickCount > 8) clearInterval(iv);
        }, 200 + Math.random() * 150);
      });
    }

    /* DAM MACHINE results — watch for class changes */
    var dmCard = document.getElementById("damMachineCard");
    if(dmCard && !dmCard._gei666AudioObs){
      dmCard._gei666AudioObs = true;
      var obs = new MutationObserver(function(){
        if(dmCard.classList.contains("hasResult")){
          var jackEl = dmCard.querySelector(".dmJackLine");
          if(jackEl && jackEl.textContent.indexOf("JACKPOT") >= 0){
            playJackpotFanfare();
          } else {
            playWinChime();
          }
        }
      });
      obs.observe(dmCard, { attributes: true, attributeFilter: ["class"] });
    }

    /* Bonus waterwheel */
    var bonusCard = document.getElementById("bonusCard");
    if(bonusCard && !bonusCard._gei666AudioObs){
      bonusCard._gei666AudioObs = true;
      var obs2 = new MutationObserver(function(){
        if(bonusCard.classList.contains("show")){
          playWaterFlow(2);
          playWheelCreak();
        }
        if(bonusCard.classList.contains("spinning")){
          playMillGrind();
        }
      });
      obs2.observe(bonusCard, { attributes: true, attributeFilter: ["class"] });
    }

    /* Level completion */
    var levelCard = document.getElementById("levelCard");
    if(levelCard && !levelCard._gei666AudioObs){
      levelCard._gei666AudioObs = true;
      var obs3 = new MutationObserver(function(){
        if(levelCard.classList.contains("show")){
          playLevelUpChime();
          setTimeout(playWaterFlow, 400);
        }
      });
      obs3.observe(levelCard, { attributes: true, attributeFilter: ["class"] });
    }
  }

  /* Enhance existing song queue randomization */
  function enhanceSongQueue(){
    if(!window.__geiAudioEngine) return;
    var engine = window.__geiAudioEngine;
    if(engine._gei666Enhanced) return;
    engine._gei666Enhanced = true;

    /* Increase shuffle diversity — ensure at least 40% of queue plays before repeat */
    if(engine.recentlyPlayed && Array.isArray(engine.recentlyPlayed)){
      var maxRecent = Math.max(5, Math.floor((window.SONGS || []).length * 0.4));
      var origNext = engine.nextTrack;
      if(typeof origNext === "function"){
        engine.nextTrack = function(){
          while(engine.recentlyPlayed.length > maxRecent){
            engine.recentlyPlayed.shift();
          }
          return origNext.apply(this, arguments);
        };
      }
    }
  }

  function init(){
    hookGameEvents();
    enhanceSongQueue();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  setTimeout(init, 2000);
  setTimeout(init, 5000);

  window.__GEI_V3000_AUDIO__ = {
    version: VERSION,
    sounds: {
      waterFlow: playWaterFlow,
      gearClick: playGearClick,
      pressureHiss: playPressureHiss,
      millGrind: playMillGrind,
      wheelCreak: playWheelCreak,
      jackpotFanfare: playJackpotFanfare,
      levelUpChime: playLevelUpChime,
      spinClick: playSpinClick,
      winChime: playWinChime
    },
    selfTest: function(){
      return {
        audioCtxAvailable: !!(window.AudioContext || window.webkitAudioContext),
        dmSpinHooked: !!(document.getElementById("dmSpinBtn") && document.getElementById("dmSpinBtn")._gei666AudioHook),
        dmCardHooked: !!(document.getElementById("damMachineCard") && document.getElementById("damMachineCard")._gei666AudioObs),
        bonusHooked: !!(document.getElementById("bonusCard") && document.getElementById("bonusCard")._gei666AudioObs),
        levelCardHooked: !!(document.getElementById("levelCard") && document.getElementById("levelCard")._gei666AudioObs)
      };
    }
  };
})();
