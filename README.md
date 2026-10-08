# Agentic AI Master Guide

Most agentic AI guides are reading lists with diagrams. This one makes you build agents and watch them fail.

The **Workflow Builder** gives you a working agent design and a set of tests, and some of the tests fail. You read the trace, change the design (add a guardrail, raise top-k, set a stop rule, require approval) and run the tests again. The failures are the ones people usually meet in production: made-up answers, prompt injection from a retrieved page, poisoned memory, runaway loops and data sent to the wrong person.

Everything runs in the browser. No API key, no backend, no sign-up, so it works on locked-down student machines too.

**Live site:** https://89omer.github.io/agentic-ai-master-guide/

## What is included

- A **Workflow Builder** with six buildable patterns (router, RAG, tool-using agent, answer + critic, human approval, memory), each with a test suite, a step-by-step trace and a challenge.
- **183 connected concepts** across AI foundations, agents, tools/protocols/interoperability, memory and RAG, loop engineering, multi-agent systems, agent engineering, safety, and evaluation.
- **Ask the guide**: type a question and a local keyword-and-intent matcher points you to the relevant concepts. It is search, not a chatbot. There is no model behind it.
- **Beginner, Developer, and Researcher** learning paths with browser-saved progress.
- Concept lessons using a consistent teaching pattern: explanation, why it matters, how it works, visual model, example, failure mode, practice, and next concepts.
- **Simple, Developer, and Research** depth modes on concept pages, including implementation prompts, research questions, evaluation methods, maturity labels, and suggested references.
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

The smoke tests check the core guide and analytics modules, and run every Workflow Builder template through the engine to confirm it fails and gets fixed as designed. The build command creates a deployable `dist/` directory and, when analytics is configured, refreshes the Most Read dataset.

## Deploy to GitHub Pages

1. Push this project to the repository's `master` branch.
2. In the repository, open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to `master` or manually run the included **Deploy Agentic AI Master Guide to GitHub Pages** workflow.
5. GitHub publishes the generated `dist/` site.

The app uses hash routes such as `#/concept/...` and `#/build/rag`, so direct navigation works on project GitHub Pages without server rewrite rules.

## Workflow Builder

Open `#/build`. Each pattern comes with a starting design, a test suite and a challenge:

| Pattern | Starts at | What the failing tests teach |
|---|---|---|
| Router workflow | 3/4 | Route descriptions decide routing; unanswerable questions get made-up answers |
| RAG assistant | 1/4 | Top-k too low, a poisoned document, no grounding check |
| Tool-using agent | 2/4 | No stop rule (runaway loop), a web page that makes the agent email an attacker |
| Answer + critic | 2/3 | A critic improves coverage but cannot invent missing sources |
| Agent with human approval | 3/3 | Swap approval for an allowlist and a legitimate email gets blocked |
| Assistant with memory | 0/3 | One poisoned memory corrupts every answer |

Learners add, remove and reorder steps (Router, Tool, Answer, Agent loop, Critic, Guardrail), edit tool and route descriptions, and change settings such as top-k or maximum iterations. Every run reports pass/fail per test plus model calls, tool calls, estimated tokens and human reviews, so learners can compare designs on cost as well as correctness. Failure messages link back to the relevant concept page, and each concept page links to the matching pattern.

### How the simulated model works

There is no LLM behind the builder. The engine (`src/builder-engine.js`) uses a small, deterministic set of rules, and those rules are shown in the UI:

1. It chooses routes and tools by matching the request against the descriptions the learner wrote.
2. It splits a request into parts and works through them in order.
3. It answers only from its context, and makes up a confident answer for any part with no source.
4. It follows instructions found inside documents, web pages or memory unless a guardrail removed them.
5. Inside an agent loop it keeps trying while any part is unanswered; only a stop rule ends the loop.

Because the rules are fixed, every change in results comes from the learner's design rather than from randomness or results written in advance. Real models fail in messier and less predictable ways; the builder teaches the structural causes, not exact model behaviour.

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
- `src/builder-engine.js` — Workflow Builder execution engine and grader (no DOM; also used by the smoke tests).
- `src/builder-templates.js` — the fictional course handbook, pattern templates, test suites and concept-to-pattern mapping.
- `src/builder.js` / `src/builder.css` — Workflow Builder editor, test runner and trace view.
- `src/concept-modes.js` / `src/concept-modes.css` — Simple / Developer / Research lesson modes and builder entry points.
- `src/analytics-config.js` — optional public analytics configuration.
- `src/analytics.js` / `src/analytics.css` — SPA tracking, concept counts, site totals, Most Read UI, and popularity sorting.
- `scripts/build-popular.mjs` — build-time aggregation of weekly concept counts.

## Guide behavior

The Guide is intentionally browser-local. It uses concept titles, aliases, keywords, descriptions, and lightweight intent rules to answer common questions, compare concepts such as **RAG vs MCP**, recognise beginner intent, switch users into quiz/practice journeys, rank concepts, and navigate learners to relevant lessons.

This avoids shipping an OpenAI, Anthropic, Gemini, or other provider key to a public GitHub Pages site. A server-backed AI mode can be added later without replacing the learning system.

## Visual direction

The UI is inspired by the spacious, component-led visual language of the public Astryx design-system site while using original layouts, content, interaction patterns, and learning components for the Agentic AI Master Guide.

## Roadmap

Useful next additions include exporting a workflow as n8n JSON or Python code, more patterns (prompt chaining, orchestrator–workers, plan-and-execute), learner-written test cases, richer concept-level citations, and accessibility/localisation passes.
