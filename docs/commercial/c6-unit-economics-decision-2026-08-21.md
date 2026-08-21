# C6 Commercial Unit Economics Decision — 2026-08-21

## Decision

**KEEP the current canonical package prices for now:**

| Package | Monthly | Annual |
|---|---:|---:|
| Lead | R0 | R0 |
| Diamond | R4,995 | R49,950 |
| Gold | R9,995 | R99,950 |
| Platinum | R24,995 | R249,950 |
| Enterprise | Custom | Custom |

No further price increase is justified until C6 has measured actual AI consumption, human delivery time, payment costs and acquisition cost per package.

## Why

The current package configuration is already productised around explicit AI allowances and support tiers. Diamond provides 5 business audits, 20 SEO analyses, 50 content generations and 500 chatbot messages; Gold increases these to 10, 100, 200 and 2,000 respectively; Platinum increases them to 50, 200, 500 and 10,000 and adds an AI staff member, BI dashboard, dedicated account management, phone support and custom integrations.

The current price ladder is therefore treated as a **commercial ceiling/floor hypothesis to validate**, not as a claim that AI usage alone costs the package price.

## External South African benchmarks reviewed

- Digital marketing packages commonly sit around R5,000–R8,000/month for starter, R8,000–R20,000/month for growth and R20,000+/month for premium programmes. Ad spend is generally separate. Source: Juicy Designs, updated June 2026.
- SEO benchmarks vary widely, but published 2026 ranges commonly put local/small-business SEO around R5,000–R12,000/month and growth/SME work around R8,000–R25,000/month. Sources: Juicy Designs and Honey Whale.
- AI chatbot services in South Africa range from low-cost FAQ bots to several thousand rand/month for multi-channel/pro implementations. Source: DoubleDown AI, January 2026.

These benchmarks support C6's current ladder as commercially plausible, but they do **not** prove C6's margins.

## Cost model to instrument

For every paying account, C6 must capture:

1. LLM input tokens and output tokens by provider/model.
2. Research/web-search/tool calls and their direct costs.
3. Chatbot message volume.
4. Content-generation volume.
5. SEO-analysis volume.
6. Business-audit volume.
7. Email/SMS/WhatsApp delivery costs where applicable.
8. Payment processing fees.
9. Human onboarding/support time.
10. Human implementation/custom integration time.
11. Hosting/database/storage cost attributable to the account.
12. Acquisition cost where measurable.

## Margin gates

Target gross margin before sales/marketing overhead:

- **Diamond:** >= 70%
- **Gold:** >= 75%
- **Platinum:** >= 70% despite higher service intensity
- **Enterprise:** individually costed; target >= 60% after direct delivery cost

These are management targets, not accounting statements.

## Pricing integrity rules

- AI may recommend a package, but must never invent a price.
- Prices come from the canonical package catalogue.
- Usage limits are hard controls unless explicitly configured as fair-use.
- Human-intensive work must not be silently bundled without a delivery-cost budget.
- Ad spend and third-party platform fees should be clearly separated where they are pass-through costs.
- Enterprise remains custom until scope and direct delivery cost are known.

## McDonald's/productisation principle

C6 should sell a repeatable outcome and a clearly bounded package, not hours of bespoke consulting. The package catalogue is the menu; AI discovery determines which menu item fits the business; the offer engine maps the diagnosis to that catalogue; checkout charges the canonical catalogue price.

The system should learn which package + intervention combinations produce the strongest customer outcomes and margins.

## Next instrumentation requirement

Before changing package prices again, implement a per-account **cost ledger** and run at least 10 real customer/account simulations or live accounts across Diamond, Gold and Platinum. Reprice from observed P50/P90 direct cost, not intuition.

## Decision log

**Decision owner:** FIRE / C6 commercial engineering
**Date:** 2026-08-21
**Status:** APPROVED — current prices retained pending measured unit economics
**Next gate:** Cost ledger + real usage evidence
