export type CommercialPackage = 'LEAD' | 'DIAMOND' | 'GOLD' | 'PLATINUM' | 'ENTERPRISE';
export interface IntelligenceSignal {
    key: string;
    value: string | number | boolean;
    confidence: number;
    source?: string;
}
export interface OfferInput {
    businessName: string;
    signals: IntelligenceSignal[];
}
export interface CommercialOffer {
    businessName: string;
    packageId: CommercialPackage;
    reasonCodes: string[];
    requiredEvidence: string[];
    confidence: number;
    status: 'RECOMMENDED' | 'INSUFFICIENT_EVIDENCE';
}
/**
 * Deterministic bridge from researched business signals to the canonical SKU.
 * Prices are deliberately not generated here; commercialCatalog.ts is the
 * single source of truth for pricing.
 */
export declare function recommendCommercialPackage(input: OfferInput): CommercialOffer;
//# sourceMappingURL=commercialOfferEngine.d.ts.map