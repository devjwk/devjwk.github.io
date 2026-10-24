/* Small, testable models adapted from the linked implementation sources. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ProjectStudyModels=api;})(typeof window==='undefined'?globalThis:window,function(){'use strict';
 const quantParams=Object.freeze({8:{scale:75.7477712,zero:-3},4:{scale:4.175074,zero:0},2:{scale:.596439143,zero:0}});
 function roundEven(x){const lo=Math.floor(x),fraction=x-lo;return fraction<.5?lo:fraction>.5?lo+1:lo%2===0?lo:lo+1;}
 function quantize(x,bits){const p=quantParams[bits];if(!p)throw Error('Unsupported precision');const lo=-(2**(bits-1)),hi=2**(bits-1)-1,scale=Math.fround(p.scale),product=Math.fround(Math.fround(x)*scale),q=Math.max(lo,Math.min(hi,roundEven(product)+p.zero)),restored=Math.fround((q-p.zero)/scale);return{x:Math.fround(x),q,restored,error:Math.abs(restored-Math.fround(x)),scale,zero:p.zero,min:lo,max:hi};}
 function forwarding({rs,memRd=0,memWrite=false,wbRd=0,wbWrite=false}){if(memWrite&&memRd!==0&&memRd===rs)return 2;if(wbWrite&&wbRd!==0&&wbRd===rs)return 1;return 0;}
 function loadUse({memRead,rd,rs1,rs2,use1=true,use2=true}){return Boolean(memRead&&rd!==0&&(use1&&rd===rs1||use2&&rd===rs2));}
 function pipeline(kind,cycle){const load=kind==='load',max=load?7:6,c=Math.max(1,Math.min(max,cycle)),rd=kind==='zero'?0:5,rs=kind==='none'?7:kind==='zero'?0:5;
  const a=c<=5?c-1:null,b=load?([null,null,0,1,1,2,3,4][c]):c>=2?c-2:null;
  const bStage=b!==null&&b<=4?b:null,hazard=load&&c===3&&loadUse({memRead:true,rd,rs1:rs,rs2:3}),fwd=bStage===2?forwarding({rs,memRd:a===3?rd:0,memWrite:a===3,wbRd:a===4?rd:0,wbWrite:a===4}):0;
  let title='Pipeline registers advance',explanation='Each instruction moves to its next stage.',bits='PCWrite = 1 · IF/ID_Write = 1',action='advance';
  if(hazard){title='Hold the consumer. Insert one bubble.';explanation='The load is in EX and its destination matches the instruction in ID. PC and IF/ID hold; ID/EX is flushed.';bits='PCWrite = 0 · IF/ID_Write = 0 · ID/EX_Flush = 1';action='stall';}
  else if(load&&c===4){title='One bubble passes through EX';explanation='The load proceeds to MEM. The consumer remains in ID for this cycle; it reaches EX next.';bits='BUBBLE IN EX · 1-CYCLE LOAD-USE DELAY';action='bubble';}
  else if(fwd===2){title='EX/MEM → EX';explanation='The matching ALU result bypasses writeback and feeds the dependent instruction’s ALU input.';bits='ForwardA = 10 · EX/MEM priority';action='mem-forward';}
  else if(fwd===1){title='MEM/WB → EX';explanation='After the load-use delay, the loaded value reaches the dependent instruction through MEM/WB forwarding.';bits='ForwardA = 01';action='wb-forward';}
  else if(bStage===2){title=rd===0?'x0 never forwards':'No register match';explanation=rd===0?'Writes to x0 are excluded by the forwarding comparisons. The consumer keeps the architectural zero.':'The source register differs from the producer destination, so the normal register input is selected.';bits='ForwardA = 00';action='register';}
  return{cycle:c,max,a,b:bStage,action,title,explanation,bits,load,rd,rs,codeA:load?'lw x5, 0(x1)':'add x'+rd+', x1, x2',codeB:(load?'add':'sub')+' x6, x'+rs+', x3'};
 }
 function sampleImage(rgba,width,height,count=1600,seed=1729){let randomState=seed>>>0;const random=()=>{randomState=(Math.imul(1664525,randomState)+1013904223)>>>0;return randomState/4294967296;};const cdf=new Float64Array(width*height);let sum=0;for(let i=0;i<cdf.length;i++){const j=i*4,l=1-(.2126*rgba[j]+.7152*rgba[j+1]+.0722*rgba[j+2])/255;sum+=l*l*.6+l*.4+.002;cdf[i]=sum;}const points=[];for(let id=0;id<count;id++){const r=random()*sum;let lo=0,hi=cdf.length-1;while(lo<hi){let m=(lo+hi)>>1;if(cdf[m]<r)lo=m+1;else hi=m;}const i=lo,j=i*4;points.push({id,x:((i%width)+random())/width-.5,y:(Math.floor(i/width)+random())/height-.5,sx:random()*1.84-.92,sy:random()*1.6-.8,color:[rgba[j]/255,rgba[j+1]/255,rgba[j+2]/255]});}return points;}
 return{quantParams,roundEven,quantize,forwarding,loadUse,pipeline,sampleImage};
});
