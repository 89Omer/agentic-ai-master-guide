import { readFile } from 'node:fs/promises';
const data=await readFile('src/data.js','utf8');
const app=await readFile('src/app.js','utf8');
const css=await readFile('src/styles.css','utf8');
const checks=[
  ['core concept data', data.includes("'loop-engineering'") && data.includes("'mcp'") && data.includes("'agent-evaluation'")],
  ['learning paths', data.includes('learningPaths')],
  ['projects', data.includes('projects')],
  ['quiz', data.includes('quizzes')],
  ['guide search', app.includes('askGuide') && app.includes('scoreConcepts')],
  ['playground', app.includes('loopLab') && app.includes('toolRouterLab') && app.includes('ragLab') && app.includes('approvalLab')],
  ['responsive CSS', css.includes('@media (max-width:760px)')],
  ['Aptos stack', css.includes('Aptos')]
];
for(const [name,ok] of checks){ if(!ok) throw new Error(`Smoke test failed: ${name}`); console.log(`✓ ${name}`); }
