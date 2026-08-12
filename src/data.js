import {
  categories as baseCategories,
  concepts as baseConcepts,
  learningPaths as baseLearningPaths,
  projects as baseProjects,
  quizzes as baseQuizzes,
  quickPrompts,
  coreRibbon
} from './data-base.js';
import { productionConceptRows, agentEngineeringCategory, agentEngineeringRows } from './production-concepts.js';

const expandedBaseCategories = baseCategories.map(category => category.id === 'tools'
  ? {
      ...category,
      title: 'Tools, Protocols & Interoperability',
      description: 'Connect agents to tools, MCP, A2A, AG-UI and other external capabilities safely.'
    }
  : category
);

const safetyIndex = expandedBaseCategories.findIndex(category => category.id === 'human-safety');
export const categories = safetyIndex >= 0
  ? [...expandedBaseCategories.slice(0, safetyIndex), agentEngineeringCategory, ...expandedBaseCategories.slice(safetyIndex)]
  : [...expandedBaseCategories, agentEngineeringCategory];

const categoryTeaching = {
  foundations: {
    analogy: 'This is one of the building blocks underneath modern AI and agent systems.',
    why: 'Understanding it prevents later agent concepts from becoming vocabulary without a mental model.',
    how: ['Identify the input or instruction involved.', 'See how the model or application uses it.', 'Connect the result to the next part of the agent system.'],
    mistake: 'Using the term without understanding what part of the system it actually controls.'
  },
  tools: {
    analogy: 'Tools and protocols are the interfaces that let an agent reach beyond the model itself.',
    why: 'Reliable agents need clear capability boundaries, discoverable interfaces and predictable contracts.',
    how: ['Discover or define the capability.', 'Describe its contract clearly.', 'Validate permissions and arguments.', 'Execute or exchange the request.', 'Return structured results to the agent or user interface.'],
    mistake: 'Treating connectivity as the same thing as permission, reliability or safety.'
  },
  memory: {
    analogy: 'Context management is like deciding what stays on the desk, what goes into notes and what should be looked up only when needed.',
    why: 'Longer agent runs need deliberate strategies for preserving important information without flooding the active context.',
    how: ['Identify what must persist.', 'Keep the active context small and relevant.', 'Retrieve deeper information when needed.', 'Compact or trim stale material.', 'Preserve durable progress outside the context window.'],
    mistake: 'Assuming the context window should contain the complete history of the agent.'
  },
  loops: {
    analogy: 'The runtime is the machinery that keeps an agent moving, pausing, recovering and eventually stopping.',
    why: 'Production agents fail across trajectories, retries and state transitions rather than only in one model response.',
    how: ['Define the current state and next decision.', 'Execute the selected action.', 'Observe events and results.', 'Persist useful progress.', 'Recover, retry, escalate or stop according to explicit rules.'],
    mistake: 'Building a repeated loop without durable state, resource limits or recovery behaviour.'
  },
  'human-safety': {
    analogy: 'Guardrails and containment create boundaries outside the model’s own judgment.',
    why: 'An autonomous system should not be able to turn one mistaken decision into unlimited impact.',
    how: ['Classify risk before execution.', 'Validate inputs, outputs and tool calls at the right boundary.', 'Require approval where consequences justify it.', 'Constrain permissions and blast radius.', 'Log and review consequential decisions.'],
    mistake: 'Relying on a system prompt as the only safety boundary.'
  },
  evaluation: {
    analogy: 'Evaluation is how we replace “the demo looked good” with evidence about reliability in testing and production.',
    why: 'Agents are non-deterministic, multi-step systems whose behaviour can change when any surrounding component changes.',
    how: ['Define representative tasks and failure cases.', 'Measure both outcomes and trajectories.', 'Test adversarial and edge conditions.', 'Evaluate before deployment.', 'Monitor live behaviour and investigate drift.'],
    mistake: 'Evaluating only final prose while ignoring the actions and failures that produced it.'
  },
  'agent-engineering': {
    analogy: 'If the model is the reasoning engine, agent engineering designs the vehicle around it: context, runtime, controls, recovery and communication.',
    why: 'A capable model becomes a dependable agent only when the surrounding software system manages execution across time and uncertainty.',
    how: ['Define the agent’s operating environment.', 'Engineer context and capability access.', 'Control the execution loop and persistent state.', 'Add recovery and protocol boundaries.', 'Evaluate the whole system under realistic failures.'],
    mistake: 'Trying to solve system-level reliability problems only by changing the prompt or model.'
  }
};

