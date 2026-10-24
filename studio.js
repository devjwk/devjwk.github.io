(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
$$('.titlebar').forEach((el,i)=>el.dataset.index=String(i+3).padStart(2,'0')+' /');
const archive=$('#archive'),stage=$('.archive-grid'),cards=$$('.archive-card'),filters=$$('[data-filter]'),viewButtons=$$('[data-view]');
let view='shelf',filter='all',active=0,shown=cards.slice(),dragStart=null,dragged=false;
function render(){
 shown=cards.filter(c=>filter==='all'||c.dataset.category===filter);
 active=Math.max(0,Math.min(active,shown.length-1));
 cards.forEach(c=>{const i=shown.indexOf(c);let offset=i-active;if(offset>shown.length/2)offset-=shown.length;if(offset<-shown.length/2)offset+=shown.length;c.hidden=i<0;c.classList.toggle('is-current',i===active);c.tabIndex=-1;const open=$('.archive-card-open',c),available=view==='grid'||i===active;open.tabIndex=available?0:-1;$$('.archive-card-resources a',c).forEach(a=>a.tabIndex=available?0:-1);$('.card-open-hint',c).textContent=available?'Open case ↗':'Select project →';c.style.setProperty('--offset',offset);c.style.setProperty('--scale',i===active?1:.89-Math.min(Math.abs(offset),3)*.035);c.style.setProperty('--opacity',i===active?1:Math.abs(offset)>2?0:.52);c.style.setProperty('--layer',10-Math.abs(offset));c.style.visibility=view==='shelf'&&Math.abs(offset)>2?'hidden':'';c.style.pointerEvents=view==='shelf'&&Math.abs(offset)>2?'none':'';c.setAttribute('aria-label',c.dataset.name);open.setAttribute('aria-label',(view==='grid'||i===active?'Open ':'Select ')+c.dataset.name);});
 const selected=shown[active];if(selected){$('#shelf-title').textContent=selected.dataset.name;$('#shelf-description').textContent=selected.dataset.desc;$('#shelf-position').textContent=String(active+1).padStart(2,'0')+' / '+String(shown.length).padStart(2,'0');}
 $('#shelf-prev').disabled=$('#shelf-next').disabled=shown.length<2;
 $('.archive-count').textContent=String(shown.length).padStart(2,'0')+' PROJECTS / '+(filter==='all'?'ALL WORK':filter==='intelligence'?'MACHINE LEARNING':filter.toUpperCase());
 filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));
 viewButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));
 archive.dataset.view=view;archive.classList.toggle('shelf-mode',view==='shelf');stage.setAttribute('aria-roledescription',view==='shelf'?'carousel':'project list');
}
function move(direction,focus=false){active=(active+direction+shown.length)%shown.length;render();if(focus)$('.archive-card-open',shown[active])?.focus({preventScroll:true});}
filters.forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;active=0;render();}));
viewButtons.forEach(b=>{b.addEventListener('click',()=>{stage.classList.add('layout-switching');view=b.dataset.view;render();requestAnimationFrame(()=>requestAnimationFrame(()=>stage.classList.remove('layout-switching')));});b.disabled=false;});
$('#shelf-prev').addEventListener('click',()=>move(-1));$('#shelf-next').addEventListener('click',()=>move(1));
stage.addEventListener('keydown',e=>{if(e.target.closest('.archive-card-resources')||view!=='shelf'||!['ArrowLeft','ArrowRight','Home','End','Enter'].includes(e.key))return;e.preventDefault();if(e.key==='Enter')openCase(shown[active].dataset.case);else if(e.key==='Home'||e.key==='End'){active=e.key==='Home'?0:shown.length-1;render();$('.archive-card-open',shown[active]).focus({preventScroll:true});}else move(e.key==='ArrowRight'?1:-1,true);});
stage.addEventListener('pointerdown',e=>{if(e.target.closest('.archive-card-resources')||view!=='shelf'||e.button!==0)return;dragStart={x:e.clientX,y:e.clientY};dragged=false;});
stage.addEventListener('pointermove',e=>{if(!dragStart)return;const dx=e.clientX-dragStart.x,dy=e.clientY-dragStart.y;if(Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>9){dragged=true;if(!stage.hasPointerCapture(e.pointerId))stage.setPointerCapture(e.pointerId);stage.style.setProperty('--drag-x',Math.max(-130,Math.min(130,dx))+'px');}});
function endDrag(e){if(!dragStart)return;const dx=e.clientX-dragStart.x;dragStart=null;stage.style.removeProperty('--drag-x');if(dragged&&Math.abs(dx)>40)move(dx<0?1:-1);if(dragged)setTimeout(()=>{dragged=false;},0);}
stage.addEventListener('pointerup',endDrag);stage.addEventListener('pointercancel',()=>{dragStart=null;dragged=false;stage.style.removeProperty('--drag-x');});stage.addEventListener('dragstart',e=>e.preventDefault());
cards.forEach(card=>card.addEventListener('click',e=>{if(e.target.closest('.archive-card-resources'))return;e.preventDefault();e.stopPropagation();if(dragged)return;const i=shown.indexOf(card);if(view==='shelf'&&i!==active){active=i;render();}else openCase(card.dataset.case);}));
$('#open-selected').addEventListener('click',()=>openCase(shown[active].dataset.case));
render();

