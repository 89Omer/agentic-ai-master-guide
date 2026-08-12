export const categories = [
  { id: 'foundations', title: 'Foundations', description: 'Key ideas, history, and building blocks of agentic systems.', icon: 'layer-group', accent: 'blue' },
  { id: 'agents', title: 'Understanding Agents', description: 'What agents are, how they think, and how they make decisions.', icon: 'robot', accent: 'green' },
  { id: 'tools', title: 'Tools & MCP', description: 'Use tools safely and effectively with Model Context Protocol.', icon: 'wrench', accent: 'orange' },
  { id: 'memory', title: 'Memory & RAG', description: 'Give agents knowledge and context with memory and retrieval.', icon: 'database', accent: 'purple' },
  { id: 'loops', title: 'Loop Engineering', description: 'Design robust agent loops that plan, act, and improve.', icon: 'arrows-rotate', accent: 'amber' },
  { id: 'multi-agent', title: 'Multi-Agent Systems', description: 'Coordinate multiple agents to solve complex problems.', icon: 'people-group', accent: 'red' },
  { id: 'human-safety', title: 'Human Oversight & Safety', description: 'Approval, permissions, guardrails and protection against agent failures.', icon: 'shield-halved', accent: 'teal' },
  { id: 'evaluation', title: 'Evaluation & Production', description: 'How to measure reliability, trace behavior and operate agents responsibly.', icon: 'chart-column', accent: 'pink' }
];

