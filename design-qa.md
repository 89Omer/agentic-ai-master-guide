# Design QA

## Evidence

- Source visual truth: `design-reference-option-2.png`
- Implementation: `http://terminal.local:4173/`
- Intended viewport: desktop, 1440 × 1024 CSS pixels at 1× density
- Source pixels: 1488 × 1058
- Implementation pixels: unavailable
- State: home route, default state
- Full-view comparison: blocked because the in-app browser could not capture the rendered implementation.
- Focused-region comparison: not performed because browser-rendered evidence is unavailable.

## Findings

- [P0] Browser-rendered implementation evidence is unavailable
  - Location: home route and responsive states.
  - Evidence: the source mock is available, the local server responds, the smoke tests pass, and the production build completes; however, the required in-app browser connection rejects capture before navigation.
  - Impact: typography, exact spacing, overflow, responsive behavior, and interaction states cannot be visually compared to the selected mock.
  - Fix: capture the running site at 1440 × 1024 and 390 × 844, test primary navigation and the guide panel, check console errors, then compare the desktop capture side-by-side with `design-reference-option-2.png`.

## Required Fidelity Surfaces

- Fonts and typography: implemented with the existing system-font stack; visual fidelity not yet verified.
- Spacing and layout rhythm: implemented for desktop, tablet, and mobile; visual fidelity not yet verified.
- Colors and visual tokens: implemented with pale sage, deep evergreen, cobalt, clay, and ochre tokens; rendered contrast not yet verified.
- Image quality and asset fidelity: the generated living-systems illustration is present as an optimized 90 KB JPEG; crop and display sharpness not yet verified in-browser.
- Copy and content: implementation includes the selected concept-map framing, learning paths, local-first facts, and sustainability principles.

## Primary Interactions

- Automated data and smoke checks: passed.
- Explore map navigation: not browser-tested.
- Ask the guide panel: not browser-tested.
- Learning-path navigation: not browser-tested.
- Console errors: not checked because browser access is unavailable.

## Comparison History

- Initial implementation: built from selected ideation result 2.
- Functional verification: `npm test` passed.
- Production verification: `npm run build` passed.
- Visual iteration: blocked before the first browser comparison.

## Implementation Checklist

- Capture desktop and mobile rendered states.
- Test Explore map, Ask the guide, and all three learning-path rows.
- Check browser console errors.
- Compare the desktop capture with the selected source visual.
- Fix any P0/P1/P2 visual mismatches and repeat QA.

## Follow-up Polish

- Reassess the hero illustration crop and navigation density after browser capture.

final result: blocked
