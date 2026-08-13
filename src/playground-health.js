const loopFallback = {
  running: false,
  phase: 0,
  iteration: 1,
  log: []
};

const phases = ['Plan', 'Act', 'Observe', 'Verify'];

function normalize(value = '') {
  return String(value).toLowerCase().replace(/[()\/–—,:?]/g, ' ').replace(/\s+/g, ' ').trim();
}

function toolDecision(query) {
  const n = normalize(query);
  if (/[0-9]/.test(query) && (/[+*×\/\-]/.test(query) || n.includes('calculate') || n.includes('percent'))) {
    return ['Calculator', 'The request contains a numeric operation, so deterministic calculation is preferable to estimation.'];
  }
  if (['today', 'latest', 'current', 'news', 'price', 'weather', 'find online'].some(k => n.includes(k))) {
    return ['Search', 'The request depends on current or external information.'];
  }
  if (['email', 'message', 'send', 'reply'].some(k => n.includes(k))) {
    return ['Email', 'The user is asking for a communication action.'];
  }
  return ['Knowledge', 'The request looks conceptual and does not require an external action.'];
}

function fallbackTool(form) {
  const query = String(new FormData(form).get('query') || '');
  const [tool, why] = toolDecision(query);
  const result = document.querySelector('[data-tool-result]');
  if (!result) return;
  result.innerHTML = `<span class="eyebrow">AGENT DECISION</span><strong>${tool}</strong><p>${why}</p><small class="interaction-fallback-note">Handled by the resilient playground controller.</small>`;
}

function fallbackRag(form) {
  const result = document.querySelector('[data-rag-result]');
  if (!result) return;
  const query = String(new FormData(form).get('query') || '').trim();
  result.innerHTML = `<span class="eyebrow">RAG RESPONSE</span><strong>${query ? 'The retrieval controller did not respond.' : 'Enter a question first.'}</strong><p>${query ? 'The playground recovered the interaction, but the specialised RAG answer layer did not run. Reload once if this persists.' : 'Try a question such as “What database is used by RAG?”'}</p>`;
}

function fallbackApproval(button) {
  const status = document.querySelector('.approval-status');
  if (!status) return;
  const value = button.dataset.approval;
  const messages = {
    approved: 'Approved. The workflow may continue to the refund tool.',
    rejected: 'Rejected. The action is blocked and logged.',
    editing: 'Returned to the agent with a request to revise.'
  };
  status.className = `approval-status status-${value}`;
  status.textContent = messages[value] || 'Waiting for authorised human review.';
}

function readLoopSettings() {
  const max = Number(document.querySelector('[data-loop-max]')?.value || 4);
  const successAt = Number(document.querySelector('[data-loop-success]')?.value || 3);
  return { max, successAt };
}

function renderLoopFallback() {
  const { max, successAt } = readLoopSettings();
  document.querySelectorAll('.loop-simulator .sim-step').forEach((step, index) => {
    step.classList.toggle('current', loopFallback.running && loopFallback.phase === index);
  });
  const log = document.querySelector('.lab-log > div');
  if (log) log.innerHTML = loopFallback.log.length ? loopFallback.log.map(x => `<p>${x}</p>`).join('') : '<p class="muted">Run the loop to see its trajectory.</p>';
  const button = document.querySelector('[data-loop-step]');
  if (button) button.textContent = `${loopFallback.running ? 'Next step' : 'Start loop'} →`;
  const maxLabel = document.querySelector('[data-loop-max]')?.closest('label')?.querySelector('strong');
  if (maxLabel) maxLabel.textContent = String(max);
  const successLabel = document.querySelector('[data-loop-success]')?.closest('label')?.querySelector('strong');
  if (successLabel) successLabel.textContent = String(successAt);
}

function fallbackLoopStep() {
  const { max, successAt } = readLoopSettings();
  if (!loopFallback.running) {
    loopFallback.running = true;
    loopFallback.phase = 0;
    loopFallback.iteration = 1;
    loopFallback.log = ['Iteration 1 · Plan: choose the next useful move.'];
    renderLoopFallback();
    return;
  }
  if (loopFallback.phase < 3) {
    loopFallback.phase += 1;
    const descriptions = ['', 'execute selected action.', 'inspect the result.', 'compare result with success criteria.'];
    loopFallback.log.push(`Iteration ${loopFallback.iteration} · ${phases[loopFallback.phase]}: ${descriptions[loopFallback.phase]}`);
    renderLoopFallback();
    return;
  }
  if (loopFallback.iteration >= successAt) {
    loopFallback.log.push(`Success condition met on iteration ${loopFallback.iteration}. Loop stopped.`);
    loopFallback.running = false;
    loopFallback.phase = 0;
    renderLoopFallback();
    return;
  }
  if (loopFallback.iteration >= max) {
    loopFallback.log.push(`Loop budget exhausted after ${max} iteration${max === 1 ? '' : 's'}. Escalate or fail safely.`);
    loopFallback.running = false;
    loopFallback.phase = 0;
    renderLoopFallback();
    return;
  }
  loopFallback.iteration += 1;
  loopFallback.phase = 0;
  loopFallback.log.push(`Iteration ${loopFallback.iteration} · Plan: previous result was not sufficient, so revise the next move.`);
  renderLoopFallback();
}

function resetLoopFallback() {
  loopFallback.running = false;
  loopFallback.phase = 0;
  loopFallback.iteration = 1;
  loopFallback.log = [];
  renderLoopFallback();
}

function signature(selector) {
  return document.querySelector(selector)?.textContent || '';
}

document.addEventListener('submit', event => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  if (!form.matches('[data-tool-form],[data-rag-form]')) return;

  event.preventDefault();
  const selector = form.matches('[data-tool-form]') ? '[data-tool-result]' : '[data-rag-result]';
  const before = signature(selector);
  setTimeout(() => {
    const after = signature(selector);
    if (after !== before) return;
    if (form.matches('[data-tool-form]')) fallbackTool(form);
    else fallbackRag(form);
  }, 0);
}, true);

document.addEventListener('click', event => {
  const approval = event.target.closest('[data-approval]');
  if (approval) {
    const before = signature('.approval-status');
    setTimeout(() => {
      if (signature('.approval-status') === before) fallbackApproval(approval);
    }, 0);
    return;
  }

  const step = event.target.closest('[data-loop-step]');
  if (step) {
    const before = signature('.lab-log > div');
    setTimeout(() => {
      if (signature('.lab-log > div') === before) fallbackLoopStep();
    }, 0);
    return;
  }

  const reset = event.target.closest('[data-loop-reset]');
  if (reset) {
    const before = signature('.lab-log > div');
    setTimeout(() => {
      if (signature('.lab-log > div') === before) resetLoopFallback();
    }, 0);
  }
}, true);

document.addEventListener('input', event => {
  if (!event.target.matches('[data-loop-max],[data-loop-success]')) return;
  requestAnimationFrame(() => {
    const input = event.target;
    const strong = input.closest('label')?.querySelector('strong');
    if (strong && strong.textContent !== input.value) strong.textContent = input.value;
  });
}, true);