// One reader, with a stable return location and normal browser Back/Forward behavior.
const dialog=$('#case-dialog');
let reading=null,placeholder=null,origin=null,readerIds=[],ownsEntry=false,pending=null,handledHash=null;
const sourceLinks={
 'proj-point':'https://github.com/devjwk/pointillism-gallery',
 'proj-detective':'https://github.com/devjwk/ai-npc-detective-game',
 'proj-riscv':'https://github.com/devjwk/Project-Part-1',
 'proj-quant':'https://github.com/devjwk/cpre487lab4',
 'proj-android':'https://github.com/devjwk/coms3090-2_sc_2',
 'proj-web':'https://github.com/devjwk/coms3190-assignment3',
 'page-senior-design':'https://git.ece.iastate.edu/sd/sddec26-08'
};
const sceneLinks={'proj-point':'scene-point','proj-quant':'scene-quant','proj-riscv':'scene-cpu','proj-detective':'scene-detective','page-senior-design':'scene-odyssey'};
const featured=Object.keys(sceneLinks);
history.scrollRestoration='manual';
function restore(){if(reading&&placeholder?.parentNode){placeholder.parentNode.insertBefore(reading,placeholder);placeholder.remove();}reading=null;placeholder=null;}
function focusDestination(node){const heading=node.matches('details')?$('summary',node):$('h1,h2,h3',node)||node;if(!heading.hasAttribute('tabindex'))heading.tabIndex=-1;heading.focus({preventScroll:true});}
function reveal(node){for(let p=node;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;}
function navigate(hash,push=true){
 const node=document.getElementById((hash||'#page-home').slice(1));if(!node)return;
 if(push&&location.hash!==hash){history.replaceState({...history.state,portfolioScroll:scrollY},'');history.pushState({portfolioScroll:0},'',hash);}
 handledHash=location.hash;reveal(node);requestAnimationFrame(()=>{node.scrollIntoView({block:'start',behavior:reduce.matches?'instant':'smooth'});focusDestination(node);});
}
function closeReader({returnToOrigin=true}={}){
 const destination=origin;restore();document.body.classList.remove('dialog-open');if(dialog.open)dialog.close();ownsEntry=false;
 if(returnToOrigin&&destination?.direct){navigate(destination.hash,false);return;}
 if(returnToOrigin&&destination){window.scrollTo({top:destination.scroll,behavior:'instant'});if(destination.focus?.isConnected)destination.focus.focus({preventScroll:true});else{const node=document.getElementById(destination.hash.slice(1));if(node)focusDestination(node);}}
}
function paintReaderNavigation(id){
 const i=readerIds.indexOf(id);$('#case-position').textContent='PROJECT '+String(i+1).padStart(2,'0')+' / '+String(readerIds.length).padStart(2,'0');
 for(const [button,offset] of [[$('#case-prev'),-1],[$('#case-next'),1]]){const nextId=readerIds[i+offset],card=cards.find(c=>c.dataset.case===nextId);button.disabled=!card;$('strong',button).textContent=card?.dataset.name||(offset<0?'First project':'Last project');button.dataset.case=nextId||'';}
 for(const [top,original] of [[$('#case-prev-top'),$('#case-prev')],[$('#case-next-top'),$('#case-next')]]){top.disabled=original.disabled;top.dataset.case=original.dataset.case;top.title=$('strong',original).textContent;}
 const visual=$('#case-visual');visual.hidden=!sceneLinks[id];visual.href='#'+(sceneLinks[id]||'selected-work');
 $('#case-related').hidden=!['proj-riscv','proj-quant','page-senior-design'].includes(id);
}
function openCase(id,push=true){
 const card=cards.find(c=>c.dataset.case===id),panel=document.getElementById(id);if(!card||!panel)return;
 if(dialog.open&&reading===panel)return;
 const alreadyOpen=dialog.open;
 if(!alreadyOpen){
  const state=history.state,fromPage=location.hash!=='#'+id;
  origin={hash:fromPage?location.hash:(state?.returnHash??'#'+(sceneLinks[id]||'archive')),scroll:fromPage?scrollY:(state?.returnScroll||0),focus:document.activeElement,direct:!fromPage&&!state?.portfolioReader};
  readerIds=(document.activeElement?.closest('.exhibit')||!fromPage&&featured.includes(id))?featured.slice():shown.map(c=>c.dataset.case);
  if(!fromPage&&state?.readerIds)readerIds=state.readerIds.filter(key=>cards.some(c=>c.dataset.case===key));
  if(!readerIds.includes(id))readerIds=cards.map(c=>c.dataset.case);
  ownsEntry=push||Boolean(state?.portfolioReader);
 }
 restore();if(id.startsWith('proj-'))$('.ptab[href="#'+id+'"]')?.click();
 $('#case-dialog-label').textContent=card.dataset.name;$('#case-title').textContent=card.dataset.name;$('#case-lede').textContent=card.dataset.desc;$('#case-role').textContent=card.dataset.role;$('#case-result').textContent=card.dataset.result;$('#case-type').textContent=$('.cover-bottom>span',card).textContent;$('#case-source').href=sourceLinks[id];
 placeholder=document.createComment('case-study-location');panel.before(placeholder);$('#case-content').append(panel);reading=panel;
 dialog.dataset.case=id;window.dispatchEvent(new CustomEvent('portfolio:casechange',{detail:id}));paintReaderNavigation(id);document.body.classList.add('dialog-open');if(!dialog.open)dialog.showModal();dialog.scrollTop=0;$('#case-close').focus({preventScroll:true});
 if(push){const state={portfolioReader:true,returnHash:origin.hash,returnScroll:origin.scroll,readerIds};if(alreadyOpen)history.replaceState(state,'','#'+id);else history.pushState(state,'','#'+id);}
 handledHash=location.hash;
}
function dismissReader(destination=null){
 if(!dialog.open)return;pending=destination?{hash:destination}:{return:true};
 if(ownsEntry&&history.state?.portfolioReader){history.back();return;}
 history.replaceState(null,'',origin?.hash??'#archive');handledHash=location.hash;
 const plan=pending;pending=null;closeReader({returnToOrigin:!plan.hash});if(plan.hash)navigate(plan.hash);
}
$('#case-close').addEventListener('click',()=>dismissReader());
dialog.addEventListener('cancel',e=>{e.preventDefault();dismissReader();});
dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dismissReader();});
for(const selector of ['#case-prev','#case-next','#case-prev-top','#case-next-top'])$(selector).addEventListener('click',e=>openCase(e.currentTarget.dataset.case));
function applyRoute(){
 if(handledHash===location.hash&&!pending)return;handledHash=location.hash;
 const id=location.hash.slice(1),isReader=id.startsWith('proj-')||id==='page-senior-design'&&history.state?.portfolioReader;
 if(isReader){pending=null;openCase(id,false);return;}
 if(dialog.open){const plan=pending;pending=null;const sameOrigin=location.hash===(origin?.hash||'');closeReader({returnToOrigin:!plan?.hash&&sameOrigin});if(plan?.hash){navigate(plan.hash);return;}if(sameOrigin)return;}
 navigate(location.hash||'#page-home',false);
}
window.addEventListener('popstate',applyRoute);window.addEventListener('hashchange',applyRoute);
document.addEventListener('click',e=>{
 const a=e.target.closest('a[href^="#"]');if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.classList.contains('ptab')||a.classList.contains('archive-card-open'))return;
 const id=a.hash.slice(1);if(!document.getElementById(id))return;e.preventDefault();
 if(a.dataset.openCase||id.startsWith('proj-'))openCase(a.dataset.openCase||id);
 else if(dialog.open)dismissReader(a.hash);else navigate(a.hash);
},true);
window.addEventListener('portfolio:navigate',e=>{if(dialog.open)dismissReader(e.detail);else navigate(e.detail);});
// Direct links to source documents expand their containing disclosure before scrolling.
if(location.hash)applyRoute();

