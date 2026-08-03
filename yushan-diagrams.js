/* Yushan Ventures — animated technical diagrams.
   Self-contained web components, shadow DOM, CSS-keyframe animation.
   Each diagram is drawn from real engagement data, not decoration.

   Animation contract:
   - The DEFAULT resting state of every diagram is the FINAL, fully visible state.
     A reader with prefers-reduced-motion, or with JS disabled, sees a complete chart.
   - The pre-animation (hidden) state and the animation itself are both scoped to
     `@media (prefers-reduced-motion: no-preference)` and to `:host(.in)`, which an
     IntersectionObserver adds when the figure actually scrolls into view — so the
     draw-on plays for the viewer instead of finishing above the fold. */
(function(){
const P={deep:'#0b3318',green:'#1a5528',mid:'#2e7031',bright:'#437829',jade:'#7fb069',pale:'#a8d18a',tint:'#eef4ea',rule:'#dbe4d6',ink:'#141f17',muted:'#4b5b4f',paper:'#f7f8f4'};
const BASE=`:host{display:block;position:relative}
svg{display:block;width:100%;height:auto}
text{font-family:'Public Sans',system-ui,sans-serif}`;

function def(tag,render){
  if(customElements.get(tag))return;
  customElements.define(tag,class extends HTMLElement{
    connectedCallback(){
      if(this._d)return;this._d=1;
      const r=this.attachShadow({mode:'open'});
      r.innerHTML='<style>'+BASE+'</style>'+render(this);
      const play=()=>{if(this._p)return;this._p=1;this.classList.add('in');cleanup()};
      /* reveal() is the safety net only: it makes the figure visible WITHOUT
         spending the animation, and deliberately leaves the scroll listener
         registered so the draw-on can still play when the reader arrives. */
      const reveal=()=>{this.classList.add('reveal')};
      const near=()=>{const b=this.getBoundingClientRect(),h=innerHeight||800;return b.top<h*0.92&&b.bottom>h*0.06};
      let tick=0;
      const onScroll=()=>{if(tick)return;tick=requestAnimationFrame(()=>{tick=0;if(near())play()})};
      let io=null;
      const cleanup=()=>{if(io)io.disconnect();removeEventListener('scroll',onScroll);removeEventListener('resize',onScroll);clearTimeout(this._t)};
      if('IntersectionObserver'in window){
        io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)play()})},{threshold:.18,rootMargin:'0px 0px -8% 0px'});
        io.observe(this);
      }
      /* Belt and braces: the observer can be starved in a hidden or throttled
         document. A rect check on scroll plus a timed reveal guarantee the
         figure becomes visible either way — the animation is an enhancement,
         never a gate, and never burned while the figure is off screen. */
      addEventListener('scroll',onScroll,{passive:true});
      addEventListener('resize',onScroll,{passive:true});
      if(near())play();else this._t=setTimeout(()=>{near()?play():reveal()},2600);
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   1. MASS TRANSFER — the yield gate at the heart of MicroLED.
   Donor wafer → laser lift-off → placement on backplane → repair → panel lights.
   Resting state: panel lit, one pixel flagged for repair.
   ───────────────────────────────────────────────────────────── */
def('dg-transfer',()=>{
  const dies=[];const cols=8,rows=4;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    dies.push(`<rect class="donor-die" x="${118+c*26}" y="${212+r*26}" width="15" height="15" rx="1.5" style="animation-delay:${(c*0.045+r*0.02).toFixed(3)}s"></rect>`);
  }
  const flights=[];
  for(let i=0;i<8;i++){
    const x0=118+i*26,y0=212+(i%4)*26,x1=666+(i%4)*58,y1=228+Math.floor(i/4)*58;
    flights.push(`<g class="flight"><path class="trail" d="M${x0+7} ${y0+7} Q ${(x0+x1)/2} ${y0-118} ${x1+11} ${y1+11}"></path><rect class="fdie" width="15" height="15" rx="1.5"><animateMotion dur="8s" repeatCount="indefinite" keyPoints="0;0;1;1" keyTimes="0;0.14;0.44;1" calcMode="linear" path="M${x0} ${y0} Q ${(x0+x1)/2} ${y0-118} ${x1+4} ${y1+4}"></animateMotion></rect></g>`);
  }
  const px=[];
  for(let r=0;r<3;r++)for(let c=0;c<4;c++){
    const i=r*4+c,x=666+c*58,y=228+r*58;
    const bad=(i===6);
    px.push(`<g class="pixel ${bad?'bad':''}" style="animation-delay:${(2.4+i*0.075).toFixed(2)}s">
      <rect class="pxbg" x="${x}" y="${y}" width="44" height="44" rx="3"></rect>
      <rect class="sub r" x="${x+5}" y="${y+5}" width="10" height="34" rx="1.5"></rect>
      <rect class="sub g" x="${x+17}" y="${y+5}" width="10" height="34" rx="1.5"></rect>
      <rect class="sub b" x="${x+29}" y="${y+5}" width="10" height="34" rx="1.5"></rect>
      ${bad?`<g class="repair"><rect x="${x}" y="${y}" width="44" height="44" rx="3" fill="none" stroke="#e8a33d" stroke-width="2.4"></rect><path d="M${x+15} ${y+15} l14 14 M${x+29} ${y+15} l-14 14" stroke="#e8a33d" stroke-width="2.4" stroke-linecap="round"></path></g>`:''}
    </g>`);
  }
  return `<style>
  .plate{fill:${P.deep}}
  .lbl{font-size:19px;font-weight:700;fill:#fff;letter-spacing:.02em}
  .sub-lbl{font-family:'IBM Plex Mono',monospace;font-size:17px;letter-spacing:.07em;text-transform:uppercase;fill:${P.pale}}
  .unit{font-family:'IBM Plex Mono',monospace;font-size:17px;letter-spacing:.02em;fill:#fff}
  .unit-d{font-family:'IBM Plex Mono',monospace;font-size:16.5px;letter-spacing:.03em;fill:${P.pale}}
  .wafer{fill:#12291b;stroke:${P.mid};stroke-width:1.4}
  .bp{fill:#12291b;stroke:${P.mid};stroke-width:1.4}
  .pxbg{fill:#0e2417;stroke:${P.green};stroke-width:1}
  .sub.r{fill:#e8654f}.sub.g{fill:#7fd06a}.sub.b{fill:#5b9ae8}
  .head{fill:none;stroke:${P.pale};stroke-width:1.6}
  .headbody{fill:#173a22;stroke:${P.pale};stroke-width:1.6}
  .arrow{fill:none;stroke:${P.pale};stroke-width:1.4;opacity:.5}
  .step-n{font-family:'IBM Plex Mono',monospace;font-size:17px;letter-spacing:.07em;fill:${P.pale};opacity:.8}
  /* resting state: transfer complete, panel lit, repair flagged */
  .donor-die{fill:${P.jade};opacity:.16}
  .beam{fill:none;stroke:#dff3cf;stroke-width:2;opacity:0}
  .trail{fill:none;stroke:${P.pale};stroke-width:1;stroke-dasharray:3 5;opacity:0}
  .fdie{fill:#dff3cf;opacity:0}
  .pixel .sub{opacity:1}
  .pixel.bad .sub{opacity:.13}
  .repair{opacity:1}
  .yield{font-family:'IBM Plex Mono',monospace;font-size:17px;letter-spacing:.02em;fill:#e8a33d;opacity:1}
  @media (prefers-reduced-motion:no-preference){
    :host(.in) .donor-die{animation:lift 8s linear infinite}
    :host(.in) .beam{animation:zap 8s linear infinite}
    :host(.in) .headbody{animation:bob 8s ease-in-out infinite}
    :host(.in) .trail{animation:trail 8s linear infinite}
    :host(.in) .fdie{animation:fly 8s linear infinite}
    :host(.in) .pixel:not(.bad) .sub{animation:glow 8s linear infinite}
    :host(.in) .repair,:host(.in) .yield{animation:flag 8s linear infinite}
  }
  @keyframes lift{0%,8%{fill:${P.jade};opacity:1}12%{fill:#dff3cf;opacity:1}20%{opacity:.16}88%{opacity:.16}100%{opacity:1;fill:${P.jade}}}
  @keyframes zap{0%,7%{opacity:0}9%{opacity:.95}13%{opacity:.5}18%,100%{opacity:0}}
  @keyframes bob{0%,6%{transform:translateY(0)}11%{transform:translateY(9px)}20%,100%{transform:translateY(0)}}
  @keyframes trail{0%,14%{opacity:0}20%{opacity:.42}40%{opacity:.42}48%,100%{opacity:0}}
  @keyframes fly{0%,13%{opacity:0}16%{opacity:1}42%{opacity:1}45%,100%{opacity:0}}
  @keyframes glow{0%,34%{opacity:.13}40%{opacity:1}82%{opacity:1}90%,100%{opacity:.13}}
  @keyframes flag{0%,44%{opacity:0}50%{opacity:1}86%{opacity:1}92%,100%{opacity:0}}
  </style>
  <svg viewBox="0 0 1100 500" role="img" aria-label="Diagram: MicroLED mass transfer from donor wafer to display backplane, showing the placement yield and repair step">
    <rect class="plate" x="0" y="0" width="1100" height="500" rx="8"></rect>
    <text class="lbl" x="40" y="52">Why MicroLED is a manufacturing problem, not a physics problem</text>
    <text class="sub-lbl" x="40" y="80">Mass transfer · the gate every automotive MicroLED business case runs through</text>

    <text class="step-n" x="118" y="170">01 · DONOR WAFER</text>
    <text class="unit" x="118" y="194">Millions of GaN emitters</text>
    <rect class="wafer" x="106" y="204" width="222" height="128" rx="4"></rect>
    ${dies.join('')}

    <g class="headbody"><rect x="152" y="118" width="130" height="30" rx="3"></rect></g>
    <path class="beam" d="M175 150 L175 210 M199 150 L199 210 M223 150 L223 210 M247 150 L247 210 M271 150 L271 210"></path>
    <text class="sub-lbl" x="152" y="112">Laser lift-off head</text>

    <text class="step-n" x="392" y="170">02 · TRANSFER</text>
    <text class="unit" x="392" y="194">Sub-15 × 30 µm placement</text>
    <path class="arrow" d="M392 234 L620 234 M606 226 L620 234 L606 242"></path>
    <text class="unit-d" x="392" y="266">±0.66 µm 3σ accuracy</text>
    <text class="unit-d" x="392" y="292">99.7% placed first pass</text>
    <text class="sub-lbl" x="392" y="322" style="fill:#e8a33d">Yield drives the cost</text>

    <text class="step-n" x="666" y="170">03 · BACKPLANE &amp; REPAIR</text>
    <text class="unit" x="666" y="194">Passive matrix or µCMOS driver</text>
    <rect class="bp" x="652" y="212" width="264" height="196" rx="4"></rect>
    ${flights.join('')}
    ${px.join('')}
    <text class="yield" x="926" y="296">One dead pixel</text>
    <text class="yield" x="926" y="320">means a repair</text>
    <text class="yield" x="926" y="344">pass. Repair</text>
    <text class="yield" x="926" y="368">is the cost.</text>

    <line x1="40" y1="440" x2="1060" y2="440" stroke="${P.green}" stroke-width="1"></line>
    <text class="sub-lbl" x="40" y="466">Mosaic Venture Lab · automotive MicroLED strategy paper, 2026 — schematic, not to scale</text>
  </svg>`;
});

