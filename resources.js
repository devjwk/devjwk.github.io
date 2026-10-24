(()=>{'use strict';
// Source paths checked against the repositories. A README is labeled notes, not a report.
const gh=repo=>'https://github.com/devjwk/'+repo;
const file=(repo,path)=>gh(repo)+'/blob/main/'+path.split('/').map(encodeURIComponent).join('/');
const code=(repo,label='GitHub')=>({label,url:gh(repo)});
const doc=(repo,path,label)=>({label,url:file(repo,path)});
const resources={
 'proj-riscv':[code('Project-Part-1','Hardware pipeline'),code('Project-Part-2','Software pipeline'),code('Project-Part-1-RISC-V-Single-cycle-Processor','Single-cycle CPU'),doc('Project-Part-1-RISC-V-Single-cycle-Processor','Proj1_report.doc','Single-cycle report (.doc)'),doc('Project-Part-1','README.md','Pipeline results & notes')],
 'proj-quant':[code('cpre487lab4'),doc('cpre487lab4','submission/lab4_report_06.pdf','Lab 4 report (PDF)'),doc('cpre487lab4','lab4/framework/src/Quant.h','Quantization source')],
 'page-senior-design':[{label:'GitLab · team repository',url:'https://git.ece.iastate.edu/sd/sddec26-08'},{label:'Presentation & project context',url:'#page-experience'}],
 'proj-android':[code('coms3090-2_sc_2'),{label:'Design & test documents',url:gh('coms3090-2_sc_2')+'/tree/main/Documents'},doc('coms3090-2_sc_2','Documents/block_diagram.pdf','System diagram (PDF)'),doc('coms3090-2_sc_2','Documents/2_sc_2_ScreenSketches.pdf','Screen sketches (PDF)')],
 'proj-web':[code('coms3190-assignment2','SkillFlix code'),code('coms3190-assignment3','Aircraft API code'),doc('coms3190-assignment2','README.md','SkillFlix notes'),doc('coms3190-assignment3','backend/README.md','API documentation')],
 'proj-point':[code('pointillism-gallery'),doc('pointillism-gallery','docs/results/README.md','Validation notes'),doc('pointillism-gallery','docs/architecture.md','Architecture')],
 'proj-detective':[code('ai-npc-detective-game'),doc('ai-npc-detective-game','docs/performance-report-v1.md','Performance report'),doc('ai-npc-detective-game','docs/architecture.md','Architecture')]
};
function link(item){const a=document.createElement('a');a.href=item.url;a.textContent=item.label+' ↗';if(!item.url.startsWith('#')){a.target='_blank';a.rel='noopener noreferrer';}return a;}
function fill(node,items){node.replaceChildren(...items.map(link));}
function compact(id){const items=resources[id];return [items[0],items.find(x=>!['Hardware pipeline','Software pipeline','Single-cycle CPU','SkillFlix code','Aircraft API code','GitHub'].includes(x.label)&&x!==items[0])];}
document.querySelectorAll('.archive-card').forEach(card=>fill(card.querySelector('.archive-card-resources'),compact(card.dataset.case)));
const scenes={'scene-point':'proj-point','scene-quant':'proj-quant','scene-cpu':'proj-riscv','scene-detective':'proj-detective','scene-odyssey':'page-senior-design'};
Object.entries(scenes).forEach(([scene,id])=>{const foot=document.querySelector('#'+scene+' .project-footnote');if(!foot)return;const nav=document.createElement('nav');nav.className='project-resources';nav.setAttribute('aria-label','Code and evidence for '+document.querySelector('[data-case="'+id+'"]').dataset.name);fill(nav,compact(id));foot.after(nav);});
const evidence=document.createElement('section');evidence.className='case-evidence';evidence.setAttribute('aria-label','Project code and evidence');const title=document.createElement('h3');title.textContent='Code & evidence';const links=document.createElement('nav');links.setAttribute('aria-label','Source repositories and related documents');evidence.append(title,links);document.querySelector('.case-summary').after(evidence);
function caseResources(id){if(resources[id])fill(links,resources[id]);}
window.addEventListener('portfolio:casechange',e=>caseResources(e.detail));
const study=document.createElement('span');study.className='study-resources';document.querySelector('.study-links').append(study);
function studyResources(i){const id=['proj-riscv','proj-quant','proj-point'][i];fill(study,i===0?[resources[id][0],resources[id].at(-1)]:compact(id));}
window.addEventListener('portfolio:studychange',e=>studyResources(e.detail));studyResources(0);
const more={
 'conv-flow-explorer':doc('conv-flow-explorer','README.md','Project notes'),
 'pipeline-detective':doc('pipeline-detective','README.md','Project notes'),
 'cpre4140-data-warehouse':doc('cpre4140-data-warehouse','README.md','Project notes'),
 'fpga-tetris':{label:'Timing & utilization reports',url:gh('fpga-tetris')+'/tree/main/reports/2026-10-05'}
};
document.querySelectorAll('.recent-code').forEach(a=>{const repo=a.href.split('/').pop();if(!more[repo])return;const nav=document.createElement('nav');nav.className='recent-actions';nav.setAttribute('aria-label','Code and documents');a.before(nav);nav.append(a,link(more[repo]));});
})();
