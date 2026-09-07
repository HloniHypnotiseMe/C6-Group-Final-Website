/**
 * C6 commercial contract.
 * The shared catalog is the pricing source of truth for the website and backend.
 */

export type CommercialSku =
  | "LEAD"
  | "DIAMOND"
  | "GOLD"
  | "PLATINUM"
  | "ENTERPRISE";

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

export const C6_COMMERCIAL_CATALOG = [
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
] as const satisfies readonly CommercialPackage[];

export const C6_COMMERCIAL_VERSION = "2026-09-07.v2";

export const FRONTEND_TO_COMMERCIAL_SKU = {
  start: "LEAD",
  diamond: "DIAMOND",
  growth: "GOLD",
  platinum: "PLATINUM",
  enterprise: "ENTERPRISE",
} as const;

export type FrontendPackageId = keyof typeof FRONTEND_TO_COMMERCIAL_SKU;

export function getCommercialPackage(sku: CommercialSku): CommercialPackage {
  const pkg = C6_COMMERCIAL_CATALOG.find(item => item.sku === sku);
  if (!pkg) throw new Error(`Unknown C6 commercial SKU: ${sku}`);
  return pkg;
}

export function resolveCommercialSku(packageId: string): CommercialSku {
  const normalized = packageId.toLowerCase();
  if (normalized in FRONTEND_TO_COMMERCIAL_SKU) {
    return FRONTEND_TO_COMMERCIAL_SKU[normalized as FrontendPackageId];
  }

  const upper = packageId.toUpperCase();
  if (C6_COMMERCIAL_CATALOG.some(pkg => pkg.sku === upper)) {
    return upper as CommercialSku;
  }

  throw new Error(`Unknown C6 commercial package ID: ${packageId}`);
}

export function getCommercialPrice(
  sku: CommercialSku,
  billingCycle: BillingCycle,
): number | null {
  const pkg = getCommercialPackage(sku);
  if (pkg.sku === "ENTERPRISE") return null;
  return billingCycle === "ANNUAL" ? pkg.annualPriceZar : pkg.monthlyPriceZar;
}