/* ─────────────────────────────────────────────────────────────
   2. COST CURVE — MicroLED premium over tandem OLED, 2026→2036.
   ───────────────────────────────────────────────────────────── */
def('dg-costcurve',()=>{
  const L=88,R=1012,T=92,B=372;
  const x=y=>L+((y-2026)/10)*(R-L);
  const sy=v=>{const lo=Math.log(0.9),hi=Math.log(13);return B-((Math.log(v)-lo)/(hi-lo))*(B-T)};
  const dv=[[2026,12],[2028,6.4],[2030,3.4],[2032,2.0],[2034,1.45],[2036,1.2]];
  const tr=[[2026,9.5],[2028,4.4],[2030,2.1],[2032,1.0],[2034,0.95],[2036,0.92]];
  const path=a=>a.map((p,i)=>(i?'L':'M')+x(p[0]).toFixed(1)+' '+sy(p[1]).toFixed(1)).join(' ');
  const band=`M${x(2028)} ${sy(1.5)} L${x(2036)} ${sy(1.05)} L${x(2036)} ${sy(3)} L${x(2028)} ${sy(3)} Z`;
  const ticks=[12,6,3,1.5,1].map(v=>`<line x1="${L}" y1="${sy(v)}" x2="${R}" y2="${sy(v)}" stroke="${P.rule}" stroke-width="1"></line><text class="ax" x="${L-12}" y="${sy(v)+4}" text-anchor="end">${v}×</text>`).join('');
  const yrs=[2026,2028,2030,2032,2034,2036].map(v=>`<text class="ax" x="${x(v)}" y="${B+24}" text-anchor="middle">${v}</text>`).join('');
  return `<style>
  .ax{font-family:'IBM Plex Mono',monospace;font-size:14.5px;fill:${P.muted}}
  .ttl{font-family:'Source Serif 4',Georgia,serif;font-size:26px;font-weight:600;fill:${P.ink}}
  .sub{font-size:16.5px;fill:${P.muted}}
  .par{stroke:${P.ink};stroke-width:1.4;stroke-dasharray:5 4;opacity:.5}
  .cv{fill:none;stroke-width:3;stroke-linecap:round;stroke-dasharray:1400;stroke-dashoffset:0}
  .disp{stroke:${P.green}}
  .tran{stroke:${P.bright}}
  .band{fill:${P.jade};opacity:.17}
  .mk{opacity:1}
  .key{font-family:'IBM Plex Mono',monospace;font-size:15px;fill:${P.ink}}
  .note{font-size:15px;fill:${P.muted}}
  .tag{font-family:'IBM Plex Mono',monospace;font-size:15px;letter-spacing:.05em;fill:${P.muted}}
  @media (prefers-reduced-motion:no-preference){
    :host(:not(.in)) .cv{stroke-dashoffset:1400}
    :host(:not(.in)) .band,:host(:not(.in)) .mk{opacity:0}
    :host(.reveal) .cv{stroke-dashoffset:0}
    :host(.reveal) .band{opacity:.17}
    :host(.reveal) .mk{opacity:1}
    :host(.in) .cv{animation:draw 2.6s .3s ease-out both}
    :host(.in) .cv2{animation-delay:.9s}
    :host(.in) .band{animation:fade 1s 2.6s ease both}
    :host(.in) .mk{animation:pop .5s ease both}
  }
  @keyframes draw{from{stroke-dashoffset:1400}to{stroke-dashoffset:0}}
  @keyframes fade{from{opacity:0}to{opacity:.17}}
  @keyframes pop{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  </style>
  <svg viewBox="0 0 1060 470" role="img" aria-label="Chart: MicroLED cost premium over tandem OLED falling from 12 times in 2026 to near parity by 2036, with transparent displays crossing OLED cost around 2032">
    <rect x="0" y="0" width="1060" height="470" rx="8" fill="#fff" stroke="${P.rule}"></rect>
    <text class="ttl" x="40" y="48">When does MicroLED stop being expensive?</text>
    <text class="sub" x="40" y="74">Cost premium over tandem OLED. The honest answer is a range — so we published a range.</text>
    ${ticks}${yrs}
    <line x1="${L}" y1="${sy(1)}" x2="${R}" y2="${sy(1)}" class="par"></line>
    <text class="tag" x="${L+6}" y="${sy(1)-9}">OLED PARITY</text>
    <path class="band" d="${band}"></path>
    <path class="cv disp" d="${path(dv)}"></path>
    <path class="cv cv2 tran" d="${path(tr)}"></path>
    <g class="mk" style="animation-delay:2.9s">
      <circle cx="${x(2032)}" cy="${sy(1.0)}" r="5.5" fill="${P.bright}"></circle>
      <path d="M530 334 L636 ${(sy(1.0)-6).toFixed(0)}" fill="none" stroke="${P.bright}" stroke-width="1.2"></path>
      <text class="key" x="230" y="340" style="font-weight:600">Transparent crosses OLED · 2032</text>
    </g>
    <g class="mk" style="animation-delay:3.15s">
      <circle cx="${x(2036)}" cy="${sy(1.2)}" r="5.5" fill="${P.green}"></circle>
      <text class="key" x="${x(2036)-2}" y="${sy(1.2)-56}" text-anchor="end" style="font-weight:600">Direct-view still 1.2× in 2036</text>
      <line x1="${x(2036)}" y1="${sy(1.2)-48}" x2="${x(2036)}" y2="${sy(1.2)-9}" stroke="${P.green}" stroke-width="1.2"></line>
    </g>
    <text class="tag" x="1000" y="252" text-anchor="end">ANALYST vs SUPPLIER DISAGREEMENT</text>
    <g class="mk" style="animation-delay:3.4s"><rect x="40" y="404" width="12" height="3.4" rx="1.7" fill="${P.green}"></rect><text class="key" x="60" y="410">Direct-view µLED</text><rect x="230" y="404" width="12" height="3.4" rx="1.7" fill="${P.bright}"></rect><text class="key" x="250" y="410">Transparent / low pixel count</text><rect x="530" y="401" width="12" height="10" rx="2" fill="${P.jade}" opacity=".35"></rect><text class="key" x="550" y="410">Where the estimates disagree</text></g>
    <text class="note" x="40" y="440">Supplier cost model, cross-checked against analyst and OEM views. ◆ estimate — deliberately shown as a band, never a single number.</text>
  </svg>`;
});

