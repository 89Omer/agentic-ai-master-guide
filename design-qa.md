# Design QA — Agentic AI Master Guide

## Comparison target

- **Source visual truth:** `/mnt/data/agentic_ai_master_guide_homepage.png`
- **Implementation screenshot:** `/mnt/data/agentic-ai-master-guide/implementation-home-viewport.png`
- **Side-by-side comparison:** `/mnt/data/agentic-ai-master-guide/qa-compare.png`
- **Mobile implementation evidence:** `/mnt/data/agentic-ai-master-guide/implementation-mobile.png`
- **Viewport:** 1487 × 1058 CSS px, deviceScaleFactor 1
- **Source pixels:** 1487 × 1058
- **Implementation pixels:** 1487 × 1058
- **Density normalization:** none required; source and implementation were compared at equal pixel dimensions and DPR 1.
- **State:** public home screen, light theme, no assistant drawer open.

## Full-view comparison evidence

The final implementation preserves the source hierarchy and frame proportions: floating top navigation, oversized left hero statement, wide chat/search control, compact prompt chips, right-side Agent Loop teaching card, two-level concept map, six essentials cards, and three learning-path cards. The main desktop landmarks align closely with the reference: hero begins at y≈80, concept ribbon at y≈583, essentials cards at y≈752, and learning-path cards at y≈923.

A focused visual comparison was also made around the hero/search area, Agent Loop card, concept ribbon, essentials cards, and learning-path cards because these carry the strongest design identity.

## Required fidelity surfaces

### Fonts and typography

- CSS explicitly prefers `Aptos` / `Aptos Display`, as requested, then falls back to Segoe UI and Arial.
- The QA container does not have Aptos installed, so browser screenshots render with the fallback font. Font files are intentionally not bundled.
- Display scale, line height and three-line desktop hero wrapping were adjusted to match the selected design closely.
- **Status:** passed. Residual font-rendering difference is expected when Aptos is unavailable on the viewing device.

### Spacing and layout rhythm

- Desktop content widths and landmarks were iterated until the source and implementation align closely at the target viewport.
- The final implementation keeps the full learning-path cards inside the reference viewport, matching the source density.
- Responsive behavior was separately checked at 390 × 844.
- **Status:** passed.

### Colors and visual tokens

- Warm off-white canvas, white surfaces, black typography, restrained grey borders, blue primary action, and muted category accent surfaces match the selected direction.
- Category icons use distinct accent treatments rather than a monochrome dashboard palette.
- **Status:** passed.

### Image quality and asset fidelity

- The selected decorative blue-orb/cube imagery and learning-path illustrations were taken from the approved visual target and stored as raster assets.
- Standard interface icons use Font Awesome library SVG assets rather than hand-drawn replacements.
- Decorative crops were corrected to remove out-of-bounds black edges.
- **Status:** passed.

### Copy and content

- Hero copy, primary navigation, Agent Loop feature, concept categories and learning paths preserve the approved content direction.
- Product content was expanded beyond the mock to support the working guide: 136 concepts, lessons, projects, quizzes and playgrounds.
- **Status:** passed.

## Browser interaction verification

Browser-rendered interaction tests covered:

- Home rendering at 1487 × 1058.
- Guide query: `RAG vs MCP`, including comparison response.
- Beginner-intent route from `I am completely new`.
- Agent Loop concept navigation.
- Mark-as-learned local progress interaction.
- Concept search/filter for prompt injection.
- Beginner learning-path module rendering.
- Agent Loop playground execution.
- Tool Router selecting Calculator for a numeric request.
- RAG lab ranking the RAG chunk first for a RAG question.
- Human Approval approve state.
- Quiz answer and feedback state.
- Mobile rendering and mobile navigation at 390 × 844.
- Browser console errors checked: **none** in the passing interaction run.

The local zero-dependency development server was also checked over HTTP and returned the application successfully.

## Comparison history

### Iteration 1

Earlier findings:

- **P2:** hero typography and section rhythm made the page substantially taller than the source, pushing learning-path cards below the reference viewport.
- **P2:** the concept map was a flat row instead of the source’s two-level relationship layout.
- **P2:** a decorative crop extended outside the source image bounds and introduced a visible black strip.

Fixes made:

- Reduced desktop hero display scale and tightened vertical section rhythm.
- Rebalanced desktop content widths and card dimensions.
- Rebuilt the concept ribbon as a two-level map with Loop and Multi-Agent nodes above the core chain.
- Added accent treatment to library icons and icons inside the Agent Loop nodes.
- Recropped decorative imagery inside the source bounds.
- Shortened home-card copy to match the visual density of the approved direction.

Post-fix evidence:

- `implementation-home-viewport.png`
- `qa-compare.png`

### Iteration 2

Earlier finding:

- **P2:** learning-path illustrations were absent in the inline QA render even though the production paths were valid.

Fix made:

- Changed learning-path image selection to explicit asset paths, allowing both the production site and QA render to resolve the exact visual assets.

Post-fix evidence:

- Final `qa-compare.png` shows the plant, laptop and microscope learning-path illustrations.

## Findings

No actionable P0, P1 or P2 issues remain in the final comparison.

### Follow-up polish

- **P3:** the source mock contains decorative dotted orbital connector paths around the hero and more curved loop arrows; the implementation simplifies these so the interface remains clean and responsive.
- **P3:** quick-prompt chips use small text intent labels rather than the mock’s emoji-like mini illustrations.
- **P3:** devices without Aptos installed will see the Segoe UI/Arial fallback because Aptos font binaries are not distributed with the project.

## Implementation checklist

- [x] Selected visual recreated as a working responsive web interface.
- [x] Chat-led Guide works without an API key.
- [x] Concept navigation and local progress work.
- [x] Learning paths, projects, playgrounds and quiz work.
- [x] Desktop and mobile states rendered and checked.
- [x] GitHub Pages build/deploy workflow included.
- [x] No browser console errors in the passing QA run.

**final result: passed**
