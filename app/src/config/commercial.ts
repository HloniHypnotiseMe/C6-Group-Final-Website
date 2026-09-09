import {
  C6_COMMERCIAL_CATALOG,
  FRONTEND_TO_COMMERCIAL_SKU,
  getCommercialPackage,
  getCommercialPrice,
  resolveCommercialSku,
  type FrontendPackageId,
} from '../../../shared/commercialContract';

export const COMMERCIAL_PRICING = {
  DIAMOND_PRICE: getCommercialPrice('DIAMOND', 'MONTHLY') ?? 4995,
  CURRENCY: 'ZAR',
  LOCKED: true,
} as const;

export const packages = C6_COMMERCIAL_CATALOG.map(pkg => {
  const frontendId = Object.entries(FRONTEND_TO_COMMERCIAL_SKU).find(([, sku]) => sku === pkg.sku)?.[0] as FrontendPackageId | undefined;
  return {
    ...pkg,
    id: frontendId ?? pkg.sku.toLowerCase(),
  };
});

export function getFrontendPackage(packageId: string) {
  const sku = resolveCommercialSku(packageId);
  const pkg = getCommercialPackage(sku);
  return {
    ...pkg,
    id: packageId.toLowerCase(),
  };
}

export { C6_COMMERCIAL_CATALOG, FRONTEND_TO_COMMERCIAL_SKU, getCommercialPrice, resolveCommercialSku };