/* ─────────────────────────────────────────────────────────────
   3. SCORECARD — 34 companies, 8 weighted criteria, stance gate.
   ───────────────────────────────────────────────────────────── */
def('dg-scorecard',()=>{
  const rows=[
    ['Pixelated light source · JP','A',4.62],
    ['Epitaxy &amp; exterior lighting · DE/AT','A',4.55],
    ['Driver ASIC · DE','A',4.41],
    ['Chip &amp; full line · TW','B',3.99],
    ['Epitaxy, GaN-on-Si · TW','B',3.98],
    ['Front-plane, pilot line · SE','B',3.89],
    ['Nanowire fab · FR','B',3.86],
    ['Strong tech — but a direct rival','D',4.30]
  ];
  const w=[['Partner safety / stance',20],['Automotive roadmap &amp; qual',15],['Technology leadership',15],['Mass-production readiness',15],['Value-chain fit',13],['Independence from rivals',10],['Financial stability',7],['Geopolitics &amp; IP control',5]];
  const tc={A:P.green,B:P.bright,C:'#b8892a',D:'#a4453a'};
  const wb=w.map((d,i)=>`<g><text class="wl" x="0" y="${i*30+13}">${d[0]}</text><rect class="wt" x="212" y="${i*30+4}" width="150" height="11" rx="2"></rect><rect class="wf" x="212" y="${i*30+4}" width="${d[1]*7.5}" height="11" rx="2" style="animation-delay:${(0.3+i*0.09).toFixed(2)}s"></rect><text class="wn" x="374" y="${i*30+13}">${d[1]}%</text></g>`).join('');
  const rb=rows.map((r,i)=>{
    const gated=r[1]==='D';
    return `<g class="row ${gated?'gated':''}" style="animation-delay:${(1.1+i*0.11).toFixed(2)}s">
      <rect class="rbg" x="0" y="${i*36}" width="546" height="30" rx="3"></rect>
      <text class="rl" x="14" y="${i*36+20}">${r[0]}</text>
      <rect class="sbar" x="312" y="${i*36+11}" width="${(r[2]/5*94).toFixed(0)}" height="8" rx="4" fill="${tc[r[1]]}"></rect>
      <text class="rs" x="452" y="${i*36+20}">${r[2].toFixed(2)}</text>
      <circle cx="${gated?520:478}" cy="${i*36+15}" r="11" fill="${tc[r[1]]}"></circle>
      <text class="rt" x="${gated?520:478}" y="${i*36+19}" text-anchor="middle">${r[1]}</text>
      ${gated?`<path class="gatearrow" d="M492 ${i*36+15} L508 ${i*36+15} M502 ${i*36+10} L508 ${i*36+15} L502 ${i*36+20}"></path><circle class="wascore" cx="478" cy="${i*36+15}" r="11" fill="none" stroke="${P.rule}" stroke-width="1.5" stroke-dasharray="3 3"></circle>`:''}
    </g>`;
  }).join('');
  return `<style>
  .ttl{font-family:'Source Serif 4',Georgia,serif;font-size:26px;font-weight:600;fill:${P.ink}}
  .sub{font-size:16.5px;fill:${P.muted}}
  .hd{font-family:'IBM Plex Mono',monospace;font-size:15px;letter-spacing:.09em;text-transform:uppercase;fill:${P.mid}}
  .wl{font-size:15px;fill:${P.ink}}
  .wn{font-family:'IBM Plex Mono',monospace;font-size:15px;fill:${P.muted}}
  .wt{fill:${P.tint}}
  .wf{fill:${P.mid};transform-origin:212px 0;transform:scaleX(1)}
  .row{opacity:1}
  .rbg{fill:${P.paper};stroke:${P.rule};stroke-width:1}
  .row.gated .rbg{fill:#fbf1ef;stroke:#e4c4bf}
  .rl{font-size:16px;fill:${P.ink}}
  .row.gated .rl{fill:#8a3a31}
  .rs{font-family:'IBM Plex Mono',monospace;font-size:15px;fill:${P.muted};text-anchor:end}
  .rt{font-family:'IBM Plex Mono',monospace;font-size:15px;font-weight:600;fill:#fff}
  .gatearrow{fill:none;stroke:#a4453a;stroke-width:1.6;opacity:1}
  .wascore{opacity:1}
  .note{font-size:15px;fill:${P.muted}}
  .gatebox{fill:none;stroke:#a4453a;stroke-width:1.4;stroke-dasharray:4 4;opacity:1}
  .gatelbl{font-family:'IBM Plex Mono',monospace;font-size:15px;letter-spacing:.04em;fill:#a4453a;opacity:1}
  @media (prefers-reduced-motion:no-preference){
    :host(:not(.in)) .wf{transform:scaleX(0)}
    :host(:not(.in)) .row{opacity:0}
    :host(:not(.in)) .gatearrow,:host(:not(.in)) .wascore,:host(:not(.in)) .gatebox,:host(:not(.in)) .gatelbl{opacity:0}
    :host(.reveal) .wf{transform:scaleX(1)}
    :host(.reveal) .row{opacity:1}
    :host(.reveal) .gatearrow,:host(.reveal) .wascore,:host(.reveal) .gatebox,:host(.reveal) .gatelbl{opacity:1}
    :host(.in) .wf{animation:grow .7s ease-out both}
    :host(.in) .row{animation:slide .5s ease-out both}
    :host(.in) .gatearrow,:host(.in) .wascore{animation:ga .5s 2.4s ease both}
    :host(.in) .gatebox,:host(.in) .gatelbl{animation:ga .6s 2.6s ease both}
  }
  @keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
  @keyframes slide{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:translateX(0)}}
  @keyframes ga{from{opacity:0}to{opacity:1}}
  </style>
  <svg viewBox="0 0 1060 500" role="img" aria-label="Diagram: weighted partner-suitability scorecard ranking 34 companies into tiers, with a stance gate capping direct rivals at the bottom tier regardless of score">
    <rect x="0" y="0" width="1060" height="500" rx="8" fill="#fff" stroke="${P.rule}"></rect>
    <text class="ttl" x="40" y="48">A partner shortlist you can argue with</text>
    <text class="sub" x="40" y="74">34 companies, eight weighted criteria. The client edits the weights; the ranking re-sorts.</text>
    <g transform="translate(40,112)"><text class="hd" x="0" y="-14">CRITERIA &amp; WEIGHTS — CLIENT-EDITABLE</text>${wb}</g>
    <g transform="translate(468,112)"><text class="hd" x="0" y="-14">RANKED OUTPUT — BEST FIT FIRST</text>${rb}</g>
    <g transform="translate(468,112)"><rect class="gatebox" x="0" y="252" width="546" height="30" rx="3"></rect><text class="gatelbl" x="0" y="304">STANCE GATE — a direct rival is capped at</text><text class="gatelbl" x="0" y="322">tier D whatever its score. The risk being</text><text class="gatelbl" x="0" y="340">managed is IP leakage, not capability.</text></g>
    <text class="note" x="40" y="482">Scores are our assessment, built on a verified evidence tab with one row of sourced fact per company. Every number is traceable.</text>
  </svg>`;
});

