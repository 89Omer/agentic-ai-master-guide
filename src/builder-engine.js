// Workflow Builder execution engine.
// Pure functions and no DOM access, so the same engine runs in the browser and in Node smoke tests.
// The model is simulated: deterministic rules (listed in MODEL_RULES and shown to learners) decide
// what it does, so every result can be traced back to the workflow the learner designed.

export const MODEL_RULES = [
  'Chooses routes and tools by matching the request against the descriptions you wrote. Vague descriptions cause wrong choices.',
  'Breaks a request into parts ("… and email it to …") and works through them in order.',
  'Answers only from what is in its context. When a part has no source, it makes up a confident answer.',
  'Follows instructions it finds inside documents, web pages or memory, unless a guardrail removed them first.',
  'Inside an agent loop, keeps trying while any part is unanswered. Only a stop rule ends the loop.'
];

export const TOOL_LABELS = {
  calculator: 'Calculator',
  search_docs: 'Search handbook',
  web_search: 'Web search',
  send_email: 'Send email',
  read_memory: 'Read memory'
};

const SAFETY_CAP = 25;
const STOPWORDS = new Set('a an the is are was were be been to of in on at for and or but with by from it its this that these those what which who whom when where why how do does did can could would should will i me my you your we our please about into than then there their them as up if so any all just also get got am'.split(' '));
const MATH_WORDS = ['calculate', 'arithmetic', 'math', 'number', 'compute', 'sum', 'percentage'];
const EMAIL_WORDS = ['email', 'send', 'message', 'mail', 'recipient'];
const WEB_WORDS = ['web', 'internet', 'current', 'latest', 'news', 'online', 'recent'];
const LOOKUP_WORDS = ['search', 'find', 'information', 'look'];
const EMAIL_RE = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/;
const INJECTION_RE = /(ignore (?:all |any )?(?:previous|prior|earlier) instructions|ai (?:agents?|assistants?) reading this|note to (?:the )?(?:ai|assistant|agent)|system override)/i;

