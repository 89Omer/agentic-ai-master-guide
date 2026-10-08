import { conceptById } from './data.js';
import { runSuite, MODEL_RULES, TOOL_LABELS } from './builder-engine.js';
import { TEMPLATES, STEP_TYPES, GUARDRAILS, TOOL_DESCRIPTIONS } from './builder-templates.js';

const STORE = 'aimg-builder-';
const iconBase = './public/assets/icons/';
const esc = (s = '') => String(s).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
const icon = name => `<img class="ui-icon" src="${iconBase}${name}.svg" alt="" aria-hidden="true">`;
const clone = o => JSON.parse(JSON.stringify(o));

let uid = 0;
const withIds = steps => steps.map(s => ({
  ...s,
  id: `s${++uid}`,
  ...(s.branches ? { branches: s.branches.map(b => ({ ...b, steps: withIds(b.steps) })) } : {}),
  ...(s.tools ? { tools: s.tools.map(t => ({ ...t })) } : {})
}));

const state = { templateId: null, steps: [], selected: null, results: null, previous: null, openTest: null, stale: false };

const template = () => TEMPLATES.find(t => t.id === state.templateId);

function load(id) {
  const t = TEMPLATES.find(x => x.id === id) || TEMPLATES[0];
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(STORE + t.id) || 'null'); } catch { /* storage unavailable */ }
  Object.assign(state, { templateId: t.id, steps: withIds(saved || clone(t.steps)), selected: null, results: null, previous: null, openTest: null, stale: false });
}

function save() {
  state.stale = true;
  try { localStorage.setItem(STORE + state.templateId, JSON.stringify(state.steps)); } catch { /* storage unavailable */ }
}

function locate(id, list = state.steps) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) return { list, index: i, step: list[i] };
    for (const b of list[i].branches || []) { const hit = locate(id, b.steps); if (hit) return hit; }
  }
  return null;
}

function listFor(key) {
  if (key === 'root') return state.steps;
  const [id, branch] = key.split('.');
  return locate(id)?.step.branches[Number(branch)]?.steps;
}

const NEW_STEP = {
  router: () => ({ type: 'router', branches: [{ label: 'Route A', description: 'Describe when this route should be used', steps: [] }, { label: 'Route B', description: 'Describe when this route should be used', steps: [] }] }),
  answer: () => ({ type: 'answer' }),
  agent: () => ({ type: 'agent', maxIterations: 5, tools: ['search_docs', 'calculator'].map(tool => ({ tool, description: TOOL_DESCRIPTIONS[tool] })) }),
  refine: () => ({ type: 'refine', maxRounds: 2 }),
  tool: () => ({ type: 'tool', tool: 'search_docs', topK: 2 }),
  guardrail: () => ({ type: 'guardrail', check: 'grounded' })
};

function summary(s) {
  if (s.type === 'router') return `${s.branches.length} routes: ${s.branches.map(b => b.label).join(' · ')}`;
  if (s.type === 'tool') return `${TOOL_LABELS[s.tool]}${['search_docs', 'web_search'].includes(s.tool) ? ` · top ${s.topK || 2}` : ''}`;
  if (s.type === 'answer') return 'Writes the reply from what is in context';
  if (s.type === 'agent') return `${s.tools.length} tool${s.tools.length === 1 ? '' : 's'} · ${Number(s.maxIterations) ? `max ${s.maxIterations} iterations` : 'no iteration limit'}`;
  if (s.type === 'refine') return `Up to ${s.maxRounds} review round${s.maxRounds > 1 ? 's' : ''}`;
  if (s.type === 'guardrail') return `${GUARDRAILS[s.check].label}${s.check === 'allowlist' ? `: ${s.domains || 'no domains'}` : ''}`;
  return '';
}

// ---------- flow editor ----------

function stepStatus() {
  const open = state.results?.find(r => r.test.id === state.openTest);
  const map = {};
  const rank = { bad: 3, warn: 2, good: 1, ok: 0 };
  open?.run.trace.forEach(e => { if (e.stepId && (rank[e.status] || 0) > (rank[map[e.stepId]] || 0)) map[e.stepId] = e.status; });
  return map;
}

function addSlot(key, index, nested) {
  const types = Object.entries(STEP_TYPES).filter(([type]) => !(nested && (type === 'router' || type === 'agent')));
  return `<div class="wf-add"><select data-add="${key}|${index}" aria-label="Add a step here"><option value="">＋ Add step</option>${types.map(([type, t]) => `<option value="${type}">${t.label}</option>`).join('')}</select></div>`;
}

