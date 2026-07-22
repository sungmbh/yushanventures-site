(function(){
  // Markets where Yushan has scouted, advised, or invested — each sourced from a real engagement.
  var MARKETS = {
    "Taiwan": {city:[121.5,25.05], items:["HQ & founding (2011)","VW Group Innovation — startup scouting","APEC O2O accelerator","Startup Weekend · MobileMonday","GSMA China Innovation Roadshow","AcBel × Uno Minda — license agreement"]},
    "United States of America": {label:"United States", city:[-122.4,37.8], items:["San Francisco office","Audi × NASA & Lockheed Martin demo day","Carbonix Materials — US market entry","Akonia → Apple · Wikitude → Qualcomm","GSMA China Innovation Roadshow"]},
    "Germany": {city:[8.68,50.11], items:["ZEISS Microoptics — automotive readiness","Aumovio — MicroLED strategy","HeidelbergCement / Foundamental — venture partner","GSMA China Innovation Roadshow"]},
    "Japan": {city:[139.7,35.68], items:["Audi — technology scouting","ABB Robotics — YuMi vision tech"]},
    "South Korea": {label:"South Korea", city:[126.98,37.57], items:["Audi — technology scouting","StradVision — Series A → KOSDAQ listing","GSMA China Innovation Roadshow"]},
    "China": {city:[121.47,31.23], items:["Audi — technology scouting","Coca-Cola — China scouting","Lite-On — radar & lidar","Siemens China — innovation program","Wikitude — social-media management (→ Qualcomm)"]},
    "Israel": {city:[34.78,32.08], items:["Audi — technology scouting","Lite-On — radar & lidar"]},
    "Thailand": {city:[100.5,13.75], items:["Siam Cement Group — high-temp kiln sensors","GSMA China Innovation Roadshow"]},
    "Malaysia": {city:[101.69,3.14], items:["IBM — Southeast Asia scouting","GSMA China Innovation Roadshow"]},
    "India": {city:[77.21,28.61], items:["IAV (VW Group) — Best-Cost-Country scouting RFQ","Uno Minda × AcBel — strategic license agreement"]},
    "Peru": {city:[-77.04,-12.05], items:["APEC O2O Summit — Lima"]},
    "Philippines": {city:[120.98,14.6], items:["APEC O2O accelerator program"]},
    "Vietnam": {city:[105.85,21.03], items:["APEC O2O accelerator program"]}
  };
  // Singapore has no polygon at this resolution — rendered as a marker only.
  var EXTRA_MARKERS = { "Singapore": {city:[103.82,1.35], items:["Southeast Asia business development"]} };

  var root = document.getElementById("footprint-map");
  if(!root) return;
  var tip = root.querySelector(".map-tip");

  function showTip(name, data, evt){
    var rect = root.getBoundingClientRect();
    tip.querySelector(".mt-country").textContent = data.label || name;
    tip.querySelector(".mt-list").innerHTML = data.items.map(function(i){return "· "+i;}).join("<br>");
    tip.style.left = (evt.clientX - rect.left) + "px";
    tip.style.top  = (evt.clientY - rect.top) + "px";
    tip.classList.add("show");
  }
  function hideTip(){ tip.classList.remove("show"); }

  function fallback(){
    var host = root.querySelector(".map-svg");
    if(host) host.remove();
    var names = Object.keys(MARKETS).map(function(k){return MARKETS[k].label||k;}).concat(Object.keys(EXTRA_MARKERS));
    var div = document.createElement("div");
    div.className = "map-fallback";
    div.innerHTML = names.sort().map(function(n){return "· "+n;}).join("<br>");
    root.querySelector(".map-inner").appendChild(div);
  }

  if(typeof d3==="undefined" || typeof topojson==="undefined"){ fallback(); return; }

  var W=1120, H=560;
  var svg = d3.select(root).select(".map-svg").attr("viewBox","0 0 "+W+" "+H);

  d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json").then(function(topo){
    var countries = topojson.feature(topo, topo.objects.countries).features;
    var framed = {type:"FeatureCollection", features: countries.filter(function(f){return f.properties.name!=="Antarctica";})};
    var proj = d3.geoNaturalEarth1().fitSize([W,H], framed);
    var path = d3.geoPath(proj);

    svg.append("g").selectAll("path").data(countries).enter().append("path")
      .attr("d", path)
      .attr("class", function(f){ return "country" + (MARKETS[f.properties.name] ? " active" : ""); })
      .on("mousemove", function(evt,f){ var m=MARKETS[f.properties.name]; if(m) showTip(f.properties.name, m, evt); })
      .on("mouseleave", hideTip);

    var mk = svg.append("g");
    var all = [];
    Object.keys(MARKETS).forEach(function(k){ all.push({name:k, d:MARKETS[k]}); });
    Object.keys(EXTRA_MARKERS).forEach(function(k){ all.push({name:k, d:EXTRA_MARKERS[k]}); });

    all.forEach(function(o){
      var p = proj(o.d.city); if(!p) return;
      mk.append("circle").attr("class","marker-halo").attr("cx",p[0]).attr("cy",p[1]).attr("r",5);
      mk.append("circle").attr("class","marker").attr("cx",p[0]).attr("cy",p[1]).attr("r",5)
        .on("mousemove", function(evt){ showTip(o.name, o.d, evt); })
        .on("mouseleave", hideTip);
    });
  }).catch(fallback);
})();
