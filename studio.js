(()=>{'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('.titlebar').forEach((el,i)=>el.dataset.index=String(i+2).padStart(2,'0')+' /');
const cards=[...document.querySelectorAll('.archive-card')];
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 let count=0;cards.forEach(c=>{c.hidden=button.dataset.filter!=='all'&&c.dataset.category!==button.dataset.filter;if(!c.hidden)count++;});
 document.querySelector('.archive-count').textContent=`Showing ${String(count).padStart(2,'0')} / 04 projects`;
}));
// Progressive enhancement: content stays visible without JavaScript or observers.
if('IntersectionObserver'in window&&!reduced.matches){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pending');observer.unobserve(e.target);}}),{threshold:.04});document.querySelectorAll('.titlebar,.archive-card,.pn').forEach(el=>{el.classList.add('reveal','pending');observer.observe(el);});}
const canvas=document.querySelector('.signal-field'),ctx=canvas.getContext('2d');if(!ctx)return;
let w=1,h=1,t=0,raf=0,visible=true,pointer={x:.6,y:.5};
function render(){raf=0;const dpr=Math.min(devicePixelRatio||1,2);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);t+=.006;
 for(let line=0;line<46;line++){ctx.beginPath();ctx.strokeStyle=`rgba(195,215,139,${.08+(line%6)*.024})`;ctx.lineWidth=.7;
 for(let i=0;i<=100;i++){const x=w*i/100;const bend=Math.sin(i/100*5+t+line*.065)*h*.14;const envelope=Math.sin(i/100*Math.PI);const y=h*.15+line*h*.014+bend+Math.sin(i/100*8+line*.08-t)*envelope*h*.19+(pointer.y-.5)*envelope*40;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();}
 if(!reduced.matches&&visible&&!document.hidden)raf=requestAnimationFrame(render);
}
function start(){if(!raf&&visible&&!document.hidden)raf=requestAnimationFrame(render);}
new ResizeObserver(()=>{const r=canvas.getBoundingClientRect();w=r.width;h=r.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;start();}).observe(canvas);
document.querySelector('.home').addEventListener('pointermove',e=>{pointer.y=e.clientY/innerHeight;pointer.x=e.clientX/innerWidth;});
new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(!visible&&raf){cancelAnimationFrame(raf);raf=0;}else start();}).observe(canvas);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&raf){cancelAnimationFrame(raf);raf=0;}else start();});
reduced.addEventListener('change',()=>{if(raf){cancelAnimationFrame(raf);raf=0;}start();});start();
})();