function stepsHtml(list, key, statuses) {
  const nested = key !== 'root';
  return addSlot(key, 0, nested) + list.map((s, i) => stepCard(s, statuses) + addSlot(key, i + 1, nested)).join('');
}

function stepCard(s, statuses) {
  const t = STEP_TYPES[s.type];
  const status = statuses[s.id];
  return `<div class="wf-step wf-${s.type} ${state.selected === s.id ? 'is-selected' : ''} ${status ? `status-${status}` : ''}" data-select="${s.id}">
    <div class="wf-step-main">
      <span class="wf-icon">${icon(s.type === 'guardrail' ? 'shield-halved' : t.icon)}</span>
      <div class="wf-step-copy"><small>${t.group}</small><strong>${s.type === 'tool' ? TOOL_LABELS[s.tool] : t.label}</strong><span>${esc(summary(s))}</span></div>
      <div class="wf-step-actions">
        <button data-move="${s.id}|-1" aria-label="Move ${t.label} up">↑</button>
        <button data-move="${s.id}|1" aria-label="Move ${t.label} down">↓</button>
        <button data-remove="${s.id}" aria-label="Remove ${t.label}">✕</button>
      </div>
    </div>
    ${s.type === 'router' ? `<div class="wf-branches">${s.branches.map((b, bi) => `<div class="wf-branch"><div class="wf-branch-head"><strong>${esc(b.label)}</strong><small>${esc(b.description)}</small></div>${stepsHtml(b.steps, `${s.id}.${bi}`, statuses)}</div>`).join('')}</div>` : ''}
  </div>`;
}

// ---------- inspector ----------

function inspector() {
  const hit = state.selected && locate(state.selected);
  if (!hit) {
    return `<span class="eyebrow">HOW THE SIMULATED MODEL BEHAVES</span>
      <h3>No API key. Consistent rules.</h3>
      <p>The model here follows the same rules every time, so any change in the results comes from your design.</p>
      <ol class="wf-rules">${MODEL_RULES.map(r => `<li>${esc(r)}</li>`).join('')}</ol>
      <p class="wf-muted">Click any step to change its settings.</p>`;
  }
  const s = hit.step, t = STEP_TYPES[s.type];
  let fields = '';
  if (s.type === 'router') {
    fields = s.branches.map((b, i) => `<div class="wf-field-group">
      <label>Route ${i + 1} name<input data-branch-label="${i}" value="${esc(b.label)}"></label>
      <label>When to use it (the model reads this)<textarea data-branch-desc="${i}" rows="2">${esc(b.description)}</textarea></label>
      ${s.branches.length > 2 ? `<button class="wf-link" data-branch-remove="${i}">Remove route</button>` : ''}
    </div>`).join('') + (s.branches.length < 4 ? '<button class="secondary-button" data-branch-add>＋ Add route</button>' : '') +
      '<p class="wf-muted">If nothing matches, the request goes to the last route.</p>';
  } else if (s.type === 'tool') {
    fields = `<label>Tool<select data-field="tool">${['search_docs', 'web_search', 'calculator', 'read_memory'].map(k => `<option value="${k}" ${s.tool === k ? 'selected' : ''}>${TOOL_LABELS[k]}</option>`).join('')}</select></label>
      ${['search_docs', 'web_search'].includes(s.tool) ? `<label>Results to retrieve (top-k)<input type="number" min="1" max="5" data-field="topK" value="${s.topK || 2}"></label><p class="wf-muted">More results give the model more to work with, and more chances to read something harmful.</p>` : ''}`;
  } else if (s.type === 'agent') {
    fields = `<label>Maximum iterations<input type="number" min="0" max="20" data-field="maxIterations" value="${Number(s.maxIterations) || 0}"></label>
      <p class="wf-muted">0 means no limit: the agent stops only when it thinks it has finished.</p>
      <span class="wf-label">Tools the agent can choose from</span>
      ${['search_docs', 'web_search', 'calculator', 'send_email'].map(k => { const tool = s.tools.find(x => x.tool === k); return `<div class="wf-field-group ${tool ? '' : 'is-off'}">
        <label class="wf-check"><input type="checkbox" data-agent-tool="${k}" ${tool ? 'checked' : ''}> ${TOOL_LABELS[k]}${k === 'send_email' ? ' <em>side effect</em>' : ''}</label>
        ${tool ? `<label>Description (the model reads this)<textarea data-agent-desc="${k}" rows="2">${esc(tool.description)}</textarea></label>` : ''}
      </div>`; }).join('')}`;
  } else if (s.type === 'refine') {
    fields = `<label>Review rounds<input type="number" min="1" max="3" data-field="maxRounds" value="${s.maxRounds}"></label><p class="wf-muted">Each round costs one review call, plus a rewrite if problems are found.</p>`;
  } else if (s.type === 'guardrail') {
    fields = `<label>Check<select data-field="check">${Object.entries(GUARDRAILS).map(([k, g]) => `<option value="${k}" ${s.check === k ? 'selected' : ''}>${g.label}</option>`).join('')}</select></label>
      <p class="wf-muted">${esc(GUARDRAILS[s.check].help)}</p>
      ${s.check === 'allowlist' ? `<label>Allowed email domains (comma-separated)<input data-field="domains" value="${esc(s.domains || '')}" placeholder="campus.ac.uk"></label>` : ''}
      <p class="wf-muted">Position matters: a guardrail only affects the steps after it.</p>`;
  } else {
    fields = '<p class="wf-muted">No settings. The model answers each part of the request from its context, and makes up an answer for any part with no source.</p>';
  }
  return `<span class="eyebrow">${t.group.toUpperCase()} STEP</span><h3>${t.label}</h3><p>${esc(t.blurb)}</p><div class="wf-fields">${fields}</div><button class="wf-link" data-deselect>← Model rules</button>`;
}

