(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
const paused=()=>document.body.dataset.motionPaused==='true';
let motionContext=null,firstSequence=true;
function choreography(){
 if(motionContext){motionContext.revert();motionContext=null;}
 if(paused()||!window.gsap||!window.ScrollTrigger){document.body.dataset.choreography='static';return;}
 gsap.registerPlugin(ScrollTrigger);document.body.dataset.choreography='active';
 motionContext=gsap.context(()=>{
  if(firstSequence&&scrollY<200){firstSequence=false;gsap.fromTo('#hero-title,.hero-line',{opacity:.6},{opacity:1,duration:.85,stagger:.1,ease:'power2.out'});gsap.fromTo('.hero-intro,.signal-lab',{y:10,opacity:.7},{y:0,opacity:1,duration:.85,stagger:.1,ease:'power3.out'});}
  $$('.exhibit').forEach((scene,i)=>{
   // These transforms never pin, resize, or hide a navigation target.
   const title=$('h3',scene),visual=$('.point-stage,.quant-instrument,.pipeline-instrument,.engine-visual,.role-map',scene);
   gsap.fromTo(title,{y:12,opacity:.65},{y:0,opacity:1,duration:.75,ease:'power3.out',scrollTrigger:{trigger:title,start:'top 92%',once:true}});
   if(visual)gsap.fromTo(visual,{opacity:.7},{opacity:1,duration:.8,ease:'power2.out',scrollTrigger:{trigger:visual,start:'top 91%',once:true}});
   ScrollTrigger.create({trigger:scene,start:'top 70%',end:'bottom 30%',onUpdate:self=>{scene.style.setProperty('--exhibit-progress',self.progress.toFixed(3));const a=$('.scene-links a[href="#'+scene.id+'"]');a?.style.setProperty('--chapter-progress',self.progress.toFixed(3));}});
  });
 });
}
// A short response when the visitor changes a diagram, not a synthetic data animation.
for(const [selector,target] of [['[data-stage]','.stage-caption'],['[data-npc-step]','#npc-description'],['[data-engine-state]','#engine-description'],['button[data-role]','#role-copy']])
 $$(selector).forEach(button=>button.addEventListener('click',()=>{if(!paused()&&window.gsap)gsap.fromTo(target,{opacity:.55},{opacity:1,duration:.3,overwrite:true});}));
$$('.quant-instrument,.pipeline-instrument,.engine-visual').forEach(panel=>panel.addEventListener('pointermove',e=>{if(!fine.matches||paused())return;const r=panel.getBoundingClientRect();panel.style.setProperty('--light-x',(e.clientX-r.left)+'px');panel.style.setProperty('--light-y',(e.clientY-r.top)+'px');},{passive:true}));
const reader=$('#case-dialog');new MutationObserver(()=>{if(reader.open&&!paused()&&window.gsap)gsap.fromTo('.case-intro',{opacity:.65},{opacity:1,duration:.35,overwrite:true});}).observe(reader,{attributes:true,attributeFilter:['open']});
let refreshFrame=0;function refresh(){if(refreshFrame||!window.ScrollTrigger)return;refreshFrame=requestAnimationFrame(()=>{refreshFrame=0;ScrollTrigger.refresh();});}
$$('details').forEach(d=>d.addEventListener('toggle',refresh));window.addEventListener('load',refresh);document.fonts?.ready.then(refresh);window.addEventListener('resize',refresh,{passive:true});

// The study controls use the shared motion preference; narrative entrances remain independent.
new MutationObserver(()=>choreography()).observe(document.body,{attributes:true,attributeFilter:['data-motion-paused']});
reduced.addEventListener('change',choreography);choreography();
})();