const rows = {
  foundations: [
    ['artificial-intelligence','Artificial Intelligence','Computer systems performing tasks associated with human intelligence.','beginner',['AI','intelligence','automation']],
    ['machine-learning','Machine Learning','Systems that learn patterns from data instead of following only hand-written rules.','beginner',['ML','training','data']],
    ['deep-learning','Deep Learning','Machine learning using multi-layer neural networks to learn complex representations.','beginner',['neural network','DL']],
    ['generative-ai','Generative AI','AI that creates new text, images, audio, code or other content.','beginner',['GenAI','generation']],
    ['large-language-model','Large Language Model (LLM)','A model trained on large amounts of language data to predict and generate text.','beginner',['LLM','language model']],
    ['transformer','Transformer','The neural architecture behind most modern language models.','intermediate',['attention','architecture']],
    ['token','Token','A small unit of text processed by a language model.','beginner',['tokens','tokenization']],
    ['prompt','Prompt','The instruction or information given to a model.','beginner',['instruction','prompting']],
    ['system-prompt','System Prompt','High-priority instructions that define model behavior and boundaries.','beginner',['system message','instructions']],
    ['context-window','Context Window','The amount of information a model can actively consider at one time.','beginner',['context','window']],
    ['inference','Inference','Using a trained model to produce an output for new input.','beginner',['generation','prediction']],
    ['hallucination','Hallucination','A plausible-sounding model output that is unsupported, incorrect or invented.','beginner',['fabrication','accuracy']],
    ['api','API','A software interface that lets one system request data or actions from another.','beginner',['application programming interface','integration']],
    ['json','JSON','A common structured text format used to exchange data between software systems.','beginner',['structured data','objects']],
    ['embeddings','Embeddings','Numeric representations that place semantically similar content near each other.','intermediate',['vectors','semantic representation']]
  ],
  agents: [
    ['agent','AI Agent','An AI system that can decide what action to take next in pursuit of a goal.','beginner',['agentic AI','autonomous agent']],
    ['goal-objective','Goal / Objective','The outcome an agent is trying to achieve.','beginner',['goal','objective']],
    ['environment','Environment','The external world, software or data sources an agent can observe and affect.','beginner',['world','system']],
    ['perception-input','Perception / Input','Information an agent receives from users, tools, files, APIs or sensors.','beginner',['input','observation']],
    ['autonomy','Autonomy','How independently an agent can decide and act without continuous human direction.','beginner',['independence','automation']],
    ['reasoning','Reasoning','Using available information to decide what a problem means and what to do next.','beginner',['thinking','decision']],
    ['planning','Planning','Turning a goal into an ordered set of actions or subgoals.','beginner',['plan','steps']],
    ['task-decomposition','Task Decomposition','Breaking a complex goal into smaller tasks that are easier to solve.','beginner',['subtasks','planning']],
    ['action-execution','Action / Execution','Performing a tool call or operation that changes or queries the environment.','beginner',['act','execute']],
    ['observation','Observation','The result an agent receives after an action, used to decide what happens next.','beginner',['observe','result']],
    ['feedback-loop','Feedback Loop','Using the result of one action to improve the next decision.','beginner',['feedback','iteration']],
    ['state','State','The information describing where the agent currently is in a task or workflow.','intermediate',['workflow state','current state']],
    ['stopping-condition','Stopping Condition','A rule that tells an agent when to finish, fail or escalate.','intermediate',['stop','termination']],
    ['agent-lifecycle','Agent Lifecycle','The full sequence from receiving a goal through planning, acting, evaluating and completing.','intermediate',['lifecycle','execution']],
    ['autonomy-levels','Agentic Autonomy Levels','Different degrees of independence, from assistant-like support to high-autonomy execution.','intermediate',['levels','autonomy']]
  ],
  tools: [
    ['tool-use','Tool Use','Giving an agent external capabilities such as search, calculation, databases or code execution.','beginner',['tools','actions']],
    ['function-calling','Function Calling','A structured way for a model to select a function and provide its arguments.','beginner',['tool calling','function']],
    ['tool-selection','Tool Selection','Choosing the most appropriate available tool for the current task.','beginner',['choose tool','routing']],
    ['dynamic-tool-selection','Dynamic Tool Selection','Letting the agent choose tools at runtime instead of following a fixed path.','intermediate',['dynamic tools','runtime']],
    ['api-integration','API Integration','Connecting an agent to external software through application programming interfaces.','intermediate',['API','integration']],
    ['structured-output','Structured Output','Constraining model output to a predictable schema for reliable downstream use.','beginner',['JSON schema','structured response']],
    ['mcp','Model Context Protocol (MCP)','A standard way for AI applications to discover and use external tools, resources and context.','intermediate',['MCP','model context protocol']],
    ['mcp-client','MCP Client','The part of an AI application that connects to and communicates with MCP servers.','intermediate',['client','MCP']],
    ['mcp-server','MCP Server','A service that exposes tools, resources or prompts to MCP clients.','intermediate',['server','MCP']],
    ['mcp-tools','MCP Tools','Executable actions exposed by an MCP server.','intermediate',['MCP tool','actions']],
    ['mcp-resources','MCP Resources','Read-oriented information exposed through MCP, such as files or records.','intermediate',['MCP resource','context']],
    ['authentication','Authentication','Proving who a user, service or agent is before access is granted.','intermediate',['authn','identity']],
    ['permissions','Permissions','Rules defining what data and actions an agent is allowed to access.','intermediate',['authorization','access']],
    ['browser-agent','Browser / Computer-Use Agent','An agent that can interact with webpages or graphical interfaces.','advanced',['browser','computer use']],
    ['code-agent','Code Agent','An agent that can write, run, test and modify software code.','intermediate',['coding agent','code execution']],
    ['search-tool','Search Tool','A tool that retrieves information from a search index or the public web.','beginner',['web search','retrieval']],
    ['database-tool','Database Tool','A tool that queries or updates structured data in a database.','intermediate',['SQL','database']]
  ],
  memory: [
    ['working-memory','Working Memory','The information most relevant to the current step of an agent task.','beginner',['working context','memory']],
    ['short-term-memory','Short-Term Memory','Information kept for the current conversation or task but not necessarily beyond it.','beginner',['conversation memory','temporary memory']],
    ['long-term-memory','Long-Term Memory','Information persisted across sessions so it can be retrieved later.','intermediate',['persistent memory','memory']],
    ['context-engineering','Context Engineering','Designing what information enters the model context, when and in what form.','intermediate',['context design','prompt context']],
    ['context-rot','Context Rot','Performance degradation caused by overly long, noisy, stale or conflicting context.','intermediate',['context degradation','noise']],
    ['persistence','Persistence','Keeping state, memory or results beyond a single execution.','intermediate',['storage','persistent state']],
    ['checkpointing','Checkpointing','Saving intermediate state so an agent can resume or recover later.','intermediate',['checkpoint','resume']],
    ['rag','Retrieval-Augmented Generation (RAG)','Retrieving relevant external information and giving it to a model before generation.','beginner',['RAG','retrieval augmented generation']],
    ['retrieval','Retrieval','Finding the most relevant information for a query from an external collection.','beginner',['search','retrieve']],
    ['chunking','Chunking','Splitting documents into smaller pieces for indexing and retrieval.','beginner',['chunks','documents']],
    ['vector-store','Vector Store','A database designed to store embeddings and retrieve semantically similar items.','intermediate',['vector database','embeddings']],
    ['semantic-search','Semantic Search','Finding content by meaning rather than only exact keywords.','intermediate',['semantic retrieval','similarity']],
    ['hybrid-search','Hybrid Search','Combining semantic and keyword retrieval to improve coverage and precision.','advanced',['BM25','semantic search']],
    ['reranking','Reranking','Reordering retrieved results using a stronger relevance model.','advanced',['ranker','retrieval quality']],
    ['knowledge-base','Knowledge Base','A managed collection of information an agent can search or retrieve.','beginner',['KB','documents']],
    ['grounding','Grounding','Basing an answer or action on supplied or retrieved evidence.','beginner',['evidence','factuality']],
    ['citation-verification','Citation Verification','Checking whether a citation exists and supports the claim it is attached to.','intermediate',['citations','references']],
    ['knowledge-graph','Knowledge Graph','A graph of entities and relationships used to represent structured knowledge.','advanced',['graph','entities']],
    ['graph-rag','Graph RAG','Retrieval that uses graph relationships as well as text similarity.','advanced',['knowledge graph','RAG']],
    ['agentic-rag','Agentic RAG','RAG in which an agent decides when, where and how to retrieve, refine or verify information.','advanced',['agentic retrieval','RAG']]
  ],
  loops: [
    ['agent-loop','Agent Loop','The repeated cycle in which an agent reasons, acts, observes and decides what happens next.','beginner',['loop','observe think act']],
    ['react-pattern','ReAct','A pattern that interleaves reasoning with actions and observations.','intermediate',['ReAct','reason act']],
    ['loop-engineering','Loop Engineering','Designing an agent’s iterative cycle so it reliably progresses, verifies results and stops safely.','intermediate',['loops','engineering','verification']],
    ['verification-loop','Verification Loop','A cycle that generates or acts, checks the result and repeats until requirements are met.','intermediate',['verify','iterate']],
    ['reflection','Reflection','Reviewing an earlier result or trajectory and using that review to improve the next attempt.','intermediate',['reflect','review']],
    ['self-critique','Self-Critique','Having a model identify weaknesses in its own proposed answer or plan.','intermediate',['critique','review']],
    ['retry-logic','Retry Logic','Rules for repeating an action after a recoverable failure.','intermediate',['retry','failure']],
    ['error-recovery','Error Recovery','Detecting a failure and choosing a safe alternative action or strategy.','intermediate',['recovery','fallback']],
    ['loop-budget','Loop Budget','A limit on iterations, tokens, cost, time or tool calls available to a loop.','intermediate',['budget','limits']],
    ['loop-termination','Loop Termination','The logic that decides whether a loop should continue, succeed, fail or escalate.','intermediate',['exit condition','stop']],
    ['workflow-vs-agent','Workflow vs Agent','The distinction between predefined execution paths and systems that decide their next action dynamically.','beginner',['workflow','agent']],
    ['agentic-workflow','Agentic Workflow','A workflow containing model-driven decisions, tool use, state and iterative behavior.','intermediate',['workflow','agents']],
    ['deterministic-workflow','Deterministic Workflow','A workflow whose path is largely predefined by explicit logic.','beginner',['deterministic','rules']],
    ['nondeterministic-behaviour','Non-Deterministic Behaviour','The possibility that the same input can lead to different model decisions or outputs.','intermediate',['variance','stochastic']],
    ['state-machine','State Machine','A system represented as defined states with controlled transitions between them.','intermediate',['states','transitions']],
    ['dag','Directed Acyclic Graph (DAG)','A graph of tasks and dependencies with no cycles, often used for deterministic orchestration.','intermediate',['DAG','workflow']],
    ['event-driven-agents','Event-Driven Agents','Agents that wake or act in response to events such as messages, updates or scheduled triggers.','advanced',['events','triggers']],
    ['orchestration','Orchestration','Coordinating models, tools, memory, agents and workflow steps into one system.','intermediate',['orchestrator','coordination']],
    ['router','Router','A component that chooses which model, agent, tool or workflow should handle a request.','intermediate',['routing','dispatcher']],
    ['model-routing','Model Routing','Selecting different models based on complexity, capability, cost or latency.','intermediate',['model selection','routing']],
    ['fallback','Fallback','An alternate model, tool or path used when the preferred option fails or is unavailable.','intermediate',['backup','recovery']]
  ],
  'multi-agent': [
    ['multi-agent-system','Multi-Agent System','A system in which multiple agents collaborate, coordinate or compete to solve a task.','intermediate',['MAS','multiple agents']],
    ['supervisor-agent','Supervisor Agent','An agent that delegates work, tracks progress and coordinates specialist agents.','intermediate',['manager agent','supervisor']],
    ['worker-agent','Worker Agent','A specialised agent that performs a task assigned by a coordinator or supervisor.','intermediate',['specialist','worker']],
    ['agent-handoff','Agent Handoff','Transferring responsibility and relevant context from one agent to another.','intermediate',['handoff','delegate']],
    ['agent-communication','Agent Communication','The messages, protocols or shared state agents use to exchange information.','intermediate',['messages','collaboration']],
    ['sequential-agents','Sequential Agents','Agents that work one after another, each using the previous output.','beginner',['sequence','pipeline']],
    ['parallel-agents','Parallel Agents','Agents that work at the same time on independent or complementary subtasks.','intermediate',['parallel','concurrent']],
    ['hierarchical-agents','Hierarchical Agents','Multi-agent systems arranged into levels such as manager, supervisor and workers.','advanced',['hierarchy','manager']],
    ['critic-agents','Debate / Critic Agents','Agents that challenge, review or compare another agent’s reasoning or result.','advanced',['critic','debate']],
    ['consensus','Consensus','Accepting or combining results when multiple agents or models independently agree.','advanced',['agreement','ensemble']],
    ['shared-memory','Shared Memory','A common state or knowledge store accessible to multiple agents.','advanced',['multi-agent memory','shared state']],
    ['agent-to-agent-protocols','Agent-to-Agent Protocols','Conventions or standards that define how independent agents discover and communicate with one another.','advanced',['A2A','protocol']]
  ],
  'human-safety': [
    ['human-in-loop','Human-in-the-Loop (HITL)','A design in which a human must review, approve or provide input at important points.','beginner',['HITL','approval']],
    ['human-on-loop','Human-on-the-Loop','A design where agents operate autonomously while humans monitor and can intervene.','intermediate',['HOTL','supervision']],
    ['approval-gate','Approval Gate','A checkpoint that blocks an action until an authorised human approves it.','beginner',['approval','checkpoint']],
    ['escalation','Escalation','Passing a task to a human or higher-level system when confidence, risk or policy requires it.','intermediate',['escalate','human review']],
    ['guardrails','Guardrails','Rules and controls that constrain what an agent can say or do.','beginner',['safety','constraints']],
    ['least-privilege','Least Privilege','Giving an agent only the minimum permissions required for its task.','intermediate',['permissions','security']],
    ['sandboxing','Sandboxing','Running agent actions in an isolated environment to limit damage from errors or attacks.','intermediate',['isolation','security']],
    ['prompt-injection','Prompt Injection','Instructions designed to manipulate a model into ignoring intended rules or objectives.','intermediate',['injection','attack']],
    ['indirect-prompt-injection','Indirect Prompt Injection','Malicious instructions hidden inside external content an agent reads.','advanced',['web injection','document attack']],
    ['tool-abuse','Tool Abuse','Using a legitimate tool in an unsafe, unintended or excessive way.','advanced',['misuse','tools']],
    ['privilege-escalation','Privilege Escalation','Gaining access to capabilities beyond what an agent should be allowed to use.','advanced',['permissions','attack']],
    ['data-leakage','Data Leakage','Sensitive information escaping to an unauthorised user, model, log or tool.','intermediate',['privacy','exfiltration']],
    ['secrets-management','Secrets Management','Safely storing and controlling API keys, credentials and other sensitive values.','intermediate',['API keys','credentials']],
    ['memory-poisoning','Memory Poisoning','Planting misleading information in persistent memory so it changes future behavior.','advanced',['memory attack','poisoning']],
    ['rag-poisoning','RAG Poisoning','Manipulating retrieved documents or indexes so an agent receives harmful or false context.','advanced',['retrieval attack','poisoning']],
    ['agent-hijacking','Agent Hijacking','Redirecting an agent from its intended goal toward an attacker’s objective.','advanced',['takeover','attack']],
    ['resource-limits','Cost & Resource Limits','Controls that cap spend, tool calls, runtime, data access or other resources.','intermediate',['budget','limits']]
  ],
  evaluation: [
    ['validation','Validation','Checking whether an output follows required structure, constraints or business rules.','beginner',['validate','schema']],
    ['verification','Verification','Checking whether claims, actions or results are actually correct.','beginner',['verify','correctness']],
    ['evaluator-model','Evaluator / Judge Model','A model used to score, compare or critique another model or agent output.','intermediate',['judge','evaluator']],
    ['agent-reliability','Agent Reliability','How consistently an agent completes tasks correctly across repeated runs and conditions.','intermediate',['reliability','consistency']],
    ['observability','Observability','The ability to understand agent behavior through events, state, metrics, traces and logs.','intermediate',['monitoring','telemetry']],
    ['tracing','Tracing','Recording the sequence of model calls, tool calls and state transitions during execution.','intermediate',['trace','trajectory']],
    ['agent-evaluation','Agent Evaluation','Systematic testing of whether an agent completes representative tasks correctly and safely.','intermediate',['evals','testing']],
    ['benchmarking','Benchmarking','Comparing performance using repeatable datasets, tasks or standard metrics.','intermediate',['benchmark','comparison']],
    ['task-success','Task Success','Whether the agent actually achieves the requested outcome rather than merely producing plausible text.','beginner',['success rate','completion']],
    ['groundedness','Groundedness','How well an answer is supported by the evidence supplied to the model.','intermediate',['evidence','support']],
    ['faithfulness','Faithfulness','Whether generated statements accurately reflect the source context without distortion.','intermediate',['fidelity','sources']],
    ['tool-correctness','Tool Correctness','Whether the agent selected the right tool and used it with valid arguments.','intermediate',['tool eval','function calling']],
    ['trajectory-evaluation','Trajectory Evaluation','Evaluating the full sequence of agent decisions, not only the final answer.','advanced',['trajectory','trace eval']],
    ['regression-testing','Regression Testing','Rerunning known tests after changes to detect new failures.','intermediate',['regression','tests']],
    ['latency','Latency','The time an agent takes to complete a request or workflow.','beginner',['speed','response time']],
    ['cost-token-budget','Cost / Token Budget','Limits and measurements for model tokens, API spend and execution cost.','beginner',['cost','tokens']],
    ['production-monitoring','Production Monitoring','Watching deployed agents for failures, quality drift, cost spikes and unsafe behavior.','advanced',['monitoring','operations']],
    ['agentic-search','Agentic Search','Search in which an agent plans queries, inspects results, refines searches and synthesises evidence.','intermediate',['search agent','research']],
    ['deep-research-agent','Deep Research Agent','An agent that performs multi-step search, analysis, comparison, verification and synthesis.','advanced',['research agent','deep research']]
  ]
};

