# Go-to-market (GTM) — SpendPilot

High-level GTM sketch for the product as shipped in this repo (audit MVP + shareable report). Not a fundraising deck; a **channel and message** map.

## Positioning (one line)

**SpendPilot helps teams find credible savings on AI subscriptions and API spend in minutes—without connecting billing.**

## Ideal customer profile (ICP)

| Segment | Why now | Message |
|--------|---------|---------|
| **20–200 person tech companies** | Many seats across ChatGPT, Cursor, Copilot, Claude, APIs | “Seat + plan sanity in one pass” |
| **Finance / Ops partnering with Eng** | Needs defensible numbers, not hype | “Keep vs downgrade is explicit per tool” |
| **Agencies / consultancies** | Repeat audits for clients | “Shareable report link per engagement” |

## Channels (MVP → scale)

1. **Product-led:** Free audit, no signup for core flow; sample report + `shareId` for trust.
2. **Content:** Short posts on “what we actually check” (intensity, seat waste, plan fit) — ties to [PRICING_DATA.md](PRICING_DATA.md).
3. **Outbound (light):** Target heads of IT/Ops at Series A–B with one specific hook (“unused seats vs headcount”).
4. **Partners:** Dev-tool newsletters, finance-for-startups communities (only after stable deploy + privacy copy).

## Competitive angle (honest)

- **Vs generic expense tools:** We model **AI-native plans** (per-seat, API tiers) and usage gates—not only receipts.
- **Vs “AI says save 90%”:** We show **keep_plan** when intensity blocks naive downgrades—trust over virality.

## Risks to name in sales

- Self-reported usage and spend; not a live billing integration in this MVP.
- Illustrative anchors for some API/enterprise tiers — see [PRICING_DATA.md](PRICING_DATA.md).

## Next GTM experiments (week 2+)

- Optional **email capture** after results (already stubbed in UI patterns).
- **PDF export** for finance packets.
- **Slack one-pager** auto-summary for internal sharing.
