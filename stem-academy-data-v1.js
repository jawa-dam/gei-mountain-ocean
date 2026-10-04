/* V1 — DAM STEM ACADEMY · DATA 💧🔬
 * The six STEM stations that ride on the six existing DAM Map regions.
 *
 *   window.GEI_STEM.stations   id → station definition   (add `stations.futureStation` here — or call registerStation)
 *   window.GEI_STEM.careers    "WHO WORKS WITH WATER?" cards
 *   window.GEI_STEM.labs       id → interactive lab renderer (see stem-academy-labs-v1.js)
 *
 * Map regions → STEM stations (the map itself is not changed):
 *   MOUNTAIN→mountain · DAM→dam · MILLPOND→reservoir · SLUICE-GATE→sluice · WATERWHEEL→wheel · FACTORY→ocean
 *
 * Every station follows DISCOVER → EXPERIMENT → MISSION → PROVE IT → COMPLETE.
 * `realWorld` is established science; `gei` is the GEI interpretive game layer (story, never presented as fact).
 * `completion` is the per-station default; the live values are persisted by stem-academy-v1.js.
 * STEM XP is educational progression only — it never touches FL OZ, XP, purchases or entitlements.
 */
(function(){
  "use strict";
  var G=window.GEI_STEM=window.GEI_STEM||{};
  if(G.stations)return;
  G.stations={}; G.labs={}; G.order=[];

  function complete(){return {discover:false,experiment:false,challenge:false,quiz:false};}
  G.registerStation=function(id,def){
    def.id=id; def.completion=complete();
    def.reward=def.reward||{discover:10,experiment:15,challenge:25,quiz:25};
    G.stations[id]=def; if(G.order.indexOf(id)<0)G.order.push(id);
    return def;
  };
  G.registerLab=function(name,fn){G.labs[name]=fn;};

  G.registerStation("mountain",{
    region:0, icon:"🏔️", title:"WATER SOURCE LAB", subtitle:"Where every river begins", topic:"Water cycle · Gravity · Watersheds",
    discover:{
      guide:"Watch this! Rain hits the mountain, and gravity sends the water downhill.",
      text:"Water falls on the land and gravity helps move it downhill into streams and rivers.",
      facts:["☁️ Rain and ❄️ snow fall on the mountain","💧 Runoff gathers into streams","🌍 Gravity pulls water to lower ground"]
    },
    experiment:{lab:"mountain",prompt:"Tap ☁️ RAIN, ❄️ SNOW and 💧 RUNOFF. Watch where the water goes!"},
    challenge:{lab:"mountain-path",title:"Which way will the water travel?",
      success:"Water follows the downhill path because gravity pulls it toward lower ground."},
    quiz:[
      {q:"What makes water move downhill?",options:["The Sun","Gravity","Trees"],answer:1,why:"Gravity pulls water toward lower ground."},
      {q:"Where does mountain rain and snowmelt gather?",options:["Streams","Clouds","Rocks only"],answer:0,why:"Runoff gathers into streams and rivers."}
    ],
    badge:{id:"water-explorer",icon:"🏔️",name:"WATER EXPLORER",desc:"Understands water sources and gravity."},
    wow:{chain:["🌧️","💧","🌊"],line:"Rain → runoff → river!"},
    realWorld:"A watershed is all the land that drains into the same river. Gravity moves the water.",
    gei:"In the GEI game story, the Mountain is where the DAM-ITE journey begins."
  });

  G.registerStation("dam",{
    region:1, icon:"🧱", title:"ENGINEERING LAB", subtitle:"Build it. Test it. Improve it.", topic:"Force · Pressure · Materials · Design",
    discover:{
      guide:"Engineers follow a cycle: ask, imagine, plan, build, test, improve. Let's test a dam!",
      text:"A dam is a strong wall that holds water back. Deeper water pushes harder, so the wall must be strong enough.",
      facts:["💪 Water pushes on the wall (pressure)","🧱 Different materials have different strength","🔁 Engineers test, then improve"]
    },
    experiment:{lab:"dam",prompt:"Pick a material and a wall, then press TEST. Try at least two different dams!"},
    challenge:{lab:"dam-flood",title:"Build a dam that can hold the water.",
      success:"Your dam is strong enough for the flood. That is engineering design: test, learn, improve!"},
    quiz:[
      {q:"What does a dam help control?",options:["Water","Clouds","Mountains"],answer:0,why:"Dams hold back and control water."},
      {q:"A leaking dam needs…",options:["A stronger, thicker wall","More clouds","A smaller river"],answer:0,why:"Engineers improve the design after a test."}
    ],
    badge:{id:"dam-engineer",icon:"🧱",name:"DAM ENGINEER",desc:"Understands basic structural design."},
    wow:{chain:["🌊","💥","🧱","✅"],line:"The wave hits… and the dam holds!"},
    realWorld:"Real dams are designed for water pressure, which grows with depth. Real earth dams are wide, packed and sealed.",
    gei:"In the GEI game story, the Dam is the dividing wall of the DAM-ITE world."
  });

  G.registerStation("reservoir",{
    region:2, icon:"🌊", title:"WATER STORAGE LAB", subtitle:"Keep the balance", topic:"Storage · Level · Inflow · Outflow",
    discover:{
      guide:"The reservoir is a water bank! Water coming in and water going out must stay balanced.",
      text:"A reservoir stores water. Its level rises when more water comes in than goes out.",
      facts:["🌧️ Inflow adds water","🚪 Outflow releases water","⚖️ Start + In − Out = End"]
    },
    experiment:{lab:"reservoir",prompt:"Change the rainfall and watch the level. Fill it up to HIGH!"},
    challenge:{lab:"reservoir-storm",title:"Keep the reservoir from overflowing.",
      success:"You balanced the water coming in and going out. Great reservoir management!"},
    quiz:[
      {q:"Where is water stored?",options:["Reservoir","Turbine","Sky"],answer:0,why:"A reservoir stores water behind a dam."},
      {q:"The level goes UP when…",options:["More comes in than goes out","Nothing happens","Water goes out faster"],answer:0,why:"Inflow bigger than outflow raises the level."}
    ],
    badge:{id:"reservoir-manager",icon:"🌊",name:"RESERVOIR MANAGER",desc:"Understands water storage and balance."},
    wow:{chain:["📈","🌊","⚖️"],line:"The level rises… then steadies!"},
    realWorld:"Operators track inflow, outflow and storage to prevent floods and keep water for later.",
    gei:"In the GEI game story, the Millpond is the calm water stored behind the Dam."
  });

  G.registerStation("sluice",{
    region:3, icon:"🚪", title:"FLOW CONTROL LAB", subtitle:"Open it. Watch it flow.", topic:"Flow · Cause and effect · Gates",
    discover:{
      guide:"This gate is a sluice! Slide it open and see how the water answers.",
      text:"A sluice gate controls how much water flows through. A wider opening lets more water pass.",
      facts:["🔒 Closed gate: almost no flow","🚪 Wider opening: more flow","🎛️ Operators set gates carefully"]
    },
    experiment:{lab:"sluice",prompt:"Try CLOSED, 25%, 50%, 75% and 100%. Try at least three!"},
    challenge:{lab:"sluice-predict",title:"What happens when you open the gate?",
      success:"Opening the gate allows more water to flow through."},
    quiz:[
      {q:"What happens when the gate opens wider?",options:["More water can flow","Water disappears","The mountain moves"],answer:0,why:"A bigger opening lets more water pass."},
      {q:"A closed gate lets…",options:["Almost no water through","The most water through","Clouds through"],answer:0,why:"Closed means water is held back."}
    ],
    badge:{id:"hydraulic-operator",icon:"🚪",name:"HYDRAULIC OPERATOR",desc:"Understands water flow control."},
    wow:{chain:["🚪","⬆️","🌊","🌊🌊"],line:"The gate opens… surge!"},
    realWorld:"Gate openings change flow. Dam operators use gates to control releases downstream.",
    gei:"In the GEI game story, the Sluice-Gate sends the stored water on to the mill."
  });

  G.registerStation("wheel",{
    region:4, icon:"⚙️", title:"ENERGY LAB", subtitle:"Water makes things move", topic:"Motion · Energy · Turbines · Hydropower",
    discover:{
      guide:"Moving water can push a wheel around. More flow means a faster wheel!",
      text:"Moving water can make a waterwheel or turbine turn. A generator can turn that motion into electricity.",
      facts:["🌊 Moving water has energy","⚙️ It turns a wheel or turbine","⚡ A generator makes electricity"]
    },
    experiment:{lab:"wheel",prompt:"Change the flow. Does the wheel go faster or slower?"},
    challenge:{lab:"wheel-power",title:"Can you make the wheel generate enough energy?",
      success:"Strong flow keeps the wheel spinning fast and fills the energy meter!"},
    quiz:[
      {q:"What can moving water make happen?",options:["A wheel can turn","Rocks float","Clouds spin"],answer:0,why:"Moving water pushes a wheel or turbine."},
      {q:"More flow makes the wheel…",options:["Spin faster","Stop","Disappear"],answer:0,why:"More flow gives more push."}
    ],
    badge:{id:"energy-engineer",icon:"⚙️",name:"ENERGY ENGINEER",desc:"Understands water-to-motion/energy conversion."},
    wow:{chain:["🌊","⚙️","⚡","💡"],line:"Water spins the wheel — power on!"},
    realWorld:"Hydropower: moving water turns a turbine, the turbine spins a generator, and the generator makes electricity.",
    gei:"In the GEI game story, the Waterwheel turns water into motion for the factory."
  });

  G.registerStation("ocean",{
    region:5, icon:"🌎", title:"WATER STEWARDSHIP LAB", subtitle:"Water keeps going", topic:"Downstream · Ecosystems · Stewardship",
    discover:{
      guide:"Water doesn't disappear when it leaves the dam. It keeps flowing to rivers, wetlands and the ocean!",
      text:"Water leaving a dam flows downstream. Fish, plants, animals and people all depend on it.",
      facts:["🐟 Fish need flowing water","🌱 Wetlands need water too","🏘️ Communities need water as well"]
    },
    experiment:{lab:"ocean",prompt:"Change how much water is released. Try at least three amounts!"},
    challenge:{lab:"ocean-balance",title:"Release enough water downstream while keeping the system healthy.",
      success:"People and nature both have the water they need. That is water stewardship!"},
    quiz:[
      {q:"Why is downstream water important?",options:["Plants and animals need water","It makes mountains taller","It stops rain"],answer:0,why:"Ecosystems and communities depend on downstream flow."},
      {q:"What is a good release?",options:["Enough for nature and people","None at all","As much as possible"],answer:0,why:"Stewardship means balancing everyone's needs."}
    ],
    badge:{id:"water-steward",icon:"🌎",name:"WATER STEWARD",desc:"Understands downstream ecosystems."},
    wow:{chain:["💧","🏞️","🦆","🌎"],line:"The water travels on — and life lights up!"},
    realWorld:"Dam operators release water downstream so rivers, wetlands, estuaries and communities stay healthy.",
    gei:"In the GEI game story, the journey ends where the water joins something bigger."
  });

  G.master={icon:"🏆",name:"MASTER DAM-ITE ENGINEER",bonus:100,
    line:"You traveled from mountain to ocean and learned how water can shape Earth, power machines, support communities, and sustain life."};

  G.careers=[
    {icon:"👷",name:"Civil Engineer",line:"Designs strong dams, bridges and canals."},
    {icon:"⚙️",name:"Mechanical Engineer",line:"Designs wheels, gates and machines that move."},
    {icon:"⚡",name:"Electrical Engineer",line:"Turns spinning power into electricity for homes."},
    {icon:"💧",name:"Hydrologist",line:"Studies how water moves across Earth."},
    {icon:"🌱",name:"Environmental Scientist",line:"Protects rivers, wetlands, fish and wildlife."},
    {icon:"🏗️",name:"Dam Operator",line:"Opens and closes gates to manage the water."},
    {icon:"🗺️",name:"Surveyor",line:"Measures land and height so builders get it right."},
    {icon:"🪨",name:"Geologist",line:"Studies rocks and soil to find safe ground."},
    {icon:"🌎",name:"Water Resource Manager",line:"Shares water fairly with people and nature."}
  ];
})();