const detail = {
  'artificial-intelligence': {
    analogy: 'Think of AI as the broad umbrella. Machine learning, generative AI and agents are different things under that umbrella.',
    why: 'It gives you the vocabulary to distinguish the field from specific techniques and products.',
    how: ['A system receives information.', 'It applies rules or learned patterns.', 'It produces a decision, prediction, recommendation or generated output.'],
    example: 'A spam filter, route planner, image generator and AI agent are all AI systems, but they solve different kinds of problems.',
    mistake: 'Treating “AI”, “LLM” and “agent” as interchangeable terms.'
  },
  'large-language-model': {
    analogy: 'An LLM is a very capable language engine. It can reason over text and generate responses, but by itself it does not automatically have tools, persistent memory or permission to act.',
    why: 'Most modern agents use an LLM as the reasoning component, so understanding its limits explains why agent architecture exists.',
    how: ['Text is converted into tokens.', 'The model uses the current context to predict useful next tokens.', 'The application may repeatedly call the model as an agent loop progresses.'],
    example: 'A model can draft an email. An agent can decide an email is needed, retrieve the recipient, draft it, ask for approval and then call an email tool.',
    mistake: 'Assuming an LLM automatically knows current facts or can take actions in external systems.'
  },
  'agent': {
    analogy: 'A chatbot answers. An agent can decide what to do next.',
    why: 'The agent concept is the centre of the entire guide: goals, tools, memory, loops, safety and evaluation all attach to it.',
    how: ['Receive a goal or task.', 'Inspect current context and state.', 'Reason about the next useful step.', 'Choose an action or produce an answer.', 'Observe the result and continue or stop.'],
    example: '“Find three suitable papers, verify the citations and summarise the evidence” requires multiple decisions and external retrieval, making it a natural agent task.',
    mistake: 'Calling every LLM-powered feature an agent. A single prompt-response call is usually just model usage, not an agentic loop.'
  },
  'tool-use': {
    analogy: 'The model is the brain; tools are the hands and instruments it can use.',
    why: 'Without tools, an agent is limited to what the model can infer from its current context.',
    how: ['The model identifies that external capability is needed.', 'It selects a tool.', 'The application validates the request.', 'The tool executes.', 'Its result returns as a new observation.'],
    example: 'For “What is 347 × 29?”, the agent can choose a calculator tool instead of estimating.',
    mistake: 'Giving an agent every available tool. More tools increase ambiguity, attack surface and evaluation complexity.'
  },
  'mcp': {
    analogy: 'An API is a specific doorway into a service. MCP is a common reception desk that tells compatible AI applications what tools and resources are available and how to use them.',
    why: 'MCP reduces bespoke integration work and gives agent applications a standard pattern for discovering external capabilities.',
    how: ['An MCP client connects to a server.', 'The server describes available tools and resources.', 'The application presents relevant capabilities to the model.', 'Approved tool calls are executed and returned as observations.'],
    example: 'A coding assistant can connect to an MCP server that exposes repository files, issue data and development tools.',
    mistake: 'Thinking MCP replaces RAG. MCP is an integration protocol; RAG is a retrieval-and-generation pattern.'
  },
  'rag': {
    analogy: 'Instead of asking the model to remember a book, RAG lets it look up the relevant pages before answering.',
    why: 'It gives models access to private, specialised or changing knowledge without retraining them.',
    how: ['Prepare and index source content.', 'Turn the user question into a retrieval query.', 'Fetch the most relevant chunks.', 'Place those chunks into model context.', 'Generate an answer grounded in the retrieved evidence.'],
    example: 'A university policy assistant retrieves the current policy sections before answering a student question.',
    mistake: 'Assuming retrieval automatically guarantees a correct answer. Retrieval quality and grounding still need evaluation.'
  },
  'context-engineering': {
    analogy: 'Prompt engineering writes the instruction. Context engineering arranges the entire desk the model is working from.',
    why: 'Agent quality often depends more on selecting the right context than on making a prompt longer.',
    how: ['Decide what the model needs for this step.', 'Retrieve or summarise only useful information.', 'Order and label context clearly.', 'Remove stale or conflicting material.', 'Measure whether the context improves task success.'],
    example: 'A supervisor agent may receive the goal, current plan, latest worker outputs and relevant policy — not every message from the entire run.',
    mistake: 'Treating the context window as storage and continuously appending everything.'
  },
  'context-rot': {
    analogy: 'A desk covered with every note you have ever written eventually makes the important note harder to find.',
    why: 'Large contexts can become noisy, contradictory and expensive even when they technically fit inside the model window.',
    how: ['Context grows over multiple steps.', 'Irrelevant or stale information competes with current instructions.', 'Important evidence becomes harder to attend to.', 'Performance becomes less reliable.'],
    example: 'An agent repeatedly includes old plans and outdated tool results, then follows the wrong version of the plan.',
    mistake: 'Assuming a larger context window means you should always fill it.'
  },
  'agent-loop': {
    analogy: 'Like navigating with a map: decide the next turn, move, check where you are, then decide again.',
    why: 'The loop is what turns one-shot model generation into an adaptive agent.',
    how: ['Reason about the current state.', 'Plan the next useful step.', 'Act using a tool or response.', 'Observe what happened.', 'Evaluate progress.', 'Repeat or stop.'],
    example: 'A coding agent edits code, runs tests, reads failures, fixes the code and reruns tests until a stopping condition is met.',
    mistake: 'Allowing a loop to continue without explicit success, failure and budget conditions.'
  },
  'loop-engineering': {
    analogy: 'Prompt engineering designs one instruction; loop engineering designs the whole repeated process that keeps moving the agent toward a trustworthy result.',
    why: 'Production agents fail through trajectories, not only bad individual prompts. The loop must control progress, verification, retries, cost and termination.',
    how: ['Define the goal and measurable success criteria.', 'Choose the plan/act/observe cycle.', 'Add verification after consequential steps.', 'Define retry and recovery behavior.', 'Limit iterations, time and spend.', 'Add human escalation for risky or uncertain states.', 'Specify exact stopping conditions.'],
    example: 'A research agent searches, inspects evidence, identifies gaps, refines queries, verifies citations and stops when coverage and quality thresholds are met.',
    mistake: 'Implementing “while not done: try again” and calling it an engineered loop.'
  },
  'workflow-vs-agent': {
    analogy: 'A workflow follows a railway track. An agent is closer to a driver choosing roads based on current conditions.',
    why: 'Many systems should use deterministic workflows for predictable steps and agents only where judgment is genuinely useful.',
    how: ['Workflows encode known paths in advance.', 'Agents select paths dynamically.', 'Hybrid systems keep sensitive or predictable actions deterministic and use agents for ambiguous decisions.'],
    example: 'Invoice approval can use a fixed workflow, while an agent extracts unusual issues and decides which specialist review is needed.',
    mistake: 'Making every step agentic because it seems more advanced.'
  },
  'multi-agent-system': {
    analogy: 'Instead of one generalist doing everything, a team splits the work across specialist roles.',
    why: 'Multiple agents can separate responsibilities, run work in parallel and add independent critique — but they also add coordination cost.',
    how: ['Define distinct responsibilities.', 'Choose a coordination pattern.', 'Control what context each agent receives.', 'Specify handoffs and shared state.', 'Evaluate both individual agents and the combined system.'],
    example: 'A research system uses Search, Analysis and Citation Verification workers coordinated by a Supervisor.',
    mistake: 'Creating many agents without a reason. More agents do not automatically produce better answers.'
  },
  'human-in-loop': {
    analogy: 'The agent prepares the decision, but a human holds the final key for selected actions.',
    why: 'Human approval reduces risk when consequences are high, requirements are ambiguous or policy demands accountability.',
    how: ['Identify high-risk decision points.', 'Pause before the consequential action.', 'Show the human enough evidence to review.', 'Capture approve, reject or edit.', 'Resume the workflow using that decision.'],
    example: 'An agent can draft a £500 refund recommendation but must wait for authorised staff approval before issuing the refund.',
    mistake: 'Adding a human checkpoint everywhere, which removes the benefits of automation and creates alert fatigue.'
  },
  'prompt-injection': {
    analogy: 'A malicious note hidden in the material an assistant is reading tries to convince it to ignore its real job.',
    why: 'Tool-using agents process untrusted content and may have capabilities that make manipulated instructions consequential.',
    how: ['Untrusted content contains adversarial instructions.', 'The model may confuse data with instructions.', 'The attacker attempts to alter tool use, disclosure or objectives.', 'Architecture and permissions must prevent the model alone from deciding what is authorised.'],
    example: 'A webpage tells a browsing agent to reveal stored secrets or send data to an attacker-controlled address.',
    mistake: 'Trying to solve prompt injection only with a stronger system prompt.'
  },
  'agent-evaluation': {
    analogy: 'A demo proves an agent can work once. Evaluation asks how often it works, where it fails and whether the failures are acceptable.',
    why: 'Agents are non-deterministic and multi-step, so intuition from a few manual runs is not enough.',
    how: ['Create representative tasks and failure cases.', 'Define measurable success criteria.', 'Run multiple trials.', 'Inspect final outcomes and trajectories.', 'Track quality, safety, cost and latency.', 'Repeat after every meaningful change.'],
    example: 'Run the same tool-routing test set across 100 tasks and measure correct tool choice, argument validity, task completion and average cost.',
    mistake: 'Evaluating only the final prose while ignoring unnecessary tool calls, unsafe actions or failed intermediate steps.'
  },
  'observability': {
    analogy: 'Observability is the flight recorder for an agent system.',
    why: 'Without traces and state visibility, multi-step failures are difficult to reproduce or improve.',
    how: ['Record model calls and selected inputs.', 'Record tool calls and outputs.', 'Track state transitions and timing.', 'Attach evaluation signals.', 'Inspect trajectories when something fails.'],
    example: 'A trace reveals that an agent chose the correct search tool but passed an overly broad query that caused poor retrieval.',
    mistake: 'Logging huge amounts of sensitive raw data without a clear debugging or evaluation purpose.'
  }
};

