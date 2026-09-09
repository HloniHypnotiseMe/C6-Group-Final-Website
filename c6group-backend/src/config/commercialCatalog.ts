import {
  C6_COMMERCIAL_CATALOG,
  getCommercialPackage as getSharedCommercialPackage,
  resolveCommercialSku,
  type CommercialSku,
} from '../../../shared/commercialContract';

export const COMMERCIAL_PRICING = Object.fromEntries(
  C6_COMMERCIAL_CATALOG.map(pkg => [pkg.sku, {
    monthlyPriceZar: pkg.monthlyPriceZar,
    annualPriceZar: pkg.annualPriceZar,
  }]),
) as Record<CommercialSku, {
  monthlyPriceZar: number | null;
  annualPriceZar: number | null;
}>;

export type CommercialPackageId = CommercialSku;

export function getCommercialPackage(id: string) {
  return getSharedCommercialPackage(resolveCommercialSku(id));
}

export const commercialCatalog = COMMERCIAL_PRICING;

export function getPackageById(id: string) {
  return getCommercialPackage(id);
}
