/**
 * C6 COMMERCIAL CONTRACT
 *
 * SINGLE SOURCE OF TRUTH
 *
 * Launch pricing:
 * Lead       R0
 * Diamond    R4,995/month | R49,950/year
 * Gold       R9,995/month | R99,950/year
 * Platinum   R24,995/month | R249,950/year
 * Enterprise CUSTOM
 *
 * Annual pricing = 10 monthly-equivalent payments.
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
export declare const C6_COMMERCIAL_VERSION = "2026-08-28.v1";
export declare function getCommercialPackage(sku: CommercialSku): CommercialPackage;
export declare function getCommercialPrice(sku: CommercialSku, billingCycle: BillingCycle): number | null;
//# sourceMappingURL=commercialContract.d.ts.map