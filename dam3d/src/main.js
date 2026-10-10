/* DAM BUILDER 3D — lazy-loaded bundle entry. window.DamBuilder3D.create(dayIndex, env) → a Day definition (same interface as the SVG Days) or null.
   env.holder is the shell's persistent holder: the 3D world (stage) is built ONCE and shared by every Day of the session. */
import { tier } from "./world.js";
import { createStage, startStage } from "./stage.js";
import { day1, day2, day3, day4, day5, day6 } from "./days.js";

function supported(){
  try{
    const c = document.createElement("canvas"), gl = c.getContext("webgl2", { failIfMajorPerformanceCaveat:false });
    if(!gl) return false;
    const ext = gl.getExtension("WEBGL_lose_context"); if(ext) ext.loseContext();
    return true;
  }catch(e){ return false; }
}
const DAYS = { 0:day1, 1:day2, 2:day3, 3:day4, 4:day5, 5:day6 };
let lastStage = null;
function stageFor(env){
  const h = env.holder || (env.holder = {});
  if(!h.stage){ const t0 = performance.now(); const st = createStage(env); st.buildMs = Math.round(performance.now() - t0); h.stage = startStage(st); lastStage = h.stage; }
  return h.stage;
}
window.DamBuilder3D = {
  version:"V2.2.20", supported, tier,
  has:i => !!DAYS[i], perfReport:() => lastStage && lastStage.perfReport ? lastStage.perfReport() : null, perfReset:() => lastStage && lastStage.perfReset && lastStage.perfReset(),
  create(i, env){ const f = DAYS[i]; if(!f) return null; const S = stageFor(env); const d = f(env, S); if(d) d.probe = () => S.probe(); return d; },
  dispose(holder){ if(holder && holder.stage){ holder.stage.dispose(); holder.stage = null; } }
};
