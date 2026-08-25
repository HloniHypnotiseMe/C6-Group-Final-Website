# C6 Group Commercial Lock — Sprint Tracker

**Scope:** `C6-Group-Final-Website` only, with integration contracts to RemotePay and Ubernie.

**Canonical source:** GitHub `main` until the website is cloned locally for runtime verification.

**Commercial destination:** C6 Group is the parent commercial brand; Ubernie is a business operating/intelligence product; RemotePay Fintech Services is the current payment entity and payment rail used by C6/Ubernie/other verticals and external merchants.

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

## Current blockers / findings

1. C6 paid package checkout now calls the RemotePay payment-link API directly rather than the legacy SimplyBlu endpoint.
2. C6 payment creation carries `brand_id`, `product_id`, `offer_id`, customer reference support, and source-system metadata for attribution.
3. RemotePay payment links now route the underlying checkout through a dedicated SimplyBlu provider adapter; the provider remains behind the RemotePay boundary.
4. RemotePay provider credentials are environment-only; hardcoded PayFast credentials were removed from `backend/core/config.py`.
5. RemotePay payment-link persistence is still an in-memory foundation store. Persistent transaction/economic-event/settlement integration remains outstanding.
6. Live/sandbox provider verification is still outstanding; no live-money readiness claim is made.
7. The C6 repository still contains legacy SimplyBlu backend code; it is no longer the package-page merchant-facing path and should be removed/deprecated only after runtime verification confirms no other consumer depends on it.
8. The repository contains generated `app/dist` content and `Thumbs.db`; cleanup is a separate repository hygiene task and must not break deployment.

## Operating rule

**Do not implement speculative integrations.** Every change must be tied to a tracker item, tested where possible, and recorded in Git history. No live-money claim is made until the RemotePay production verification gate is satisfied.
