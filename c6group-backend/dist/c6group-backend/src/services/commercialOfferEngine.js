"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendCommercialPackage = recommendCommercialPackage;
const PACKAGE_SCORE = {
    LEAD: 0,
    DIAMOND: 1,
    GOLD: 2,
    PLATINUM: 3,
    ENTERPRISE: 4,
};
/**
 * Deterministic bridge from researched business signals to the canonical SKU.
 * Prices are deliberately not generated here; commercialCatalog.ts is the
 * single source of truth for pricing.
 */
function recommendCommercialPackage(input) {
    const signals = new Map(input.signals.map((signal) => [signal.key, signal]));
    const reasons = [];
    const evidence = [];
    let score = PACKAGE_SCORE.LEAD;
    let confidence = 0;
    const add = (packageId, reason, evidenceKey) => {
        score = Math.max(score, PACKAGE_SCORE[packageId]);
        reasons.push(reason);
        evidence.push(evidenceKey);
    };
    const locations = Number(signals.get('location_count')?.value ?? 0);
    const automation = Number(signals.get('automation_opportunity')?.value ?? 0);
    const payment = Number(signals.get('payment_opportunity')?.value ?? 0);
    const enterprise = Boolean(signals.get('enterprise_signal')?.value ?? false);
    if (enterprise)
        add('ENTERPRISE', 'Enterprise-scale operating signal detected', 'enterprise_signal');
    else if (locations >= 10)
        add('PLATINUM', 'Multi-location scale supports a high-touch growth programme', 'location_count');
    else if (automation >= 70 || payment >= 70)
        add('GOLD', 'Material automation or payment opportunity detected', 'opportunity_signal');
    else if (automation >= 40 || payment >= 40)
        add('DIAMOND', 'A measurable digital improvement opportunity is present', 'opportunity_signal');
    else
        add('LEAD', 'Evidence is insufficient for a paid package recommendation', 'minimum_evidence');
    const confidenceValues = input.signals
        .map((signal) => signal.confidence)
        .filter((value) => Number.isFinite(value) && value >= 0 && value <= 1);
    confidence = confidenceValues.length
        ? Number((confidenceValues.reduce((a, b) => a + b, 0) / confidenceValues.length).toFixed(3))
        : 0;
    const status = confidence >= 0.7 && reasons.length > 0
        ? 'RECOMMENDED'
        : 'INSUFFICIENT_EVIDENCE';
    return {
        businessName: input.businessName,
        packageId: status === 'RECOMMENDED' ? Object.keys(PACKAGE_SCORE).find((key) => PACKAGE_SCORE[key] === score) : 'LEAD',
        reasonCodes: reasons,
        requiredEvidence: evidence,
        confidence,
        status,
    };
}
//# sourceMappingURL=commercialOfferEngine.js.map