const categoryDefaults = {
  foundations: { analogy: 'This is a foundational building block that makes later agent concepts easier to reason about.', why: 'It gives you the vocabulary needed to understand how modern AI applications work.', example: 'Look for this concept in everyday AI products and identify what role it plays.', mistake: 'Memorising the term without connecting it to a real system.' },
  agents: { analogy: 'Think of an agent as a goal-directed problem solver that repeatedly decides what happens next.', why: 'Agent behavior emerges from the interaction between goals, reasoning, state and actions.', example: 'Trace a simple task and label where this concept appears in the agent lifecycle.', mistake: 'Treating the concept as an isolated feature instead of part of a loop.' },
  tools: { analogy: 'Tools connect model reasoning to capabilities outside the model.', why: 'External actions need structure, permissions and reliable interfaces.', example: 'Imagine an assistant deciding whether it needs search, a calculator or a database.', mistake: 'Giving tools broad access without validation or least-privilege permissions.' },
  memory: { analogy: 'Memory and retrieval decide what useful information is brought back into the model’s working context.', why: 'Agents need relevant information without continuously carrying everything.', example: 'Ask which information should be kept, retrieved later or discarded after a task.', mistake: 'Treating memory as an unlimited transcript.' },
  loops: { analogy: 'A loop lets an agent adapt after seeing what happened.', why: 'Reliable autonomy depends on progress checks, recovery and clear termination.', example: 'Sketch what should happen after success, failure and uncertainty.', mistake: 'Repeating actions without explicit budgets or exit conditions.' },
  'multi-agent': { analogy: 'Multi-agent architecture is team design for AI systems.', why: 'Specialisation can help when roles are genuinely different and coordination is well controlled.', example: 'Split a complex task into roles, then decide what information each role actually needs.', mistake: 'Adding agents merely to make an architecture look sophisticated.' },
  'human-safety': { analogy: 'Safety architecture limits what an agent may do even if its model makes a poor decision.', why: 'Agents can affect external systems, so permissions and review must exist outside model reasoning.', example: 'Classify an action as automatic, approval-required or forbidden.', mistake: 'Relying on the model to enforce every safety boundary itself.' },
  evaluation: { analogy: 'Evaluation turns “it seems to work” into measurable evidence.', why: 'Agent systems vary across runs and can fail in intermediate steps that final-answer checks miss.', example: 'Define a small test set and measure both the result and the path taken to reach it.', mistake: 'Optimising a metric without checking whether it reflects real task success.' }
};

