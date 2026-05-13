# Deployment notes

SpendPilot is designed to run as a **static frontend** (e.g. Vercel) plus a **Node API** (e.g. Render) with **MongoDB Atlas**.

## Frontend (Vercel)

- Build: `cd frontend && npm run build`
- Output: see [frontend/vercel.json](frontend/vercel.json) (`dist/client` + SPA rewrites).
- **Environment**
  - `VITE_API_BASE_URL` — full base to the API, e.g. `https://your-api.onrender.com/api`
  - Optional: `VITE_GROQ_API_KEY`, `VITE_GROQ_MODEL` for in-browser audit summary generation (see [frontend/.env.example](frontend/.env.example)).

Redeploy after any change to `VITE_*` variables (they are baked in at build time).

## Backend (Render or similar)

- Start: `cd backend && npm start` (runs `node src/index.js`).
- Listen: production binds `0.0.0.0` so the platform can route traffic.
- **Environment** (see [backend/.env.example](backend/.env.example))
  - `MONGO_URI` — **must** be a reachable Atlas URI in production (not `127.0.0.1` on the host).
  - `FRONTEND_ORIGIN` — comma-separated allowed web origins for CORS (include your Vercel URL, no trailing slash inconsistency if your app normalizes it).
  - `PORT` — set to the port your host injects (e.g. Render’s `PORT`).
  - Optional: `GEMINI_API_KEY`, `GEMINI_MODEL` for server-side audit summaries; `RESEND_*` for email flows if enabled.

## Smoke checks

1. `GET /api/health` (or your health route) returns OK from the deployed API.
2. From the deployed site, run an audit and confirm `POST .../audit/run` succeeds (watch browser network tab for CORS or 404 base URL mistakes).
3. Open a shared result: `/results?shareId=<id>` or public `/report/<id>` as implemented in your build.

## Related docs

- [ARCHITECTURE.md](ARCHITECTURE.md) — request flow and persistence.
- [DEVLOG.md](DEVLOG.md) — what shipped when (with GitHub link).