const index=$('#section-index'),toggle=$('#index-toggle');
function showIndex(open){index.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'Menu −':'Menu +';toggle.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu');if(open)$('a',index).focus({preventScroll:true});}
toggle.addEventListener('click',()=>showIndex(index.hidden));$('#index-close').addEventListener('click',()=>{showIndex(false);toggle.focus();});
$$('a',index).forEach(a=>a.addEventListener('click',()=>showIndex(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!index.hidden){e.preventDefault();showIndex(false);toggle.focus();}});
document.addEventListener('click',e=>{if(!index.hidden&&!index.contains(e.target)&&!toggle.contains(e.target))showIndex(false);});
$('#mono-toggle').addEventListener('click',e=>{const on=e.currentTarget.getAttribute('aria-pressed')!=='true';document.body.dataset.monochrome=String(on);e.currentTarget.setAttribute('aria-pressed',String(on));e.currentTarget.textContent=on?'B&W [ON]':'B&W [OFF]';drawBackground(true);});
$('#copy-email').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('jwk0425@iastate.edu');$('#copy-status').textContent='Email copied.';}catch{$('#copy-status').textContent='jwk0425@iastate.edu';}});
$('#print-resume').addEventListener('click',()=>{document.body.dataset.print='resume';window.print();});window.addEventListener('afterprint',()=>{delete document.body.dataset.print;});