export const concepts = Object.entries(rows).flatMap(([category, items]) => items.map(([id,title,short,level,keywords], index) => {
  const d = detail[id] || categoryDefaults[category];
  return {
    id, title, short, level, keywords, category,
    order: index,
    analogy: d.analogy,
    why: d.why,
    how: d.how || [
      'Identify where this concept appears in the system.',
      'Define the information or control it needs.',
      'Connect it to the surrounding agent workflow.',
      'Test what happens when it works and when it fails.'
    ],
    example: d.example,
    mistake: d.mistake,
    when: `Use ${title.toLowerCase()} when it makes the agent system clearer, safer or more reliable; avoid adding it when a simpler deterministic design already solves the problem.`,
    practice: `Create a one-minute sketch showing where “${title}” sits in a real agent system. Label its input, output and one failure mode.`
  };
}));

export const conceptById = Object.fromEntries(concepts.map(c => [c.id, c]));

export const learningPaths = [
  {
    id: 'beginner',
    title: 'Beginner',
    badge: 'New to AI',
    description: 'Start from the ground up. No prior AI experience needed.',
    modules: ['artificial-intelligence','generative-ai','large-language-model','token','prompt','context-window','hallucination','api','agent','goal-objective','reasoning','planning','tool-use','agent-loop','rag','mcp','human-in-loop','agent-evaluation'],
    hours: 6
  },
  {
    id: 'developer',
    title: 'Developer',
    badge: 'Build & Ship',
    description: 'Build reliable agentic applications and integrate real tools.',
    modules: ['agent','structured-output','function-calling','tool-selection','api-integration','state','checkpointing','rag','vector-store','mcp','agent-loop','loop-engineering','error-recovery','orchestration','router','multi-agent-system','guardrails','observability','regression-testing'],
    hours: 12
  },
  {
    id: 'researcher',
    title: 'Researcher',
    badge: 'Go Deep',
    description: 'Explore agentic research, retrieval, verification, evaluation and advanced architectures.',
    modules: ['context-engineering','context-rot','grounding','citation-verification','hybrid-search','reranking','knowledge-graph','graph-rag','agentic-rag','agentic-search','deep-research-agent','critic-agents','consensus','trajectory-evaluation','evaluator-model','agent-reliability'],
    hours: 10
  }
];