// ---------- tests + trace ----------

function totals(results) {
  return results.reduce((a, r) => ({
    pass: a.pass + (r.grade.pass ? 1 : 0),
    modelCalls: a.modelCalls + r.run.metrics.modelCalls,
    toolCalls: a.toolCalls + r.run.metrics.toolCalls,
    tokens: a.tokens + r.run.metrics.tokens,
    reviews: a.reviews + r.run.metrics.humanReviews
  }), { pass: 0, modelCalls: 0, toolCalls: 0, tokens: 0, reviews: 0 });
}

function scoreboard() {
  if (!state.results) return '<p class="wf-muted">Run the tests to see how this design holds up.</p>';
  const t = totals(state.results), n = state.results.length, p = state.previous;
  const delta = (now, before, lowerIsBetter) => before === undefined || now === before ? '' : `<em class="${(now < before) === lowerIsBetter ? 'up' : 'down'}">${now > before ? '+' : ''}${(now - before).toLocaleString()}</em>`;
  return `<div class="wf-score ${t.pass === n ? 'all-pass' : ''}">
    <div><strong>${t.pass}/${n}</strong><span>tests passing ${delta(t.pass, p?.pass, false)}</span></div>
    <div><strong>${t.modelCalls}</strong><span>model calls ${delta(t.modelCalls, p?.modelCalls, true)}</span></div>
    <div><strong>${t.toolCalls}</strong><span>tool calls ${delta(t.toolCalls, p?.toolCalls, true)}</span></div>
    <div><strong>~${t.tokens.toLocaleString()}</strong><span>tokens ${delta(t.tokens, p?.tokens, true)}</span></div>
    <div><strong>${t.reviews}</strong><span>human reviews ${delta(t.reviews, p?.reviews, true)}</span></div>
  </div>${state.stale ? '<p class="wf-stale">You changed the workflow. Run the tests again to see the effect.</p>' : ''}`;
}

function testList() {
  const t = template();
  return t.tests.map(test => {
    const r = state.results?.find(x => x.test.id === test.id);
    const cls = r ? (r.grade.pass ? 'pass' : 'fail') : 'idle';
    return `<button class="wf-test ${cls} ${state.openTest === test.id ? 'is-open' : ''}" data-open-test="${test.id}">
      <span class="wf-test-mark">${r ? (r.grade.pass ? '✓' : '✕') : '•'}</span>
      <span class="wf-test-copy"><strong>${esc(test.title)}</strong><small>“${esc(test.input)}”</small>${r && !r.grade.pass ? `<em>${esc(r.grade.failures[0].message)}</em>` : ''}</span>
      <span class="wf-test-open">${r ? 'Trace →' : ''}</span>
    </button>`;
  }).join('');
}