// A wide, low-contrast signal field follows the viewport throughout the page.
const bg=$('#ambient-field'),ctx=bg.getContext('2d');let width=1,height=1,t=0,raf=0,last=0,paused=reduce.matches,pointer=.5,target=.5;
function requestBackground(){if(!raf&&!document.hidden)raf=requestAnimationFrame(frame);}
function drawBackground(force=false){if(!ctx)return;const ratio=Math.min(devicePixelRatio||1,1.5);ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,width,height);ctx.strokeStyle=getComputedStyle(document.body).getPropertyValue('--accent').trim();ctx.lineWidth=.65;const shift=Math.min(window.scrollY/1800,2);
 for(let line=0;line<46;line++){ctx.beginPath();ctx.globalAlpha=.13+(line%9)*.032;for(let k=0;k<=100;k++){const u=k/100,x=u*width,env=Math.sin(u*Math.PI);const y=height*(.02+line*.022)+Math.sin(u*5.4+t+line*.065+shift)*height*.15+Math.cos(u*9.5-line*.033-t*.6)*height*.1*env+(pointer-.5)*height*.08*env;if(k)ctx.lineTo(x,y);else ctx.moveTo(x,y);}ctx.stroke();}
 if(force)last=0;
}
function frame(now){raf=0;if(document.hidden)return;if(now-last>=32){if(!paused){t+=.006;pointer+=(target-pointer)*.03;}drawBackground();last=now;}if(!paused)requestBackground();}
function resize(){const ratio=Math.min(devicePixelRatio||1,1.5);width=innerWidth;height=innerHeight;bg.width=Math.round(width*ratio);bg.height=Math.round(height*ratio);drawBackground(true);requestBackground();}
function paintMotionButton(){document.body.dataset.motionPaused=String(paused);const b=$('#motion-toggle');b.setAttribute('aria-pressed',String(paused));b.textContent=paused?'Play background':'Pause background';}
$('#motion-toggle').addEventListener('click',()=>{paused=!paused;paintMotionButton();if(paused&&raf){cancelAnimationFrame(raf);raf=0;drawBackground();}else requestBackground();});
reduce.addEventListener('change',e=>{paused=e.matches;paintMotionButton();if(paused&&raf){cancelAnimationFrame(raf);raf=0;}requestBackground();});
window.addEventListener('pointermove',e=>{target=e.clientY/Math.max(1,innerHeight);},{passive:true});window.addEventListener('resize',resize);window.addEventListener('scroll',()=>{if(paused)drawBackground();},{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&raf){cancelAnimationFrame(raf);raf=0;}else{last=0;requestBackground();}});
paintMotionButton();resize();
})();