export const projects = [
  { id:'first-agent', title:'Build Your First Agent', level:'Beginner', summary:'Model a simple goal → decide → act → observe loop without any external API keys.', concepts:['agent','goal-objective','agent-loop','stopping-condition'], steps:['Choose one narrow goal.','Define two possible actions.','Represent the current state.','Run a loop that chooses an action.','Stop on success or after a fixed budget.'] },
  { id:'two-tool-agent', title:'Two-Tool Agent', level:'Beginner', summary:'Route questions between a calculator-like tool and a knowledge lookup.', concepts:['tool-use','tool-selection','function-calling'], steps:['Define the two tool descriptions.','Create clear routing examples.','Test ambiguous requests.','Record incorrect tool choices.','Improve descriptions and retest.'] },
  { id:'rag-assistant', title:'RAG Assistant', level:'Intermediate', summary:'Build the mental model of a retrieval pipeline and test how chunk quality changes answers.', concepts:['rag','chunking','embeddings','vector-store','grounding'], steps:['Prepare a small document set.','Split it into useful chunks.','Create retrieval queries.','Inspect the top evidence.','Answer only from retrieved material.'] },
  { id:'research-agent', title:'Research Agent', level:'Intermediate', summary:'Plan searches, inspect evidence, refine queries and verify conclusions.', concepts:['agentic-search','planning','grounding','verification-loop'], steps:['Turn a research question into search tasks.','Gather evidence from several angles.','Identify missing coverage.','Refine the search.','Verify claims before synthesis.'] },
  { id:'supervisor-workers', title:'Supervisor + Workers', level:'Advanced', summary:'Coordinate specialised agents with explicit responsibilities and handoffs.', concepts:['supervisor-agent','worker-agent','agent-handoff','shared-memory'], steps:['Define three distinct roles.','Give each role a narrow contract.','Define handoff payloads.','Add a supervisor decision rule.','Evaluate coordination failures.'] },
  { id:'human-approval', title:'Human Approval Workflow', level:'Intermediate', summary:'Place an approval gate before a consequential external action.', concepts:['human-in-loop','approval-gate','permissions','least-privilege'], steps:['Choose a high-impact action.','Define what evidence the reviewer sees.','Block execution before approval.','Support reject/edit/approve outcomes.','Log the decision.'] },
  { id:'mcp-agent', title:'MCP-Powered Agent', level:'Intermediate', summary:'Design an agent that discovers a tool and resource through an MCP server.', concepts:['mcp','mcp-client','mcp-server','mcp-tools'], steps:['Identify the external capability.','Model the MCP server contract.','Expose a read resource and an action tool.','Let the client discover capabilities.','Apply permission checks before execution.'] },
  { id:'reliable-loop', title:'Engineer a Reliable Loop', level:'Advanced', summary:'Add verification, retry limits, fallback and termination to an agent loop.', concepts:['loop-engineering','verification-loop','retry-logic','fallback','loop-budget','loop-termination'], steps:['Define measurable success.','Add a verifier after each attempt.','Classify recoverable failures.','Set retry and cost budgets.','Define fail-safe termination and escalation.'] }
];

