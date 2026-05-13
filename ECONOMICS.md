# Economics — SpendPilot

Rough **unit economics framing** for a hypothetical SaaS built on this audit MVP. Numbers are **illustrative** unless you replace them with real cohort data.

## Value created (buyer math)

- **Annualized savings surfaced** = `totalMonthlySavings × 12` from the audit engine (upper bound before execution risk).
- **Conservative take rate:** assume **25–40%** of “identified savings” actually lands in year one (process, contracts, partial adoption).

**Example:** If audit shows **$3,000/mo** savings → **$36k/yr** headline → **$9k–$14k/yr** realistic first-year value for a buyer.

## Pricing hypotheses (product)

| Model | When it fits | Notes |
|-------|----------------|-------|
| **Free audit + lead** | Current MVP | Consultation / paid tier for teams above savings threshold |
| **Seat-based SaaS** | Recurring audits, SSO, policy rules | e.g. $8–15/seat/mo for 50–500 seats (placeholder) |
| **Success fee** | Enterprise | % of realized savings — heavy legal/ops overhead |

## Cost structure (technical)

- **Variable:** LLM summaries (Gemini server, optional Groq client), email (Resend), DB read/write per audit.
- **Fixed:** Hosting (Vercel + Render-class), MongoDB Atlas tier, domain.

**Order-of-magnitude:** At low thousands of audits/month, infra + LLM often stays **sub hundreds $/mo** if summaries are rate-limited and cached per `shareId`.

## Gross margin (directional)

- If revenue is **software subscription**, gross margin target **75–85%** after infra + LLM.
- If revenue is **services**, margin lower; product should still **reduce delivery cost** via automated report.

## Payback (for a B2B buyer)

If SpendPilot (paid) costs **$500/mo** and credible savings are **$2,000/mo**, simple payback is **<1 month** on paper—execution and politics dominate in practice.

## What we do not claim in this repo

- We do not guarantee savings; we surface **catalog + rule-based** opportunities.
- See [PRICING_DATA.md](PRICING_DATA.md) for methodology limits.
