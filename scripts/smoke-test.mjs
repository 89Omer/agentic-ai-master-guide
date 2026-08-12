import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
const data=await readFile('src/data.js','utf8');
const base=await readFile('src/data-base.js','utf8');
const production=await readFile('src/production-concepts.js','utf8');
const app=await readFile('src/app.js','utf8');
const playground=await readFile('src/playground-context.js','utf8');
const ragUpgrade=await readFile('src/rag-lab-upgrade.js','utf8');
const research=await readFile('src/research-lab.js','utf8');
const researchState=await readFile('src/research-state.js','utf8');
const researchA=await readFile('src/research-stations-a.js','utf8');
const researchB=await readFile('src/research-stations-b.js','utf8');
const researchCss=await readFile('src/research-lab.css','utf8');
const index=await readFile('index.html','utf8');
const css=await readFile('src/styles.css','utf8');
for(const file of ['src/research-state.js','src/research-stations-a.js','src/research-stations-b.js','src/research-experiments.js','src/research-concept-mode.js','src/research-lab.js']) execFileSync(process.execPath,['--check',file],{stdio:'pipe'});
const checks=[
  ['core concept data', base.includes("'loop-engineering'") && base.includes("'mcp'") && base.includes("'agent-evaluation'")],
  ['production concept data', production.includes("'harness-engineering'") && production.includes("'ag-ui'") && production.includes("'context-compaction'") && production.includes("'adversarial-evaluation'")],
  ['expanded data integration', data.includes('productionConceptRows') && data.includes('agentEngineeringCategory') && data.includes('baseConcepts')],
  ['learning paths', data.includes('learningPaths')],
  ['projects', data.includes('projects')],
  ['quiz', data.includes('quizzes')],
  ['guide search', app.includes('askGuide') && app.includes('scoreConcepts')],
  ['playground', app.includes('loopLab') && app.includes('toolRouterLab') && app.includes('ragLab') && app.includes('approvalLab')],
  ['contextual playground', playground.includes('openConceptPractice') && playground.includes('challengeFor') && playground.includes('Practice complete')],
  ['contextual playground loaded', index.includes('playground-context.js')],
  ['RAG question answering', ragUpgrade.includes('RAG does not use one mandatory database') && ragUpgrade.includes('vector store') && ragUpgrade.includes('renderResult')],
  ['RAG upgrade loaded', index.includes('rag-lab-upgrade.js')],
  ['research lab route', research.includes('renderResearchLab') && research.includes('AGENT BEHAVIOUR LABORATORY')],
  ['research experiments', researchA.includes('Run 20 benchmark requests') && researchA.includes('Compare architectures') && researchB.includes('REPEATED-RUN EVALUATION') && researchB.includes('ADVERSARIAL TEST') && researchB.includes('LONG-HORIZON METRICS')],
  ['research concept modes', research.includes('research-concept-mode.js') && researchState.includes('stationForConcept')],
  ['research lab loaded', index.includes('research-lab.js') && index.includes('research-lab.css')],
  ['research responsive CSS', researchCss.includes('@media(max-width:760px)')],
  ['responsive CSS', css.includes('@media (max-width:760px)')],
  ['Aptos stack', css.includes('Aptos')]
];
for(const [name,ok] of checks){ if(!ok) throw new Error(`Smoke test failed: ${name}`); console.log(`✓ ${name}`); }