function tracePanel() {
  const r = state.results?.find(x => x.test.id === state.openTest);
  if (!r) return '';
  const answer = r.run.sentences.length
    ? r.run.sentences.map(s => `<span class="wf-sentence ${s.injected ? 'injected' : s.grounded ? 'grounded' : 'made-up'}">${esc(s.text)}<small>${s.injected ? 'injected' : s.grounded ? esc(s.source) : 'no source'}</small></span>`).join(' ')
    : '<span class="wf-muted">No answer was produced.</span>';
  const failures = r.grade.failures.map(f => `<div class="wf-failure"><strong>${esc(f.message)}</strong><p>${esc(f.hint)}</p>${conceptById[f.concept] ? `<button class="wf-link" data-concept="${f.concept}">Learn: ${esc(conceptById[f.concept].title)} →</button>` : ''}</div>`).join('');
  const kindIcon = { input: 'book-open', model: 'brain', tool: 'wrench', guardrail: 'shield-halved', human: 'user-check', agent: 'arrows-rotate' };
  return `<section class="wf-trace-panel">
    <div class="wf-trace-head"><div><span class="eyebrow">TRACE</span><h3>${esc(r.test.title)}</h3></div><span class="wf-verdict ${r.grade.pass ? 'pass' : 'fail'}">${r.grade.pass ? 'Passed' : 'Failed'}</span></div>
    <div class="wf-final"><span class="eyebrow">FINAL ANSWER</span><p>${answer}</p>${r.run.outbox.length ? `<div class="wf-outbox">${r.run.outbox.map(e => `<span class="${e.status}">✉ ${esc(e.to)}: ${e.status}</span>`).join('')}</div>` : ''}</div>
    ${failures ? `<div class="wf-failures">${failures}</div>` : '<div class="wf-failure ok"><strong>This test passes.</strong></div>'}
    <ol class="wf-trace">${r.run.trace.map(e => `<li class="trace-${e.status}"><span class="wf-trace-icon">${icon(kindIcon[e.kind] || 'circle-nodes')}</span><div><strong>${esc(e.title)}</strong>${e.detail ? `<pre>${esc(e.detail)}</pre>` : ''}</div></li>`).join('')}</ol>
  </section>`;
}

function allPassBanner() {
  if (!state.results || state.stale || !state.results.every(r => r.grade.pass)) return '';
  const i = TEMPLATES.findIndex(t => t.id === state.templateId), next = TEMPLATES[i + 1];
  return `<div class="wf-banner"><div><strong>All tests pass.</strong><span>Look at the cost numbers: could you get the same result with fewer model calls or reviews?</span></div>${next ? `<button class="primary-button" data-template="${next.id}">Next pattern: ${esc(next.title)} →</button>` : ''}</div>`;
}

// ---------- page ----------

export function builderPage(id) {
  if (!state.templateId || (id && id !== state.templateId)) load(id);
  const t = template();
  const statuses = stepStatus();
  return `
  <section class="page-width wf-intro">
    <span class="eyebrow">WORKFLOW BUILDER</span>
    <h1>Build an agent. Test it. Break it. Fix it.</h1>
    <p>Each pattern starts with a working design and a set of tests, and some of the tests fail. Read the trace, change the design, run the tests again. When they all pass, you understand the pattern.</p>
    <div class="wf-templates" role="tablist">${TEMPLATES.map(x => `<button role="tab" aria-selected="${x.id === t.id}" class="${x.id === t.id ? 'active' : ''}" data-template="${x.id}"><strong>${esc(x.title)}</strong><small>${esc(x.pattern)}</small></button>`).join('')}</div>
  </section>
  <section class="page-width wf-shell">
    <div class="wf-brief">
      <div><span class="eyebrow">${esc(t.pattern.toUpperCase())}</span><h2>${esc(t.title)}</h2><p>${esc(t.summary)}</p>
        <div class="wf-concepts">${t.concepts.filter(c => conceptById[c]).map(c => `<button data-concept="${c}">${esc(conceptById[c].title)}</button>`).join('')}</div></div>
      <div class="wf-challenge"><span class="eyebrow">YOUR CHALLENGE</span><p>${esc(t.challenge)}</p><button class="wf-link" data-reset>Reset to the starting design</button></div>
    </div>
    <div class="wf-workspace">
      <div class="wf-canvas">
        <div class="wf-terminal">${icon('book-open')} User request</div>
        ${stepsHtml(state.steps, 'root', statuses)}
        <div class="wf-terminal end">${icon('check')} Reply to user</div>
      </div>
      <aside class="wf-inspector">${inspector()}</aside>
    </div>
    <div class="wf-tests">
      <div class="wf-tests-head"><div><span class="eyebrow">TEST SUITE</span><h2>Does your design hold up?</h2></div><button class="primary-button" data-run-tests>▶ Run all tests</button></div>
      ${scoreboard()}
      ${allPassBanner()}
      <div class="wf-test-grid"><div class="wf-test-list">${testList()}</div>${tracePanel() || '<div class="wf-trace-empty">Run the tests, then open any test to see every decision the agent made.</div>'}</div>
    </div>
  </section>`;
}