function createExpandedConcept(row, category, order) {
  const [id, title, short, level, keywords] = row;
  const teaching = categoryTeaching[category] || categoryTeaching['agent-engineering'];
  return {
    id,
    title,
    short,
    level,
    keywords,
    category,
    order,
    analogy: teaching.analogy,
    why: teaching.why,
    how: teaching.how,
    example: `In a production agent, ${title.toLowerCase()} becomes visible when the system must keep working reliably beyond a single model response.`,
    mistake: teaching.mistake,
    when: `Use ${title.toLowerCase()} when it creates a clearer boundary, preserves useful state, improves interoperability, or reduces operational risk.`,
    practice: `Draw a small agent architecture and mark exactly where “${title}” belongs. Add one normal path, one failure path and the information that crosses the boundary.`
  };
}

const appendedConcepts = Object.entries(productionConceptRows).flatMap(([category, rows]) =>
  rows.map((row, index) => createExpandedConcept(row, category, baseConcepts.filter(c => c.category === category).length + index))
);

const engineeringConcepts = agentEngineeringRows.map((row, index) =>
  createExpandedConcept(row, 'agent-engineering', index)
);

export const concepts = [...baseConcepts, ...appendedConcepts, ...engineeringConcepts];
export const conceptById = Object.fromEntries(concepts.map(concept => [concept.id, concept]));

const pathAdditions = {
  beginner: ['prompt-engineering','sessions','session-vs-context'],
  developer: ['tool-design','tool-approval','agent-runtime','streaming-agents','input-guardrails','output-guardrails','tool-guardrails','context-compaction'],
  researcher: ['just-in-time-context','progressive-disclosure','agent-skills','harness-engineering','long-running-agent','durable-execution','agent-as-tool','manager-vs-handoff','a2a-agent-card','ag-ui','offline-vs-online-evaluation','adversarial-evaluation','agent-drift']
};

export const learningPaths = baseLearningPaths.map(path => ({
  ...path,
  modules: [...path.modules, ...(pathAdditions[path.id] || [])],
  hours: path.id === 'beginner' ? 7 : path.id === 'developer' ? 14 : 15
}));

export const projects = [
  ...baseProjects,
  {
    id: 'long-running-agent',
    title: 'Engineer a Long-Running Agent',
    level: 'Advanced',
    summary: 'Design an agent that can preserve progress across context resets, failures and human approval delays.',
    concepts: ['long-running-agent','context-compaction','structured-note-taking','durable-execution','agent-recovery-strategy'],
    steps: ['Define durable task state.', 'Separate active context from persistent progress.', 'Add compaction and structured notes.', 'Simulate a restart in the middle of the run.', 'Resume safely and verify the final state.']
  },
  {
    id: 'agent-interoperability',
    title: 'Design an Interoperable Agent System',
    level: 'Advanced',
    summary: 'Map MCP, A2A and AG-UI onto one architecture without confusing their responsibilities.',
    concepts: ['mcp','a2a-agent-card','a2a-tasks-messages-artifacts','ag-ui','protocol-engineering'],
    steps: ['Connect tools and resources through MCP.', 'Describe agent discovery and collaboration through A2A.', 'Stream agent state to the interface through AG-UI.', 'Mark authentication and approval boundaries.', 'Test what happens when one capability is unavailable.']
  },
  {
    id: 'red-team-agent',
    title: 'Red-Team an Agent',
    level: 'Advanced',
    summary: 'Attack a tool-using agent design and measure whether its controls limit unsafe trajectories.',
    concepts: ['adversarial-evaluation','prompt-injection','tool-guardrails','agent-containment','tool-side-effects'],
    steps: ['Create adversarial input cases.', 'Try to trigger an unintended tool route.', 'Test duplicate or irreversible actions.', 'Measure whether guardrails and containment stop the failure.', 'Turn each discovered failure into a regression test.']
  }
];

export const quizzes = [
  ...baseQuizzes,
  {
    q: 'What does harness engineering primarily design?',
    options: ['Only the wording of a prompt.','The software environment, tools, state and controls surrounding an agent.','Only the model training dataset.','Only the user interface.'],
    answer: 1,
    concept: 'harness-engineering'
  },
  {
    q: 'Which mapping is most accurate?',
    options: ['MCP = agent-to-tools/data, A2A = agent-to-agent, AG-UI = agent-to-user interface.','MCP = UI styling, A2A = embeddings, AG-UI = model training.','All three protocols solve exactly the same problem.','A2A replaces both MCP and AG-UI.'],
    answer: 0,
    concept: 'protocol-engineering'
  }
];

export { quickPrompts, coreRibbon };
