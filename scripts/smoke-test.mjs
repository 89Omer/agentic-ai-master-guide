import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { runSuite } from '../src/builder-engine.js';
import { TEMPLATES } from '../src/builder-templates.js';
const data=await readFile('src/data.js','utf8');
const base=await readFile('src/data-base.js','utf8');
const production=await readFile('src/production-concepts.js','utf8');
const app=await readFile('src/app.js','utf8');
const builder=await readFile('src/builder.js','utf8');
const builderCss=await readFile('src/builder.css','utf8');
const conceptModes=await readFile('src/concept-modes.js','utf8');
const analytics=await readFile('src/analytics.js','utf8');
const analyticsConfig=await readFile('src/analytics-config.js','utf8');
const analyticsCss=await readFile('src/analytics.css','utf8');
const buildPopular=await readFile('scripts/build-popular.mjs','utf8');
const packageJson=await readFile('package.json','utf8');
const index=await readFile('index.html','utf8');
const css=await readFile('src/styles.css','utf8');
for(const file of ['src/app.js','src/builder.js','src/builder-engine.js','src/builder-templates.js','src/concept-modes.js','src/analytics-config.js','src/analytics.js','scripts/build-popular.mjs']) execFileSync(process.execPath,['--check',file],{stdio:'pipe'});

// Each template must start with exactly the intended failures, and the intended fixes must make every test pass.
const g=(check,extra={})=>({type:'guardrail',check,...extra});
const builderCases={
  router:{start:3,fix:w=>{w.steps.push(g('grounded'));}},
  rag:{start:1,fix:w=>{w.steps[0].topK=2;w.steps.splice(1,0,g('sanitize'));w.steps.push(g('grounded'));}},
  agent:{start:2,fix:w=>{w.steps.unshift(g('sanitize'));w.steps[1].maxIterations=4;w.steps.push(g('grounded'));}},
  evaluator:{start:2,fix:w=>{w.steps.push(g('grounded'));}},
  approval:{start:3,fix:w=>{w.steps[0]=g('allowlist',{domains:'campus.ac.uk'});},fixedPass:2},
  memory:{start:0,fix:w=>{w.steps.unshift(g('sanitize'));}}
};
const passing=(w,t)=>runSuite(w,t.tests).filter(r=>r.grade.pass).length;
const builderBehaviour=TEMPLATES.every(t=>{
  const c=builderCases[t.id], w=JSON.parse(JSON.stringify(t));
  c.fix(w);
  return passing(t,t)===c.start && passing(w,t)===(c.fixedPass??t.tests.length);
});
const misplaced=(()=>{const t=TEMPLATES.find(x=>x.id==='rag'),w=JSON.parse(JSON.stringify(t));w.steps.push(g('sanitize'));w.steps.unshift(g('grounded'));return passing(w,t)===1;})();

const checks=[
  ['core concept data', base.includes("'loop-engineering'") && base.includes("'mcp'") && base.includes("'agent-evaluation'")],
  ['production concept data', production.includes("'harness-engineering'") && production.includes("'ag-ui'") && production.includes("'context-compaction'") && production.includes("'adversarial-evaluation'")],
  ['expanded data integration', data.includes('productionConceptRows') && data.includes('agentEngineeringCategory') && data.includes('baseConcepts')],
  ['learning paths', data.includes('learningPaths')],
  ['projects', data.includes('projects')],
  ['quiz', data.includes('quizzes')],
  ['guide search', app.includes('askGuide') && app.includes('scoreConcepts')],
  ['builder route', app.includes("r.page==='build'") && app.includes('bindBuilder') && app.includes("['playground', 'research-lab']")],
  ['builder UI', builder.includes('builderPage') && builder.includes('data-run-tests') && builder.includes('tracePanel')],
  ['builder templates behave as designed', builderBehaviour],
  ['guardrail placement matters', misplaced],
  ['concept pages link to builder', app.includes('templateForConcept') && conceptModes.includes('data-open-build')],
  ['builder + concept modes loaded', index.includes('builder.css') && index.includes('concept-modes.js') && index.includes('concept-modes.css')],
  ['old labs removed', !index.includes('research-lab') && !index.includes('playground-')],
  ['builder responsive CSS', builderCss.includes('@media(max-width:760px)')],
  ['analytics config', analyticsConfig.includes("provider: 'goatcounter'") && analyticsConfig.includes('respectDoNotTrack') && analyticsConfig.includes('siteCode')],
  ['analytics tracking', analytics.includes('window.goatcounter.count') && analytics.includes('trackCurrentRoute') && analytics.includes('enhanceConceptCount')],
  ['Most Read UI', analytics.includes('enhanceMostRead') && analytics.includes('enhancePopularSort') && analyticsCss.includes('analytics-most-read')],
  ['Most Read build', buildPopular.includes('analytics-popular.json') && buildPopular.includes('concepts.length') && packageJson.includes('build-popular.mjs')],
  ['analytics loaded', index.includes('analytics.js') && index.includes('analytics.css')],
  ['responsive CSS', css.includes('@media (max-width:760px)')],
  ['Aptos stack', css.includes('Aptos')]
];
for(const [name,ok] of checks){ if(!ok) throw new Error(`Smoke test failed: ${name}`); console.log(`✓ ${name}`); }
