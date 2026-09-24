(function(){
  // Hero visual: a dotted world with the three hubs and animated links from Taiwan.
  var svg=document.getElementById('hx-map'); if(!svg||typeof d3==='undefined'||typeof topojson==='undefined') return;
  var HUBS=[{n:'Germany',c:[8.68,50.11]},{n:'USA',c:[-122.4,37.8]},{n:'Taiwan',c:[121.5,25.05],home:true}];
  var phone=window.matchMedia('(max-width: 760px)').matches;
  var W=1600,H=820, s=d3.select(svg).attr('viewBox','0 0 '+W+' '+H).attr('preserveAspectRatio','xMidYMid meet');
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  fetch('assets/countries-110m.json').then(function(r){return r.json();}).then(function(topo){
    var land=topojson.feature(topo,topo.objects.countries);
    land.features=land.features.filter(function(f){return f.properties.name!=='Antarctica';});
    var proj=d3.geoNaturalEarth1().rotate([-20,0]).fitExtent([[40,60],[W-40,H-40]],land);
    var path=d3.geoPath(proj);
    // dot grid clipped to land
    var defs=s.append('defs');
    defs.append('clipPath').attr('id','hx-land').append('path').attr('d',path(land));
    var pat=defs.append('pattern').attr('id','hx-dots').attr('width',9).attr('height',9).attr('patternUnits','userSpaceOnUse');
    pat.append('circle').attr('cx',4.5).attr('cy',4.5).attr('r',1.5).attr('fill','#7fb069');
    s.append('rect').attr('width',W).attr('height',H).attr('fill','url(#hx-dots)').attr('clip-path','url(#hx-land)').attr('opacity',.42);
    var tw=proj(HUBS[2].c);
    var g=s.append('g');
    HUBS.forEach(function(h,i){
      var p=proj(h.c);
      if(!h.home){
        var mx=(p[0]+tw[0])/2, my=Math.min(p[1],tw[1])-Math.abs(p[0]-tw[0])*.28;
        var d='M'+tw[0]+','+tw[1]+' Q'+mx+','+my+' '+p[0]+','+p[1];
        g.append('path').attr('d',d).attr('fill','none').attr('stroke','#7fb069').attr('stroke-opacity',.35).attr('stroke-width',1.4);
        var arc=g.append('path').attr('d',d).attr('fill','none').attr('stroke','#c9f2a8').attr('stroke-width',2.2).attr('stroke-linecap','round');
        var L=arc.node().getTotalLength();
        if(reduce){ arc.attr('stroke-opacity',.8); }
        else { arc.attr('stroke-dasharray','60 '+L).attr('stroke-dashoffset',L+60);
          var t0=performance.now()+i*900;
          (function run(){ requestAnimationFrame(function(t){ var k=((t-t0)/2600)%1; if(k<0)k+=1; arc.attr('stroke-dashoffset',(L+60)*(1-k)); run(); }); })(); }
      }
      var dot=g.append('g').attr('transform','translate('+p[0]+','+p[1]+')');
      if(!reduce) dot.append('circle').attr('r',6).attr('class','hx-pulse');
      dot.append('circle').attr('r',(h.home?7:5)*(phone?2:1.4)).attr('fill',h.home?'#c9f2a8':'#7fb069');
      dot.append('text').attr('x',h.home?14:10).attr('y',5).attr('class','hx-label'+(h.home?' home':'')).style('font-size',phone?'30px':'22px').text(h.n);
    });
  }).catch(function(){});
})();
