import {
  C6_COMMERCIAL_CATALOG as SHARED_COMMERCIAL_CATALOG,
  C6_COMMERCIAL_VERSION as SHARED_COMMERCIAL_VERSION,
  getCommercialPackage as getSharedCommercialPackage,
  getCommercialPrice as getSharedCommercialPrice,
  type CommercialSku,
  type BillingCycle,
} from "../../../shared/commercialContract";

/**
 * C6 Commercial Catalogue
 *
 * Single source of truth for customer-facing package identity and base pricing.
 * Pricing is deterministic: the intelligence layer may recommend an eligible
 * SKU, but it MUST NOT invent or alter the base price.
 *
 * Annual pricing is intentionally fixed at 10 monthly-equivalent payments
 * for the current launch catalogue.
 */
export interface CommercialPackage {
  sku: CommercialSku;
  name: string;
  description: string;
  monthlyPriceZar: number | null;
  annualPriceZar: number | null;
  billingCycle: BillingCycle;
  selfServe: boolean;
  recommendationEligible: boolean;
  notes: string[];
}

export const C6_COMMERCIAL_CATALOG: readonly CommercialPackage[] =
  SHARED_COMMERCIAL_CATALOG.map((pkg) => ({
    ...pkg,
    description:
      pkg.sku === "LEAD"
        ? "Entry-level/free discovery and qualification experience."
        : pkg.sku === "DIAMOND"
          ? "Foundational C6 business growth and automation package."
          : pkg.sku === "GOLD"
            ? "Expanded growth, automation and intelligence package."
            : pkg.sku === "PLATINUM"
              ? "Advanced C6 intelligence, growth and implementation package."
              : "Custom enterprise engagement requiring commercial review.",
    notes:
      pkg.sku === "ENTERPRISE"
        ? [
            "No fabricated price is permitted.",
            "Requires human/commercial approval before checkout.",
          ]
        : ["Base price is fixed by shared commercial contract."],
  }));

export const C6_COMMERCIAL_VERSION = SHARED_COMMERCIAL_VERSION;

export function getCommercialPackage(sku: CommercialSku): CommercialPackage {
  const shared = getSharedCommercialPackage(sku);

  const pkg = C6_COMMERCIAL_CATALOG.find((item) => item.sku === shared.sku);
  if (!pkg) throw new Error(`Unknown C6 commercial SKU: ${sku}`);

  return pkg;
}

export function getCommercialPrice(
  sku: CommercialSku,
  billingCycle: Exclude<BillingCycle, "CUSTOM">
): number | null {
  return getSharedCommercialPrice(sku, billingCycle);
}
