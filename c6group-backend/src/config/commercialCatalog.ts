export const COMMERCIAL_PRICING = {
  LEAD: { monthlyPriceZar: 0, annualPriceZar: 0 },
  DIAMOND: { monthlyPriceZar: 4995, annualPriceZar: 49950 },
  GOLD: { monthlyPriceZar: 9995, annualPriceZar: 99950 },
  PLATINUM: { monthlyPriceZar: 24995, annualPriceZar: 249950 },
  ENTERPRISE: { monthlyPriceZar: 0, annualPriceZar: 0 },
} as const;

export type CommercialPackageId = keyof typeof COMMERCIAL_PRICING;

export function getCommercialPackage(id: string) {
  const key = id.toUpperCase() as CommercialPackageId;
  return COMMERCIAL_PRICING[key] || COMMERCIAL_PRICING.LEAD;
}

export const commercialCatalog = COMMERCIAL_PRICING;

export function getPackageById(id: string) {
  return getCommercialPackage(id);
}
