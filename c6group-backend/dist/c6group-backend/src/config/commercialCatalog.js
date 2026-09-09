"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commercialCatalog = exports.COMMERCIAL_PRICING = void 0;
exports.getCommercialPackage = getCommercialPackage;
exports.getPackageById = getPackageById;
const commercialContract_1 = require("../../../shared/commercialContract");
exports.COMMERCIAL_PRICING = Object.fromEntries(commercialContract_1.C6_COMMERCIAL_CATALOG.map(pkg => [pkg.sku, {
        monthlyPriceZar: pkg.monthlyPriceZar,
        annualPriceZar: pkg.annualPriceZar,
    }]));
function getCommercialPackage(id) {
    return (0, commercialContract_1.getCommercialPackage)((0, commercialContract_1.resolveCommercialSku)(id));
}
exports.commercialCatalog = exports.COMMERCIAL_PRICING;
function getPackageById(id) {
    return getCommercialPackage(id);
}
//# sourceMappingURL=commercialCatalog.js.map