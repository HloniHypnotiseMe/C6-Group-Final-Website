# C6 Commercial Pricing Decision — 2026-08-21

## Decision

Replace the previous placeholder/USD-derived package prices with a South African ZAR productised pricing ladder.

Canonical monthly prices:

| Package | Monthly | Annual cash price | Position |
|---|---:|---:|---|
| Lead | R0 | R0 | Acquisition / free audit entry |
| Diamond | R4,995 | R49,950 | Small-business digital/AI starter |
| Gold | R9,995 | R99,950 | Growth-stage SME |
| Platinum | R24,995 | R249,950 | High-touch growth + intelligence |
| Enterprise | Custom | Custom | Multi-location / bespoke |

Annual pricing is set at 10 monthly payments (two months free) to encourage cash collection without introducing arbitrary discounts.

## Why this decision

Current C6 package configuration was materially under-specified commercially: Diamond was USD 299.99/month, Gold USD 699/month and Platinum USD 1,499/month, while the feature ladder mixed AI usage, support, integrations and business intelligence. The prices were not anchored to a South African commercial benchmark.

The 2026 South African benchmark reviewed on 2026-08-21 shows:

- Small-business websites commonly range from roughly R3,000–R25,000+ once-off, with managed monthly offers from a few hundred rand to several thousand.
- Digital marketing starter packages commonly begin around R5,000/month; growth packages commonly sit around R8,000–R20,000/month; premium programmes commonly exceed R20,000/month.
- SEO services commonly sit around R2,500–R8,000/month depending on scope.
- Managed website/maintenance services commonly sit around R500–R2,500/month for ordinary SME needs, with higher-touch plans above that.

Sources reviewed:
- Groundwork Digital, June 2026: South African website pricing ranges.
- Juicy Designs, June 2026: South African digital marketing package ranges.
- Online By Digital, 2026: South African website/SEO/social/email pricing ranges.
- BizAI, April 2026: local SEO package benchmark.
- Cognexa, August 2026: AI automation pricing methodology.

## Productisation rules

1. AI may recommend a package; it may not invent a price.
2. Prices are controlled by `src/config/packages.ts`.
3. Package prices are in ZAR, not USD.
4. Ad spend and third-party usage costs are not silently included unless explicitly listed in a package.
5. Platinum no longer advertises unlimited AI usage; it uses high-volume allowances and fair-use controls.
6. Enterprise remains sales-assisted/custom because multi-location, SLA, bespoke development and custom model work cannot be responsibly standardised yet.
7. The package ladder is designed around outcomes and repeatable delivery, not billable hours.

## Commercial benchmark conclusion

The ladder is intentionally positioned so C6 is not competing as the cheapest web/AI provider. Diamond is accessible but monetised; Gold is the core SME growth SKU; Platinum is the premium Business Intelligence / AI staff offer; Enterprise captures bespoke/high-value accounts.

## Next required validation

Before treating these as final-final pricing, validate against:

- actual C6 delivery cost per package;
- actual AI/tool/API usage under realistic customer behaviour;
- support hours and account-management capacity;
- gross-margin floor;
- first 3–5 customer conversion data.

The catalogue is therefore **production-canonical for the current implementation**, but subject to evidence-driven commercial recalibration after live customer data.
