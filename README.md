# SpendPilot

SpendPilot is a small full-stack app that helps teams **estimate AI tool spend**, run a **guided audit**, and get **shareable results** with per-tool recommendations grounded in catalog pricing and usage assumptions.

**Repository:** [github.com/parthSata/SpendPilot](https://github.com/parthSata/SpendPilot) · **Commit history:** [commits on `main`](https://github.com/parthSata/SpendPilot/commits/main/)

## Monorepo layout

| Path | Role |
|------|------|
| [frontend/](frontend/) | Vite + React + TanStack Router UI |
| [backend/](backend/) | Express API, MongoDB, audit engine |

## Quick start (local)

**Backend** (from repo root):

```bash
cd backend
cp .env.example .env
# Set MONGO_URI (Atlas recommended), FRONTEND_ORIGIN, and optional GEMINI_* / RESEND_* as needed
npm install
npm run dev
```

Default API port is **5000** (see `backend/src/config/env.js`); override with `PORT` in `.env`.

**Frontend:**

```bash
cd frontend
cp .env.example .env
# Point VITE_API_BASE_URL at your API, e.g. http://localhost:5000/api
npm install
npm run dev
```

## Documentation index

### Assessment / product bundle

| Doc | Purpose |
|-----|---------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System diagram, data flow, scale notes |
| [DEVLOG.md](DEVLOG.md) | Timeline of features and fixes (links to GitHub commits) |
| [REFLECTION.md](REFLECTION.md) | Retrospective (bugs, tradeoffs, AI use) |
| [TESTS.md](TESTS.md) | How to run backend Vitest, lint, frontend typecheck |
| [PRICING_DATA.md](PRICING_DATA.md) | Vendor URLs, methodology, illustrative tier notes |
| [PROMPTS.md](PROMPTS.md) | Gemini (server) and Groq (client) prompt specs + fallbacks |
| [GTM.md](GTM.md) | Positioning, ICP, channels |
| [ECONOMICS.md](ECONOMICS.md) | Unit economics framing and pricing hypotheses |
| [USER_INTERVIEWS.md](USER_INTERVIEWS.md) | Interview guide + hypothesis log |
| [LANDING_COPY.md](LANDING_COPY.md) | Landing page copy map → React components |
| [METRICS.md](METRICS.md) | North star and funnel event spec |

### Engineering extras

| Doc | Purpose |
|-----|---------|
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production env, Vercel + API host |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Conventions and PR checklist |
| [SUBMISSION_EMAIL.md](SUBMISSION_EMAIL.md) | Email template for handing in the assessment |

## License

Private / assessment project unless otherwise stated by the author.
