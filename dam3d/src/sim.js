/* Day 5 hydraulic model for the 3D scene — the SAME simplified teaching physics as the SVG Day 5 (single-wheel layout), kept deterministic and pure.
     flow to wheel   Qw = Q0 × gate opening            (the rest spills over the dam)
     wheel power     P  = η × min(Qw, cap)             (η = 0.60 + 0.06 per bearing upgrade)
     machine runs    when P ≥ its demand (mill 3, saw 4); an overloaded wheel slows: speed × (0.25 + 0.75·P/D)
     win             every machine of this level engaged AND running for 4 s
   Not an engineering tool. tests/parity compare it against the SVG Day 5 model. */
export function createSim(level, bear){
  const L = Math.max(1, level | 0), Q0 = 13, cap = 14, eta = 0.6 + 0.06 * bear, M = 1 + ((L - 1) >> 1) > 2 ? 2 : 1 + ((L - 1) >> 1);
  const defs = [{ id:"mill", name:"MILL", d:3 }, { id:"saw", name:"SAW", d:4 }].slice(0, M);
  const S = { L, Q0, cap, eta, M, defs, setpoint:0, a:0, Q:0, P:0, D:0, f:1, rpm:0, as:defs.map(() => false), run:defs.map(() => false), holdT:0, HOLD:4, t:0, TL:Math.round(45 - Math.min(L - 1, 10) * 1.5), done:false, failed:false, why:"" };
  S.setGate = v => { S.setpoint = Math.min(100, Math.max(0, Math.round(v / 5) * 5)); };
  S.engage = (i, on) => { if(i >= 0 && i < M) S.as[i] = on == null ? !S.as[i] : !!on; };
  S.step = dt => {
    if(S.done || S.failed) return;
    S.t += dt;
    S.a += Math.max(-0.6 * dt, Math.min(0.6 * dt, S.setpoint / 100 - S.a));
    S.Q = Q0 * S.a; S.P = eta * Math.min(S.Q, cap);
    S.D = 0; defs.forEach((m, i) => { if(S.as[i]) S.D += m.d; });
    S.f = S.D > 0 ? Math.min(1, S.P / S.D) : 1;
    const target = Math.min(S.Q / cap, 1.3) * 48 * (S.D > 0 && S.f < 1 ? 0.25 + 0.75 * S.f : 1);
    S.rpm += (target - S.rpm) * Math.min(1, dt * 2.5);
    let all = true; defs.forEach((m, i) => { S.run[i] = S.as[i] && S.Q > 0 && S.P >= m.d - 1e-9; if(!S.run[i]) all = false; });
    if(all) S.holdT += dt; else S.holdT = 0;
    if(S.holdT >= S.HOLD){ S.done = true; return; }
    if(S.t >= S.TL){ S.failed = true; S.why = "Time ran out before every machine was running."; }
  };
  return S;
}