/* ─────────────────────────────────────────────────────────────
   4. FUNNEL — scouting pipeline, universe → client-rated → visits.
   ───────────────────────────────────────────────────────────── */
def('dg-funnel',el=>{
  const spec=(el.getAttribute('data-stages')||'').trim();
  const st=spec?JSON.parse(spec):[
    ['Companies dossiered','15','Japan AI, robotics and machine-vision','ecosystem — 27 fields per company'],
    ['Graded A — engage','7','Edge AI silicon, high-speed vision, 3D','sensing, motion planning, welding, cloud'],
    ['Graded B — watch','3','Real capability, wrong stage','or adjacent focus'],
    ['Graded C — not a fit','5','Humanoid platforms and total-solution','plays. The file said no, and why'],
    ['Site visits requested','8','Converted to a meeting by ABB','after reading the dossiers']
  ];
  const W=st.map(s=>120+(parseInt(s[1],10)/15)*440);
  const bars=st.map((s,i)=>{
    const y=110+i*66,w=W[i],x=40;
    return `<g class="fs" style="animation-delay:${(0.25+i*0.16).toFixed(2)}s">
      <rect x="${x}" y="${y}" width="${w.toFixed(0)}" height="46" rx="3" fill="${i===1||i===4?P.green:P.mid}" opacity="${(0.92-i*0.03).toFixed(2)}"></rect>
      <text class="fn" x="${x+16}" y="${y+30}">${s[1]}</text>
      <text class="fl" x="${x+90}" y="${y+29}">${s[0]}</text>
      <text class="fd" x="624" y="${y+22}">${s[2]}</text>
      <text class="fd" x="624" y="${y+38}">${s[3]||''}</text>
    </g>`;
  }).join('');
  return `<style>
  .ttl{font-family:'Source Serif 4',Georgia,serif;font-size:25px;font-weight:600;fill:#fff}
  .sub{font-size:15.5px;fill:${P.pale}}
  .fs{opacity:1}
  .fn{font-family:'IBM Plex Mono',monospace;font-size:20px;font-weight:500;fill:#fff}
  .fl{font-size:16px;font-weight:600;fill:#fff}
  .fd{font-size:14px;fill:${P.pale}}
  .note{font-size:14.5px;fill:${P.pale}}
  @media (prefers-reduced-motion:no-preference){
    :host(:not(.in)) .fs{opacity:0}
    :host(.reveal) .fs{opacity:1}
    :host(.in) .fs{animation:fin .6s ease-out both}
  }
  @keyframes fin{from{opacity:0;transform:translateY(-10px) scaleX(.94)}to{opacity:1;transform:translateY(0) scaleX(1)}}
  </style>
  <svg viewBox="0 0 1000 500" role="img" aria-label="Diagram: fifteen Japanese AI and robotics companies dossiered and graded by ABB's own engineers, seven rated A, eight converted to site visits">
    <rect x="0" y="0" width="1000" height="500" rx="8" fill="${P.deep}"></rect>
    <text class="ttl" x="40" y="48">Fifteen dossiers. The client graded every one.</text>
    <text class="sub" x="40" y="76">The grade that matters is the one your engineers give, not the one we give.</text>
    ${bars}
    <line x1="40" y1="452" x2="960" y2="452" stroke="${P.green}" stroke-width="1"></line>
    <text class="note" x="40" y="478">ABB Robotics · Japan scouting file, 29 June 2017 — 15 companies, 27 fields, grades and visit requests as recorded</text>
  </svg>`;
});
/* ─────────────────────────────────────────────────────────────
   5. AUXETIC LATTICE — negative Poisson's ratio, the mechanism
   under the smart-seat and steering-wheel concepts. Conventional
   foam bulges outward under load; an auxetic lattice contracts
   inward, so it conforms to a body instead of squeezing away.
   Audi 4D printing scouting project, 2019.
   ───────────────────────────────────────────────────────────── */
