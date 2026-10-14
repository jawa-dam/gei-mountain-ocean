/* HYDRO — the ONE simulation state of the whole mountain-to-ocean chain.
     MOUNTAIN SOURCE → RESERVOIR → DAM → MILLPOND → SLUICE GATE → WATERWHEEL → MILL / FACTORY → RIVER → OCEAN
   Every Day sets up this same state (different presets / objectives); every visual (lake level, millpond, gate, flume, wheel speed, machine lights, river) and every
   gauge reads it, so animations and displayed measurements always agree.
   Simplified teaching physics — deterministic, not an engineering solver:
     reservoir  level = 6.0 + 3.8·V/cap          storage changes by inflow − release − overflow
     release    Q = valve × 40·√(head/1.2)       a large conduit from the lake into the millpond
     overflow   12·(level − 9.0)^1.5             over the spillway crest
     millpond   level = 7.8 + 1.4·V/cap          fed by the release, drained by the sluice gate, weir overflow above 9.0
     sluice     Q = gate × 13·√((pond − 7.8)/1.2)   → 13·gate at a full pond (what Day 5 uses)
     wheel      P = η·min(Q, 14), η = 0.60 + 0.06 per bearing upgrade; machine runs when P ≥ its need; an overloaded wheel slows × (0.25 + 0.75·P/D)
     river      carries the tailwater + every overflow on to the ocean */
export const SILL = 7.8, FULL = 9.0, MINL = 6.0, MAXL = 9.8, PEAK = 9.2;
const cl = (v, a, b) => v < a ? a : v > b ? b : v;

