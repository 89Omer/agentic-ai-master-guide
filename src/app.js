import { categories, concepts, conceptById, learningPaths, projects, quizzes, quickPrompts, coreRibbon } from './data.js';

const app = document.querySelector('#app');
const iconBase = './public/assets/icons/';
const storageGet = (key, fallback = '[]') => { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } };
const storageSet = (key, value) => { try { localStorage.setItem(key, value); } catch { /* storage may be unavailable in previews */ } };
const state = {
  completed: new Set(JSON.parse(storageGet('aimg-completed'))),
  bookmarks: new Set(JSON.parse(storageGet('aimg-bookmarks'))),
  recent: JSON.parse(storageGet('aimg-recent')),
  assistant: null,
  conceptFilter: { q: '', category: 'all', level: 'all' },
  quiz: { index: 0, score: 0, selected: null, finished: false },
  playgroundTab: 'loop',
  loop: { step: 0, iteration: 1, max: 4, successAt: 3, running: false, log: [] },
  approval: 'waiting'
};

const html = String.raw;

function icon(name, alt = '', cls = '') {
  return `<img class="ui-icon ${cls}" src="${iconBase}${name}.svg" alt="${alt}" aria-hidden="${alt ? 'false' : 'true'}">`;
}

function saveState() {
  storageSet('aimg-completed', JSON.stringify([...state.completed]));
  storageSet('aimg-bookmarks', JSON.stringify([...state.bookmarks]));
  storageSet('aimg-recent', JSON.stringify(state.recent.slice(0, 8)));
}

function route() {
  const hash = location.hash || '#/home';
  const parts = hash.slice(2).split('/').filter(Boolean);
  return { page: parts[0] || 'home', id: parts[1] || null };
}

