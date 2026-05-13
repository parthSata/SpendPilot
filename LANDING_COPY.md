# Landing copy — SpendPilot

Source of truth for **marketing strings** lives in React components under [frontend/src/components/features/home/](frontend/src/components/features/home/). This file is a **stable reference** for reviewers and for keeping messaging consistent across docs and screenshots.

## Hero

| Element | Copy (approx.) | Component |
|---------|----------------|-----------|
| Eyebrow | `New · GPT-5 & Claude 4.5 pricing supported` | [HeroSection.tsx](frontend/src/components/features/home/components/HeroSection.tsx) |
| H1 | `Stop overpaying` / `for AI tools.` | Same |
| Subhead | SpendPilot audits every AI subscription and API across your team in under 2 minutes — and shows you exactly where to cut without losing velocity. | Same |
| Primary CTA | `Start Free Audit` → `/audit` | Same |
| Secondary CTA | `See sample report` or `See your last report` (device) → `/results?shareId=…` | Same (`useDefaultResultsShareId`) |
| Trust chips | `Free forever` · `No credit card` · `SOC 2 ready` | Same |

## Bottom CTA band

| Element | Copy | Component |
|---------|------|-----------|
| H2 | `Find your AI savings in 2 minutes` | [CtaSection.tsx](frontend/src/components/features/home/components/CtaSection.tsx) |
| Sub | `Free audit. No signup required to see your results.` | Same |
| Button | `Start Free Audit` | Same |

## Saved audits (home)

| Element | Copy | Component |
|---------|------|-----------|
| Section title | `Your saved audits` | [SavedReportsSection.tsx](frontend/src/components/features/home/components/SavedReportsSection.tsx) |
| Sub | Reports you generated on this device — open any past run. | Same |

## How it works (home)

Step titles/descriptions are defined in [useLandingPage.ts](frontend/src/hooks/useLandingPage.ts) (`flowSteps`).

## Footer — Product links

- `Run audit` → `/audit`  
- `Sample results` / `Your last results` → `/results` with resolved `shareId`  

[Footer.tsx](frontend/src/components/site/Footer.tsx)

## Voice & tone

- **Direct, finance-friendly:** prefer numbers and constraints over hype.  
- **Honest limits:** we do not claim live billing access in MVP; privacy note on audit page reinforces that.

## Changelog

When you change hero or CTA copy, update this file in the same PR so assessment docs stay aligned.
