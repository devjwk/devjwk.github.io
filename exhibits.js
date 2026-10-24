(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
// The graph values are the same recorded lab measurements used by the full notes.
const quant=window.__portfolioRecords;
const memory=$('#memory-grid');for(let n=0;n<256;n++)memory.append(document.createElement('i'));
function precision(i){const q=quant[i],baseline=quant[0],ratio=baseline.s/q.s;
 $$('[data-precision]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.precision===i)));
 $('#quant-headline').innerHTML=ratio.toFixed(2)+'<span>×</span>';
 $('#quant-headline-label').textContent=i===0?'BASELINE STORAGE':'SMALLER WEIGHT STORAGE';
 $('#quant-insight').textContent=[
 'The reference point: floating-point weights and activations.',
 '8 bits preserves baseline accuracy while cutting weight storage to a quarter.',
 '4 bits loses most of the accuracy. Int8 containers mean no additional storage saving.',
 'At 2 bits, activations collapse to zero after convolution 2. Accuracy falls to chance level.'
 ][i];
 $('#x-storage').innerHTML=q.s.toLocaleString('en-US')+' <small>KB</small>';
 $('#x-latency').innerHTML=q.l+' <small>ms</small>';
 $('#x-accuracy').innerHTML=q.a+'<small>%</small>';
 $('#x-storage-bar').style.width=q.s/baseline.s*100+'%';$('#x-latency-bar').style.width=q.l/baseline.l*100+'%';$('#x-accuracy-bar').style.width=q.a+'%';
 $$('#memory-grid i').forEach((dot,k)=>dot.classList.toggle('filled',k<Math.round(256*q.s/baseline.s)));
 $('#quant-comparison').textContent='FP32: 3,081 KB / 142.9 ms / 23.5% top-1. '+(i===1?'8-bit: 74.9% less weight storage; 38.7% less latency.':i>1?'Lower precision shares the same int8 storage.':'Accuracy bars use an absolute 0–100% scale.');
}
$$('[data-precision]').forEach(b=>b.addEventListener('click',()=>precision(+b.dataset.precision)));precision(1);
const cpu=[{name:'Single-cycle',time:70214,clock:41.4},{name:'Software scheduled',time:74105,clock:16.8},{name:'Hardware scheduled',time:56327,clock:25.43}];
function cpuMetric(key){const max=Math.max(...cpu.map(x=>x[key]));$$('[data-cpu-metric]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.cpuMetric===key)));
 cpu.forEach((r,i)=>{$('[data-cpu-bar="'+i+'"]').style.width=r[key]/max*100+'%';$('[data-cpu-value="'+i+'"]').textContent=(key==='time'?r[key].toLocaleString('en-US'):r[key].toFixed(2))+' ns';});
 $('#cpu-takeaway').innerHTML=key==='time'?'19.8%<small> less time</small>':'16.80<small> ns / fastest clock</small>';
 $('#cpu-insight').textContent=key==='time'?'Hardware scheduled vs. single-cycle on the recorded Mergesort benchmark.':'Software scheduling wins on clock period but adds instructions. Its Mergesort run is slower.';
 $('#cpu-comparison').setAttribute('aria-label',(key==='time'?'Mergesort execution time':'Clock period')+': '+cpu.map(x=>x.name+' '+x[key]+' ns').join(', '));}
$$('[data-cpu-metric]').forEach(b=>b.addEventListener('click',()=>cpuMetric(b.dataset.cpuMetric)));cpuMetric('time');
const stages=[['FETCH / NEXT-PC LOGIC','I rewrote fetch logic to support jalr, then integrated it with the single-cycle datapath.'],['DECODE / CONTROL UNIT','I translated an instruction-by-signal table into control logic and checked it with module-level testbenches.'],['EXECUTE / HAZARD HANDLING','My forwarding unit resolves data dependencies; load-use stalls and branch flushes keep the pipeline correct.'],['MEMORY / PIPELINE CONTROL','I integrated stall and flush behavior in the pipeline registers. Load-use hazards need a stall, not just forwarding.'],['WRITEBACK / INTEGRATION','I worked on pipeline-register integration and systematic producer/consumer hazard checks, including twelve module-level testbenches.']];
$$('[data-stage]').forEach(b=>b.addEventListener('click',()=>{const i=+b.dataset.stage;$$('[data-stage]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('#stage-title').textContent=stages[i][0];$('#stage-copy').textContent=stages[i][1];}));
const npc=['Input checks screen injection patterns and banned topics before a model call.','Repeated questions can use a response cache. Otherwise, past summaries provide memory before the model is called.','Returned JSON is checked against a schema. Invalid output is replaced with a prepared fallback line.'];
$$('[data-npc-step]').forEach(b=>b.addEventListener('click',()=>{$$('[data-npc-step]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('#npc-description').textContent=npc[+b.dataset.npcStep];}));
const engine={intro:'The briefing starts a fresh mystery session.',explore:'Explore locations and collect clues. An accusation is available only after at least three clues.',dialogue:'A conversation can start only where that NPC is. The dialogue pipeline validates the reply before display.',deduction:'Submit a suspect after collecting enough clues; the engine evaluates the accusation.',ending:'The engine resolves the ending. Running out of turns can also end exploration or dialogue; retry returns to the intro.'};
$$('[data-engine-state]').forEach(b=>b.addEventListener('click',()=>{$$('[data-engine-state]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('#engine-description').textContent=engine[b.dataset.engineState];}));
const roles={traveler:['A traveler signs up.','The registration flow connects the page to protected routes and database constraints that prevent duplicate sign-ups.'],leader:['A leader opens a roster.','Role checks restrict access to assigned trips. Participant information is separated from accounts in the relational schema.'],organization:['An organization plans a trip.','Organization tools connect program creation and leader assignment to feature-based routes and controllers.'],admin:['An admin manages access.','Administrative pages connect organization setup and leader assignment to role-checked backend operations.']};
$$('button[data-role]').forEach(b=>b.addEventListener('click',()=>{$$('button[data-role]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const r=roles[b.dataset.role];$('#role-title').textContent=r[0];$('#role-copy').textContent=r[1];}));
// Keep the compact project selector, project links, and header in sync with scrolling.
const projectJump=$('#project-jump'),sceneNav=$('.scene-navigation');
projectJump.addEventListener('change',()=>window.dispatchEvent(new CustomEvent('portfolio:navigate',{detail:projectJump.value})));projectJump.disabled=false;
const seen=new IntersectionObserver(entries=>{for(const e of entries){e.target.dataset.visible=String(e.isIntersecting);if(e.isIntersecting){projectJump.value='#'+e.target.id;$$('.scene-links a').forEach(a=>a.setAttribute('aria-current',String(a.hash==='#'+e.target.id)));}}},{rootMargin:'-20% 0px -40% 0px'});$$('.exhibit').forEach(n=>seen.observe(n));
function measureNavigation(){document.documentElement.style.setProperty('--header-height',$('header').getBoundingClientRect().height+'px');document.documentElement.style.setProperty('--project-nav-height',sceneNav.getBoundingClientRect().height+'px');}
new ResizeObserver(measureNavigation).observe($('header'));new ResizeObserver(measureNavigation).observe(sceneNav);measureNavigation();
// Lightweight 2D point study. This preview makes no depth-reconstruction claim.
const canvas=$('#painting-points'),ctx=canvas.getContext('2d'),img=$('#point-source'),range=$('#point-gather');let points=[],w=1,h=1,raf=0,visible=false,amount=1,target=1,tilt=0,targetTilt=0;
const paused=()=>reduced.matches||document.body.dataset.motionPaused==='true';
function request(){if(!raf&&visible&&!document.hidden)raf=requestAnimationFrame(frame);}
function sample(){const temp=document.createElement('canvas');temp.width=240;temp.height=Math.round(240*img.naturalHeight/img.naturalWidth);const c=temp.getContext('2d',{willReadFrequently:true});c.drawImage(img,0,0,temp.width,temp.height);const data=c.getImageData(0,0,temp.width,temp.height).data;points=[];
 for(let y=0;y<temp.height;y+=2)for(let x=0;x<temp.width;x+=2){const i=(y*temp.width+x)*4,lum=(data[i]*.2126+data[i+1]*.7152+data[i+2]*.0722)/255;if(lum>.87)continue;const seed=Math.sin(x*12.9898+y*78.233)*43758.5453,noise=seed-Math.floor(seed);points.push({x:x/temp.width-.5,y:y/temp.height-.5,lum,r:Math.max(12,data[i]*.8),g:Math.max(14,data[i+1]*.8),b:Math.max(16,data[i+2]*.8),dx:Math.cos(noise*30)*(noise+.2),dy:Math.sin(noise*40)*(noise+.2)});}
 canvas.parentNode.dataset.ready='true';resize();}
function resize(){const box=canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,1.5);w=box.width;h=box.height;canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);request();}
function frame(){raf=0;const smooth=!paused();amount=smooth?amount+(target-amount)*.085:target;tilt=smooth?tilt+(targetTilt-tilt)*.06:0;ctx.clearRect(0,0,w,h);const artH=h*.79,artW=artH*img.naturalWidth/img.naturalHeight,scale=Math.min(1,(w*.86)/artW),aw=artW*scale,ah=artH*scale,scatter=1-amount;
 for(const p of points){const x=w*.5+p.x*aw+p.dx*scatter*w*.45+tilt*p.y*24,y=h*.44+p.y*ah+p.dy*scatter*h*.2;ctx.fillStyle='rgba('+p.r+','+p.g+','+p.b+','+(.4+(1-p.lum)*.6)+')';const size=Math.max(.6,aw/165*(.65+(1-p.lum)*.6));ctx.fillRect(x,y,size,size);}
 if(!paused()&&(Math.abs(amount-target)>.001||Math.abs(tilt-targetTilt)>.001))request();}
range.addEventListener('input',()=>{target=+range.value/100;$('#gather-value').textContent=range.value+'%';request();});
canvas.parentNode.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||paused())return;const r=canvas.getBoundingClientRect();targetTilt=(e.clientX-r.left)/r.width-.5;request();});canvas.parentNode.addEventListener('pointerleave',()=>{targetTilt=0;request();});
new ResizeObserver(resize).observe(canvas);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)request();else if(raf){cancelAnimationFrame(raf);raf=0;}},{rootMargin:'100px'}).observe(canvas);
if(img.complete&&img.naturalWidth)sample();else img.addEventListener('load',sample,{once:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&raf){cancelAnimationFrame(raf);raf=0;}else request();});reduced.addEventListener('change',request);
})();
