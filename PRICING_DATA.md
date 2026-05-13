# SpendPilot Pricing Data Catalog

Related: [DEVLOG.md](DEVLOG.md) · [ARCHITECTURE.md](ARCHITECTURE.md)

This document tracks the official pricing sources used for AI Spend Audit recommendations. All **list** prices are verified as of May 11, 2026. Some **extended** plan keys in the app (below) are **illustrative monthly anchors** for comparison when vendors publish usage-based or custom pricing — they are labeled in code comments and should be re-checked before any contractual use.

| Tool | Official Pricing URL | Last Verified | Notes |
| :--- | :--- | :--- | :--- |
| **Cursor** | [cursor.com/pricing](https://www.cursor.com/pricing) | 2026-05-11 | Pro at $20/mo, Business at $40/mo |
| **GitHub Copilot** | [github.com/features/copilot#pricing](https://github.com/features/copilot#pricing) | 2026-05-11 | Individual ($10), Business ($19), Enterprise ($39) |
| **Claude** | [anthropic.com/pricing](https://www.anthropic.com/pricing) | 2026-05-11 | Pro ($20), Max ($100), Team ($30) |
| **ChatGPT** | [openai.com/chatgpt/pricing/](https://openai.com/chatgpt/pricing/) | 2026-05-11 | Plus ($20), Team ($30) |
| **Google Gemini** | [gemini.google.com/advanced](https://gemini.google.com/advanced) | 2026-05-11 | Advanced ($20), Business ($24) |
| **OpenAI API** | [openai.com/api/pricing/](https://openai.com/api/pricing/) | 2026-05-11 | Usage-based tiers (50/200/500 benchmarks) |
| **Anthropic API** | [anthropic.com/api](https://www.anthropic.com/api) | 2026-05-11 | Usage-based tiers (30/150 benchmarks) |
| **Windsurf** | [codeium.com/windsurf/pricing](https://codeium.com/windsurf/pricing) | 2026-05-11 | Pro ($15), Team ($30) |

### Extended catalog keys (illustrative anchors)

These appear in [frontend/src/lib/pricing/pricing.ts](frontend/src/lib/pricing/pricing.ts) and [backend/src/services/audit-engine.js](backend/src/services/audit-engine.js) so the wizard can model **ChatGPT API direct**, **Claude Enterprise / API direct**, **Gemini Ultra**, and **Gemini API** style selections. Dollar values are **placeholders for relative tier ordering**, not vendor quotes — replace with your own benchmarks after validating against invoices.

| Product line | Key(s) | Intent |
|--------------|--------|--------|
| ChatGPT | `enterprise`, `api_direct` | Team/contract vs API-style monthly anchor |
| Claude | `enterprise`, `api_direct` | Enterprise vs API-style anchor |
| Gemini | `ultra`, `api` | Higher consumer tier vs API usage anchor |

## Audit Methodology

- **Wasted seats:** `max(0, tool_seats − team_size)` — billed seats above headcount.
- **Declared spend override:** Users may enter **current monthly spend** per tool; when set, that value is sent as `monthlySpend` for the audit row instead of plan × seats alone.
- **Plan price deltas:** Official per-seat (or tier list) prices from the URLs above; see [backend/data/pricing/plans.json](backend/data/pricing/plans.json) for ordered tiers.
- **Usage intensity (self-reported):** `light` | `medium` | `heavy`. Each catalog plan includes `planFit.maxIntensity` — we **do not** recommend a cheaper plan if it cannot support the declared intensity (e.g. **Free** for **heavy** ChatGPT/consumer tiers).
- **API tier jumps:** For tools whose ids end with `_api`, **heavy** usage applies an extra guard so we do not recommend a single-step price drop that would likely be undone by overages (heuristic in code; not a vendor quote).
- **Defensibility:** Savings are either (1) seat reclamation, (2) a cheaper tier that still passes the intensity gate, or (3) explicitly **no plan change** with a written rationale — we avoid “free for everyone” unless the user declares **light** usage and the tier supports it.

### When we do NOT recommend downgrading

- Declared **heavy** usage and the only cheaper tiers have `maxIntensity` below `heavy`.
- Hosted API: monthly sticker-price improvement exceeds the conservative threshold in [backend/src/services/audit-engine.js](backend/src/services/audit-engine.js) for **heavy** workloads.
- Already on the lowest priced tier in our catalog for that product.
