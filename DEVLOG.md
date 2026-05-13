# SpendPilot — development log

Ongoing log of meaningful changes. Full commit history: **[github.com/parthSata/SpendPilot/commits/main](https://github.com/parthSata/SpendPilot/commits/main/)**.

---

## 2026-05-13

- **Usage-aware audit engine (milestone):** Pure `audit-engine.js` logic with plan capacity (`planFit.maxIntensity`), seat waste, and API-tier downgrade guardrails; Vitest coverage in `backend/src/services/audit-engine.test.js`. Aligns recommendations with self-reported **usage intensity** so “keep plan” outcomes are defensible.

---

## 2026-05-12

- **Audit architecture & recommendations:** Wiring between Express audit routes, Mongo persistence, and frontend audit/results flows; usage-aware recommendation display on review and results.
- **Vercel:** `frontend/vercel.json` — build command and SPA rewrites for client routing.
- **Environment & CORS:** `FRONTEND_ORIGIN` and related config for production frontends (e.g. Vercel) talking to the API.
- **Frontend polish:** Favicon helpers for floating tool icons, pricing catalog expansion in the audit wizard.

---

## 2026-05-10

- **Audit generation service:** `POST /api/audit/run`, shared report storage, **Gemini**-backed executive summaries on the server (with fallback copy when the model or key is unavailable).
- **Pricing engine:** Centralized tool/plan data and client-side preview math aligned with backend heuristics.
- **Reporting:** Public/share flow and results UI consuming the audit API.

---

## 2026-05-08

- **Audit end-to-end:** Backend audit routes and frontend audit UX tied together; environment and API base URL patterns for local vs deployed stacks.

---

## 2026-05-07

- **Monorepo bootstrap:** Initial Express backend (models, routing, env) and Vite + React frontend with shared component patterns.

---

## Product / UX follow-ups (tracked in repo; may land between commits)

- **Shareable sample:** Built-in `shareId=sample` demo data and `fetchAuditForDisplay` so landing CTAs work without a DB row.
- **Offline / device reports:** `localStorage` persistence after a successful audit; `/results` defaults to latest saved id, then sample; homepage **Saved audits** list and hero/footer CTAs use `useDefaultResultsShareId`.
- **Assignment-aligned form:** Per-tool optional **declared monthly spend**, extended plan options (e.g. API direct / enterprise anchors), primary use cases **coding / writing / data / research / mixed**.
- **Abuse friction:** Optional honeypot `website` field on audit POST (must be empty).
- **Client summary:** Groq-backed browser summary with fallback text aligned to `recommendationType` (no contradictory “downgrade” vs “keep” copy).
- **UI performance:** Lighter Framer transitions on the audit tools step; savings sidebar uses `$0` for zero savings via `formatSavingsUsd`.

---

## How to use this file

- For **architecture and data flow**, see [ARCHITECTURE.md](ARCHITECTURE.md).
- For **pricing sources and methodology**, see [PRICING_DATA.md](PRICING_DATA.md).
- For **tests**, see [TESTS.md](TESTS.md).
- For **retrospective notes**, see [REFLECTION.md](REFLECTION.md).
- For **LLM prompts**, see [PROMPTS.md](PROMPTS.md).
- For **GTM / economics / research / copy / metrics**, see [GTM.md](GTM.md), [ECONOMICS.md](ECONOMICS.md), [USER_INTERVIEWS.md](USER_INTERVIEWS.md), [LANDING_COPY.md](LANDING_COPY.md), [METRICS.md](METRICS.md).
- For **ship checklist**, see [DEPLOYMENT.md](DEPLOYMENT.md).
