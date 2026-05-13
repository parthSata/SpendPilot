# Prompts (LLM)

This file documents **production-facing prompts** used in SpendPilot. Source of truth remains the code paths cited below.

---

## 1. Server — Gemini executive summary (audit run)

**Where:** [backend/src/services/audit.service.js](backend/src/services/audit.service.js) (`buildGeminiSummary`)

**Input:** JSON payload with `teamSize`, `primaryUseCase`, `usageIntensity`, `totalMonthlySpend`, `totalMonthlySavings`, `totalAnnualSavings`, and `recommendations` (full tool rows including `recommendationType`).

**Prompt (paraphrased structure):**

```
You are SpendPilot's audit assistant. Return a concise 3-4 sentence executive summary.
Input:
<JSON payload>
Rules:
- mention estimated monthly and annual savings
- highlight top 2 opportunities
- if any recommendationType is "keep_plan" with monthlySavings 0, acknowledge that heavy usage can block naive downgrades
- do not claim blanket downgrades if tools are marked keep_plan
- keep tone practical and direct
- no markdown
```

**Fallback:** If `GEMINI_API_KEY` is missing or the call fails, a **deterministic string** is built in `buildFallbackSummary` (same file) from savings totals and top tool lines.

---

## 2. Client — Groq chat summary (results page)

**Where:** [frontend/src/hooks/useAISummary.ts](frontend/src/hooks/useAISummary.ts)

**Endpoint:** `https://api.groq.com/openai/v1/chat/completions`  
**Default model:** `llama-3.1-8b-instant` (override `VITE_GROQ_MODEL`)

**User message (template):**

```
You are an AI infrastructure cost consultant.
Write a professional audit summary in exactly 3 short paragraphs (~100 words total).

Data:
- Current monthly AI tool spend: $<totalSpend>
- Potential monthly savings identified: $<totalSavings>
- Per-tool signals (plan labels must match this list; do not contradict a "keep" with a "downgrade" for the same tool): <recsText>

Paragraph 1: Summarize current spend.
Paragraph 2: Describe the optimization opportunities (respect keep_plan vs downgrade_plan).
Paragraph 3: Expected outcome if changes are made.

Rules: Prose only. No bullet points. No headers. Professional tone. Under 120 words total.
```

`recsText` is built from each tool: `Name: currentPlan → suggestedPlan (recommendationType), save $X/mo`.

**Fallback:** On missing key, rate limits, or errors, `applyFallback()` generates copy keyed off `recommendationType` (keep vs reduce_seats vs downgrade) so the summary does not contradict the table.

---

## Prompt hygiene (for reviewers)

- Do not paste live API keys into this file or into chat.
- When changing rules, update **both** the prompt and any **fallback** path so offline and error paths stay aligned.
