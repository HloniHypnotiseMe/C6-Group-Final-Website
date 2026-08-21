# C6 Decision Log

## 2026-08-21 — Commercial Catalogue v1

**Decision:** Establish a deterministic, centrally defined C6 commercial SKU catalogue for the Customer #1 Discovery → Offer → Checkout path.

**Approved catalogue:**

| SKU | Monthly | Annual |
|---|---:|---:|
| Lead | R0 | R0 |
| Diamond | R4,995 | R49,950 |
| Gold | R9,995 | R99,950 |
| Platinum | R24,995 | R249,950 |
| Enterprise | Custom | Custom |

### Rationale

1. Discovery Intelligence must recommend from a controlled product catalogue rather than inventing offers.
2. Base prices must be deterministic and auditable.
3. The current annual prices represent ten monthly-equivalent payments.
4. Enterprise remains custom because no evidence-backed fixed price has been approved.
5. Checkout/payment integration is downstream of the offer contract and must consume the selected SKU and catalogue price rather than allowing an AI agent to mutate the price.

### Guardrails

- AI agents may recommend an eligible SKU.
- AI agents may not invent, discount, increase, or otherwise mutate a base catalogue price.
- Enterprise cannot proceed to automated self-serve checkout without commercial approval.
- Future price changes require a new catalogue version and an explicit logged decision.
- Add-ons are not activated until separately priced and approved; no ad-hoc add-on pricing is permitted.

### Implementation

Canonical source: `c6group-backend/src/config/commercialCatalog.ts`

Version: `2026-08-21.v1`

Commit: `fe20e7323e1f7369aa8b59b06c004a7015c9719e`
