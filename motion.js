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
for(const [selector,target] of [['[data-stage]','.stage-caption'],['[data-npc-step]','#npc-description'],['[data-engine-state]','#engine-description'],['[data-role]','#role-copy']])
 $$(selector).forEach(button=>button.addEventListener('click',()=>{if(!paused()&&window.gsap)gsap.fromTo(target,{opacity:.55},{opacity:1,duration:.3,overwrite:true});}));
$$('.quant-instrument,.pipeline-instrument,.engine-visual').forEach(panel=>panel.addEventListener('pointermove',e=>{if(!fine.matches||paused())return;const r=panel.getBoundingClientRect();panel.style.setProperty('--light-x',(e.clientX-r.left)+'px');panel.style.setProperty('--light-y',(e.clientY-r.top)+'px');},{passive:true}));
const reader=$('#case-dialog');new MutationObserver(()=>{if(reader.open&&!paused()&&window.gsap)gsap.fromTo('.case-intro',{opacity:.65},{opacity:1,duration:.35,overwrite:true});}).observe(reader,{attributes:true,attributeFilter:['open']});
let refreshFrame=0;function refresh(){if(refreshFrame||!window.ScrollTrigger)return;refreshFrame=requestAnimationFrame(()=>{refreshFrame=0;ScrollTrigger.refresh();});}
$$('details').forEach(d=>d.addEventListener('toggle',refresh));window.addEventListener('load',refresh);document.fonts?.ready.then(refresh);window.addEventListener('resize',refresh,{passive:true});

// Original procedural signal surface. A bounded WebGL wire mesh; no model or texture download.
const figure=$('.signal-lab'),canvas=$('#signal-surface'),viewport=$('.signal-viewport');
let gl=null,program=null,indexBuffer=null,count=0,raf=0,visible=false,stopped=false,lastFrame=0,time=0,mode=0,pulse=0;
let pointer=[0,0],target=[0,0],locations={},theme=[36/255,71/255,198/255];
const vertex=`attribute vec2 a_position;
uniform float u_time;uniform vec2 u_pointer;uniform float u_mode;uniform float u_pulse;varying float v_light;
void main(){
 float x=a_position.x,z=a_position.y;
 float wave=sin(x*4.8+u_time*.8)*.095+cos(z*5.0-u_time*.65)*.075;
 float d=distance(vec2(x,z),u_pointer*.7);
 wave+=sin(d*13.0-u_time*2.0)*exp(-d*2.2)*(.035+u_pulse*.09);
 if(u_mode<.5){wave=mix(wave,floor(wave*16.0)/16.0,.3);}
 else if(u_mode<1.5){wave+=exp(-(x*x+z*z)*2.8)*.22;}
 else{wave+=sin(x*3.0+z*4.5-u_time)*.075;}
 float yaw=-.18+u_pointer.x*.12,angle=.87+u_pointer.y*.06;
 float rx=cos(yaw)*x+sin(yaw)*z,rz=-sin(yaw)*x+cos(yaw)*z;
 float sy=wave*cos(angle)-rz*sin(angle),depth=wave*sin(angle)+rz*cos(angle);
 gl_Position=vec4(rx*.68,sy*.8,depth*.15,1.0);
 v_light=clamp(.35+wave*1.6+(1.0-z)*.12,.18,.82);
}`;
const fragment=`precision mediump float;uniform vec3 u_color;varying float v_light;void main(){gl_FragColor=vec4(u_color,v_light);}`;
function fallback(){figure.dataset.graphics='fallback';stopped=true;if(raf){cancelAnimationFrame(raf);raf=0;}canvas.hidden=true;}
function compile(type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);throw Error('Signal shader unavailable');}return shader;}
function init(){try{
 gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false,powerPreference:'low-power'});if(!gl){fallback();return;}
 const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment);program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);if(!gl.getProgramParameter(program,gl.LINK_STATUS)){fallback();return;}
 gl.useProgram(program);const vertices=[],indices=[],nx=76,nz=46;
 for(let z=0;z<=nz;z++)for(let x=0;x<=nx;x++)vertices.push((x/nx*2-1)*1.18,z/nz*2-1);
 for(let z=0;z<=nz;z++)for(let x=0;x<nx;x++){const k=z*(nx+1)+x;indices.push(k,k+1);}
 for(let z=0;z<nz;z++)for(let x=0;x<=nx;x++){const k=z*(nx+1)+x;indices.push(k,k+nx+1);}
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);const pos=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
 indexBuffer=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);count=indices.length;
 for(const key of ['time','pointer','mode','pulse','color'])locations[key]=gl.getUniformLocation(program,'u_'+key);
 gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(0,0,0,0);figure.dataset.graphics='webgl';resize();
 }catch{fallback();}}
