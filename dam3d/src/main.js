/* DAM BUILDER 3D — lazy-loaded bundle entry. window.DamBuilder3D.create(dayIndex, env) → a Day definition (same interface as the SVG Days) or null. */
import { tier } from "./world.js";
import { createDay5 } from "./day5.js";

function supported(){
  try{
    const c = document.createElement("canvas"), gl = c.getContext("webgl2", { failIfMajorPerformanceCaveat:false });
    if(!gl) return false;
    const ext = gl.getExtension("WEBGL_lose_context"); if(ext) ext.loseContext();
    return true;
  }catch(e){ return false; }
}
window.DamBuilder3D = {
  version:"V2.2.18", supported, tier,
  has:i => i === 4,
  create(i, env){ if(i === 4) return createDay5(env); return null; }
};
