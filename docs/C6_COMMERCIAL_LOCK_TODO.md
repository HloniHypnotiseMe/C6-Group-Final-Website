# C6 Group Commercial Lock — Sprint Tracker

**Scope:** `C6-Group-Final-Website` only, with integration contracts to RemotePay and Ubernie.

**Canonical source:** GitHub `main` until the website is cloned locally for runtime verification.

**Commercial destination:** C6 Group is the parent commercial brand; Ubernie is a business operating/intelligence product; RemotePay Fintech Services is the current payment entity and payment rail used by C6/Ubernie/other verticals and external merchants.

## TODAY — PAYMENT-FIRST EXECUTION LANE

**Objective:** Get to a demonstrably working C6 → RemotePay → SimplyBlu payment flow today, rather than spending the day on speculative architecture.

**Known fact:** SimplyBlu already successfully sends payment emails, SMS and hosted payment links. The existing SimplyBlu capability is therefore treated as the current working processor rail; RemotePay's job is to become the merchant-facing orchestration/boundary around it.

### Priority order

1. [x] Put C6 checkout behind RemotePay.
2. [x] Carry C6 brand/product/offer attribution into RemotePay.
3. [x] Put SimplyBlu behind a RemotePay provider adapter.
4. [x] Remove hardcoded payment credentials from RemotePay source configuration.
5. [ ] Make RemotePay invoke the **known-working SimplyBlu payment-link/email/SMS capability using its real API contract** — do not invent a second checkout system.
6. [ ] Run one sandbox/test transaction end-to-end.
7. [ ] Verify the resulting hosted link/email/SMS and RemotePay transaction reference.
8. [ ] Persist the transaction and provider reference before declaring the payment flow production-ready.
9. [ ] Verify webhook/status callback and final payment state.
10. [ ] Verify attribution: C6/Ubernie/other brand → RemotePay transaction → underlying provider transaction.
11. [ ] Only after the above works, move to refunds, reconciliation and broader commercial polish.

**Working-day rule:** If an existing capability already works, integrate to it first. Do not replace, redesign or duplicate it before proving the working path.

## Phase 0 — Baseline & forensic lock

- [x] Confirm canonical GitHub repository.
- [x] Confirm React/Vite frontend and Express/Prisma backend.
- [x] Identify existing `/audit`, `/packages`, `/ai-tools`, dashboard and account flows.
- [x] Identify current SimplyBlu payment component and backend initiation boundary.
- [x] Identify current commercial prices shown on the site.
- [x] Identify current trust/payment-provider language.
- [ ] Clone locally after GitHub changes stabilize.
- [ ] Run install/build/lint/tests locally and record evidence.

## Phase 1 — Commercial positioning lock

- [x] Define one clear C6 Group proposition above the product catalogue.
- [x] Present C6 as the parent ecosystem/brand without implying unincorporated subsidiaries are separate legal entities.
- [x] Position Ubernie as the business intelligence / operating product.
- [x] Position RemotePay Fintech Services as the current payment entity/rail.
- [x] Add a clear ecosystem relationship section: C6 → Ubernie / RemotePay / other verticals.
- [x] Remove conflicting or outdated provider language from customer-facing C6 copy.
- [ ] Ensure every primary CTA maps to a measurable commercial next step.

## Phase 2 — Offer architecture & pricing

- [ ] Audit all offers, packages and AI tools for duplication/overlap.
- [ ] Build a single canonical product catalogue.
- [ ] Separate free lead-generation offers from paid products.
- [ ] Re-engineer pricing against acquisition cost, delivery cost, recurring value and R1M/day scale.
- [ ] Define entry, growth and enterprise paths.
- [ ] Ensure pricing shown in homepage and packages page cannot drift.
- [x] Add internal product IDs/offer IDs where payment attribution requires them.

## Phase 3 — Audit → recommendation → sale funnel

- [x] Remove client-side synthetic audit fallback; AI audit now fails closed when the service does not return valid data.
- [ ] Audit intake.
- [ ] Business diagnosis.
- [ ] Recommendation engine/output.
- [ ] Recommended product/package.
- [x] Checkout/payment initiation.
- [ ] Payment confirmation.
- [ ] Fulfilment/onboarding.
- [ ] Recurring revenue lifecycle.
- [ ] Event/attribution tracking across the funnel.

## Phase 4 — RemotePay commercial integration