def('dg-auxetic',()=>{
  const KT='0;0.16;0.42;0.72;1', DUR='6s';
  const STILL=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const anim=(attr,from,to)=>STILL?'':`<animate attributeName="${attr}" dur="${DUR}" repeatCount="indefinite" keyTimes="${KT}" calcMode="spline" keySplines=".4 0 .6 1;.4 0 .6 1;.4 0 .6 1;.4 0 .6 1" values="${from};${from};${to};${to};${from}"></animate>`;
  // hexagonal cell; sideX = w - r  →  r>0 concave (re-entrant), r<0 convex
  const cell=(cx,cy,w,h,r)=>{const s=w-r;return `M${(cx-w).toFixed(1)} ${(cy-h).toFixed(1)} L${(cx+w).toFixed(1)} ${(cy-h).toFixed(1)} L${(cx+s).toFixed(1)} ${cy.toFixed(1)} L${(cx+w).toFixed(1)} ${(cy+h).toFixed(1)} L${(cx-w).toFixed(1)} ${(cy+h).toFixed(1)} L${(cx-s).toFixed(1)} ${cy.toFixed(1)} Z`;};
  function lattice(cx,baseY,cols,rows,w,h,rRel,sx,sy,rCom,cls){
    const wc=w*sx,hc=h*sy,out=[];
    const relH=rows*2*h, comH=rows*2*hc;
    for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
      const xR=cx-cols*w+w+i*2*w, yR=baseY-relH+h+j*2*h;
      const xC=cx-cols*wc+wc+i*2*wc, yC=baseY-comH+hc+j*2*hc;
      const a=cell(xR,yR,w,h,rRel), b=cell(xC,yC,wc,hc,rCom);
      out.push(`<path class="${cls}" d="${a}">${anim('d',a,b)}</path>`);
    }
    return {cells:out.join(''),relH,comH,relW:cols*2*w,comW:cols*2*wc};
  }
  const baseY=392, cols=5, rows=4, w=32, h=26;
  const L=lattice(250,baseY,cols,rows,w,h,-0.30*w,1.17,0.74,-0.52*w,'cn');
  const R=lattice(790,baseY,cols,rows,w,h,0.34*w,0.74,0.74,0.60*w,'ax');
  // press plate + width caliper, animated on the same clock
  const plate=(cx,relH,comH)=>{const yR=baseY-relH-15,yC=baseY-comH-15,ax=cx+150;
    const arrow=y=>`M${ax} ${y-34} L${ax} ${y-7} M${ax-7} ${y-16} L${ax} ${y-7} L${ax+7} ${y-16}`;
    return `<g><rect x="${cx-190}" y="${yR}" width="380" height="11" rx="2" fill="#4b5b4f">${anim('y',yR,yC)}</rect><path d="${arrow(yR)}" fill="none" stroke="#4b5b4f" stroke-width="2.4" stroke-linecap="round">${anim('d',arrow(yR),arrow(yC))}</path></g>`;};
  const cal=(cx,relW,comW,col)=>{const y=baseY+26,aR=cx-relW/2,bR=cx+relW/2,aC=cx-comW/2,bC=cx+comW/2;
    const d=(a,b)=>`M${a} ${y} L${b} ${y} M${a+9} ${y-5} L${a} ${y} L${a+9} ${y+5} M${b-9} ${y-5} L${b} ${y} L${b-9} ${y+5}`;
    return `<path fill="none" stroke="${col}" stroke-width="2" d="${d(aR,bR)}">${anim('d',d(aR,bR),d(aC,bC))}</path>`;};
  return `<style>
  .ttl{font-family:'Source Serif 4',Georgia,serif;font-size:26px;font-weight:600;fill:${P.ink}}
  .sub{font-size:16.5px;fill:${P.muted}}
  .pn{font-family:'IBM Plex Mono',monospace;font-size:15px;letter-spacing:.09em;text-transform:uppercase}
  .pd{font-size:15.5px;fill:${P.muted}}
  .cn{fill:#e6ded4;stroke:#9c8f7d;stroke-width:1.6}
  .ax{fill:${P.tint};stroke:${P.mid};stroke-width:1.6}
  .vd{font-family:'IBM Plex Mono',monospace;font-size:15px;fill:${P.muted}}
  .note{font-size:15px;fill:${P.muted}}
  </style>
  <svg viewBox="0 0 1060 500" role="img" aria-label="Animated comparison: under load a conventional cellular structure bulges outward, while an auxetic lattice contracts inward — negative Poisson's ratio">
    <rect x="0" y="0" width="1060" height="500" rx="8" fill="#fff" stroke="${P.rule}"></rect>
    <text class="ttl" x="40" y="46">Why a printed seat can conform instead of resist</text>
    <text class="sub" x="40" y="72">The same load on both. Watch the width, not the height.</text>
    <line x1="530" y1="100" x2="530" y2="430" stroke="${P.rule}" stroke-width="1"></line>
    <text class="pn" x="60" y="118" fill="#8a7a63">CONVENTIONAL CELL</text>
    <text class="pd" x="60" y="142">Compress it and it bulges wider —</text>
    <text class="pd" x="60" y="163">it pushes back against the body.</text>
    <text class="pn" x="600" y="118" fill="${P.mid}">AUXETIC LATTICE · 4D PRINTED</text>
    <text class="pd" x="600" y="142">Compress it and it draws inward —</text>
    <text class="pd" x="600" y="163">it wraps around the body.</text>
    ${L.cells}${R.cells}
    ${plate(250,L.relH,L.comH)}${plate(790,R.relH,R.comH)}
    ${cal(250,L.relW,L.comW,'#9c8f7d')}${cal(790,R.relW,R.comW,P.mid)}
    <text class="vd" x="250" y="${baseY+50}" text-anchor="middle">width GROWS · Poisson ratio positive</text>
    <text class="vd" x="790" y="${baseY+50}" text-anchor="middle" fill="${P.mid}">width SHRINKS · Poisson ratio NEGATIVE</text>
    <line x1="40" y1="466" x2="1020" y2="466" stroke="${P.rule}" stroke-width="1"></line>
    <text class="note" x="40" y="490">Audi 4D printing scouting project, 2019 — the mechanism under the smart-seat and steering-wheel concepts. Schematic.</text>
  </svg>`;
});