export const quizzes = [
  { q:'Which statement best distinguishes an agent from a one-shot chatbot?', options:['An agent always uses a larger model.','An agent can repeatedly decide and act toward a goal.','An agent must have a human-like avatar.','An agent always uses multiple models.'], answer:1, concept:'agent' },
  { q:'What is the main purpose of a stopping condition?', options:['Make the prompt longer.','Choose a vector database.','Decide when the agent should finish, fail or escalate.','Increase model temperature.'], answer:2, concept:'stopping-condition' },
  { q:'RAG primarily helps a model by…', options:['Retraining it on every question.','Retrieving relevant external information before generation.','Giving it unrestricted tool permissions.','Creating multiple agents automatically.'], answer:1, concept:'rag' },
  { q:'MCP is best described as…', options:['A replacement for all APIs.','A standard way for AI applications to connect to external tools and resources.','A vector embedding model.','A type of human approval workflow.'], answer:1, concept:'mcp' },
  { q:'Which is the clearest example of loop engineering?', options:['Writing a longer system prompt.','Adding a blue UI theme.','Designing verification, retry budgets and exit conditions around repeated agent actions.','Using a bigger context window.'], answer:2, concept:'loop-engineering' },
  { q:'Why is least privilege important for agents?', options:['It makes models generate faster.','It gives agents only the permissions they actually need.','It guarantees no prompt injection.','It eliminates the need for evaluation.'], answer:1, concept:'least-privilege' },
  { q:'What does trajectory evaluation inspect?', options:['Only the final answer.','The full sequence of decisions and actions.','Only model cost.','Only retrieved documents.'], answer:1, concept:'trajectory-evaluation' },
  { q:'When is a deterministic workflow often preferable?', options:['When every step requires open-ended judgment.','When the path is known, predictable and sensitive to mistakes.','When you want more agents.','When you cannot define any business rules.'], answer:1, concept:'deterministic-workflow' },
  { q:'Context rot refers to…', options:['A broken database server.','The model forgetting its training.','Performance degradation from noisy, stale or excessive context.','A failed API authentication token.'], answer:2, concept:'context-rot' },
  { q:'A supervisor-agent pattern is useful when…', options:['One model call is enough.','Distinct specialists need delegation and coordination.','No tool calls are allowed.','The system has no state.'], answer:1, concept:'supervisor-agent' }
];

export const quickPrompts = [
  'I am completely new',
  'How does an AI agent work?',
  'RAG vs MCP',
  'Show me a diagram',
  'Build my first agent',
  'Quiz me'
];

export const coreRibbon = ['agent','tool-use','working-memory','rag','mcp','agent-loop','multi-agent-system','agent-evaluation'];
