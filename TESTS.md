# Tests

All automated tests run from the **backend** package.

## How to run

```bash
cd backend
npm run test
```

## Audit engine (usage-aware recommendations)

| File | What it covers |
|------|----------------|
| [backend/src/services/audit-engine.test.js](backend/src/services/audit-engine.test.js) | `planSupportsUsage` caps cheaper tiers by declared `light` / `medium` / `heavy` intensity; ChatGPT Plus is not downgraded to Free under **heavy** usage; **light** usage allows that downgrade; seat-only savings when plan change is blocked by intensity; OpenAI API aggressive tier drops blocked under **heavy** usage (heuristic); unknown tools → `insufficient_data`; `buildToolRecommendations` returns one coherent row per tool. |

Minimum **5** audit-engine scenarios are covered (the file contains **7** tests).

## Lint

```bash
cd backend
npm run lint
```