export function createHydro(level, up = {}, opt = {}){
  const L = Math.max(1, level | 0), bear = up.bear | 0, liner = up.liner | 0;
  const H = { level:L, t:0, Qref:13, cap:14, eta:0.6 + 0.06 * bear, defs:[{ id:"mill", name:"MILL", d:3, r:1.0 }, { id:"saw", name:"SAW", d:4, r:1.4 }, { id:"hammer", name:"HAMMER", d:5, r:1.8 }] };
  H.M = opt.M != null ? opt.M : Math.min(2, 1 + ((L - 1) >> 1));
  H.as = [false, false, false]; H.run = [false, false, false];
  H.resCap = 150 * (1 + 0.1 * liner); H.resV = (opt.resFrac != null ? opt.resFrac : (FULL - MINL) / (MAXL - MINL)) * H.resCap;
  H.pondCap = 60; H.pin = opt.pin == null ? null : opt.pin; H.pinSupply = H.Qref; H.pondV = 0.8 * H.pondCap;
  H.inflow = opt.inflow || (() => 12); H.relCoef = opt.relCoef || 40; H.relSat = !!opt.relSat; H.relSet = opt.rel == null ? 1 : opt.rel; H.relA = H.relSet; H.gateSet = 0; H.gateA = 0;
  H.resL = 0; H.pondL = 0; H.Qin = 0; H.Qrel = 0; H.spillRes = 0; H.spillPond = 0; H.Qg = 0; H.P = 0; H.D = 0; H.f = 1; H.rpm = 0; H.Qriver = 0; H.units = 0; H.overtopped = false; H.dynamicLake = !!opt.dynamicLake; H.freeRel = !!opt.freeRel;
  H.setGate = v => { H.gateSet = cl(Math.round(v / 5) * 5, 0, 100); };
  H.setRelease = v => { H.relSet = cl(v, 0, 1); };
  H.engage = (i, on) => { if(i >= 0 && i < H.M) H.as[i] = on == null ? !H.as[i] : !!on; };
  H.levels = () => { H.resL = MINL + (MAXL - MINL) * H.resV / H.resCap; H.pondL = H.pin != null ? H.pin : SILL + (PEAK - SILL) * H.pondV / H.pondCap; };
  H.levels();

  H.step = dt => {
    H.t += dt; H.levels();
    H.relA += cl(H.relSet - H.relA, -0.5 * dt, 0.5 * dt);
    H.gateA += cl(H.gateSet / 100 - H.gateA, -0.6 * dt, 0.6 * dt);
    const head = Math.max(0, H.resL - H.pondL);
    const rs = Math.sqrt(head / 1.2); H.Qrel = H.resL <= MINL + 0.05 ? 0 : H.relA * H.relCoef * (H.relSat ? Math.min(1, rs) : rs);
    H.spillRes = H.resL > FULL ? 12 * Math.pow(H.resL - FULL, 1.5) : 0;
    const hp = cl((H.pondL - SILL) / (FULL - SILL), 0, 1.3);
    H.Qg = H.gateA * 13 * Math.sqrt(hp);
    if(H.freeRel){ H.spillPond = 0; }                       // Day 3: the release runs down a free channel — the valve alone sets what leaves the lake
    else if(H.pin != null){ H.spillPond = Math.max(0, H.pinSupply - H.Qg); H.Qrel = H.Qg + H.spillPond; }
    else { H.spillPond = H.pondL > FULL ? 14 * Math.pow(H.pondL - FULL, 1.5) : 0; H.pondV = cl(H.pondV + (H.Qrel - H.Qg - H.spillPond) * dt, 0, H.pondCap); }
    H.Qin = H.inflow(H.t);
    if(H.pin == null || H.dynamicLake){ H.resV = cl(H.resV + (H.Qin - H.Qrel - H.spillRes) * dt, 0, H.resCap); }
    H.overtopped = H.resL >= MAXL - 0.005;
    // wheel + machines
    H.P = H.eta * Math.min(H.Qg, H.cap);
    H.D = 0; H.defs.forEach((m, i) => { if(i < H.M && H.as[i]) H.D += m.d; });
    H.f = H.D > 0 ? Math.min(1, H.P / H.D) : 1;
    const target = Math.min(H.Qg / H.cap, 1.3) * 48 * (H.D > 0 && H.f < 1 ? 0.25 + 0.75 * H.f : 1);
    H.rpm += (target - H.rpm) * Math.min(1, dt * 2.5);
    H.defs.forEach((m, i) => { H.run[i] = i < H.M && H.as[i] && H.Qg > 0 && H.P >= m.d - 1e-9; });
    if(H.D > 0 && H.Qg > 0) H.defs.forEach((m, i) => { if(i < H.M && H.as[i]) H.units += m.r * H.f * dt; });
    H.Qriver = H.Qg + H.spillPond + H.spillRes + (H.freeRel ? H.Qrel : 0);
  };

  /* plain-language feedback for the HUD: is the whole system working well, or does it need adjusting? */
  H.advice = () => {
    const running = H.run.filter((x, i) => x && i < H.M).length, engaged = H.as.filter((x, i) => x && i < H.M).length, wasted = H.spillPond + H.spillRes, used = H.Qg / Math.max(0.01, H.Qg + wasted);
    if(H.overtopped) return { tone:"bad", text:"RESERVOIR OVERTOPPING — release more water now" };
    if(H.resL > FULL + 0.15) return { tone:"warn", text:"RESERVOIR OVERFULL — open the release; water is going over the spillway" };
    if(H.resL < SILL + 0.1 && H.pin == null) return { tone:"warn", text:"LAKE TOO LOW — the gate can't draw water; close the release" };
    if(H.Qg > 0.5 && engaged === 0) return { tone:"warn", text:"WATER IS TURNING THE WHEEL BUT NOTHING IS CONNECTED — engage a machine" };
    if(engaged > 0 && running < engaged) return { tone:"warn", text:"MACHINES STARVED — power " + H.P.toFixed(1) + " < need " + H.D.toFixed(1) + ": open the gate or drop a machine" };
    if(wasted > 2.5 && H.Qg < H.cap * 0.95) return { tone:"warn", text:"WASTING WATER — " + wasted.toFixed(1) + " L/s is spilling past the wheel: open the gate" };
    if(running > 0 && running === engaged && used > 0.8) return { tone:"good", text:"EFFICIENT — " + Math.round(used * 100) + "% of the water is working, all machines running" };
    if(H.Qg < 0.2) return { tone:"info", text:"GATE CLOSED — no water reaches the wheel" };
    return { tone:"info", text:"ADJUST THE GATE AND ENGAGE MACHINES" };
  };
  return H;
}
