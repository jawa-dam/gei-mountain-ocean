/* V2.2 — DAM ENGINEERING WORLD 💧🏗️ · DATA
 * The six engineering labs that ride on the six existing DAM Map regions. Data-driven: a new lab is
 * `GEI_STEM.registerStation("id", {...})` + `GEI_STEM.registerLab("name", fn)` — no engine changes.
 *
 *   GEI_STEM.stations (= GEI_STEM.world)   id → lab definition
 *   GEI_STEM.why                            "💡 WHY DID THAT HAPPEN?" explanations, keyed "<station>.<event>"
 *   GEI_STEM.ranks / careers / master       educational ranks, career cards, final reward
 *
 * Station fields: title · subtitle · topic · discover · experiment{lab,prompt} · challenge{lab,title,success}
 *   · decide{scenario,options[]}  ("WHAT WOULD YOU DO?": decision → result → explanation)
 *   · badge · wow · career · realWorld · gei · reward · completion
 *
 * Map regions → stations: MOUNTAIN→mountain · DAM→dam · MILLPOND→reservoir · SLUICE-GATE→sluice ·
 *   WATERWHEEL→wheel (turbine) · FACTORY→ocean.
 *
 * `realWorld` is established introductory science; `gei` is the GEI interpretive story layer and is never
 * presented as scientific fact. STEM XP / ranks / badges are educational only: no game XP, FL OZ, purchase
 * or entitlement is read or written anywhere in this system.
 */