/* ─────────────────────────────────────────────────────────────
   6. GATED VALIDATION — how a bleeding-edge technology gets
   de-risked into production. Figures as delivered in the report.
   ───────────────────────────────────────────────────────────── */
def('dg-gates',()=>{
  const g=[
    ['GATE 1','50–100K','Auxetic structure','Prove the minimum viable solution','Paid project','Lab partner + brand',150],
    ['GATE 2','100–250K','Fully customised','MVS against agreed key parameters','Paid project + first right of refusal','Shared IP',205],
    ['GATE 3','200–400K','Sensor &amp; AI connected','Solution production','Production partner','Full production path',262]
  ];
  const baseY=406, bw=252;
  const blocks=g.map((d,i)=>{
    const x=88+i*312, y=baseY-d[6];
    return `<g class="gt" style="animation-delay:${(0.3+i*0.28).toFixed(2)}s">
      <rect x="${x}" y="${y}" width="${bw}" height="${d[6]}" rx="4" fill="${i===2?P.green:i===1?P.mid:'#4a7d3f'}"></rect>
      <text class="gn" x="${x+18}" y="${y+30}">${d[0]}</text>
      <text class="gv" x="${x+18}" y="${y+64}">${d[1]}</text>
      <text class="gc" x="${x+18}" y="${y+86}">USD</text>
      <text class="gp" x="${x+18}" y="${y+118}">${d[2]}</text>
      <text class="gd" x="${x+18}" y="${y+144}">${d[3]}</text>
      <text class="gs" x="${x+18}" y="${d[6]>200?y+180:y+176}">${d[4]}</text>
      <text class="gs2" x="${x+18}" y="${d[6]>200?y+200:y+196}">${d[5]}</text>
    </g>`;
  }).join('');
  const arrows=[0,1].map(i=>{const x=88+i*312+bw+12;return `<path class="ga" style="animation-delay:${(0.7+i*0.28).toFixed(2)}s" d="M${x} ${baseY-40} L${x+36} ${baseY-40} M${x+27} ${baseY-48} L${x+36} ${baseY-40} L${x+27} ${baseY-32}" fill="none" stroke="${P.mid}" stroke-width="2.4"></path>`}).join('');
  return `<style>
  .ttl{font-family:'Source Serif 4',Georgia,serif;font-size:26px;font-weight:600;fill:${P.ink}}
  .sub{font-size:16.5px;fill:${P.muted}}
  .gt{opacity:1}
  .ga{opacity:1}
  @keyframes rise{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
  @keyframes af{from{opacity:0}to{opacity:1}}
  @media (prefers-reduced-motion:no-preference){
    :host(:not(.in)) .gt,:host(:not(.in)) .ga{opacity:0}
    :host(.reveal) .gt,:host(.reveal) .ga{opacity:1}
    :host(.in) .gt{animation:rise .6s ease-out both}
    :host(.in) .ga{animation:af .5s ease both}
  }
  .gn{font-family:'IBM Plex Mono',monospace;font-size:15px;letter-spacing:.12em;fill:#dff0d2}
  .gv{font-family:'IBM Plex Mono',monospace;font-size:29px;font-weight:500;fill:#fff}
  .gc{font-family:'IBM Plex Mono',monospace;font-size:15px;letter-spacing:.1em;fill:#a8d18a}
  .gp{font-size:18px;font-weight:600;fill:#fff}
  .gd{font-size:15.5px;fill:#dff0d2}
  .gs{font-family:'IBM Plex Mono',monospace;font-size:15px;fill:#fff}
  .gs2{font-family:'IBM Plex Mono',monospace;font-size:15px;fill:#a8d18a}
  .note{font-size:15px;fill:${P.muted}}
  .fl{font-family:'IBM Plex Mono',monospace;font-size:15px;letter-spacing:.09em;text-transform:uppercase;fill:${P.muted}}
  </style>
  <svg viewBox="0 0 1060 500" role="img" aria-label="Diagram: three-gate validation model escalating from 50-100 thousand dollars proving a minimum viable solution to 200-400 thousand dollars for production, with IP terms deepening at each gate">
    <rect x="0" y="0" width="1060" height="500" rx="8" fill="#fff" stroke="${P.rule}"></rect>
    <text class="ttl" x="40" y="46">Nobody signs off on a moonshot. They sign off on a gate.</text>
    <text class="sub" x="40" y="72">Each gate buys the right to open the next one — and only if the last one delivered.</text>
    ${blocks}${arrows}
    <line x1="88" y1="${baseY+1}" x2="1012" y2="${baseY+1}" stroke="${P.ink}" stroke-width="1.4"></line>
    <text class="fl" x="88" y="${baseY+26}">Investment rises only as the risk falls</text>
    <line x1="40" y1="466" x2="1020" y2="466" stroke="${P.rule}" stroke-width="1"></line>
    <text class="note" x="40" y="490">Audi 4D printing scouting project, 2019 — gate structure and investment bands as delivered in the final report.</text>
  </svg>`;
});
})();
