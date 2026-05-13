# Reflection (Round 1)

Chronological build notes and follow-up work: **[DEVLOG.md](DEVLOG.md)** · Commits: **[github.com/parthSata/SpendPilot/commits/main](https://github.com/parthSata/SpendPilot/commits/main/)**

## 1. The hardest bug you hit this week, and how you debugged it

The hardest bug cluster was **deployment + pricing math**, not UI polish. On Render, the backend crashed with `MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`, which also caused “no open ports” because the process exited before `listen()`. Hypothesis A: MongoDB URI missing in Render — partially true when `.env` was never mapped. Hypothesis B: URI still pointed at localhost — confirmed from topology (`127.0.0.1:27017`). Fix path: create Atlas, whitelist `0.0.0.0/0` for the MVP, set `MONGO_URI` on Render, redeploy, bind `0.0.0.0` in production.

Later, while implementing **usage-aware recommendations**, Vitest showed OpenAI API “scale → starter” downgrades even under **heavy** usage. Hypothesis A: API guard was wrong — false; the guard was never firing. Hypothesis B: **per-seat prices were wrong** — true: `getPrice` treated the per-tool row map as if it were keyed by `toolId` again, so most lookups fell through to `globalPlanFallbacks` and produced nonsense prices. Fix: resolve `row = toolPricing[toolId]` once and use `getPriceForRow(row, plan)`. Re-ran Vitest until green. Lesson: when business logic looks “too good,” validate the smallest arithmetic layer first.

## 2. A decision you reversed mid-week, and what made you reverse it

Early in the week the audit engine optimized purely on **sticker price deltas** (“always pick the highest cheaper tier”). That maximized headline savings and looked exciting in screenshots, but it contradicted the assignment’s bar: a finance reviewer should agree. Real teams on **Plus/Pro** often run **high volume**; telling them to drop to **Free** is not a serious recommendation. The reversal was to add **self-reported usage intensity** and **plan capacity metadata** (`maxIntensity`) so “cheap” must pass a **fit gate** before it counts as savings. We traded viral-looking 100% savings numbers for **credible, partial savings** plus explicit “keep plan” outcomes.

## 3. What you would build in week 2

Week 2 would focus on **measurement, not more self-reporting**. Priorities: (1) import **last-30-day usage** from admin surfaces where available (OpenAI/Anthropic usage dashboards, Cursor team analytics where accessible) to replace intensity with **observed bands**; (2) model **effective monthly cost** for API workloads using token histograms + published list prices, not a single heuristic cap; (3) add **policy constraints** (SSO, retention, compliance) so “Team vs Business” is not purely a price question; (4) ship a **diff view** that shows what changes if the user rejects a specific recommendation, to support collaborative eng/finance review.

## 4. How you used AI tools (which tool, for what tasks, what you did not trust them with, and one time the AI was wrong)

Primary use was **Cursor agent mode** for refactors (splitting the audit engine into a pure module, wiring Vitest, and updating React props). Also used for drafting **markdown architecture/test docs** faster. I did **not** trust models for **vendor pricing truth** or for **legal/compliance claims** about what a plan includes — those require primary sources and careful wording.

One concrete wrong suggestion: while designing copy, the model proposed aggressive “**move everyone to free**” language as a default CTA. That contradicts the product goal (trust + lead quality). The correction was to bake **non-contradiction rules** into the Gemini prompt and fallback summary so “keep_plan” rows are acknowledged, not overwritten by generic savings hype.

## 5. Self-rating on a 1–10 scale for each dimension (one sentence each)

- **Discipline (7/10):** Work was structured around deployability and testability, but not every day had equal depth.
- **Code quality (7/10):** Separation of pure audit logic from Express improves readability and test coverage, though ESLint v9 config migration is still pending in this repo.
- **Design sense (7/10):** Added intensity controls and recommendation badges so dense finance text is scannable without losing the premium visual language.
- **Problem solving (8/10):** Found and fixed a subtle pricing lookup bug that invalidated API downgrade guardrails until tests caught it.
- **Entrepreneurial thinking (7/10):** Treated “savings” as a trust asset: better to show **smaller true savings** than fictional 100% downgrades that would embarrass a sales follow-up.
