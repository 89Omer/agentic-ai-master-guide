import { conceptById } from './data.js';

const STORAGE_KEY = 'aimg-practice-context';

const labForConcept = concept => {
  if (!concept) return 'loop';
  if (concept.category === 'tools') return 'tools';
  if (concept.category === 'memory') return 'rag';
  if (concept.category === 'human-safety') return 'approval';
  if (['tool-design','tool-side-effects','tool-approval','capability-discovery','mcp-prompts','mcp-sampling','mcp-roots','mcp-elicitation','mcp-capability-negotiation','a2a-agent-card','a2a-tasks-messages-artifacts','ag-ui','generative-ui','shared-agent-ui-state','agent-middleware'].includes(concept.id)) return 'tools';
  if (['context-compaction','context-trimming','structured-note-taking','just-in-time-context','progressive-disclosure','sessions','session-vs-context'].includes(concept.id)) return 'rag';
  if (['input-guardrails','output-guardrails','tool-guardrails','agent-containment'].includes(concept.id)) return 'approval';
  return 'loop';
};

function readContext() {
  try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null'); }
  catch { return null; }
}

function writeContext(value) {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value)); } catch { /* no-op */ }
}

function clearContext() {
  try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* no-op */ }
}

function currentConceptId() {
  const match = location.hash.match(/^#\/concept\/([^/?#]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;'
  }[char]));
}

function challengeFor(concept, lab) {
  const title = concept?.title || 'this concept';

  if (lab === 'tools') {
    return {
      title: `Use the tool router to practise ${title}`,
      intro: 'Run at least two different requests and watch how the system chooses a capability. Change the wording and see when routing becomes ambiguous.',
      steps: [
        'Run one request that clearly needs a specific tool.',
        'Run a second request that needs a different tool.',
        `Relate the routing decision back to ${title}.`
      ],
      target: 2,
      metric: 'tool runs'
    };
  }

  if (lab === 'rag') {
    return {
      title: `Test retrieval while learning ${title}`,
      intro: 'Use two different questions against the same knowledge chunks. Compare which evidence moves to the top and why.',
      steps: [
        'Run the supplied retrieval question.',
        'Rewrite it so a different chunk should rank first.',
        `Explain what the result teaches you about ${title}.`
      ],
      target: 2,
      metric: 'retrieval runs'
    };
  }

  if (lab === 'approval') {
    return {
      title: `Make a consequential decision about ${title}`,
      intro: 'Review the proposed £500 refund and choose approve, reject, or request an edit. Think about what should happen before the external action executes.',
      steps: [
        'Read the evidence and risk level.',
        'Choose an approval decision.',
        `Connect that decision to ${title}.`
      ],
      target: 1,
      metric: 'decision'
    };
  }

  return {
    title: `Run an agent loop to practise ${title}`,
    intro: 'Step through the loop and watch how planning, action, observation, verification, budgets and stopping rules shape the trajectory.',
    steps: [
      'Start the loop and move through Plan, Act, Observe and Verify.',
      'Change the iteration budget or success point.',
      `Identify where ${title} affects the run.`
    ],
    target: 4,
    metric: 'loop steps'
  };
}

function progressFor(context) {
  const p = context?.progress || {};
  if (context?.lab === 'tools') return p.toolRuns || 0;
  if (context?.lab === 'rag') return p.ragRuns || 0;
  if (context?.lab === 'approval') return p.decisions || 0;
  return p.loopSteps || 0;
}

function updateProgress(type) {
  const context = readContext();
  if (!context) return;
  context.progress ||= {};
  if (type === 'tools') context.progress.toolRuns = (context.progress.toolRuns || 0) + 1;
  if (type === 'rag') context.progress.ragRuns = (context.progress.ragRuns || 0) + 1;
  if (type === 'approval') context.progress.decisions = 1;
  if (type === 'loop') context.progress.loopSteps = (context.progress.loopSteps || 0) + 1;
  writeContext(context);
}

function enhanceConceptPage() {
  const id = currentConceptId();
  if (!id) return;
  const concept = conceptById[id];
  if (!concept) return;

  const button = document.querySelector('.practice-box [data-nav="playground"]');
  if (!button) return;
  button.textContent = 'Try this concept →';
  button.setAttribute('aria-label', `Open an interactive exercise for ${concept.title}`);

  const box = button.closest('.practice-box');
  if (box && !box.querySelector('.practice-expectation')) {
    const note = document.createElement('small');
    note.className = 'practice-expectation';
    note.textContent = 'Opens a hands-on task matched to this concept.';
    box.insertBefore(note, button);
  }
}

