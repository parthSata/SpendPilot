# Contributing

This repo is a focused assessment / portfolio project. Small, reviewable changes are preferred.

## Workflow

1. Branch from `main`, keep commits scoped (feat/fix/docs/chore prefixes are fine).
2. Run checks before opening a PR:
   - **Backend:** `cd backend && npm test && npm run lint`
   - **Frontend:** `cd frontend && npx tsc --noEmit` (and `npm run lint` if you touched TS/TSX).
3. Describe **what** and **why** in the PR body; link issues or briefs if applicable.

## Code conventions

- **Backend:** layered Express handlers → services → models; validate request bodies (Zod where used).
- **Frontend:** feature folders under `src/components/features`, shared UI under `src/components/ui`, hooks under `src/hooks`.
- **Pricing:** when you add or rename plans, update **both** [backend/data/pricing/plans.json](backend/data/pricing/plans.json) and [frontend/src/lib/pricing/plan-fit.ts](frontend/src/lib/pricing/plan-fit.ts), and extend [PRICING_DATA.md](PRICING_DATA.md) with sources or “illustrative anchor” notes.

## Documentation

- Notable behavior or ship changes: add a dated entry to [DEVLOG.md](DEVLOG.md) and link [commit history](https://github.com/parthSata/SpendPilot/commits/main/) when it helps reviewers.

## Security

- Do not commit real API keys or database credentials.
- Rotate any key that was ever pasted into chat or committed by mistake.
