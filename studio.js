(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
$$('.titlebar').forEach((el,i)=>el.dataset.index=String(i+3).padStart(2,'0')+' /');
const archive=$('#archive'),stage=$('.archive-grid'),cards=$$('.archive-card'),filters=$$('[data-filter]'),viewButtons=$$('[data-view]');
let view='shelf',filter='all',active=0,shown=cards.slice(),dragStart=null,dragged=false;
function render(){
 shown=cards.filter(c=>filter==='all'||c.dataset.category===filter);
 active=Math.max(0,Math.min(active,shown.length-1));
 cards.forEach(c=>{const i=shown.indexOf(c);let offset=i-active;if(offset>shown.length/2)offset-=shown.length;if(offset<-shown.length/2)offset+=shown.length;c.hidden=i<0;c.classList.toggle('is-current',i===active);c.tabIndex=view==='shelf'&&i!==active?-1:0;c.style.setProperty('--offset',offset);c.style.setProperty('--scale',i===active?1:.89-Math.min(Math.abs(offset),3)*.035);c.style.setProperty('--opacity',i===active?1:Math.abs(offset)>2?0:.52);c.style.setProperty('--layer',10-Math.abs(offset));c.style.visibility=view==='shelf'&&Math.abs(offset)>2?'hidden':'';c.style.pointerEvents=view==='shelf'&&Math.abs(offset)>2?'none':'';c.setAttribute('aria-label',(view==='grid'||i===active?'Open ':'Select ')+c.dataset.name);});
 const selected=shown[active];if(selected){$('#shelf-title').textContent=selected.dataset.name;$('#shelf-description').textContent=selected.dataset.desc;$('#shelf-position').textContent=String(active+1).padStart(2,'0')+' / '+String(shown.length).padStart(2,'0');}
 $('#shelf-prev').disabled=$('#shelf-next').disabled=shown.length<2;
 $('.archive-count').textContent=String(shown.length).padStart(2,'0')+' PROJECTS / '+(filter==='all'?'ALL WORK':filter==='intelligence'?'MACHINE LEARNING':filter.toUpperCase());
 filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));
 viewButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));
 archive.dataset.view=view;archive.classList.toggle('shelf-mode',view==='shelf');stage.setAttribute('aria-roledescription',view==='shelf'?'carousel':'project list');
}
function move(direction,focus=false){active=(active+direction+shown.length)%shown.length;render();if(focus)shown[active]?.focus({preventScroll:true});}
filters.forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;active=0;render();}));
viewButtons.forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view;render();}));
$('#shelf-prev').addEventListener('click',()=>move(-1));$('#shelf-next').addEventListener('click',()=>move(1));
stage.addEventListener('keydown',e=>{if(view!=='shelf'||!['ArrowLeft','ArrowRight','Home','End','Enter'].includes(e.key))return;e.preventDefault();if(e.key==='Enter')openCase(shown[active].dataset.case);else if(e.key==='Home'||e.key==='End'){active=e.key==='Home'?0:shown.length-1;render();shown[active].focus({preventScroll:true});}else move(e.key==='ArrowRight'?1:-1,true);});
stage.addEventListener('pointerdown',e=>{if(view!=='shelf'||e.button!==0)return;dragStart={x:e.clientX,y:e.clientY};dragged=false;});
stage.addEventListener('pointermove',e=>{if(!dragStart)return;const dx=e.clientX-dragStart.x,dy=e.clientY-dragStart.y;if(Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>9){dragged=true;if(!stage.hasPointerCapture(e.pointerId))stage.setPointerCapture(e.pointerId);stage.style.setProperty('--drag-x',Math.max(-130,Math.min(130,dx))+'px');}});
function endDrag(e){if(!dragStart)return;const dx=e.clientX-dragStart.x;dragStart=null;stage.style.removeProperty('--drag-x');if(dragged&&Math.abs(dx)>40)move(dx<0?1:-1);if(dragged)setTimeout(()=>{dragged=false;},0);}
stage.addEventListener('pointerup',endDrag);stage.addEventListener('pointercancel',()=>{dragStart=null;dragged=false;stage.style.removeProperty('--drag-x');});stage.addEventListener('dragstart',e=>e.preventDefault());
cards.forEach(card=>card.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if(dragged)return;const i=shown.indexOf(card);if(view==='shelf'&&i!==active){active=i;render();}else openCase(card.dataset.case);}));
$('#open-selected').addEventListener('click',()=>openCase(shown[active].dataset.case));
render();