function openConceptPractice(id) {
  const concept = conceptById[id];
  if (!concept) return;
  const lab = labForConcept(concept);
  writeContext({ id, lab, progress: {}, openedAt: Date.now() });
  location.hash = '#/playground';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function ensureCorrectLab(context) {
  const tab = document.querySelector(`[data-play-tab="${context.lab}"]`);
  if (!tab || tab.classList.contains('active')) return false;
  tab.click();
  return true;
}

function injectPracticeCard() {
  if (!location.hash.startsWith('#/playground')) return;
  const context = readContext();
  if (!context) return;
  const concept = conceptById[context.id];
  if (!concept) return;

  if (ensureCorrectLab(context)) {
    queueMicrotask(injectPracticeCard);
    return;
  }

  const playContent = document.querySelector('.play-content');
  if (!playContent) return;

  const existing = playContent.querySelector('.context-practice-card');
  if (existing) existing.remove();

  const challenge = challengeFor(concept, context.lab);
  const progress = Math.min(progressFor(context), challenge.target);
  const complete = progress >= challenge.target;
  const percent = Math.round((progress / challenge.target) * 100);

  const card = document.createElement('section');
  card.className = `context-practice-card ${complete ? 'is-complete' : ''}`;
  card.innerHTML = `
    <div class="context-practice-head">
      <div>
        <span class="eyebrow">PRACTISE THIS CONCEPT</span>
        <h2>${escapeHtml(challenge.title)}</h2>
        <p>${escapeHtml(challenge.intro)}</p>
      </div>
      <button class="context-back" data-context-back>Back to ${escapeHtml(concept.title)} →</button>
    </div>
    <div class="context-practice-body">
      <ol>${challenge.steps.map(step => `<li>${escapeHtml(step)}</li>`).join('')}</ol>
      <div class="context-progress">
        <div class="context-progress-row">
          <strong>${complete ? 'Practice complete ✓' : `${progress}/${challenge.target} ${challenge.metric}`}</strong>
          <span>${complete ? 'You interacted with the system. Go back and connect what happened to the lesson.' : 'Use the activity below. Progress updates automatically.'}</span>
        </div>
        <div class="context-progress-track"><span style="width:${percent}%"></span></div>
      </div>
    </div>`;

  playContent.prepend(card);
  card.querySelector('[data-context-back]')?.addEventListener('click', () => {
    location.hash = `#/concept/${context.id}`;
  });
}

function addStyles() {
  if (document.querySelector('#playground-context-styles')) return;
  const style = document.createElement('style');
  style.id = 'playground-context-styles';
  style.textContent = `
    .practice-expectation{display:block;margin:8px 0 12px;color:var(--muted);font-size:14px}
    .context-practice-card{margin:0 0 22px;padding:24px;border:1px solid var(--line);border-radius:22px;background:linear-gradient(135deg,var(--surface) 0%,var(--blue-soft) 100%);box-shadow:var(--shadow)}
    .context-practice-card.is-complete{background:linear-gradient(135deg,var(--surface) 0%,var(--green-soft) 100%)}
    .context-practice-head{display:flex;gap:24px;align-items:flex-start;justify-content:space-between}
    .context-practice-head h2{margin:0 0 8px;font-size:28px;line-height:1.1}
    .context-practice-head p{margin:0;max-width:820px;color:var(--muted)}
    .context-back{flex:0 0 auto;padding:10px 14px;border:1px solid var(--line-strong);border-radius:999px;background:var(--surface);font-weight:700}
    .context-practice-body{display:grid;grid-template-columns:minmax(0,1fr) minmax(260px,.8fr);gap:28px;margin-top:22px;align-items:start}
    .context-practice-body ol{margin:0;padding-left:22px}
    .context-practice-body li{margin:0 0 9px;padding-left:6px}
    .context-progress{padding:16px;border-radius:16px;background:rgba(255,255,255,.75);border:1px solid var(--line)}
    .context-progress-row{display:flex;flex-direction:column;gap:4px}
    .context-progress-row span{font-size:14px;color:var(--muted)}
    .context-progress-track{height:8px;margin-top:12px;border-radius:999px;background:var(--line);overflow:hidden}
    .context-progress-track span{display:block;height:100%;border-radius:999px;background:var(--blue);transition:width .2s ease}
    .context-practice-card.is-complete .context-progress-track span{background:#2f8f46}
    @media (max-width:760px){
      .context-practice-card{padding:18px}
      .context-practice-head{flex-direction:column}
      .context-practice-head h2{font-size:23px}
      .context-practice-body{grid-template-columns:1fr;gap:16px}
      .context-back{width:100%;text-align:center}
    }
  `;
  document.head.appendChild(style);
}

document.addEventListener('click', event => {
  const practiceButton = event.target.closest('.practice-box [data-nav="playground"]');
  if (practiceButton) {
    const id = currentConceptId();
    if (id) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openConceptPractice(id);
      return;
    }
  }

  const genericPlayground = event.target.closest('[data-nav="playground"]');
  if (genericPlayground && !currentConceptId()) clearContext();

  if (event.target.closest('[data-loop-step]')) updateProgress('loop');
  if (event.target.closest('[data-approval]')) updateProgress('approval');
}, true);

document.addEventListener('submit', event => {
  if (event.target.matches('[data-tool-form]')) updateProgress('tools');
  if (event.target.matches('[data-rag-form]')) updateProgress('rag');
}, true);

const app = document.querySelector('#app');
if (app) {
  const observer = new MutationObserver(() => queueMicrotask(enhance));
  observer.observe(app, { childList: true, subtree: true });
}

function enhance() {
  addStyles();
  enhanceConceptPage();
  injectPracticeCard();
}

window.addEventListener('hashchange', () => queueMicrotask(enhance));
queueMicrotask(enhance);
