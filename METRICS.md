# Metrics — SpendPilot

Definitions for **product and funnel** measurement. Instrumentation (Posthog, Plausible, GA4, etc.) is not wired in this MVP repo; this doc is the **spec** for when you add analytics.

## North Star (suggested)

**Meaningful audits completed per week** — audit where `totalMonthlySpend > 0` and user reached the results screen (client or server event).

_Rationale:_ Raw page views inflate vanity; “completed audit” correlates with value delivered.

## Funnel events

| Step | Event name (suggested) | Definition |
|------|------------------------|------------|
| Land | `landing_view` | `/` loaded |
| Start audit | `audit_start` | `/audit` step 0 viewed |
| Complete wizard | `audit_submit` | POST `/audit/run` success |
| View results | `results_view` | `/results` with valid payload (API or local/sample) |
| Share | `share_copy` | User copied share URL (if tracked in UI) |
| Lead | `lead_submit` | Consultation / email modal success |

## Activation

**Activated user:** completed ≥1 audit **and** returned within 7 days OR opened a saved report from the homepage list.

## Quality / trust metrics

| Metric | Why it matters |
|--------|----------------|
| **% audits with `keep_plan` rows** | Sanity check: not everyone should be “downgrade everything” |
| **Error rate on `audit/run`** | API validation, CORS, or payload issues |
| **Time to first result** | Median duration from `audit_start` to `results_view` |

## Guardrails

- Do not log **raw emails** or **full audit payloads** to third-party analytics without DPA and user notice.
- Prefer **hashed shareId** or internal `auditId` only if events need correlation.

## Success criteria (example targets, pre-scale)

- **Completion rate:** >40% of `audit_start` → `audit_submit` (after UX stabilizes).  
- **Return rate:** >15% of completers open results again within 14 days (localStorage list helps).

## Related docs

- [GTM.md](GTM.md) — who we optimize the funnel for.  
- [USER_INTERVIEWS.md](USER_INTERVIEWS.md) — qualitative validation.  
- [DEVLOG.md](DEVLOG.md) — shipped changes that may affect baselines.
