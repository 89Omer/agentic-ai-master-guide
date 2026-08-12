# Agentic AI Master Guide

An open-source, interactive learning guide that teaches Agentic AI from first principles to advanced agent systems. The interface is conversation-led: learners can ask what they want to understand, get matched to the right concepts, jump directly into an explanation, practise through interactive simulations, and run small experiments on agent behaviour.

## What is included

- **183 connected concepts** across AI foundations, agents, tools/protocols/interoperability, memory and RAG, loop engineering, multi-agent systems, agent engineering, safety, and evaluation.
- A **local Guide** that maps natural-language questions to relevant concepts without an API key or backend.
- **Beginner, Developer, and Researcher** learning paths with browser-saved progress.
- Concept lessons using a consistent teaching pattern: explanation, why it matters, how it works, visual model, example, failure mode, practice, and next concepts.
- **Simple, Developer, and Research** depth modes on concept pages, including implementation prompts, research questions, evaluation methods, maturity labels, and suggested references.
- Interactive **Agent Loop, Tool Routing, RAG, and Human Approval** playgrounds.
- A browser-local **Research Lab** with Agent Observatory, Tool A/B testing, Planning Strategy comparison, Repeated-Run reliability evaluation, adversarial failure experiments, and a Long-Horizon changing-environment simulation.
- Research-lab experiments expose **hypotheses, variables, trajectories, task success, groundedness, constraints, iterations, token/cost estimates, failure examples, and recovery behaviour**.
- **11 guided projects** and a built-in quiz.
- Modern production topics including **Harness Engineering, Context Compaction, Agent Skills, Long-Running Agents, Durable Execution, MCP lifecycle features, A2A, AG-UI, Agent Runtime, Guardrails, Red-Team Evaluation, and Agent Drift**.
- Responsive desktop/mobile UI and hash routing that works on GitHub Pages.
- Zero runtime dependencies and no exposed AI provider keys.

## Run locally

Requires Node.js 18+.

```bash
npm run dev
```

Open `http://localhost:4173`.

## Test and build

```bash
npm test
npm run build
```

The smoke tests validate the core guide, RAG answer layer, research-lab modules, and JavaScript syntax before deployment. The build command creates a deployable `dist/` directory.

## Deploy to GitHub Pages

1. Push this project to the repository's `master` branch.
2. In the repository, open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to `master` or manually run the included **Deploy Agentic AI Master Guide to GitHub Pages** workflow.
5. GitHub publishes the generated `dist/` site.

The app uses hash routes such as `#/concept/...` and `#/research-lab`, so direct navigation works on project GitHub Pages without server rewrite rules.

## Research Lab

The Research Lab changes the learning pattern from reading definitions to investigating agent behaviour:

**Question → Hypothesis → Experiment → Trace → Metric → Failure → Explanation**

The initial stations are:

- **Agent Observatory** — inspect a complete multi-step trajectory and open individual decisions.
- **Tool A/B** — compare clear vs ambiguous tool descriptions over a 20-request benchmark.
- **Planning Lab** — compare Direct, ReAct, Plan → Execute, and Planner + Verifier architectures as constraints increase.
- **Repeated Runs** — run the same simulated architecture 5, 10, or 20 times and inspect success, groundedness, iterations, cost, and the worst run.
- **Break the Agent** — test stopping failures, ambiguous tools, retrieved prompt injection, poisoned memory, and budget exhaustion, then apply a control and rerun.
- **Long-Horizon** — manage a workshop-planning agent while budget, availability, and accessibility constraints change during the run.

These are transparent browser simulations designed to teach architecture and evaluation. They do not claim to reproduce the stochastic behaviour of a specific hosted LLM.

## Font

The design uses this CSS font stack:

```css
font-family: Aptos, "Aptos Display", "Segoe UI", Arial, sans-serif;
```

Aptos is **not bundled** with this repository. Devices that already have Aptos installed use it automatically; other devices fall back to Segoe UI or Arial.

## Content architecture

- `src/data-base.js` — original foundations, learning paths, projects, quizzes, and detailed concept explanations.
- `src/production-concepts.js` — modern production Agentic AI, protocol, runtime, interoperability, guardrail, and evaluation concepts.
- `src/data.js` — integration layer that combines both sources into the live knowledge graph.
- `src/playground-context.js` — concept-aware practice routing.
- `src/rag-lab-upgrade.js` — local RAG retrieval-and-answer teaching layer.
- `src/research-state.js` — shared research-lab state and experiment metadata.
- `src/research-stations-a.js` / `src/research-stations-b.js` — experiment stations.
- `src/research-experiments.js` — station routing and event binding.
- `src/research-concept-mode.js` — Simple / Developer / Research lesson modes and research-lab entry points.
- `src/research-lab.js` / `src/research-lab.css` — Research Lab page integration and visual layer.

## Guide behavior

The Guide is intentionally browser-local. It uses concept titles, aliases, keywords, descriptions, and lightweight intent rules to answer common questions, compare concepts such as **RAG vs MCP**, recognise beginner intent, switch users into quiz/practice journeys, rank concepts, and navigate learners to relevant lessons.

This avoids shipping an OpenAI, Anthropic, Gemini, or other provider key to a public GitHub Pages site. A server-backed AI mode can be added later without replacing the learning system.

## Visual direction

The UI is inspired by the spacious, component-led visual language of the public Astryx design-system site while using original layouts, content, interaction patterns, and learning components for the Agentic AI Master Guide.

## Roadmap

Useful next additions include real optional model-backed experiments behind a safe server boundary, richer concept-level citations, exportable experiment results, community benchmark packs, more environment simulations, and accessibility/localisation passes.