- [x] Make RemotePay the C6-facing payment boundary.
- [x] Keep current processor behind RemotePay/provider adapter architecture.
- [x] Pass brand, product, offer and customer attribution into payment creation.
- [x] Replace direct SimplyBlu naming in the merchant-facing architecture where RemotePay is the commercial layer.
- [x] Preserve SimplyBlu as the current underlying processor only where technically accurate.
- [ ] Verify real SimplyBlu email/SMS/hosted-link initiation through RemotePay.
- [ ] Verify webhook → transaction lifecycle → settlement/reconciliation path.
- [ ] Ensure refunds and adjustments retain original transaction attribution.

## Phase 5 — Ubernie integration

- [ ] Link C6 recommendation outputs to Ubernie where appropriate.
- [ ] Define exact handoff contract between C6 and Ubernie.
- [ ] Ensure Ubernie payment events identify Ubernie as the brand/product beneficiary while RemotePay remains the payment rail/entity.
- [ ] Avoid duplicating business-audit logic between C6 and Ubernie.

## Phase 6 — Trust, legal & conversion

- [ ] Verify POPIA/privacy/cookie/terms surfaces.
- [ ] Verify company/entity/payment disclosures are accurate.
- [ ] Remove unsupported claims.
- [ ] Verify WhatsApp/contact channels.
- [ ] Add appropriate payment/security language.
- [ ] Ensure no test/payment credentials appear in frontend source.

## Phase 7 — Runtime verification

- [ ] Clone canonical repo locally.
- [ ] Install dependencies.
- [ ] Build frontend.
- [ ] Lint frontend.
- [ ] Build/start backend.
- [ ] Run application smoke tests.
- [ ] Test audit flow.
- [ ] Test package selection.
- [ ] Test payment initiation in sandbox/test mode.
- [ ] Verify hosted payment link.
- [ ] Verify email/SMS delivery where enabled.
- [ ] Verify webhook handling.
- [ ] Verify attribution and state transitions.
- [ ] Capture evidence package.

## Phase 8 — Launch gate

- [ ] Commercial copy locked.
- [ ] Product catalogue locked.
- [ ] Pricing locked.
- [ ] RemotePay routing locked.
- [ ] Ubernie handoff locked.
- [ ] Runtime tests green.
- [ ] Security gate green.
- [ ] Payment sandbox evidence green.
- [ ] Production configuration reviewed.
- [ ] Only then clone/align local production workspace.

## FIX LOG — AUTONOMOUS BOUNDED REPAIRS

### 2026-08-25 — RemotePay/C6 payment boundary

- **Fixed:** C6 package checkout now calls RemotePay rather than the legacy direct SimplyBlu path.
- **Fixed:** C6 payment creation now carries brand/product/offer/customer/source attribution and an idempotency key.
- **Fixed:** RemotePay now has a dedicated SimplyBlu provider adapter so the underlying processor remains behind RemotePay.
- **Fixed:** Hardcoded payment credentials were removed from RemotePay source configuration; provider credentials are environment-only.
- **Added:** RemotePay payment-link tests use a mocked provider and verify idempotency.
- **Added:** SimplyBlu adapter test verifies provider checkout URL normalization.
- **Added:** C6 main now contains the RemotePay payment-link boundary directly; the older PR remains as historical review context rather than being merged over newer main commits.
- **Evidence status:** Code-level changes committed to GitHub; real provider sandbox verification remains OPEN.

### 2026-08-25 — Audit integrity gate

- **Found:** C6's audit UI contained a local synthetic fallback when the AI audit API failed.
- **Fixed:** Ported the verified fail-closed audit implementation onto current `main` without overwriting the newer RemotePay payment boundary.
- **Result:** No synthetic audit report is generated when the AI audit service is unavailable.
- **Evidence:** Commit `eab7efcef617599efbcc4942fc8d79da29c86648`.

## CURRENT BLOCKERS / FINDINGS

1. **Critical next action:** use the existing working SimplyBlu payment-link/email/SMS API contract rather than inventing provider semantics. The exact provider API contract must be verified from the existing RemotePay implementation/configuration before live integration is claimed.
2. RemotePay payment-link persistence is currently an in-memory foundation store. Persistent transaction/economic-event/settlement integration remains outstanding.
3. Live/sandbox provider verification is still outstanding; no live-money readiness claim is made.
4. The C6 repository still contains legacy SimplyBlu backend code; it is no longer the package-page merchant-facing path and should be removed/deprecated only after runtime verification confirms no other consumer depends on it.
5. The repository contains generated `app/dist` content and `Thumbs.db`; cleanup is a separate repository hygiene task and must not break deployment.

## OPERATING RULE

**Approved sprint destination = execution authority.** If a discovered defect is clearly within scope, bounded, low-risk and objectively correct, fix it, test it, log it and continue. Stop only for material business, legal, destructive, credential, production-money or architecture decisions.

**No live-money claim is made until the RemotePay production verification gate is satisfied.**
