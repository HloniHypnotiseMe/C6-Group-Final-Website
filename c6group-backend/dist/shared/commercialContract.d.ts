/**
 * C6 commercial contract.
 * The shared catalog is the pricing source of truth for the website and backend.
 */
export type CommercialSku = "LEAD" | "DIAMOND" | "GOLD" | "PLATINUM" | "ENTERPRISE";
export type BillingCycle = "MONTHLY" | "ANNUAL" | "CUSTOM";
export interface CommercialPackage {
    sku: CommercialSku;
    name: string;
    monthlyPriceZar: number | null;
    annualPriceZar: number | null;
    billingCycle: BillingCycle;
    selfServe: boolean;
    recommendationEligible: boolean;
}
export declare const C6_COMMERCIAL_CATALOG: readonly [{
    readonly sku: "LEAD";
    readonly name: "Lead";
    readonly monthlyPriceZar: 0;
    readonly annualPriceZar: 0;
    readonly billingCycle: "MONTHLY";
    readonly selfServe: true;
    readonly recommendationEligible: true;
}, {
    readonly sku: "DIAMOND";
    readonly name: "Diamond";
    readonly monthlyPriceZar: 4995;
    readonly annualPriceZar: 49950;
    readonly billingCycle: "MONTHLY";
    readonly selfServe: true;
    readonly recommendationEligible: true;
}, {
    readonly sku: "GOLD";
    readonly name: "Gold";
    readonly monthlyPriceZar: 9995;
    readonly annualPriceZar: 99950;
    readonly billingCycle: "MONTHLY";
    readonly selfServe: true;
    readonly recommendationEligible: true;
}, {
    readonly sku: "PLATINUM";
    readonly name: "Platinum";
    readonly monthlyPriceZar: 24995;
    readonly annualPriceZar: 249950;
    readonly billingCycle: "MONTHLY";
    readonly selfServe: true;
    readonly recommendationEligible: true;
}, {
    readonly sku: "ENTERPRISE";
    readonly name: "Enterprise";
    readonly monthlyPriceZar: null;
    readonly annualPriceZar: null;
    readonly billingCycle: "CUSTOM";
    readonly selfServe: false;
    readonly recommendationEligible: true;
}];
export declare const C6_COMMERCIAL_VERSION = "2026-09-07.v2";
export declare const FRONTEND_TO_COMMERCIAL_SKU: {
    readonly start: "LEAD";
    readonly diamond: "DIAMOND";
    readonly growth: "GOLD";
    readonly platinum: "PLATINUM";
    readonly enterprise: "ENTERPRISE";
};
export type FrontendPackageId = keyof typeof FRONTEND_TO_COMMERCIAL_SKU;
export declare function getCommercialPackage(sku: CommercialSku): CommercialPackage;
export declare function resolveCommercialSku(packageId: string): CommercialSku;
export declare function getCommercialPrice(sku: CommercialSku, billingCycle: BillingCycle): number | null;
//# sourceMappingURL=commercialContract.d.ts.map