function navTo(path) {
  location.hash = `#/${path}`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function categoryFor(id) {
  return categories.find(c => c.id === id);
}

function progressForPath(path) {
  const complete = path.modules.filter(id => state.completed.has(id)).length;
  return { complete, total: path.modules.length, pct: Math.round((complete / path.modules.length) * 100) };
}

function topNav(active) {
  return html`
    <header class="topbar">
      <button class="brand" data-nav="home" aria-label="Go to home">
        <span class="brand-mark">${icon('layer-group')}</span>
        <span>Agentic AI Master Guide</span>
        <span class="open-badge">Open Source</span>
      </button>
      <nav class="desktop-nav" aria-label="Primary navigation">
        <button class="nav-link ${active === 'concepts' ? 'is-active' : ''}" data-nav="concepts">Explore Concepts</button>
        <button class="nav-link ${active === 'paths' ? 'is-active' : ''}" data-nav="paths">Learning Paths</button>
        <button class="nav-link ${active === 'playground' ? 'is-active' : ''}" data-nav="playground">Playground</button>
        <a class="nav-link github-link" href="https://github.com/" target="_blank" rel="noreferrer">${icon('github')} GitHub</a>
        <button class="primary-button compact" data-nav="paths">Start Learning <span>→</span></button>
      </nav>
      <button class="mobile-menu" data-mobile-menu aria-expanded="false">Menu</button>
    </header>
    <div class="mobile-nav" data-mobile-nav hidden>
      <button data-nav="concepts">Explore Concepts</button>
      <button data-nav="paths">Learning Paths</button>
      <button data-nav="playground">Playground</button>
      <button data-nav="projects">Projects</button>
      <button data-nav="quiz">Quiz</button>
    </div>
  `;
}

function shell(content, active = 'home') {
  return html`${topNav(active)}<main>${content}</main>${assistantPanel()}${footer()}`;
}

function footer() {
  return html`
    <footer class="footer">
      <div><strong>Agentic AI Master Guide</strong><span>Learn the concepts. See the system. Practise the decisions.</span></div>
      <div class="footer-links"><button data-nav="concepts">Concepts</button><button data-nav="projects">Projects</button><button data-nav="quiz">Quiz</button></div>
    </footer>`;
}

function assistantPanel() {
  if (!state.assistant) return '';
  const { title, text, matches = [], compare, actions = [] } = state.assistant;
  return html`
    <div class="assistant-backdrop" data-assistant-close></div>
    <aside class="assistant-panel" role="dialog" aria-modal="true" aria-label="Agentic AI Guide">
      <div class="assistant-head">
        <div><span class="eyebrow">GUIDE</span><h2>${escapeHtml(title)}</h2></div>
        <button class="icon-button" data-assistant-close aria-label="Close guide">×</button>
      </div>
      <div class="assistant-body">
        <p class="assistant-answer">${escapeHtml(text)}</p>
        ${compare ? comparisonMarkup(compare) : ''}
        ${matches.length ? html`<div class="assistant-matches"><span class="eyebrow">BEST MATCHES</span>${matches.map(c => html`<button class="assistant-result" data-concept="${c.id}"><strong>${c.title}</strong><span>${c.short}</span><b>→</b></button>`).join('')}</div>` : ''}
        ${actions.length ? html`<div class="assistant-actions">${actions.map(a => `<button class="secondary-button" data-nav="${a.path}">${a.label}</button>`).join('')}</div>` : ''}
      </div>
      <form class="assistant-input" data-assistant-form>
        <label class="sr-only" for="assistant-question">Ask another question</label>
        <input id="assistant-question" name="question" placeholder="Ask another Agentic AI question…" autocomplete="off">
        <button class="primary-circle" aria-label="Ask">${icon('arrow-up')}</button>
      </form>
    </aside>`;
}

function comparisonMarkup(compare) {
  return html`
    <div class="comparison-grid">
      <article><span class="compare-label">${compare.a.title}</span><p>${compare.a.short}</p><small>${compare.a.analogy}</small><button data-concept="${compare.a.id}">Learn ${compare.a.title} →</button></article>
      <article><span class="compare-label">${compare.b.title}</span><p>${compare.b.short}</p><small>${compare.b.analogy}</small><button data-concept="${compare.b.id}">Learn ${compare.b.title} →</button></article>
    </div>`;
}

function homePage() {
  const pathCards = learningPaths.map(path => {
    const p = progressForPath(path);
    const pathImage = { beginner:'./public/assets/path-beginner.png', developer:'./public/assets/path-developer.png', researcher:'./public/assets/path-researcher.png' }[path.id];
    return html`<button class="path-card path-${path.id}" data-path="${path.id}">
      <span class="path-icon"><img src="${pathImage}" alt=""></span>
      <span class="path-copy"><span class="path-title-row"><strong>${path.title}</strong><em>${path.badge}</em></span><span>${path.description}</span><small>${path.modules.length} modules · ~${path.hours} hours${p.complete ? ` · ${p.pct}% complete` : ''}</small></span>
      <b>→</b>
    </button>`;
  }).join('');

  const essential = categories.slice(0, 6).map(c => html`
    <button class="essential-card" data-category="${c.id}">
      <span class="concept-icon tone-${c.accent}">${icon(c.icon)}</span>
      <span><strong>${c.title}</strong><small>${c.description}</small></span>
      <b>→</b>
    </button>`).join('');

  return shell(html`
    <section class="hero page-width">
      <img class="hero-decoration cube" src="./public/assets/hero-orb-cube.png" alt="">
      <img class="hero-decoration orb" src="./public/assets/hero-orb-small.png" alt="">
      <div class="hero-copy">
        <h1>What do you want to <br>understand about <br>Agentic AI?</h1>
        <p>A free, open-source guide to help you learn Agentic AI—from first principles to advanced systems. Built for complete beginners and advanced builders.</p>
        <form class="hero-search" data-guide-form>
          <span class="search-spark">✦</span>
          <label class="sr-only" for="hero-question">Ask anything about Agentic AI</label>
          <input id="hero-question" name="question" placeholder="Ask anything about Agentic AI…" autocomplete="off">
          <button class="primary-circle" aria-label="Ask the guide">${icon('arrow-up')}</button>
        </form>
        <div class="quick-prompts">${quickPrompts.map((q, i) => `<button data-quick="${escapeAttr(q)}"><span>${['Start','Agent','Compare','Visual','Build','Quiz'][i]}</span>${q}</button>`).join('')}</div>
      </div>
      <div class="loop-feature-card">
        <div class="feature-copy"><h2>Agent Loop</h2><p>The core cycle every agent follows to solve tasks and achieve goals.</p></div>
        ${agentLoopDiagram('compact')}
        <div class="feature-actions"><button class="secondary-button" data-explain="agent-loop">${icon('book-open')} Explain simply</button><button class="primary-button" data-concept="agent-loop">Take me there <span>→</span></button></div>
      </div>
    </section>

    <section class="concept-ribbon page-width" aria-label="Core concept map">
      <div class="ribbon-label">Core concepts and how<br>they connect</div>
      <div class="ribbon-track ribbon-map">
        <div class="ribbon-top">
          ${ribbonButton('agent-loop')}
          ${ribbonButton('multi-agent-system')}
        </div>
        <div class="ribbon-bottom">
          ${['agent','tool-use','working-memory','rag','mcp','agent-evaluation'].map((id,i,arr)=>`${ribbonButton(id)}${i<arr.length-1?'<span class="ribbon-connector">→</span>':''}`).join('')}
        </div>
      </div>
    </section>

    <section class="page-width section-block">
      <div class="section-heading"><h2>Start with the essentials</h2><button data-nav="concepts">View all ${concepts.length} concepts →</button></div>
      <div class="essentials-grid">${essential}</div>
    </section>

    <section class="page-width section-block bottom-space">
      <div class="section-heading"><h2>Choose your learning path</h2><button data-nav="paths">Compare paths →</button></div>
      <div class="paths-grid">${pathCards}</div>
    </section>
  `, 'home');
}

function ribbonButton(id) {
  const c = conceptById[id];
  const cat = categoryFor(c.category);
  return `<button class="ribbon-node tone-${cat.accent}" data-concept="${id}">${icon(cat.icon)} ${shortTitle(c.title)}</button>`;
}

function shortTitle(title) {
  return title.replace('Retrieval-Augmented Generation (RAG)', 'RAG').replace('Model Context Protocol (MCP)', 'MCP').replace('Multi-Agent System', 'Multi-Agent').replace('Agent Evaluation','Evaluation').replace('Working Memory','Memory').replace('Tool Use','Tools').replace('Agent Loop','Loops');
}

function agentLoopDiagram(size = 'large') {
  return html`
    <div class="loop-diagram ${size}" aria-label="Agent loop: plan, act, observe, reflect">
      <div class="loop-node plan"><span class="loop-icon tone-blue">${icon('book-open')}</span><span><strong>Plan</strong><small>Break down the goal</small></span></div>
      <div class="loop-node act"><span class="loop-icon tone-green">${icon('wrench')}</span><span><strong>Act</strong><small>Use tools or take action</small></span></div>
      <div class="loop-node observe"><span class="loop-icon tone-purple">${icon('eye')}</span><span><strong>Observe</strong><small>Collect results</small></span></div>
      <div class="loop-node reflect"><span class="loop-icon tone-amber">${icon('brain')}</span><span><strong>Reflect</strong><small>Learn and improve</small></span></div>
      <div class="loop-arrow a1">→</div><div class="loop-arrow a2">↓</div><div class="loop-arrow a3">←</div><div class="loop-arrow a4">↑</div>
    </div>`;
}

function conceptsPage() {
  const f = state.conceptFilter;
  const list = concepts.filter(c => {
    const q = normalize(f.q);
    return (f.category === 'all' || c.category === f.category) && (f.level === 'all' || c.level === f.level) && (!q || normalize(`${c.title} ${c.short} ${c.keywords.join(' ')}`).includes(q));
  });
  return shell(html`
    <section class="page-width page-intro">
      <span class="eyebrow">KNOWLEDGE MAP</span>
      <h1>Explore Agentic AI concepts</h1>
      <p>${concepts.length} connected concepts from first principles to production reliability. Search by the words you already know.</p>
      <form class="concept-search" data-concept-search>
        ${icon('magnifying-glass')}
        <input name="q" value="${escapeAttr(f.q)}" placeholder="Search agents, RAG, MCP, loops, safety…">
        <select name="category"><option value="all">All topics</option>${categories.map(c => `<option value="${c.id}" ${f.category===c.id?'selected':''}>${c.title}</option>`).join('')}</select>
        <select name="level"><option value="all">All levels</option>${['beginner','intermediate','advanced'].map(l => `<option value="${l}" ${f.level===l?'selected':''}>${titleCase(l)}</option>`).join('')}</select>
      </form>
    </section>
    <section class="page-width concept-list-wrap">
      <div class="concept-list-head"><strong>${list.length} concepts</strong><span>Click any concept for explanation, examples, diagram and practice.</span></div>
      <div class="concept-list">${list.map(conceptRow).join('')}</div>
    </section>
  `, 'concepts');
}

function conceptRow(c) {
  const cat = categoryFor(c.category);
  return html`<button class="concept-row" data-concept="${c.id}">
    <span class="concept-icon tone-${cat.accent}">${icon(cat.icon)}</span>
    <span class="concept-row-copy"><span><strong>${c.title}</strong><em>${titleCase(c.level)}</em></span><small>${c.short}</small></span>
    <span class="concept-category">${cat.title}</span><b>→</b>
  </button>`;
}

function conceptPage(id) {
  const c = conceptById[id];
  if (!c) return notFound();
  addRecent(id);
  const cat = categoryFor(c.category);
  const related = getRelated(c, 5);
  const complete = state.completed.has(id);
  const bookmark = state.bookmarks.has(id);
  return shell(html`
    <section class="page-width lesson-hero">
      <button class="back-link" data-nav="concepts">← All concepts</button>
      <div class="lesson-heading-grid">
        <div>
          <div class="lesson-meta"><span class="tone-${cat.accent}">${cat.title}</span><span>${titleCase(c.level)}</span><span>~5 min</span></div>
          <h1>${c.title}</h1>
          <p>${c.short}</p>
          <div class="lesson-actions"><button class="primary-button" data-toggle-complete="${id}">${complete ? 'Completed ✓' : 'Mark as learned'}</button><button class="secondary-button" data-toggle-bookmark="${id}">${bookmark ? 'Bookmarked' : 'Bookmark'}</button><button class="secondary-button" data-ask-about="${id}">Ask the guide</button></div>
        </div>
        <div class="lesson-mini-card"><span class="eyebrow">30-SECOND EXPLANATION</span><p>${c.analogy}</p></div>
      </div>
    </section>
    <section class="page-width lesson-layout">
      <article class="lesson-content">
        <section class="lesson-section"><span class="section-number">01</span><div><h2>Why it matters</h2><p>${c.why}</p></div></section>
        <section class="lesson-section"><span class="section-number">02</span><div><h2>How it works</h2><ol>${c.how.map(step => `<li>${step}</li>`).join('')}</ol></div></section>
        <section class="lesson-section visual-section"><span class="section-number">03</span><div><h2>See it</h2>${diagramFor(c)}</div></section>
        <section class="lesson-section"><span class="section-number">04</span><div><h2>Example</h2><div class="example-box"><strong>Example</strong><p>${c.example}</p></div></div></section>
        <section class="lesson-section"><span class="section-number">05</span><div><h2>How it fails</h2><div class="warning-box"><strong>Common mistake</strong><p>${c.mistake}</p></div></div></section>
        <section class="lesson-section"><span class="section-number">06</span><div><h2>Try it</h2><div class="practice-box"><p>${c.practice}</p><button class="primary-button" data-nav="playground">Open Playground →</button></div></div></section>
      </article>
      <aside class="lesson-side">
        <div class="side-block"><span class="eyebrow">WHEN TO USE IT</span><p>${c.when}</p></div>
        <div class="side-block"><span class="eyebrow">RELATED CONCEPTS</span>${related.map(r => `<button data-concept="${r.id}"><strong>${r.title}</strong><span>${r.short}</span></button>`).join('')}</div>
        <div class="side-block"><span class="eyebrow">NEXT STEP</span><button class="next-concept" data-concept="${nextConcept(c).id}"><strong>${nextConcept(c).title}</strong><span>${nextConcept(c).short}</span><b>→</b></button></div>
      </aside>
    </section>
  `, 'concepts');
}

function diagramFor(c) {
  if (['agent-loop','loop-engineering','verification-loop','react-pattern'].includes(c.id)) return agentLoopDiagram('large');
  if (c.id === 'rag' || c.id === 'agentic-rag') return flowDiagram(['Question','Retrieve','Evidence','Generate','Verify']);
  if (c.id === 'mcp') return flowDiagram(['Agent app','MCP client','MCP server','Tool / Resource','Observation']);
  if (c.id === 'multi-agent-system' || c.id === 'supervisor-agent') return supervisorDiagram();
  if (c.id === 'human-in-loop' || c.id === 'approval-gate') return flowDiagram(['Agent proposes','Risk check','Human review','Approve / reject','Continue']);
  if (c.id === 'agent') return flowDiagram(['Goal','Reason','Plan','Act','Observe']);
  return flowDiagram([shortTitle(c.title), 'Input', 'Decision', 'Output']);
}

function flowDiagram(steps) {
  return html`<div class="flow-diagram">${steps.map((s,i) => `<div class="flow-step"><span>${i+1}</span><strong>${s}</strong></div>${i < steps.length-1 ? '<div class="flow-arrow">→</div>' : ''}`).join('')}</div>`;
}

function supervisorDiagram() {
  return html`<div class="supervisor-diagram"><div class="supervisor">Supervisor</div><div class="worker-row"><div>Researcher</div><div>Analyst</div><div>Verifier</div></div><div class="diagram-note">Delegate → work independently → return evidence → supervisor decides next step</div></div>`;
}

function pathsPage() {
  return shell(html`
    <section class="page-width page-intro"><span class="eyebrow">LEARNING PATHS</span><h1>Choose how deep you want to go</h1><p>You can follow a path from start to finish or jump between concepts at any time. Progress stays in your browser.</p></section>
    <section class="page-width path-detail-grid">${learningPaths.map(path => {
      const p = progressForPath(path);
      return html`<article class="path-detail-card path-${path.id}"><div><span class="path-badge">${path.badge}</span><h2>${path.title}</h2><p>${path.description}</p></div><div class="progress-line"><span style="width:${p.pct}%"></span></div><small>${p.complete}/${p.total} concepts learned · ${p.pct}%</small><div class="path-preview">${path.modules.slice(0,5).map((id,i)=>`<span>${i+1}. ${conceptById[id].title}</span>`).join('')}</div><button class="primary-button" data-path="${path.id}">${p.complete ? 'Continue path' : 'Start path'} →</button></article>`;
    }).join('')}</section>
  `, 'paths');
}

function pathPage(id) {
  const path = learningPaths.find(p => p.id === id);
  if (!path) return notFound();
  const p = progressForPath(path);
  return shell(html`
    <section class="page-width page-intro"><button class="back-link" data-nav="paths">← Learning paths</button><span class="eyebrow">${path.badge}</span><h1>${path.title} Path</h1><p>${path.description}</p><div class="wide-progress"><span style="width:${p.pct}%"></span></div><small>${p.complete} of ${p.total} complete</small></section>
    <section class="page-width module-list">${path.modules.map((id,i)=>{ const c=conceptById[id]; return `<button class="module-row ${state.completed.has(id)?'done':''}" data-concept="${id}"><span class="module-index">${state.completed.has(id)?'✓':String(i+1).padStart(2,'0')}</span><span><strong>${c.title}</strong><small>${c.short}</small></span><em>${titleCase(c.level)}</em><b>→</b></button>`; }).join('')}</section>
  `,'paths');
}

function playgroundPage() {
  const tabs = [['loop','Agent Loop'],['tools','Tool Router'],['rag','RAG Lab'],['approval','Human Approval']];
  return shell(html`
    <section class="page-width page-intro"><span class="eyebrow">PLAYGROUND</span><h1>Learn by changing the system</h1><p>No API key. No setup. These simulations teach the decisions underneath real agent architectures.</p></section>
    <section class="page-width playground-shell">
      <div class="play-tabs">${tabs.map(([id,label])=>`<button class="${state.playgroundTab===id?'active':''}" data-play-tab="${id}">${label}</button>`).join('')}</div>
      <div class="play-content">${playgroundContent()}</div>
    </section>
  `,'playground');
}

function playgroundContent() {
  if (state.playgroundTab === 'tools') return toolRouterLab();
  if (state.playgroundTab === 'rag') return ragLab();
  if (state.playgroundTab === 'approval') return approvalLab();
  return loopLab();
}

function loopLab() {
  const s=state.loop;
  const phases=['Plan','Act','Observe','Verify'];
  return html`<div class="lab-grid"><div class="lab-main"><span class="eyebrow">LOOP ENGINEERING</span><h2>Control the agent loop</h2><p>Change the loop budget and when the task should succeed. Then step through the trajectory and watch the stopping rule.</p><div class="lab-controls"><label>Maximum iterations <input type="range" min="1" max="8" value="${s.max}" data-loop-max><strong>${s.max}</strong></label><label>Success on iteration <input type="range" min="1" max="8" value="${s.successAt}" data-loop-success><strong>${s.successAt}</strong></label></div><div class="loop-simulator">${phases.map((p,i)=>`<div class="sim-step ${s.running && s.step===i?'current':''}"><small>0${i+1}</small><strong>${p}</strong><span>${['Choose the next useful move','Execute the selected action','Read the result','Check success criteria'][i]}</span></div>`).join('')}</div><div class="lab-actions"><button class="secondary-button" data-loop-reset>Reset</button><button class="primary-button" data-loop-step>${s.running?'Next step':'Start loop'} →</button></div></div><aside class="lab-log"><span class="eyebrow">TRACE</span><h3>What the agent did</h3><div>${s.log.length?s.log.map(x=>`<p>${x}</p>`).join(''):'<p class="muted">Run the loop to see its trajectory.</p>'}</div></aside></div>`;
}

function toolRouterLab() {
  return html`<div class="lab-grid"><div class="lab-main"><span class="eyebrow">TOOL SELECTION</span><h2>Which tool should the agent choose?</h2><p>Try a request. The local router scores intent words against four tool descriptions, similar to the problem a model solves when tools are available.</p><form class="lab-query" data-tool-form><input name="query" value="What is 347 × 29?" aria-label="Tool routing request"><button class="primary-button">Route request →</button></form><div class="tool-grid"><div><strong>Calculator</strong><span>Arithmetic and numeric operations</span></div><div><strong>Knowledge</strong><span>Stable conceptual explanations</span></div><div><strong>Search</strong><span>Current or external information</span></div><div><strong>Email</strong><span>Draft or send a message</span></div></div><div class="tool-result" data-tool-result><span class="eyebrow">AGENT DECISION</span><strong>Waiting for a request.</strong></div></div><aside class="lab-log"><span class="eyebrow">WHAT TO NOTICE</span><h3>Descriptions are part of the architecture</h3><p>If two tools sound too similar, routing becomes ambiguous. Good tool descriptions state when the tool should and should not be used.</p><button class="text-link" data-concept="tool-selection">Learn Tool Selection →</button></aside></div>`;
}

function ragLab() {
  return html`<div class="lab-grid"><div class="lab-main"><span class="eyebrow">RETRIEVAL</span><h2>See a tiny RAG pipeline</h2><p>Ask a question against three local knowledge chunks. The lab uses transparent word-overlap scoring so you can inspect why a chunk was retrieved.</p><div class="rag-docs"><article data-rag-doc><strong>Chunk A · Agents</strong><p>An AI agent can reason about a goal, choose actions, use tools and observe results.</p></article><article data-rag-doc><strong>Chunk B · RAG</strong><p>Retrieval-Augmented Generation fetches relevant external information and puts it into model context before generation.</p></article><article data-rag-doc><strong>Chunk C · MCP</strong><p>Model Context Protocol provides a standard way for AI applications to discover external tools and resources.</p></article></div><form class="lab-query" data-rag-form><input name="query" value="How does RAG give an agent knowledge?" aria-label="RAG query"><button class="primary-button">Retrieve →</button></form><div class="tool-result" data-rag-result><span class="eyebrow">RETRIEVAL RESULT</span><strong>Run retrieval to rank the chunks.</strong></div></div><aside class="lab-log"><span class="eyebrow">WHAT TO NOTICE</span><h3>Retrieval is not generation</h3><p>First the system finds evidence. Then a model can use that evidence to answer. Agentic RAG adds decisions about whether and how to retrieve again.</p><button class="text-link" data-concept="rag">Learn RAG →</button></aside></div>`;
}

function approvalLab() {
  return html`<div class="lab-grid"><div class="lab-main"><span class="eyebrow">HUMAN-IN-THE-LOOP</span><h2>Put a human at the consequential step</h2><p>The agent has prepared an action. Decide whether the action should execute, be rejected or return for editing.</p><div class="approval-card"><div><span class="risk-pill">High impact</span><h3>Issue a £500 customer refund</h3><p>Reason: duplicate charge confirmed by transaction records. Evidence reviewed by the agent: 3 records.</p></div><div class="approval-status status-${state.approval}">${approvalStatusText()}</div><div class="approval-buttons"><button class="secondary-button" data-approval="rejected">Reject</button><button class="secondary-button" data-approval="editing">Request edit</button><button class="primary-button" data-approval="approved">Approve action</button></div></div></div><aside class="lab-log"><span class="eyebrow">DESIGN QUESTION</span><h3>What deserves approval?</h3><p>Use consequences, reversibility, confidence, policy and user expectations to decide. Approval gates should be targeted, not placed after every harmless step.</p><button class="text-link" data-concept="human-in-loop">Learn HITL →</button></aside></div>`;
}

function approvalStatusText(){ return {waiting:'Waiting for authorised human review.',approved:'Approved. The workflow may continue to the refund tool.',rejected:'Rejected. The action is blocked and logged.',editing:'Returned to the agent with a request to revise.'}[state.approval]; }

function projectsPage() {
  return shell(html`
    <section class="page-width page-intro"><span class="eyebrow">PROJECTS</span><h1>Build the ideas in increasing depth</h1><p>Projects start concept-first. You can later replace each simulation with your preferred SDK or framework.</p></section>
    <section class="page-width projects-grid">${projects.map((p,i)=>`<article class="project-card"><div><span class="project-number">${String(i+1).padStart(2,'0')}</span><span class="level-pill">${p.level}</span></div><h2>${p.title}</h2><p>${p.summary}</p><div class="project-concepts">${p.concepts.map(id=>`<button data-concept="${id}">${shortTitle(conceptById[id].title)}</button>`).join('')}</div><details><summary>Project steps</summary><ol>${p.steps.map(s=>`<li>${s}</li>`).join('')}</ol></details>${p.id==='first-agent'||p.id==='reliable-loop'?'<button class="primary-button" data-nav="playground">Open related playground →</button>':''}</article>`).join('')}</section>
  `,'projects');
}

function quizPage() {
  const qstate=state.quiz;
  if(qstate.finished) return shell(html`<section class="page-width quiz-finish"><span class="eyebrow">QUIZ COMPLETE</span><h1>${qstate.score}/${quizzes.length}</h1><p>${qstate.score>=8?'Strong foundation. Try the Developer path next.':qstate.score>=5?'Good start. Review the concepts you missed, then try again.':'Start with the Beginner path, then return to this quiz.'}</p><div><button class="primary-button" data-quiz-restart>Try again</button><button class="secondary-button" data-nav="paths">Choose a learning path</button></div></section>`,'quiz');
  const q=quizzes[qstate.index];
  return shell(html`<section class="page-width quiz-shell"><div class="quiz-progress"><span style="width:${((qstate.index)/quizzes.length)*100}%"></span></div><span class="eyebrow">QUESTION ${qstate.index+1} OF ${quizzes.length}</span><h1>${q.q}</h1><div class="quiz-options">${q.options.map((o,i)=>`<button class="${qstate.selected===i?(i===q.answer?'correct':'wrong'):''}" data-quiz-answer="${i}" ${qstate.selected!==null?'disabled':''}><span>${String.fromCharCode(65+i)}</span>${o}</button>`).join('')}</div>${qstate.selected!==null?`<div class="quiz-feedback ${qstate.selected===q.answer?'good':'bad'}"><strong>${qstate.selected===q.answer?'Correct.':'Not quite.'}</strong><p>${conceptById[q.concept].short}</p><button data-concept="${q.concept}">Review ${conceptById[q.concept].title} →</button></div><button class="primary-button quiz-next" data-quiz-next>${qstate.index===quizzes.length-1?'See score':'Next question'} →</button>`:''}</section>`,'quiz');
}

function notFound(){ return shell(`<section class="page-width page-intro"><h1>Page not found</h1><p>The guide could not find that page.</p><button class="primary-button" data-nav="home">Return home</button></section>`); }

function getRelated(c, limit=5){
  return concepts.filter(x=>x.id!==c.id).map(x=>({x,score:(x.category===c.category?4:0)+x.keywords.filter(k=>c.keywords.some(ck=>normalize(k).includes(normalize(ck))||normalize(ck).includes(normalize(k)))).length})).sort((a,b)=>b.score-a.score).filter(v=>v.score>0).slice(0,limit).map(v=>v.x);
}
function nextConcept(c){ const same=concepts.filter(x=>x.category===c.category); const i=same.findIndex(x=>x.id===c.id); return same[(i+1)%same.length] || concepts[0]; }
function addRecent(id){ state.recent=[id,...state.recent.filter(x=>x!==id)].slice(0,8); saveState(); }

function scoreConcepts(query){
  const q=normalize(query); const tokens=q.split(' ').filter(Boolean);
  return concepts.map(c=>{ const title=normalize(c.title), short=normalize(c.short), keys=normalize(c.keywords.join(' ')); let score=0; if(title===q)score+=100; if(title.includes(q))score+=60; if(keys.includes(q))score+=35; tokens.forEach(t=>{ if(title.includes(t))score+=12; if(keys.includes(t))score+=7; if(short.includes(t))score+=3; }); return {c,score}; }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,5).map(x=>x.c);
}

function findConceptByPhrase(phrase){
  const n=normalize(phrase);
  const aliases={
    'rag':'rag',
    'retrieval augmented generation':'rag',
    'mcp':'mcp',
    'model context protocol':'mcp',
    'llm':'large-language-model',
    'large language model':'large-language-model',
    'ai agent':'agent',
    'agent':'agent',
    'loop engineering':'loop-engineering',
    'agent loop':'agent-loop',
    'hitl':'human-in-loop',
    'human in the loop':'human-in-loop'
  };
  if(aliases[n]) return conceptById[aliases[n]];
  const exact=concepts.find(c=>normalize(shortTitle(c.title))===n || normalize(c.title)===n || c.keywords.some(k=>normalize(k)===n));
  if(exact) return exact;
  const matches=scoreConcepts(phrase); return matches[0] || null;
}

function askGuide(question){
  const q=question.trim(); if(!q)return;
  const n=normalize(q);
  if(n.includes('quiz')) { state.assistant={title:'Quiz mode',text:'I can test your understanding with short questions and explain any concept you miss.',actions:[{label:'Start the quiz',path:'quiz'}]}; render(); return; }
  if(n.includes('build my first agent') || (n.includes('first')&&n.includes('agent')&&n.includes('build'))) { const c=conceptById.agent; state.assistant={title:'Build your first agent',text:'Start with a tiny goal-directed loop: define a goal, choose from two actions, observe the result and stop on success or after a small budget.',matches:[c,conceptById['agent-loop'],conceptById['stopping-condition']],actions:[{label:'Open the Playground',path:'playground'},{label:'See Projects',path:'projects'}]}; render(); return; }
  if(n.includes('completely new') || n.includes('new to ai') || n.includes("don't know") || n.includes('dont know')) { state.assistant={title:'Start from zero',text:'Begin with the difference between AI, a language model and an agent. Once those three are clear, tools, memory and loops become much easier.',matches:[conceptById['artificial-intelligence'],conceptById['large-language-model'],conceptById.agent],actions:[{label:'Start Beginner Path',path:'path/beginner'}]}; render(); return; }
  const vs=q.split(/\s+(?:vs\.?|versus|compared to|difference between)\s+/i);
  if(vs.length===2){ const a=findConceptByPhrase(vs[0]), b=findConceptByPhrase(vs[1]); if(a&&b){ state.assistant={title:`${shortTitle(a.title)} vs ${shortTitle(b.title)}`,text:`They solve different layers of an agent system. ${a.title} is about ${lowerFirst(a.short)} ${b.title} is about ${lowerFirst(b.short)}`,compare:{a,b}}; render(); return; } }
  if(n.includes('show')&&n.includes('diagram')) { state.assistant={title:'Start with the agent loop',text:'The agent loop is the best first diagram because it connects reasoning, action, observation and iteration.',matches:[conceptById['agent-loop'],conceptById.agent,conceptById['agentic-workflow']]}; render(); return; }
  const matches=scoreConcepts(q);
  if(matches.length){ const c=matches[0]; state.assistant={title:c.title,text:`${c.short} ${c.analogy}`,matches}; }
  else state.assistant={title:'I could not map that yet',text:'Try describing the problem in plain language. You can ask about agents, tools, RAG, MCP, memory, loops, multi-agent systems, safety or evaluation.',actions:[{label:'Browse all concepts',path:'concepts'}]};
  render();
}

function normalize(s){ return String(s).toLowerCase().replace(/[()\/–—,:?]/g,' ').replace(/\s+/g,' ').trim(); }
function lowerFirst(s){ return s ? s[0].toLowerCase()+s.slice(1) : s; }
function titleCase(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
function escapeHtml(s=''){ return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function escapeAttr(s=''){ return escapeHtml(s); }

function render(){
  const r=route();
  if(r.page==='concepts') app.innerHTML=conceptsPage();
  else if(r.page==='concept') app.innerHTML=conceptPage(r.id);
  else if(r.page==='paths') app.innerHTML=pathsPage();
  else if(r.page==='path') app.innerHTML=pathPage(r.id);
  else if(r.page==='playground') app.innerHTML=playgroundPage();
  else if(r.page==='projects') app.innerHTML=projectsPage();
  else if(r.page==='quiz') app.innerHTML=quizPage();
  else app.innerHTML=homePage();
  bindEvents();
}

function bindEvents(){
  document.querySelectorAll('[data-nav]').forEach(el=>el.addEventListener('click',()=>navTo(el.dataset.nav)));
  document.querySelectorAll('[data-concept]').forEach(el=>el.addEventListener('click',()=>{state.assistant=null;navTo(`concept/${el.dataset.concept}`)}));
  document.querySelectorAll('[data-path]').forEach(el=>el.addEventListener('click',()=>navTo(`path/${el.dataset.path}`)));
  document.querySelectorAll('[data-category]').forEach(el=>el.addEventListener('click',()=>{state.conceptFilter.category=el.dataset.category;state.conceptFilter.q='';navTo('concepts')}));
  document.querySelectorAll('[data-quick]').forEach(el=>el.addEventListener('click',()=>askGuide(el.dataset.quick)));
  document.querySelectorAll('[data-guide-form],[data-assistant-form]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();askGuide(new FormData(form).get('question')||'')}));
  document.querySelectorAll('[data-assistant-close]').forEach(el=>el.addEventListener('click',()=>{state.assistant=null;render()}));
  document.querySelectorAll('[data-explain]').forEach(el=>el.addEventListener('click',()=>askGuide(`Explain ${conceptById[el.dataset.explain].title} simply`)));
  document.querySelectorAll('[data-ask-about]').forEach(el=>el.addEventListener('click',()=>askGuide(`Explain ${conceptById[el.dataset.askAbout].title}`)));
  const mobileBtn=document.querySelector('[data-mobile-menu]'), mobileNav=document.querySelector('[data-mobile-nav]'); if(mobileBtn&&mobileNav)mobileBtn.addEventListener('click',()=>{const open=mobileNav.hidden;mobileNav.hidden=!open;mobileBtn.setAttribute('aria-expanded',String(open));});
  const search=document.querySelector('[data-concept-search]'); if(search){ search.addEventListener('input',()=>{const fd=new FormData(search);state.conceptFilter={q:String(fd.get('q')||''),category:String(fd.get('category')||'all'),level:String(fd.get('level')||'all')};render();}); search.addEventListener('change',()=>{const fd=new FormData(search);state.conceptFilter={q:String(fd.get('q')||''),category:String(fd.get('category')||'all'),level:String(fd.get('level')||'all')};render();}); }
  document.querySelectorAll('[data-toggle-complete]').forEach(el=>el.addEventListener('click',()=>{const id=el.dataset.toggleComplete;state.completed.has(id)?state.completed.delete(id):state.completed.add(id);saveState();render()}));
  document.querySelectorAll('[data-toggle-bookmark]').forEach(el=>el.addEventListener('click',()=>{const id=el.dataset.toggleBookmark;state.bookmarks.has(id)?state.bookmarks.delete(id):state.bookmarks.add(id);saveState();render()}));
  document.querySelectorAll('[data-play-tab]').forEach(el=>el.addEventListener('click',()=>{state.playgroundTab=el.dataset.playTab;render()}));
  const max=document.querySelector('[data-loop-max]'); if(max)max.addEventListener('input',e=>{state.loop.max=Number(e.target.value);if(state.loop.successAt>state.loop.max)state.loop.successAt=state.loop.max;render()});
  const success=document.querySelector('[data-loop-success]'); if(success)success.addEventListener('input',e=>{state.loop.successAt=Number(e.target.value);render()});
  const loopStep=document.querySelector('[data-loop-step]'); if(loopStep)loopStep.addEventListener('click',stepLoop);
  const loopReset=document.querySelector('[data-loop-reset]'); if(loopReset)loopReset.addEventListener('click',()=>{state.loop={...state.loop,step:0,iteration:1,running:false,log:[]};render()});
  const toolForm=document.querySelector('[data-tool-form]'); if(toolForm)toolForm.addEventListener('submit',e=>{e.preventDefault();routeTool(String(new FormData(toolForm).get('query')||''))});
  const ragForm=document.querySelector('[data-rag-form]'); if(ragForm)ragForm.addEventListener('submit',e=>{e.preventDefault();runRag(String(new FormData(ragForm).get('query')||''))});
  document.querySelectorAll('[data-approval]').forEach(el=>el.addEventListener('click',()=>{state.approval=el.dataset.approval;render()}));
  document.querySelectorAll('[data-quiz-answer]').forEach(el=>el.addEventListener('click',()=>{const i=Number(el.dataset.quizAnswer);state.quiz.selected=i;if(i===quizzes[state.quiz.index].answer)state.quiz.score++;render()}));
  const next=document.querySelector('[data-quiz-next]'); if(next)next.addEventListener('click',()=>{if(state.quiz.index===quizzes.length-1)state.quiz.finished=true;else{state.quiz.index++;state.quiz.selected=null;}render()});
  const restart=document.querySelector('[data-quiz-restart]'); if(restart)restart.addEventListener('click',()=>{state.quiz={index:0,score:0,selected:null,finished:false};render()});
}

function stepLoop(){
  const s=state.loop;
  if(!s.running){s.running=true;s.step=0;s.iteration=1;s.log=[`Iteration 1 · Plan: choose the next useful move.`];render();return;}
  if(s.step<3){s.step++;s.log.push(`Iteration ${s.iteration} · ${['Plan','Act','Observe','Verify'][s.step]}: ${['','execute selected action.','inspect the result.','compare result with success criteria.'][s.step]}`);render();return;}
  if(s.iteration>=s.successAt){s.log.push(`Success condition met on iteration ${s.iteration}. Loop stopped.`);s.running=false;s.step=0;render();return;}
  if(s.iteration>=s.max){s.log.push(`Loop budget exhausted after ${s.max} iteration${s.max===1?'':'s'}. Escalate or fail safely.`);s.running=false;s.step=0;render();return;}
  s.iteration++;s.step=0;s.log.push(`Iteration ${s.iteration} · Plan: previous result was not sufficient, so revise the next move.`);render();
}

function routeTool(query){
  const n=normalize(query); let tool='Knowledge',why='The request looks conceptual and does not require an external action.';
  if(/[0-9]/.test(query)&&(/[+*×\/\-]/.test(query)||n.includes('calculate')||n.includes('percent'))){tool='Calculator';why='The request contains a numeric operation, so deterministic calculation is preferable to estimation.';}
  else if(['today','latest','current','news','price','weather','find online'].some(k=>n.includes(k))){tool='Search';why='The request depends on current or external information.';}
  else if(['email','message','send','reply'].some(k=>n.includes(k))){tool='Email';why='The user is asking for a communication action.';}
  const el=document.querySelector('[data-tool-result]'); if(el)el.innerHTML=`<span class="eyebrow">AGENT DECISION</span><strong>${tool}</strong><p>${why}</p>`;
}

function runRag(query){
  const docs=[['Chunk A · Agents','An AI agent can reason about a goal, choose actions, use tools and observe results.'],['Chunk B · RAG','Retrieval-Augmented Generation fetches relevant external information and puts it into model context before generation.'],['Chunk C · MCP','Model Context Protocol provides a standard way for AI applications to discover external tools and resources.']];
  const tokens=normalize(query).split(' ').filter(x=>x.length>2);
  const ranked=docs.map(([title,text])=>{ const titleTokens=normalize(title).split(' '); return {title,text,score:tokens.reduce((s,t)=>s+(titleTokens.includes(t)?6:(normalize(title).includes(t)?2:0))+(normalize(text).includes(t)?1:0),0)}; }).sort((a,b)=>b.score-a.score);
  const el=document.querySelector('[data-rag-result]'); if(el)el.innerHTML=`<span class="eyebrow">RETRIEVAL RESULT</span>${ranked.map((d,i)=>`<div class="ranked-chunk"><strong>#${i+1} ${d.title}</strong><span>${d.score} matching signals</span><p>${d.text}</p></div>`).join('')}`;
}

window.addEventListener('hashchange',render);
render();
