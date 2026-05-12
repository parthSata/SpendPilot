# SpendPilot Pricing Data Catalog

This document tracks the official pricing sources used for AI Spend Audit recommendations. All pricing is verified as of May 11, 2026.

| Tool | Official Pricing URL | Last Verified | Notes |
| :--- | :--- | :--- | :--- |
| **Cursor** | [cursor.com/pricing](https://www.cursor.com/pricing) | 2026-05-11 | Pro at $20/mo, Business at $40/mo |
| **GitHub Copilot** | [github.com/features/copilot#pricing](https://github.com/features/copilot#pricing) | 2026-05-11 | Individual ($10), Business ($19), Enterprise ($39) |
| **Claude** | [anthropic.com/pricing](https://www.anthropic.com/pricing) | 2026-05-11 | Pro ($20), Team ($30) |
| **ChatGPT** | [openai.com/chatgpt/pricing/](https://openai.com/chatgpt/pricing/) | 2026-05-11 | Plus ($20), Team ($30) |
| **Google Gemini** | [gemini.google.com/advanced](https://gemini.google.com/advanced) | 2026-05-11 | Advanced ($20), Business ($24) |
| **OpenAI API** | [openai.com/api/pricing/](https://openai.com/api/pricing/) | 2026-05-11 | Usage-based tiers (50/200/500 benchmarks) |
| **Anthropic API** | [anthropic.com/api](https://www.anthropic.com/api) | 2026-05-11 | Usage-based tiers (30/150 benchmarks) |
| **Windsurf** | [codeium.com/windsurf/pricing](https://codeium.com/windsurf/pricing) | 2026-05-11 | Pro ($15), Team ($30) |

## Audit Methodology
- **Wasted Seats:** Calculated as `Math.max(0, Tool_Seats - Total_Team_Size)`.
- **Optimization:** Recommendations suggest downgrading to the highest possible tier that is still cheaper than the current plan.
- **Defensibility:** Every recommendation is backed by a specific seat count comparison or plan-price delta.
