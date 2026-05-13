# User interviews — SpendPilot

This document supports the assessment deliverable: **how we learn from users** and what we would validate next.  
Sections marked **Hypothesis** are *not* presented as completed research—they are **targets for interviews**.

---

## Goals of research

1. Do buyers trust **self-reported** usage/seat inputs, or do they demand integrations?
2. Is the **primary buyer** Eng leadership, Finance, or IT/Ops?
3. Does **“keep plan”** messaging increase trust enough to share internally?

---

## Interview guide (30 min)

**Screener:** Role at 15–300 person company; owns or influences AI tool spend.

**Opening (2 min)**  
- “How do you currently track spend on ChatGPT / Copilot / Cursor / APIs?”

**Deep dive (20 min)**  
- Walk through last renewal or invoice surprise.  
- “When would a downgrade be politically impossible?” (security, compliance, feature parity)  
- “What would make you forward an audit to your CFO?”

**Close (5 min)**  
- “If this tool took 2 minutes and produced a shareable link, what would you need to see to act?”

**Consent:** Record only with permission; no PII in this repo.

---

## Hypothesis → what we’d listen for

| Hypothesis | Signal we’d treat as validation |
|------------|----------------------------------|
| Seat waste is the fastest win | Multiple unprompted stories of “we bought N seats and use M” |
| Finance distrusts “AI magic savings” | Requests for export, audit trail, source links (we surface sources per tool where configured) |
| Usage intensity is too fuzzy | Ask for CSV import or admin API within first session |

---

## Synthesized themes (placeholder)

_Replace this section after 5–8 interviews with real quotes (anonymized) and counts._

- Theme A — *TBD*  
- Theme B — *TBD*  
- Theme C — *TBD*

---

## Product implications (backlog)

- Integrations: read-only usage from vendor admin APIs (post-MVP).
- **Policy constraints:** SSO-required tiers, data residency (future rules engine).
- **Export:** PDF / Slack summary for internal circulation.

See also [METRICS.md](METRICS.md) for what we’d measure once interviews move to production traffic.
