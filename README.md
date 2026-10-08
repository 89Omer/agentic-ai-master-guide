# Agentic AI Master Guide

Most agentic AI guides are reading lists with diagrams. This one makes you run experiments.

The **Research Lab** follows a research loop: **Question → Hypothesis → Experiment → Trace → Metric → Failure**. Learners A/B test clear versus vague tool descriptions, repeat runs to expose the worst case, and break agents with prompt injection and poisoned memory. These are failure modes people usually learn the hard way, in production.

Everything runs in the browser. No API key, no backend, no sign-up, so it works on locked-down student machines too.

**Live site:** https://89omer.github.io/agentic-ai-master-guide/

## What is included

- A browser-local **Research Lab** with Agent Observatory, Tool A/B testing, Planning Strategy comparison, Repeated-Run reliability evaluation, Break the Agent adversarial experiments, and a Long-Horizon changing-environment simulation.
- **183 connected concepts** across AI foundations, agents, tools/protocols/interoperability, memory and RAG, loop engineering, multi-agent systems, agent engineering, safety, and evaluation.
- **Ask the guide**: type a question and a local keyword-and-intent matcher points you to the relevant concepts. It is search, not a chatbot. There is no model behind it.
- **Beginner, Developer, and Researcher** learning paths with browser-saved progress.
- Concept lessons using a consistent teaching pattern: explanation, why it matters, how it works, visual model, example, failure mode, practice, and next concepts.
- **Simple, Developer, and Research** depth modes on concept pages, including implementation prompts, research questions, evaluation methods, maturity labels, and suggested references.
- Interactive **Agent Loop, Tool Routing, RAG, and Human Approval** playgrounds.
- Optional shared **read counts and Most Read analytics** using GoatCounter, with no analytics enabled until a site code is configured.
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

The smoke tests validate the core guide, RAG answer layer, Research Lab, analytics modules, and JavaScript syntax before deployment. The build command creates a deployable `dist/` directory and, when analytics is configured, refreshes the Most Read dataset.

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

## Views and Most Read analytics

Analytics is **disabled by default**. Once a GoatCounter site code is configured, the guide can show:

- concept-level read counts
- total recorded site reads in the footer
- a **Most Read** homepage section
- **Most read** sorting in Explore Concepts
- SPA pageview tracking for the guide's hash routes

The Pages workflow also runs every six hours so the cached Most Read ranking can refresh without requiring a code change.

See **`ANALYTICS-SETUP.md`** for the one-time setup and configuration options.

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
- `src/research-concept-mode.js` — Simple / Developer / Research lesson modes and Research Lab entry points.
- `src/research-lab.js` / `src/research-lab.css` — Research Lab page integration and visual layer.
- `src/analytics-config.js` — optional public analytics configuration.
- `src/analytics.js` / `src/analytics.css` — SPA tracking, concept counts, site totals, Most Read UI, and popularity sorting.
- `scripts/build-popular.mjs` — build-time aggregation of weekly concept counts.

## Guide behavior

The Guide is intentionally browser-local. It uses concept titles, aliases, keywords, descriptions, and lightweight intent rules to answer common questions, compare concepts such as **RAG vs MCP**, recognise beginner intent, switch users into quiz/practice journeys, rank concepts, and navigate learners to relevant lessons.

This avoids shipping an OpenAI, Anthropic, Gemini, or other provider key to a public GitHub Pages site. A server-backed AI mode can be added later without replacing the learning system.

## Visual direction

The UI is inspired by the spacious, component-led visual language of the public Astryx design-system site while using original layouts, content, interaction patterns, and learning components for the Agentic AI Master Guide.

## Roadmap

Useful next additions include real optional model-backed experiments behind a safe server boundary, richer concept-level citations, exportable experiment results, community benchmark packs, more environment simulations, and accessibility/localisation passes.