function updateTheme(){theme=document.body.dataset.monochrome==='true'?[.19,.21,.18]:[36/255,71/255,198/255];}
function draw(){if(!gl||stopped)return;gl.viewport(0,0,canvas.width,canvas.height);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);gl.uniform1f(locations.time,time);gl.uniform2fv(locations.pointer,pointer);gl.uniform1f(locations.mode,mode);gl.uniform1f(locations.pulse,pulse);gl.uniform3fv(locations.color,theme);gl.drawElements(gl.LINES,count,gl.UNSIGNED_SHORT,0);}
function request(){if(!raf&&visible&&!document.hidden&&!stopped)raf=requestAnimationFrame(frame);}
function frame(now){raf=0;if(stopped||document.hidden||!visible)return;const moving=!paused();if(now-lastFrame>=(fine.matches?32:45)){if(moving){time+=.023;pointer[0]+=(target[0]-pointer[0])*.055;pointer[1]+=(target[1]-pointer[1])*.055;pulse*=.96;}draw();lastFrame=now;}if(moving)request();}
function resize(){if(!gl||stopped)return;const r=viewport.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.max(1,Math.round(r.width*dpr));canvas.height=Math.max(1,Math.round(r.height*dpr));draw();request();}
viewport.addEventListener('pointermove',e=>{if(!fine.matches||paused())return;const r=viewport.getBoundingClientRect();target=[(e.clientX-r.left)/r.width*2-1,(e.clientY-r.top)/r.height*2-1];request();},{passive:true});
viewport.addEventListener('pointerleave',()=>{target=[0,0];},{passive:true});viewport.addEventListener('pointerdown',()=>{if(!paused()){pulse=1;request();}},{passive:true});
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback();});
new ResizeObserver(resize).observe(viewport);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){draw();request();}else if(raf){cancelAnimationFrame(raf);raf=0;}},{rootMargin:'40px'}).observe(figure);
const themes=[['Control and timing.','A conceptual field inspired by control and timing. Not measured data.','#scene-cpu','Explore RISC-V ↗'],['Precision and representation.','A conceptual field inspired by precision and representation. Not model output.','#scene-quant','Explore CNN inference ↗'],['Perception and response.','A conceptual field inspired by perception and response. Not a depth reconstruction.','#scene-point','Explore Pointillism ↗']];
$$('[data-field-mode]').forEach(b=>b.addEventListener('click',()=>{mode=+b.dataset.fieldMode;$$('[data-field-mode]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('#field-caption').textContent=themes[mode][1];$('#field-project').href=themes[mode][2];$('#field-project').textContent=themes[mode][3];pulse=1;draw();request();}));
$('#signal-motion').addEventListener('click',()=>$('#motion-toggle').click());
function motionState(){const isPaused=paused();$('#signal-motion').textContent=isPaused?'Play motion':'Pause motion';$('#signal-motion').setAttribute('aria-pressed',String(isPaused));if(isPaused&&raf){cancelAnimationFrame(raf);raf=0;}draw();if(!isPaused)request();}
new MutationObserver(records=>{if(records.some(r=>r.attributeName==='data-monochrome')){updateTheme();draw();}if(records.some(r=>r.attributeName==='data-motion-paused')){motionState();choreography();}}).observe(document.body,{attributes:true,attributeFilter:['data-motion-paused','data-monochrome']});
reduced.addEventListener('change',()=>{motionState();choreography();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&raf){cancelAnimationFrame(raf);raf=0;}else{draw();request();}});
updateTheme();init();motionState();choreography();
})();
