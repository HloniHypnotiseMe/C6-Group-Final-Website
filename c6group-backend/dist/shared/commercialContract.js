"use strict";
/**
 * C6 commercial contract.
 * The shared catalog is the pricing source of truth for the website and backend.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FRONTEND_TO_COMMERCIAL_SKU = exports.C6_COMMERCIAL_VERSION = exports.C6_COMMERCIAL_CATALOG = void 0;
exports.getCommercialPackage = getCommercialPackage;
exports.resolveCommercialSku = resolveCommercialSku;
exports.getCommercialPrice = getCommercialPrice;
exports.C6_COMMERCIAL_CATALOG = [
    {
        sku: "LEAD",
        name: "Lead",
        monthlyPriceZar: 0,
        annualPriceZar: 0,
        billingCycle: "MONTHLY",
        selfServe: true,
        recommendationEligible: true,
    },
    {
        sku: "DIAMOND",
        name: "Diamond",
        monthlyPriceZar: 4995,
        annualPriceZar: 49950,
        billingCycle: "MONTHLY",
        selfServe: true,
        recommendationEligible: true,
    },
    {
        sku: "GOLD",
        name: "Gold",
        monthlyPriceZar: 9995,
        annualPriceZar: 99950,
        billingCycle: "MONTHLY",
        selfServe: true,
        recommendationEligible: true,
    },
    {
        sku: "PLATINUM",
        name: "Platinum",
        monthlyPriceZar: 24995,
        annualPriceZar: 249950,
        billingCycle: "MONTHLY",
        selfServe: true,
        recommendationEligible: true,
    },
    {
        sku: "ENTERPRISE",
        name: "Enterprise",
        monthlyPriceZar: null,
        annualPriceZar: null,
        billingCycle: "CUSTOM",
        selfServe: false,
        recommendationEligible: true,
    },
];
exports.C6_COMMERCIAL_VERSION = "2026-09-07.v2";
exports.FRONTEND_TO_COMMERCIAL_SKU = {
    start: "LEAD",
    diamond: "DIAMOND",
    growth: "GOLD",
    platinum: "PLATINUM",
    enterprise: "ENTERPRISE",
};
function getCommercialPackage(sku) {
    const pkg = exports.C6_COMMERCIAL_CATALOG.find(item => item.sku === sku);
    if (!pkg)
        throw new Error(`Unknown C6 commercial SKU: ${sku}`);
    return pkg;
}
function resolveCommercialSku(packageId) {
    const normalized = packageId.toLowerCase();
    if (normalized in exports.FRONTEND_TO_COMMERCIAL_SKU) {
        return exports.FRONTEND_TO_COMMERCIAL_SKU[normalized];
    }
    const upper = packageId.toUpperCase();
    if (exports.C6_COMMERCIAL_CATALOG.some(pkg => pkg.sku === upper)) {
        return upper;
    }
    throw new Error(`Unknown C6 commercial package ID: ${packageId}`);
}
function getCommercialPrice(sku, billingCycle) {
    const pkg = getCommercialPackage(sku);
    if (pkg.sku === "ENTERPRISE")
        return null;
    return billingCycle === "ANNUAL" ? pkg.annualPriceZar : pkg.monthlyPriceZar;
}
//# sourceMappingURL=commercialContract.js.map