function runTests() {
  if (state.results && !state.stale) return;
  if (state.results) state.previous = totals(state.results);
  state.results = runSuite({ steps: state.steps }, template().tests);
  state.stale = false;
  const firstFail = state.results.find(r => !r.grade.pass);
  if (!state.openTest || !state.results.some(r => r.test.id === state.openTest)) state.openTest = (firstFail || state.results[0]).test.id;
}

export function bindBuilder(render) {
  const root = document.querySelector('.wf-shell');
  if (!root) return;
  const rerender = () => render();
  document.querySelectorAll('[data-template]').forEach(b => b.addEventListener('click', () => { location.hash = `#/build/${b.dataset.template}`; }));
  root.querySelector('[data-run-tests]')?.addEventListener('click', () => { runTests(); rerender(); });
  root.querySelector('[data-reset]')?.addEventListener('click', () => {
    try { localStorage.removeItem(STORE + state.templateId); } catch { /* storage unavailable */ }
    load(state.templateId); rerender();
  });
  root.querySelectorAll('[data-open-test]').forEach(b => b.addEventListener('click', () => {
    if (!state.results || state.stale) runTests();
    state.openTest = b.dataset.openTest; rerender();
  }));
  root.querySelectorAll('[data-select]').forEach(el => el.addEventListener('click', e => {
    if (e.target.closest('button, select, input, textarea')) return;
    const card = e.target.closest('[data-select]');
    if (card !== el) return;
    state.selected = el.dataset.select; rerender();
  }));
  root.querySelector('[data-deselect]')?.addEventListener('click', () => { state.selected = null; rerender(); });
  root.querySelectorAll('[data-add]').forEach(sel => sel.addEventListener('change', () => {
    if (!sel.value) return;
    const [key, index] = sel.dataset.add.split('|');
    const [step] = withIds([NEW_STEP[sel.value]()]);
    listFor(key).splice(Number(index), 0, step);
    state.selected = step.id; save(); rerender();
  }));
  root.querySelectorAll('[data-move]').forEach(b => b.addEventListener('click', () => {
    const [id, dir] = b.dataset.move.split('|');
    const hit = locate(id), to = hit.index + Number(dir);
    if (to < 0 || to >= hit.list.length) return;
    hit.list.splice(to, 0, hit.list.splice(hit.index, 1)[0]); save(); rerender();
  }));
  root.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => {
    const hit = locate(b.dataset.remove);
    hit.list.splice(hit.index, 1);
    if (state.selected === b.dataset.remove) state.selected = null;
    save(); rerender();
  }));

  const hit = state.selected && locate(state.selected);
  if (!hit) return;
  const s = hit.step;
  // Text edits save quietly so typing and tabbing are not interrupted by a re-render.
  root.querySelectorAll('[data-branch-label]').forEach(i => i.addEventListener('input', () => { s.branches[i.dataset.branchLabel].label = i.value; save(); }));
  root.querySelectorAll('[data-branch-desc]').forEach(i => i.addEventListener('input', () => { s.branches[i.dataset.branchDesc].description = i.value; save(); }));
  root.querySelectorAll('[data-agent-desc]').forEach(i => i.addEventListener('input', () => { s.tools.find(t => t.tool === i.dataset.agentDesc).description = i.value; save(); }));
  root.querySelectorAll('input[data-field="domains"]').forEach(i => i.addEventListener('input', () => { s.domains = i.value; save(); }));
  root.querySelectorAll('select[data-field], input[type="number"][data-field]').forEach(i => i.addEventListener('change', () => {
    s[i.dataset.field] = i.type === 'number' ? Number(i.value) : i.value; save(); rerender();
  }));
  root.querySelector('[data-branch-add]')?.addEventListener('click', () => { s.branches.splice(s.branches.length - 1, 0, { label: `Route ${s.branches.length + 1}`, description: 'Describe when this route should be used', steps: [] }); save(); rerender(); });
  root.querySelectorAll('[data-branch-remove]').forEach(b => b.addEventListener('click', () => { s.branches.splice(Number(b.dataset.branchRemove), 1); save(); rerender(); }));
  root.querySelectorAll('[data-agent-tool]').forEach(c => c.addEventListener('change', () => {
    const k = c.dataset.agentTool;
    s.tools = c.checked ? [...s.tools, { tool: k, description: TOOL_DESCRIPTIONS[k] }] : s.tools.filter(t => t.tool !== k);
    save(); rerender();
  }));
}