(function(){
  "use strict";
  var G=window.GEI_STEM=window.GEI_STEM||{};
  if(G.stations)return;
  G.stations={}; G.labs={}; G.order=[]; G.world=G.stations; G.version="V2.2";

  function complete(){return {discover:false,experiment:false,challenge:false,quiz:false};}
  G.registerStation=function(id,def){
    def.id=id; def.completion=complete();
    def.reward=def.reward||{discover:10,experiment:15,challenge:25,quiz:25};      // quiz = the WHAT WOULD YOU DO? decision
    G.stations[id]=def; if(G.order.indexOf(id)<0)G.order.push(id);
    return def;
  };
  G.registerLab=function(name,fn){G.labs[name]=fn;};

  /* ---------- 💡 WHY DID THAT HAPPEN? — one short, kid-friendly cause per result ---------- */
  G.why={
    "mountain.rain":"Rain falls on the mountain. Gravity pulls it down toward the lowest ground.",
    "mountain.snow":"Snow is frozen water. When it melts, gravity pulls the meltwater downhill too.",
    "mountain.runoff":"Water can't climb uphill by itself. Gravity pulls runoff into streams and rivers.",
    "mountain.path.right":"The downhill path is the lowest, so gravity pulls the water that way.",
    "mountain.path.wrong":"That path goes up or stays flat. Gravity pulls water toward the lowest ground.",
    "dam.leak":"The water pushed harder than the wall was strong, so it leaked.",
    "dam.poor":"The wall was almost strong enough, but the water was too high for it.",
    "dam.hold":"The wall was stronger than the push of the water.",
    "dam.master":"Strong material plus a thick, reinforced wall gives a big safety margin. Engineers plan for that.",
    "dam.deeper":"Deeper water pushes harder on the wall. That is water pressure.",
    "reservoir.rise":"More water entered than was released, so the level rose.",
    "reservoir.fall":"More water was released than entered, so the level fell.",
    "reservoir.stable":"Water in equals water out, so the level stays steady.",
    "reservoir.overflow":"Water came in faster than the reservoir could hold or release.",
    "reservoir.dry":"Too much was released, so not enough water was left to store.",
    "sluice.more":"The gate opened wider, allowing more water to pass through.",
    "sluice.less":"The gate opened less, so less water could pass through.",
    "sluice.closed":"A closed gate blocks the water, so only a trickle gets by.",
    "sluice.lowhead":"The reservoir is low, so the water pushes out with less force. The same gate gives less flow.",
    "wheel.faster":"More moving water transferred more energy to the wheel, so it spins faster.",
    "wheel.slower":"Less moving water means less energy to push the wheel, so it slows down.",
    "wheel.height":"Water that falls from higher up moves faster when it hits the wheel, so it carries more energy.",
    "wheel.lights":"The turbine spins the generator, and the generator turns that motion into electricity.",
    "wheel.stopped":"No flow means no push, so the wheel stops and there is no electricity.",
    "ocean.low":"Too little water reached the river, so fish, frogs and plants struggled.",
    "ocean.high":"Too much water at once made the river rise and wash things away.",
    "ocean.town":"Nature is fine, but this much release leaves the town with less water.",
    "ocean.healthy":"The downstream river received a healthier amount of water, so life can thrive."
  };

  /* ---------- the six labs ---------- */
  G.registerStation("mountain",{
    region:0, icon:"🏔️", title:"WATER SOURCE LAB", subtitle:"Where every river begins", topic:"Water cycle · Gravity · Watersheds",
    discover:{
      guide:"Watch this! Rain hits the mountain, and gravity sends the water downhill.",
      text:"Water falls on the land and gravity helps move it downhill into streams and rivers.",
      facts:["☁️ Rain and ❄️ snow fall on the mountain","💧 Runoff gathers into streams","🌍 Gravity pulls water to lower ground"]
    },
    experiment:{lab:"mountain",prompt:"Tap ☁️ MAKE IT RAIN, ❄️ SNOW and 💧 RUNOFF. Watch the water travel toward the reservoir!"},
    challenge:{lab:"mountain-path",title:"Where will the water go?",
      success:"Water follows the downhill path because gravity pulls it toward lower ground."},
    decide:{scenario:"⛈️ A BIG STORM is raining on the mountain!",sub:"A reservoir is waiting downhill. What would you do?",
      meter:{label:"💧 WATER ARRIVING AT THE RESERVOIR",from:5},
      options:[
        {icon:"🅰️",text:"Wait — gravity will carry it downhill",ok:1,to:70,outcome:"🌧️ → 💧 → 🌊 The runoff streams down into the reservoir.",why:"mountain.runoff"},
        {icon:"🅱️",text:"Push the water uphill to the peak",ok:0,to:5,outcome:"⬆️ Water won't flow uphill. Nothing arrives!",why:"mountain.path.wrong"},
        {icon:"🆎",text:"Do nothing and hope the clouds take it back",ok:0,to:5,outcome:"☁️ The rain keeps falling downhill anyway.",why:"mountain.rain"}]},
    badge:{id:"water-explorer",icon:"🏔️",name:"WATER EXPLORER",desc:"Understands water sources and gravity."},
    wow:{chain:["🌧️","💧","🌊"],line:"Rain → streams appear → river!"},
    career:"Hydrologist",
    quiz:[{q:"What makes water move downhill?",options:["The Sun","Gravity","Trees"],answer:1,why:"Gravity pulls water toward lower ground."}],
    realWorld:"A watershed is all the land that drains into the same river. Gravity moves the water.",
    gei:"In the GEI game story, the Mountain is where the DAM-ITE journey begins."
  });

  G.registerStation("dam",{
    region:1, icon:"🧱", title:"STRUCTURAL ENGINEERING LAB", subtitle:"Build it. Test it. Improve it.", topic:"Pressure · Materials · Design",
    discover:{
      guide:"Engineers follow a cycle: ask, imagine, plan, build, test, improve. Let's build a dam!",
      text:"A dam is a strong wall that holds water back. Deeper water pushes harder, so the wall must be strong enough.",
      facts:["💪 Water pushes on the wall (pressure)","🧱 Materials and thickness change strength","🔁 Engineers test, then improve"]
    },
    experiment:{lab:"dam",prompt:"Pick a material, a wall and maybe reinforcement. Press TEST. Try at least two different dams!"},
    challenge:{lab:"dam-flood",title:"A flood is coming! Build a dam that can hold it.",
      success:"Your dam is strong enough for the flood. That is engineering design: test, learn, improve!"},
    decide:{scenario:"🌊 The reservoir is getting DEEPER!",sub:"Water pressure on the wall is growing. What would you do?",
      meter:{label:"🧱 STRESS ON THE WALL",from:60},
      options:[
        {icon:"🅰️",text:"Strengthen the wall with reinforcement",ok:1,to:35,outcome:"🏗️🧱 The reinforced wall handles the push. DAM HOLDING!",why:"dam.master"},
        {icon:"🅱️",text:"Remove some of the wall",ok:0,to:100,outcome:"💥 The thinner wall can't take it. LEAK!",why:"dam.leak"},
        {icon:"🆎",text:"Do nothing",ok:0,to:90,outcome:"😬 The stress keeps rising as the water gets deeper.",why:"dam.deeper"}]},
    badge:{id:"dam-engineer",icon:"🧱",name:"DAM ENGINEER",desc:"Understands basic structural design."},
    wow:{chain:["🌊","💥","🧱","🚀"],line:"The wave hits… and the dam holds!"},
    career:"Civil Engineer",
    quiz:[{q:"What does a dam help control?",options:["Water","Clouds","Mountains"],answer:0,why:"Dams hold back and control water."}],
    realWorld:"Real dams are designed for water pressure, which grows with depth. Real earth dams are wide, packed and sealed.",
    gei:"In the GEI game story, the Dam is the dividing wall of the DAM-ITE world."
  });

  G.registerStation("reservoir",{
    region:2, icon:"🌊", title:"WATER STORAGE LAB", subtitle:"Keep the balance", topic:"Storage · Inflow · Outflow · Balance",
    discover:{
      guide:"The reservoir is a water bank! Water coming in and water going out must stay balanced.",
      text:"A reservoir stores water. Its level rises when more water comes in than goes out.",
      facts:["💧 Incoming water adds to the level","🚪 Released water lowers it","⚖️ Start + In − Out = End"]
    },
    experiment:{lab:"reservoir",prompt:"Slide INCOMING and RELEASE. Make it rise, fall… and hold steady!"},
    challenge:{lab:"reservoir-storm",title:"Keep the reservoir safe.",
      success:"You balanced the water coming in and going out. Great reservoir management!"},
    decide:{scenario:"🌊 RESERVOIR GETTING TOO HIGH!",sub:"A storm keeps adding water. What would you do?",
      meter:{label:"🌊 RESERVOIR LEVEL",from:80},
      options:[
        {icon:"🅰️",text:"Open the gate",ok:1,to:50,outcome:"🚪💦 Extra water flows out. ✅ RESERVOIR STABLE",why:"reservoir.fall"},
        {icon:"🅱️",text:"Close the gate",ok:0,to:100,outcome:"🌊 More comes in than goes out. OVERFLOW!",why:"reservoir.overflow"},
        {icon:"🆎",text:"Do nothing",ok:0,to:95,outcome:"⚠️ The level keeps creeping up.",why:"reservoir.rise"}]},
    badge:{id:"reservoir-manager",icon:"🌊",name:"RESERVOIR MANAGER",desc:"Understands water storage and balance."},
    wow:{chain:["📈","🌊","⚖️","✅"],line:"The level rises… then steadies!"},
    career:"Water Resource Manager",
    quiz:[{q:"Where is water stored?",options:["Reservoir","Turbine","Sky"],answer:0,why:"A reservoir stores water behind a dam."}],
    realWorld:"Operators track inflow, outflow and storage to prevent floods and keep water for later.",
    gei:"In the GEI game story, the Millpond is the calm water stored behind the Dam."
  });

  G.registerStation("sluice",{
    region:3, icon:"🚪", title:"FLOW CONTROL LAB", subtitle:"Open it. Watch it flow.", topic:"Flow · Gates · Cause and effect",
    discover:{
      guide:"This gate is a sluice! Slide it open and see how the water answers.",
      text:"A sluice gate controls how much water flows through. A wider opening lets more water pass.",
      facts:["🔒 Closed gate: almost no flow","🚪 Wider opening: more flow","🎛️ Operators set gates carefully"]
    },
    experiment:{lab:"sluice",prompt:"Try CLOSED, 25%, 50%, 75% and 100%. Try at least three!"},
    challenge:{lab:"sluice-target",title:"Control the flow. Match each TARGET.",
      success:"You set the gate to hit every target flow. That is hydraulic control!"},
    decide:{scenario:"🐟 The river downstream is too LOW!",sub:"The fish need more flow. What would you do?",
      meter:{label:"💧 DOWNSTREAM FLOW",from:10},
      options:[
        {icon:"🅰️",text:"Open the gate wider",ok:1,to:60,outcome:"🚪🌊 More water flows through. The river rises to a healthy flow!",why:"sluice.more"},
        {icon:"🅱️",text:"Close the gate",ok:0,to:2,outcome:"🔒 Only a trickle gets by. The river gets even lower.",why:"sluice.closed"},
        {icon:"🆎",text:"Do nothing",ok:0,to:10,outcome:"😐 Nothing changes. The river stays low.",why:"sluice.less"}]},
    badge:{id:"hydraulic-operator",icon:"🚪",name:"HYDRAULIC OPERATOR",desc:"Understands water flow control."},
    wow:{chain:["🚪","⬆️","💦","🌊"],line:"The gate opens… surge!"},
    career:"Dam Operator",
    quiz:[{q:"What happens when the gate opens wider?",options:["More water can flow","Water disappears","The mountain moves"],answer:0,why:"A bigger opening lets more water pass."}],
    realWorld:"Gate openings change flow. Dam operators use gates to control releases downstream.",
    gei:"In the GEI game story, the Sluice-Gate sends the stored water on to the mill."
  });

  G.registerStation("wheel",{
    region:4, icon:"⚙️", title:"ENERGY LAB", subtitle:"Turbines turn water into power", topic:"Motion · Turbines · Generators · Hydropower",
    discover:{
      guide:"Moving water pushes a turbine around. A generator turns that spin into electricity!",
      text:"Moving water can turn a waterwheel or turbine. A generator can turn that motion into electricity.",
      facts:["🌊 Moving water has energy","⚙️ It spins a turbine","⚡ A generator makes electricity"]
    },
    experiment:{lab:"wheel",prompt:"Change the flow. Watch the turbine, the power meter and the town lights!"},
    challenge:{lab:"wheel-power",title:"Power the city! Light up all 5 homes.",
      success:"Strong flow from a good height spins the turbine fast. The whole town is lit!"},
    decide:{scenario:"🏘️ The town lights are DIM!",sub:"The generator isn't making enough power. What would you do?",
      meter:{label:"⚡ POWER OUTPUT",from:20},
      options:[
        {icon:"🅰️",text:"Send more water to the turbine",ok:1,to:90,outcome:"🌊⚙️⚡ The turbine spins faster. The lights come on!",why:"wheel.faster"},
        {icon:"🅱️",text:"Close the gate",ok:0,to:0,outcome:"🔒 The turbine slows and stops. Lights out!",why:"wheel.stopped"},
        {icon:"🆎",text:"Turn the lights up",ok:0,to:20,outcome:"💡 Lights can't make power. The generator makes it!",why:"wheel.lights"}]},
    badge:{id:"energy-engineer",icon:"⚙️",name:"ENERGY ENGINEER",desc:"Understands water-to-motion/energy conversion."},
    wow:{chain:["🌊","⚙️","⚡","💡"],line:"The wheel accelerates — the generator wakes up!"},
    career:"Electrical Engineer",
    quiz:[{q:"What can moving water make happen?",options:["A wheel can turn","Rocks float","Clouds spin"],answer:0,why:"Moving water pushes a wheel or turbine."}],
    realWorld:"Hydropower: moving water turns a turbine, the turbine spins a generator, and the generator makes electricity.",
    gei:"In the GEI game story, the Waterwheel turns water into motion for the factory."
  });

  G.registerStation("ocean",{
    region:5, icon:"🌎", title:"WATER STEWARDSHIP LAB", subtitle:"Water keeps going", topic:"Downstream · Ecosystems · Stewardship",
    discover:{
      guide:"Water doesn't disappear when it leaves the dam. It keeps flowing to rivers, wetlands and the ocean!",
      text:"Water leaving a dam flows downstream. Fish, plants, animals and people all depend on it.",
      facts:["🐟 Fish need flowing water","🌾 Wetlands need water too","🏘️ Communities need water as well"]
    },
    experiment:{lab:"ocean",prompt:"Change how much water is released. Try at least three amounts!"},
    challenge:{lab:"ocean-balance",title:"Protect the downstream world.",
      success:"People and nature both have the water they need. That is water stewardship!"},
    decide:{scenario:"🐟 The river is DRYING OUT!",sub:"Fish and frogs are struggling. What would you do?",
      meter:{label:"🌱 RIVER HEALTH",from:20},
      options:[
        {icon:"🅰️",text:"Release a healthy amount of water",ok:1,to:90,outcome:"🌊🐟🐸🦆 The river wakes up. HEALTHY RIVER!",why:"ocean.healthy"},
        {icon:"🅱️",text:"Release nothing",ok:0,to:5,outcome:"🏜️ The river dries up even more.",why:"ocean.low"},
        {icon:"🆎",text:"Release a giant flood",ok:0,to:30,outcome:"🌊 The river rises too fast and washes things away.",why:"ocean.high"}]},
    badge:{id:"water-steward",icon:"🌎",name:"WATER STEWARD",desc:"Understands downstream ecosystems."},
    wow:{chain:["💧","🏞️","🦆","🌎"],line:"The water travels on — the ecosystem comes alive!"},
    career:"Environmental Scientist",
    quiz:[{q:"Why is downstream water important?",options:["Plants and animals need water","It makes mountains taller","It stops rain"],answer:0,why:"Ecosystems and communities depend on downstream flow."}],
    realWorld:"Dam operators release water downstream so rivers, wetlands, estuaries and communities stay healthy.",
    gei:"In the GEI game story, the journey ends where the water joins something bigger."
  });

  G.master={icon:"🏆",name:"MASTER DAM-ITE ENGINEER",world:"DAM ENGINEERING WORLD",bonus:100,
    line:"You traveled from mountain to ocean and learned how water can shape Earth, power machines, support communities, and sustain life.",
    finale:["YOU DIDN'T JUST PLAY THE DAM.","YOU ENGINEERED THE WATER."]};

  /* Educational ranks: derived from how many lab badges are earned (never stored, never an economy) */
  G.ranks=[
    {icon:"💧",name:"WATER EXPLORER"},{icon:"🪨",name:"JUNIOR BUILDER"},{icon:"🧱",name:"DAM ENGINEER"},
    {icon:"🌊",name:"HYDRAULIC OPERATOR"},{icon:"⚡",name:"ENERGY ENGINEER"},{icon:"🌱",name:"WATER STEWARD"},{icon:"🏆",name:"MASTER DAM-ITE ENGINEER"}
  ];

  G.careers=[
    {icon:"👷",name:"Civil Engineer",line:"Designs strong dams, bridges and canals."},
    {icon:"⚙️",name:"Mechanical Engineer",line:"Mechanical engineers design machines that move and work."},
    {icon:"⚡",name:"Electrical Engineer",line:"Turns spinning power into electricity for homes."},
    {icon:"💧",name:"Hydrologist",line:"Studies how water moves across Earth."},
    {icon:"🌱",name:"Environmental Scientist",line:"Protects rivers, wetlands, fish and wildlife."},
    {icon:"🏗️",name:"Dam Operator",line:"Opens and closes gates to manage the water."},
    {icon:"🗺️",name:"Surveyor",line:"Measures land and height so builders get it right."},
    {icon:"🪨",name:"Geologist",line:"Studies rocks and soil to find safe ground."},
    {icon:"🌎",name:"Water Resource Manager",line:"Shares water fairly with people and nature."}
  ];
})();