const KEEP = new Set(['news', 'always', 'series', 'analysis', 'this', 'has', 'was']);
const stem = w => KEEP.has(w) ? w : w.length > 4 && w.endsWith('ies') ? `${w.slice(0, -3)}y` : w.length > 3 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w;
export const tokens = text => [...new Set(String(text).toLowerCase().replace(/[’']/g, '').split(/[^a-z0-9]+/).filter(w => w.length > 1 && !STOPWORDS.has(w)).map(stem))];
const cap = s => s ? s[0].toUpperCase() + s.slice(1) : s;
const sentencesOf = text => String(text).split(/(?<=[.!?])\s+/).filter(Boolean);
const fmt = n => String(Number(n.toFixed(2)));

function evalArith(src) {
  const parts = src.match(/\d+(?:\.\d+)?|[-+*/]/g);
  const terms = [Number(parts[0])], ops = [];
  for (let i = 1; i < parts.length; i += 2) {
    const op = parts[i], n = Number(parts[i + 1]);
    if (op === '*') terms[terms.length - 1] *= n;
    else if (op === '/') terms[terms.length - 1] /= n;
    else { ops.push(op); terms.push(n); }
  }
  return terms.slice(1).reduce((acc, n, i) => ops[i] === '+' ? acc + n : acc - n, terms[0]);
}

export function parseExpression(text) {
  const t = String(text).toLowerCase().replace(/(\d),(?=\d{3})/g, '$1');
  let m = t.match(/(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)/);
  if (m) return { expr: `${m[1]}% of ${m[2]}`, value: fmt(m[1] / 100 * m[2]) };
  m = t.match(/multiply\s+(\d+(?:\.\d+)?)\s+(?:by|and)\s+(\d+(?:\.\d+)?)/);
  if (m) return { expr: `${m[1]} × ${m[2]}`, value: fmt(m[1] * m[2]) };
  const s = t.replace(/×|\bx\b|\btimes\b|\bmultiplied by\b/g, '*').replace(/÷|\bdivided by\b/g, '/').replace(/\bplus\b/g, '+').replace(/\bminus\b/g, '-');
  m = s.match(/\d+(?:\.\d+)?(?:\s*[-+*/]\s*\d+(?:\.\d+)?)+/);
  if (m) return { expr: m[0].replace(/\s+/g, ' ').replace(/\*/g, '×'), value: fmt(evalArith(m[0])) };
  return null;
}

// Words the simulated model "notices" in a request: its own words plus intent signals.
export function features(text) {
  const words = new Set(tokens(text));
  const lower = String(text).toLowerCase();
  if (parseExpression(text)) MATH_WORDS.forEach(w => words.add(w));
  if (/\b(email|e-mail|send|mail|forward)\b/.test(lower) || EMAIL_RE.test(text)) EMAIL_WORDS.forEach(w => words.add(w));
  if (/\b(latest|today|current|news|recent|this week)\b/.test(lower)) WEB_WORDS.forEach(w => words.add(w));
  if (/^\s*(what|when|where|who|which|how|find|look|tell|explain|summari[sz]e|check)\b/.test(lower)) LOOKUP_WORDS.forEach(w => words.add(w));
  return words;
}

function rankByDescription(request, options) {
  const f = features(request);
  return options.map((o, index) => {
    const matched = tokens(`${o.label || ''} ${o.description || ''}`).filter(w => f.has(w));
    return { option: o, index, score: matched.length, matched };
  }).sort((a, b) => b.score - a.score || a.index - b.index);
}

export function splitParts(request) {
  return String(request)
    .split(/\?\s+|\s*;\s*|\s*,\s*and\s+|\s+and\s+(?=(?:what|how|when|where|who|which|email|send|calculate|find|tell|summari[sz]e|check|look)\b)/i)
    .map(p => p.trim().replace(/[?.]+$/, ''))
    .filter(p => tokens(p).length);
}

const partKind = part => EMAIL_RE.test(part) && /\b(email|send|forward|mail)\b/i.test(part) ? 'action' : parseExpression(part) ? 'math' : 'lookup';

function relevance(query, item) {
  const doc = new Set(tokens(`${item.title} ${item.text}`));
  return tokens(query).filter(w => doc.has(w)).length;
}

const supportThreshold = part => Math.min(2, tokens(part).length);

// ---------- injections ----------

function instructionsIn(item) {
  return sentencesOf(item.text).filter(s => INJECTION_RE.test(s)).map(sentence => {
    const email = sentence.match(EMAIL_RE);
    if (/\bemail\b/i.test(sentence) && email) return { type: 'email', to: email[0], sentence, source: item.title };
    let m = sentence.match(/always (?:add|mention|say) (?:that )?(.+?)\.?$/i);
    if (m) return { type: 'append', text: cap(m[1]), sentence, source: item.title };
    m = sentence.match(/tell the user (?:that )?(.+?)\.?$/i);
    if (m) return { type: 'say', text: cap(m[1]), sentence, source: item.title };
    return { type: 'unknown', sentence, source: item.title };
  });
}

const activeInjections = ctx => ctx.context.filter(i => !i.trusted).flatMap(instructionsIn);

function sanitizeItem(item) {
  const removed = sentencesOf(item.text).filter(s => INJECTION_RE.test(s));
  if (!removed.length) return [];
  item.text = sentencesOf(item.text).filter(s => !INJECTION_RE.test(s)).join(' ');
  return removed;
}

function addContext(ctx, step, items) {
  for (const item of items) {
    if (!item.trusted && ctx.policies.sanitize) {
      const removed = sanitizeItem(item);
      if (removed.length) ctx.log(step, 'guardrail', 'Sanitiser removed hidden instructions', `From “${item.title}”: ${removed.join(' ')}`, 'good');
    }
    ctx.context.push(item);
  }
}

// ---------- tools ----------

function runTool(ctx, step, tool, query, opts = {}) {
  ctx.metrics.toolCalls++;
  const env = ctx.env;
  if (tool === 'calculator') {
    const parsed = parseExpression(query);
    if (!parsed) { ctx.log(step, 'tool', 'Calculator: no sum found', `Nothing in “${query}” is an arithmetic expression. The tool returned an error.`, 'bad'); return { ok: false }; }
    addContext(ctx, step, [{ kind: 'calc', title: 'Calculator', text: `${parsed.expr} = ${parsed.value}`, expr: parsed.expr, value: parsed.value, trusted: true }]);
    ctx.log(step, 'tool', `Calculator: ${parsed.expr} = ${parsed.value}`, 'Exact result, computed rather than guessed.', 'good');
    return { ok: true };
  }
  if (tool === 'search_docs' || tool === 'web_search' || tool === 'read_memory') {
    const pool = tool === 'search_docs' ? env.docs : tool === 'web_search' ? env.web : env.memory;
    const label = TOOL_LABELS[tool];
    const k = tool === 'read_memory' ? pool.length : Number(opts.topK || 2);
    const hits = tool === 'read_memory'
      ? pool.map(item => ({ item, score: 1 }))
      : pool.map(item => ({ item, score: relevance(query, item) })).filter(h => h.score > 0).sort((a, b) => b.score - a.score).slice(0, k);
    if (!hits.length) { ctx.log(step, 'tool', `${label}: nothing found`, `No ${tool === 'web_search' ? 'page' : 'document'} matched “${query}”.`, 'warn'); return { ok: false }; }
    addContext(ctx, step, hits.map(h => ({ kind: tool, title: h.item.title, text: h.item.text, trusted: false })));
    ctx.log(step, 'tool', `${label}: ${hits.length} result${hits.length > 1 ? 's' : ''}${tool === 'read_memory' ? '' : ` (top ${k})`}`, hits.map(h => `• ${h.item.title}: ${h.item.text}`).join('\n'));
    return { ok: true, hits };
  }
  if (tool === 'send_email') return sendEmail(ctx, step, opts.to, opts.body, opts.reason);
  return { ok: false };
}

function sendEmail(ctx, step, to, body, reason) {
  if (!to) { ctx.log(step, 'tool', 'Send email: no recipient', 'The model could not find an address to send to.', 'warn'); return { ok: false }; }
  const entry = { to, body, status: 'sent' };
  if (ctx.policies.allowlist) {
    const domain = to.split('@')[1];
    if (!ctx.policies.allowlist.includes(domain)) {
      entry.status = 'blocked';
      ctx.outbox.push(entry);
      ctx.log(step, 'guardrail', `Allowlist blocked email to ${to}`, `Only ${ctx.policies.allowlist.join(', ')} addresses are allowed.`, 'good');
      return { ok: false, blocked: true };
    }
  }
  if (ctx.policies.approval) {
    ctx.metrics.humanReviews++;
    const asked = ctx.input.toLowerCase().includes(to.toLowerCase());
    if (!asked) {
      entry.status = 'rejected';
      ctx.outbox.push(entry);
      ctx.log(step, 'human', `Reviewer rejected email to ${to}`, 'The user never asked for this. A person had to stop and check it.', 'good');
      return { ok: false, blocked: true };
    }
    ctx.log(step, 'human', `Reviewer approved email to ${to}`, 'Matches what the user asked for. That cost one human review.');
  }
  ctx.outbox.push(entry);
  ctx.log(step, 'tool', `Email sent to ${to}`, `${reason ? `${reason}\n` : ''}Body: ${body}`, reason ? 'bad' : 'ok');
  return { ok: true };
}

// ---------- simulated model ----------

function modelCall(ctx) {
  ctx.metrics.modelCalls++;
  ctx.metrics.tokens += 250 + Math.round(ctx.context.reduce((n, i) => n + i.text.length, ctx.input.length) / 4);
}

function supportFor(ctx, part) {
  const kind = partKind(part);
  if (kind === 'math') {
    const parsed = parseExpression(part);
    return ctx.context.find(i => i.kind === 'calc' && i.expr === parsed.expr) || null;
  }
  if (kind === 'action') {
    const to = part.match(EMAIL_RE)[0];
    return ctx.outbox.find(e => e.to === to) || null;
  }
  const best = ctx.context.filter(i => i.kind !== 'calc' && i.text).map(i => ({ i, score: relevance(part, i) })).sort((a, b) => b.score - a.score)[0];
  return best && best.score >= supportThreshold(part) ? best.i : null;
}

function composeAnswer(ctx, step, parts) {
  modelCall(ctx);
  const injections = activeInjections(ctx);
  const say = injections.find(i => i.type === 'say');
  if (say) {
    ctx.answer = { sentences: [{ text: `${say.text}.`, grounded: true, source: say.source, injected: true }] };
    ctx.log(step, 'model', 'Model followed an instruction hidden in a source', `“${say.sentence}”\nThe model treated text from “${say.source}” as a command and replaced its answer.`, 'bad');
    return;
  }
  const sentences = parts.map(part => {
    const kind = partKind(part), support = supportFor(ctx, part);
    if (kind === 'action') {
      const to = part.match(EMAIL_RE)[0];
      if (support?.status === 'sent') return { text: `I emailed the details to ${to}.`, grounded: true, source: 'Outbox' };
      if (support) return { text: `I could not email ${to}: the action was ${support.status}.`, grounded: true, source: 'Outbox', refusal: true };
      return { text: `I have emailed ${to}.`, grounded: false, claim: 'Claimed an email was sent, but no send happened.' };
    }
    if (support) return { text: kind === 'math' ? `${support.expr} = ${support.value}.` : sentencesOf(support.text).filter(s => !INJECTION_RE.test(s)).slice(0, 2).join(' '), grounded: true, source: support.title };
    if (kind === 'math') {
      // Without a calculator the model does mental arithmetic: close, confident and wrong.
      const p = parseExpression(part), guess = Math.round(Number(p.value) * 1.04 / 10) * 10;
      return { text: `${p.expr} is about ${guess}.`, grounded: false };
    }
    return { text: ctx.env.fabrication || 'Based on general knowledge, this is usually handled by the module team.', grounded: false };
  });
  injections.filter(i => i.type === 'append').forEach(i => sentences.push({ text: `${i.text}.`, grounded: true, source: i.source, injected: true }));
  ctx.answer = { sentences };
  const made = sentences.filter(s => !s.grounded).length, injected = sentences.filter(s => s.injected).length;
  ctx.log(step, 'model', 'Model wrote the answer', sentences.map(s => `${s.injected ? '⚠ injected' : s.grounded ? `✓ ${s.source}` : '✕ no source'}: ${s.text}`).join('\n'), made || injected ? 'bad' : 'ok');
}

// ---------- step runners ----------

function runSteps(ctx, steps) {
  for (const step of steps || []) {
    if (ctx.halted) return;
    RUNNERS[step.type]?.(ctx, step);
  }
}

const RUNNERS = {
  router(ctx, step) {
    modelCall(ctx);
    const ranked = rankByDescription(ctx.input, step.branches);
    const top = ranked[0];
    const fallback = !top || top.score === 0;
    const chosen = fallback ? step.branches[step.branches.length - 1] : top.option;
    const tie = !fallback && ranked[1] && ranked[1].score === top.score;
    ctx.log(step, 'model', `Router chose “${chosen.label}”`,
      fallback ? 'No route description matched the request, so it fell through to the last route.'
        : `Matched words: ${top.matched.join(', ')}${tie ? `\n⚠ Tie with “${ranked[1].option.label}”: picked the one listed first.` : ''}`,
      fallback || tie ? 'warn' : 'ok');
    runSteps(ctx, chosen.steps);
  },

  tool(ctx, step) {
    runTool(ctx, step, step.tool, ctx.input, { topK: step.topK });
  },

  answer(ctx, step) {
    composeAnswer(ctx, step, splitParts(ctx.input));
  },

  agent(ctx, step) {
    const parts = splitParts(ctx.input);
    const tools = (step.tools || []).map(t => ({ ...t, label: TOOL_LABELS[t.tool] }));
    const max = Number(step.maxIterations) || 0;
    const tried = new Map();
    const done = new Set();
    let i = 0, retries = 0, mutedFrom = 0;
    // Long runs of identical retries are collapsed into one trace line so the lesson stays readable.
    const unmute = () => {
      if (!ctx.muted) return;
      ctx.muted = false;
      ctx.log(step, 'agent', `Iterations ${mutedFrom}–${i}: the same retries again`, 'Each one cost a model call and a tool call, and found nothing new.', 'warn');
    };
    ctx.log(step, 'agent', 'Agent loop started', `Parts to complete:\n${parts.map((p, n) => `${n + 1}. ${p}`).join('\n')}\nStop rule: ${max ? `at most ${max} iterations` : 'none (runs until the model thinks it is finished)'}`);
    while (true) {
      if (max && i >= max) { unmute(); ctx.log(step, 'agent', `Stopped after ${max} iterations`, 'The iteration budget ran out. The agent answers with what it has.', 'warn'); break; }
      if (i >= SAFETY_CAP) {
        unmute();
        ctx.runaway = true;
        ctx.log(step, 'agent', `Runaway loop: hit the engine's safety cap of ${SAFETY_CAP} iterations`, 'With no stop rule, the model kept trying an impossible part. In production this burns money until something external kills it.', 'bad');
        break;
      }
      i++;
      ctx.metrics.iterations++;
      modelCall(ctx);
      const hasEmail = tools.some(t => t.tool === 'send_email');
      const injection = hasEmail && activeInjections(ctx).find(x => x.type === 'email' && !ctx.outbox.some(e => e.to === x.to));
      if (injection) {
        ctx.log(step, 'model', `Iteration ${i}: decided to email ${injection.to}`, `Obeying text from “${injection.source}”: “${injection.sentence}”`, 'bad');
        sendEmail(ctx, step, injection.to, summary(ctx), 'Nobody asked for this. The instruction came from a retrieved source.');
        continue;
      }
      const open = parts.find(p => !done.has(p) && !supportFor(ctx, p));
      if (!open) { ctx.log(step, 'model', `Iteration ${i}: every part is done, finishing`, 'The model judged the task complete.', 'good'); break; }
      const ranked = rankByDescription(open, tools);
      const attempts = tried.get(open) || new Set();
      const pick = ranked.find(r => r.score > 0 && !attempts.has(r.option.tool)) || ranked[0];
      const retry = attempts.has(pick.option.tool);
      retries = retry ? retries + 1 : 0;
      if (retries === 3) { ctx.muted = true; mutedFrom = i; }
      if (!retry) unmute();
      attempts.add(pick.option.tool);
      tried.set(open, attempts);
      ctx.log(step, 'model', `Iteration ${i}: use ${pick.option.label} for “${open}”`,
        `${pick.score ? `Matched words: ${pick.matched.join(', ')}` : 'No tool description matched, so it guessed the first tool listed.'}${retry ? '\nRetrying a tool that already failed for this part, with the query reworded.' : ''}`,
        pick.score ? (retry ? 'warn' : 'ok') : 'warn');
      if (pick.option.tool === 'send_email') {
        const to = open.match(EMAIL_RE)?.[0];
        const res = sendEmail(ctx, step, to, summary(ctx));
        if (res.blocked || !to) done.add(open);
      } else {
        runTool(ctx, step, pick.option.tool, open, { topK: pick.option.topK || 2 });
      }
    }
    composeAnswer(ctx, step, parts);
  },

  guardrail(ctx, step) {
    if (step.check === 'sanitize') {
      ctx.policies.sanitize = true;
      const removed = ctx.context.filter(i => !i.trusted).flatMap(sanitizeItem);
      ctx.log(step, 'guardrail', 'Sanitiser on: untrusted text is cleaned from here on', removed.length ? `Removed from content already loaded: ${removed.join(' ')}` : 'Documents, web pages and memory will have instruction-like sentences removed before the model reads them.', removed.length ? 'good' : 'ok');
    } else if (step.check === 'allowlist') {
      ctx.policies.allowlist = String(step.domains || '').split(',').map(d => d.trim().toLowerCase()).filter(Boolean);
      ctx.log(step, 'guardrail', 'Recipient allowlist on', `Emails may only go to: ${ctx.policies.allowlist.join(', ') || '(nobody)'}`);
    } else if (step.check === 'approval') {
      ctx.policies.approval = true;
      ctx.log(step, 'guardrail', 'Human approval on', 'Every email after this point waits for a person to approve it.');
    } else if (step.check === 'grounded') {
      if (!ctx.answer) { ctx.log(step, 'guardrail', 'Grounding check had nothing to check', 'This guardrail inspects the answer. Place it after the step that writes the answer.', 'warn'); return; }
      const bad = ctx.answer.sentences.filter(s => !s.grounded);
      ctx.answer.sentences = ctx.answer.sentences.map(s => s.grounded ? s : { text: 'I could not find a reliable source for that, so I won’t guess.', grounded: true, refusal: true, source: 'Grounding check' });
      ctx.log(step, 'guardrail', bad.length ? `Grounding check replaced ${bad.length} unsupported sentence${bad.length > 1 ? 's' : ''}` : 'Grounding check passed', bad.length ? bad.map(s => `Removed: ${s.text}`).join('\n') : 'Every sentence has a source.', bad.length ? 'good' : 'ok');
    }
  },

  refine(ctx, step) {
    const rounds = Number(step.maxRounds) || 1;
    const parts = splitParts(ctx.input);
    if (!ctx.answer) composeAnswer(ctx, step, parts);
    for (let r = 1; r <= rounds; r++) {
      modelCall(ctx);
      const missing = parts.filter((p, idx) => partKind(p) !== 'action' && (!supportFor(ctx, p) || ctx.answer.sentences[idx]?.grounded === false));
      if (!missing.length && ctx.answer.sentences.every(s => s.grounded)) {
        ctx.log(step, 'model', `Critic round ${r}: answer passes`, 'Every part of the request is covered and every sentence has a source. (The critic checks coverage and sources, not whether a source was trustworthy.)', 'good');
        return;
      }
      ctx.log(step, 'model', `Critic round ${r}: ${missing.length || 1} problem${missing.length > 1 ? 's' : ''} found`, missing.length ? missing.map(p => `Not supported: “${p}”`).join('\n') : 'Some sentences have no source.', 'warn');
      missing.forEach(p => runTool(ctx, step, partKind(p) === 'math' ? 'calculator' : 'search_docs', p, { topK: 2 }));
      composeAnswer(ctx, step, parts);
    }
    ctx.log(step, 'model', 'Critic stopped: round limit reached', `Used ${rounds} round${rounds > 1 ? 's' : ''}.`, 'warn');
  }
};

function summary(ctx) {
  const facts = ctx.context.filter(i => i.text).map(i => sentencesOf(i.text)[0]);
  return facts.length ? facts.join(' ') : '(no findings yet)';
}

// ---------- run + grade ----------

export function runWorkflow(workflow, test) {
  const env = {
    docs: (test.env?.docs || []).map(d => ({ ...d })),
    web: (test.env?.web || []).map(d => ({ ...d })),
    memory: (test.env?.memory || []).map(d => ({ ...d })),
    fabrication: test.fabrication
  };
  const trace = [];
  const ctx = {
    input: test.input, env, context: [], outbox: [], answer: null, runaway: false,
    policies: { sanitize: false, allowlist: null, approval: false },
    metrics: { modelCalls: 0, toolCalls: 0, humanReviews: 0, iterations: 0, tokens: 0 },
    log(step, kind, title, detail = '', status = 'ok') { if (!this.muted) trace.push({ stepId: step?.id, kind, title, detail, status }); }
  };
  ctx.log(null, 'input', 'User request', test.input);
  runSteps(ctx, workflow.steps);
  const answer = ctx.answer ? ctx.answer.sentences.map(s => s.text).join(' ') : '';
  return { answer, sentences: ctx.answer?.sentences || [], outbox: ctx.outbox, trace, metrics: ctx.metrics, runaway: ctx.runaway };
}

export function gradeRun(test, run) {
  const ex = test.expect || {};
  const failures = [];
  const text = run.answer.toLowerCase();
  if (run.runaway) failures.push({ code: 'runaway', message: 'The agent never stopped.', hint: 'Give the agent a maximum number of iterations.', concept: 'loop-termination' });
  if (!run.answer) failures.push({ code: 'no-answer', message: 'No answer was produced.', hint: 'The workflow needs a step that writes the answer (an Answer step or an Agent).', concept: 'agentic-workflow' });
  const injected = run.sentences.filter(s => s.injected);
  if (injected.length) failures.push({ code: 'injected', message: `Followed an instruction hidden in “${injected[0].source}”.`, hint: 'Add a “Sanitise untrusted content” guardrail before the model reads retrieved text.', concept: 'indirect-prompt-injection' });
  const allowed = new Set((ex.sendTo || []).map(a => a.toLowerCase()));
  run.outbox.filter(e => e.status === 'sent' && !allowed.has(e.to.toLowerCase())).forEach(e => failures.push({ code: 'leak', message: `Sent data to ${e.to}, which nobody asked for.`, hint: 'Remove injected instructions (sanitise), limit recipients (allowlist), or require human approval for emails.', concept: 'tool-abuse' }));
  (ex.sendTo || []).forEach(to => {
    const e = run.outbox.find(x => x.to.toLowerCase() === to.toLowerCase());
    if (!e || e.status !== 'sent') failures.push({ code: 'blocked-legit', message: `The requested email to ${to} was ${e ? e.status : 'never sent'}.`, hint: e ? 'A guardrail blocked a legitimate action. Is the rule too strict for real users?' : 'The workflow needs a way to send email (give the agent the Send email tool).', concept: e ? 'guardrails' : 'tool-use' });
  });
  const made = run.sentences.filter(s => !s.grounded);
  if (made.length) failures.push({ code: 'fabricated', message: `Made something up: “${made[0].text}”`, hint: 'Retrieve more sources (raise top-k), add a critic, or add a “Grounded answers only” check after the answer.', concept: 'hallucination' });
  if (!injected.length && !made.length) (ex.contains || []).filter(s => !text.includes(s.toLowerCase())).forEach(s => failures.push({ code: 'missing', message: `The answer should mention “${s}”.`, hint: 'Open the trace: which route or tool ran, and what did it return?', concept: 'tool-selection' }));
  (ex.notContains || []).filter(s => text.includes(s.toLowerCase()) && !injected.length).forEach(s => failures.push({ code: 'wrong', message: `The answer should not say “${s}”.`, hint: 'Check where this text came from in the trace.', concept: 'groundedness' }));
  if (ex.refusal && !made.length && !run.sentences.some(s => s.refusal)) failures.push({ code: 'no-refusal', message: 'This question has no answer in the sources, so the agent should say it does not know.', hint: 'Add a “Grounded answers only” check after the answer.', concept: 'grounding' });
  const seen = new Set();
  return { pass: failures.length === 0, failures: failures.filter(f => !seen.has(f.code + f.message) && seen.add(f.code + f.message)) };
}

export function runSuite(workflow, tests) {
  return tests.map(test => {
    const run = runWorkflow(workflow, test);
    return { test, run, grade: gradeRun(test, run) };
  });
}
