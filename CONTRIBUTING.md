# Contributing

Contributions are welcome. The guide should stay understandable to someone who has never studied AI while remaining technically useful to advanced learners.

## Before opening a change

Run:

```bash
npm test
npm run build
```

For UI changes, check desktop and mobile layouts. For content changes, use the learning contract in `CONTENT-GUIDE.md`.

## Adding a concept

Add the concept to the appropriate category array in `src/data.js`. Give it a unique slug, a concise definition, a level, and search keywords. Add a custom detail block when the default category explanation is not specific enough.

## Design principles

- Conversation is the front door; the concept graph is the structure underneath.
- Teach the concept before teaching a framework.
- Prefer plain language without making the technical explanation inaccurate.
- Show an example and a failure mode, not only a definition.
- Keep consequential actions explicit and human-reviewable.
- Avoid adding interface panels simply to advertise features.