// Existing case-study elements are moved, never duplicated, preserving graphs and IDs.
const dialog=$('#case-dialog');let reading=null,placeholder=null,lastFocus=null,openScroll=0,preserveURL=false;
const sourceLinks={
 'proj-riscv':'https://github.com/devjwk/Project-Part-1',
 'proj-quant':'https://github.com/devjwk/cpre487lab4',
 'proj-android':'https://github.com/devjwk/coms3090-2_sc_2',
 'proj-web':'https://github.com/devjwk/coms3190-assignment3',
 'page-senior-design':'https://git.ece.iastate.edu/sd/sddec26-08'
};
function restore(){if(reading&&placeholder?.parentNode){placeholder.parentNode.insertBefore(reading,placeholder);placeholder.remove();}reading=null;placeholder=null;}
function openCase(id,push=true){
 const card=cards.find(c=>c.dataset.case===id),panel=document.getElementById(id);if(!card||!panel)return;
 if(dialog.open&&reading===panel)return;
 if(!dialog.open){lastFocus=document.activeElement;openScroll=window.scrollY;}restore();
 if(id.startsWith('proj-'))$('.ptab[href="#'+id+'"]')?.click();
 $('#case-title').textContent=card.dataset.name;$('#case-lede').textContent=card.dataset.desc;$('#case-role').textContent=card.dataset.role;$('#case-result').textContent=card.dataset.result;$('#case-type').textContent=$('.cover-bottom>span',card).textContent;$('#case-source').href=sourceLinks[id];
 placeholder=document.createComment('case-study-location');panel.before(placeholder);$('#case-content').append(panel);reading=panel;
 document.body.classList.add('dialog-open');if(!dialog.open)dialog.showModal();dialog.scrollTop=0;$('#case-close').focus({preventScroll:true});
 if(push&&location.hash!=='#'+id)history.pushState({case:id},'','#'+id);
}
$('#case-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{restore();document.body.classList.remove('dialog-open');if(!preserveURL&&(location.hash.startsWith('#proj-')||location.hash==='#page-senior-design'))history.replaceState(null,'','#archive');preserveURL=false;window.scrollTo({top:openScroll,behavior:'instant'});if(lastFocus?.isConnected)lastFocus.focus({preventScroll:true});});
dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#proj-"]');if(a&&!a.classList.contains('archive-card')&&!a.classList.contains('ptab')){e.preventDefault();openCase(a.hash.slice(1));}},true);
function applyURL(){const id=location.hash.slice(1);if(id.startsWith('proj-'))openCase(id,false);else if(dialog.open){preserveURL=true;dialog.close();}}
window.addEventListener('hashchange',applyURL);window.addEventListener('popstate',applyURL);applyURL();

const index=$('#section-index'),toggle=$('#index-toggle');
function showIndex(open){index.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'Index −':'Index +';if(open)$('a',index).focus({preventScroll:true});}
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
function paintMotionButton(){const b=$('#motion-toggle');b.setAttribute('aria-pressed',String(paused));b.textContent=paused?'Play background':'Pause background';}
$('#motion-toggle').addEventListener('click',()=>{paused=!paused;paintMotionButton();if(paused&&raf){cancelAnimationFrame(raf);raf=0;drawBackground();}else requestBackground();});
reduce.addEventListener('change',e=>{paused=e.matches;paintMotionButton();if(paused&&raf){cancelAnimationFrame(raf);raf=0;}requestBackground();});
window.addEventListener('pointermove',e=>{target=e.clientY/Math.max(1,innerHeight);},{passive:true});window.addEventListener('resize',resize);window.addEventListener('scroll',()=>{if(paused)drawBackground();},{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&raf){cancelAnimationFrame(raf);raf=0;}else{last=0;requestBackground();}});
paintMotionButton();resize();
})();
