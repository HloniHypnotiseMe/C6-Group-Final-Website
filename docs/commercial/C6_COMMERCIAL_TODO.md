# C6 COMMERCIAL ENGINE — LIVE TODO

Updated: 2026-08-24

## DONE

- [x] Forensic extraction of C6 website, Agent-OS and RemotePay capabilities
- [x] Confirm package catalogue: Lead / Diamond / Gold / Platinum / Enterprise
- [x] Replace placeholder pricing with canonical ZAR product pricing
- [x] Replace uncontrolled Platinum unlimited-AI positioning with bounded allowances/fair-use controls
- [x] Log pricing decision
- [x] Benchmark current South African digital marketing / SEO / AI-service market
- [x] Perform first unit-economics review
- [x] Define package gross-margin gates
- [x] Define required per-account cost ledger
- [x] Make RemotePay the C6 payment boundary
- [x] Remove direct SimplyBlu credentials/configuration from C6 backend
- [x] Route C6 payment creation to RemotePay `/payment-links`
- [x] Preserve legacy SimplyBlu endpoint name as a compatibility alias that still routes through RemotePay
- [x] Add production `.gitignore`

## IN PROGRESS — NEXT

- [ ] Implement per-account cost ledger
- [ ] Instrument LLM input/output token cost by provider/model
- [ ] Instrument AI feature usage against package limits
- [ ] Instrument research/search/tool costs
- [ ] Instrument human onboarding/support/implementation time
- [ ] Instrument payment and third-party pass-through costs
- [ ] Build P50/P90 direct-cost report by package
- [ ] Validate economics across at least 10 real/simulated customer accounts

## COMMERCIAL INTELLIGENCE BUILD

- [ ] Discovery Agent: real business research
- [ ] Evidence Graph: source, observation date, confidence, fact/inference separation
- [ ] Opportunity Detector: business signal -> measurable opportunity
- [x] Offer Engine: opportunity -> canonical C6 package
- [x] Price Resolver: package -> canonical catalogue price; no AI-generated prices
- [x] Checkout Bridge foundation: offer -> C6 checkout -> RemotePay payment-link boundary
- [ ] Outcome Ledger: intervention -> result -> revenue/retention signal
- [ ] Learning Loop: outcome -> package/recommendation optimisation

## REMOTEPAY INTEGRATION GATE

C6 is a RemotePay merchant/brand consumer. C6 source code must not contain underlying processor credentials or call an underlying processor directly.

Current contract:

C6 -> C6 backend -> RemotePay `/payment-links` -> RemotePay provider boundary -> settlement

Remaining RemotePay-side requirements:

- [ ] Enforce authenticated merchant-to-RemotePay API access
- [ ] Persist payment-link records in the RemotePay ledger
- [ ] Return a stable hosted payment URL in production
- [ ] Deliver signed webhook events to C6
- [ ] Reconcile RemotePay transaction state into the C6 payment record
- [ ] Record C6/brand transaction fees and settlement references

## GO-LIVE GATE

A Customer #1 commercial loop is ready when:

Business -> Discovery -> Evidence -> Diagnosis -> Recommendation -> Canonical Package -> Canonical Price -> Checkout -> RemotePay Payment Link -> Provider -> Payment Confirmation -> Delivery -> Outcome

works end-to-end with auditable evidence, deterministic pricing, RemotePay as the payment boundary, and no manual price invention.
