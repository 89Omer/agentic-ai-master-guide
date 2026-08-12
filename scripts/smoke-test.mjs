import { readFile } from 'node:fs/promises';
const data=await readFile('src/data.js','utf8');
const base=await readFile('src/data-base.js','utf8');
const production=await readFile('src/production-concepts.js','utf8');
const app=await readFile('src/app.js','utf8');
const playground=await readFile('src/playground-context.js','utf8');
const ragUpgrade=await readFile('src/rag-lab-upgrade.js','utf8');
const index=await readFile('index.html','utf8');
const css=await readFile('src/styles.css','utf8');
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
  ['responsive CSS', css.includes('@media (max-width:760px)')],
  ['Aptos stack', css.includes('Aptos')]
];
for(const [name,ok] of checks){ if(!ok) throw new Error(`Smoke test failed: ${name}`); console.log(`✓ ${name}`); }
