import { type CommercialSku } from '../../../shared/commercialContract';
export declare const COMMERCIAL_PRICING: Record<CommercialSku, {
    monthlyPriceZar: number | null;
    annualPriceZar: number | null;
}>;
export type CommercialPackageId = CommercialSku;
export declare function getCommercialPackage(id: string): import("../../../shared/commercialContract").CommercialPackage;
export declare const commercialCatalog: Record<CommercialSku, {
    monthlyPriceZar: number | null;
    annualPriceZar: number | null;
}>;
export declare function getPackageById(id: string): import("../../../shared/commercialContract").CommercialPackage;
//# sourceMappingURL=commercialCatalog.d.ts.map