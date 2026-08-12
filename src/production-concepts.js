export const productionConceptRows = {
  foundations: [
    ['prompt-engineering','Prompt Engineering','Designing instructions, examples and constraints so models behave more reliably for a task.','beginner',['prompt design','instructions','few-shot']]
  ],
  tools: [
    ['tool-design','Tool Design / Tool Contracts','Engineering tool names, descriptions, parameters and outputs so agents can select and use tools reliably.','intermediate',['tool contract','schema','tool description']],
    ['tool-side-effects','Tool Side Effects & Idempotency','Designing consequential tool actions so retries do not accidentally perform the same external action twice.','advanced',['idempotency','side effects','retries']],
    ['tool-approval','Tool Approval','Requiring explicit approval before an agent executes selected consequential tools.','intermediate',['approval','tool guardrail']],
    ['capability-discovery','Capability Discovery','Dynamically determining what tools, agents or servers can do instead of relying only on hard-coded assumptions.','advanced',['discovery','capabilities']],
    ['mcp-prompts','MCP Prompts','Reusable prompt templates exposed by an MCP server to compatible clients.','advanced',['MCP','prompts']],
    ['mcp-sampling','MCP Sampling','An MCP capability that lets a server request model generation through the connected client.','advanced',['MCP','sampling']],
    ['mcp-roots','MCP Roots','Client-declared filesystem or workspace boundaries that MCP servers can use as context for operations.','advanced',['MCP','roots','workspace']],
    ['mcp-elicitation','MCP Elicitation','An MCP interaction in which a server asks the client to collect additional structured information from the user.','advanced',['MCP','elicitation','user input']],
    ['mcp-capability-negotiation','MCP Capability Negotiation & Lifecycle','The initialization and capability-discovery process that establishes what an MCP client and server support.','advanced',['MCP','lifecycle','capabilities']],
    ['a2a-agent-card','A2A Agent Card','A discoverable description of an agent’s identity, endpoint, skills and interaction capabilities.','advanced',['A2A','agent card','discovery']],
    ['a2a-tasks-messages-artifacts','A2A Tasks, Messages & Artifacts','The core work objects used to exchange requests, progress and results between interoperable agents.','advanced',['A2A','tasks','artifacts']],
    ['ag-ui','AG-UI (Agent–User Interaction Protocol)','A protocol for streaming agent events, state and interactions between agent backends and user interfaces.','advanced',['AG-UI','protocol','frontend']],
    ['generative-ui','Generative UI / Agent-Generated UI','Interfaces or components generated dynamically by an agent instead of returning only text.','advanced',['generative UI','agent UI']],
    ['shared-agent-ui-state','Shared Agent–UI State','Synchronising application state between an autonomous agent and the user interface a human is interacting with.','advanced',['AG-UI','shared state','frontend']],
    ['agent-middleware','Agent Middleware','Interception layers for agent events that add concerns such as authentication, logging, policy, filtering or rate limits.','advanced',['middleware','policy','telemetry']]
  ],
  memory: [
    ['context-compaction','Context Compaction','Compressing an overflowing or long-running context into a smaller representation that preserves what the agent still needs.','advanced',['compaction','context compression']],
    ['context-trimming','Context Trimming / Tool-Result Clearing','Removing stale, low-value or obsolete context and tool outputs instead of continually appending them.','advanced',['context trimming','tool clearing']],
    ['structured-note-taking','Structured Note-Taking / Agentic Memory','Having an agent deliberately write plans, facts or progress into durable notes that can be retrieved later.','intermediate',['notes','external memory','scratchpad']],
    ['just-in-time-context','Just-in-Time Context','Retrieving or loading information only when the current agent step actually needs it.','advanced',['JIT context','retrieval']],
    ['progressive-disclosure','Progressive Disclosure','Exposing a small amount of information first and allowing the agent to discover deeper instructions or resources as needed.','advanced',['progressive context','discovery']],
    ['sessions','Sessions','A persistent conversation or run-history layer that can preserve interaction history outside a single model call.','intermediate',['session memory','history']],
    ['session-vs-context','Session vs Context Window','The distinction between persisted session history and the subset of information placed into the model’s active context for one call.','intermediate',['session','context window']]
  ],
  loops: [
    ['agent-skills','Agent Skills','Reusable packages of instructions, scripts and resources that an agent can discover and load when a task requires them.','advanced',['skills','capabilities','progressive disclosure']],
    ['agent-as-tool','Agent-as-a-Tool','Using one specialised agent as a callable tool while another agent retains orchestration control.','advanced',['agent tool','multi-agent']],
    ['manager-vs-handoff','Manager vs Handoff Orchestration','Choosing between a manager agent that retains control and a handoff pattern that transfers control to another agent.','advanced',['manager','handoff','orchestration']],
    ['long-running-agent','Long-Horizon / Long-Running Agent','An agent designed to make progress across many steps, context windows or sessions rather than one short interaction.','advanced',['long horizon','long running']],
    ['durable-execution','Durable Execution / Resumable Runs','Persisting execution state so an agent can survive failures, restarts, delays or human approval pauses and later continue.','advanced',['durable execution','resume','checkpoint']],
    ['lifecycle-hooks','Lifecycle Events / Hooks','Events emitted around agent, model, tool and handoff activity that applications can observe or intercept.','advanced',['hooks','events','lifecycle']],
    ['streaming-agents','Streaming Agents','Agents that emit incremental text, state, progress and tool events while work is still in progress.','intermediate',['streaming','events']],
    ['asynchronous-agents','Asynchronous Agents / Push Notifications','Agents that continue long-running work independently and communicate completion or progress later.','advanced',['async','push notifications','background work']],
    ['agent-runtime','Agent Runtime','The execution layer around the model that manages the loop, state, tools, approvals, retries and lifecycle.','intermediate',['runtime','execution environment']],
    ['concurrency-control','Concurrency Control','Controlling simultaneous workers, tool calls or state updates so parallel agent activity remains safe and consistent.','advanced',['concurrency','race conditions','parallelism']],
    ['rollback-compensation','Rollback / Compensation','Undoing or compensating for external actions when an agent workflow partially succeeds and later needs recovery.','advanced',['rollback','compensation','transactions']]
  ],
  'human-safety': [
    ['input-guardrails','Input Guardrails','Controls that inspect or restrict user and external inputs before an agent acts on them.','intermediate',['guardrails','input safety']],
    ['output-guardrails','Output Guardrails','Controls that validate or restrict an agent’s generated output before it reaches a user or downstream system.','intermediate',['guardrails','output safety']],
    ['tool-guardrails','Tool Guardrails','Controls that validate, restrict or approve tool calls before and after execution.','advanced',['guardrails','tools']],
    ['agent-containment','Agent Containment / Blast Radius','Architectural controls that limit how much damage a mistaken or compromised agent can cause.','advanced',['containment','blast radius','security']]
  ],
  evaluation: [
    ['offline-vs-online-evaluation','Offline vs Online Evaluation','The distinction between testing agents before deployment and measuring their behaviour on live production traffic.','advanced',['offline eval','online eval']],
    ['adversarial-evaluation','Adversarial / Red-Team Agent Evaluation','Deliberately probing an agent for unsafe trajectories, unintended routes, prompt injection and tool misuse.','advanced',['red team','adversarial testing']],
    ['agent-drift','Agent Drift','Changes in production behaviour caused by updates to models, prompts, tools, context, data or external services.','advanced',['drift','production quality']]
  ]
};

