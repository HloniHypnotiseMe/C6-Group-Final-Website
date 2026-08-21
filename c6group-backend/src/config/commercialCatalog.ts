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
  description: string;
  monthlyPriceZar: number | null;
  annualPriceZar: number | null;
  billingCycle: BillingCycle;
  selfServe: boolean;
  recommendationEligible: boolean;
  notes: string[];
}

export const C6_COMMERCIAL_CATALOG: readonly CommercialPackage[] = [
  {
    sku: "LEAD",
    name: "Lead",
    description: "Entry-level/free discovery and qualification experience.",
    monthlyPriceZar: 0,
    annualPriceZar: 0,
    billingCycle: "MONTHLY",
    selfServe: true,
    recommendationEligible: true,
    notes: ["Free entry point; no AI-generated pricing."],
  },
  {
    sku: "DIAMOND",
    name: "Diamond",
    description: "Foundational C6 business growth and automation package.",
    monthlyPriceZar: 4995,
    annualPriceZar: 49950,
    billingCycle: "MONTHLY",
    selfServe: true,
    recommendationEligible: true,
    notes: ["Base price is fixed by catalogue."],
  },
  {
    sku: "GOLD",
    name: "Gold",
    description: "Expanded growth, automation and intelligence package.",
    monthlyPriceZar: 9995,
    annualPriceZar: 99950,
    billingCycle: "MONTHLY",
    selfServe: true,
    recommendationEligible: true,
    notes: ["Base price is fixed by catalogue."],
  },
  {
    sku: "PLATINUM",
    name: "Platinum",
    description: "Advanced C6 intelligence, growth and implementation package.",
    monthlyPriceZar: 24995,
    annualPriceZar: 249950,
    billingCycle: "MONTHLY",
    selfServe: true,
    recommendationEligible: true,
    notes: ["Base price is fixed by catalogue."],
  },
  {
    sku: "ENTERPRISE",
    name: "Enterprise",
    description: "Custom enterprise engagement requiring commercial review.",
    monthlyPriceZar: null,
    annualPriceZar: null,
    billingCycle: "CUSTOM",
    selfServe: false,
    recommendationEligible: true,
    notes: [
      "No fabricated price is permitted.",
      "Requires human/commercial approval before checkout.",
    ],
  },
] as const;

export const C6_COMMERCIAL_VERSION = "2026-08-21.v1";

export function getCommercialPackage(sku: CommercialSku): CommercialPackage {
  const pkg = C6_COMMERCIAL_CATALOG.find((item) => item.sku === sku);
  if (!pkg) throw new Error(`Unknown C6 commercial SKU: ${sku}`);
  return pkg;
}

export function getCommercialPrice(
  sku: CommercialSku,
  billingCycle: Exclude<BillingCycle, "CUSTOM">
): number | null {
  const pkg = getCommercialPackage(sku);
  return billingCycle === "MONTHLY"
    ? pkg.monthlyPriceZar
    : pkg.annualPriceZar;
}
