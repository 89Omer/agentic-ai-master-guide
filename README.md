# Agentic AI Master Guide

An open-source, interactive learning guide that teaches Agentic AI from first principles to advanced agent systems. The interface is conversation-led: learners can ask what they want to understand, get matched to the right concepts, jump directly into an explanation, and practise through interactive simulations.

## What is included

- **136 connected concepts** across AI foundations, agents, tools and MCP, memory and RAG, loop engineering, multi-agent systems, safety, and evaluation.
- A **local Guide** that maps natural-language questions to relevant concepts without an API key or backend.
- **Beginner, Developer, and Researcher** learning paths with browser-saved progress.
- Concept lessons using a consistent teaching pattern: explanation, why it matters, how it works, visual model, example, failure mode, practice, and next concepts.
- Interactive **Agent Loop, Tool Routing, RAG, and Human Approval** playgrounds.
- **8 guided projects** and a built-in quiz.
- Responsive desktop/mobile UI and hash routing that works on GitHub Pages.
- Zero runtime dependencies and no exposed AI provider keys.

## Run locally

Requires Node.js 18+.

```bash
npm run dev
```

Open `http://localhost:4173`.

To use another port:

```bash
npm run dev -- --port 8080
```

## Test and build

```bash
npm test
npm run build
```

The build command creates a deployable `dist/` directory.

## Deploy to GitHub Pages

1. Create a GitHub repository and push this project to the `main` branch.
2. In the repository, open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main` or manually run the included **Deploy Agentic AI Master Guide to GitHub Pages** workflow.
5. GitHub will publish the generated `dist/` site.

The app uses hash routes (`#/concept/...`) so direct navigation works on project GitHub Pages without server rewrite rules.

## Font

The design uses this CSS font stack:

```css
font-family: Aptos, "Aptos Display", "Segoe UI", Arial, sans-serif;
```

Aptos is **not bundled** with this repository. Devices that already have Aptos installed use it automatically; other devices fall back to Segoe UI or Arial. This keeps the public project free from redistributing proprietary font files.

## Content architecture

Concept content lives in `src/data.js`. A concept includes:

- title and short definition
- level and category
- keywords used by the Guide search
- analogy / 30-second explanation
- why it matters
- how it works
- example
- common mistake
- when to use it
- practice task

Learning paths, projects, quizzes, and quick prompts are defined in the same file so contributors can extend the guide without changing the rendering system.

## Guide behavior

The Guide is intentionally browser-local in this version. It uses concept titles, aliases, keywords, descriptions, and lightweight intent rules to:

- answer common “what is…” questions
- compare concepts such as **RAG vs MCP**
- recognise beginner intent
- switch users into quiz or practice journeys
- rank concepts for open-ended questions
- navigate learners to the relevant lesson

This design avoids shipping an OpenAI, Anthropic, Gemini, or other provider key to a public GitHub Pages site. A server-backed AI mode can be added later without replacing the learning system.

## Visual direction

The UI is inspired by the spacious, component-led visual language of the public Astryx design-system site while using original layouts, content, interaction patterns, and learning components for the Agentic AI Master Guide.

## Repository structure

```text
agentic-ai-master-guide/
├── .github/workflows/pages.yml
├── public/
│   └── assets/
├── scripts/
│   ├── build.mjs
│   ├── dev-server.mjs
│   └── smoke-test.mjs
├── src/
│   ├── app.js
│   ├── data.js
│   └── styles.css
├── index.html
├── CONTRIBUTING.md
├── CONTENT-GUIDE.md
├── LICENSE
└── package.json
```

## Roadmap

Useful next additions include richer diagram libraries, more project-specific sandboxes, optional server-backed AI tutoring, concept-level citations/references, importable community lesson packs, and accessibility/localisation passes.