export const agentEngineeringCategory = {
  id: 'agent-engineering',
  title: 'Agent Engineering',
  description: 'Engineer the runtime, harness, context and long-horizon execution around capable agents.',
  icon: 'gears',
  accent: 'indigo'
};

export const agentEngineeringRows = [
  ['harness-engineering','Harness Engineering','Designing the software environment around an agent, including prompts, tools, state, permissions, tests and execution controls.','advanced',['harness','agent infrastructure']],
  ['agent-runtime-engineering','Agent Runtime Engineering','Engineering the execution layer that coordinates model calls, tools, state, retries, approvals and lifecycle events.','advanced',['runtime','infrastructure']],
  ['long-horizon-engineering','Long-Horizon Agent Engineering','Designing agents that preserve progress and reliability across many steps, sessions and context resets.','advanced',['long horizon','persistent agents']],
  ['context-management-strategy','Context Management Strategy','A deliberate policy for retrieval, compaction, trimming, note-taking and context refresh across a long agent run.','advanced',['context management','compaction']],
  ['agent-recovery-strategy','Agent Recovery Strategy','A system-level plan for retry, resume, fallback, escalation, rollback and compensation after failures.','advanced',['recovery','resilience']],
  ['protocol-engineering','Protocol Engineering for Agents','Designing how agents communicate with tools, other agents and user interfaces through standards such as MCP, A2A and AG-UI.','advanced',['protocols','MCP','A2A','AG-UI']]
];
