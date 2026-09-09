import { Zap, Diamond as DiamondIcon, TrendingUp, Rocket, Building2, Check } from 'lucide-react';
import { getCommercialPackage, FRONTEND_TO_COMMERCIAL_SKU } from '../../../shared/commercialContract';

const packagePresentation = [
  {
    id: 'start', name: 'Start', tagline: 'Get Found', description: 'Start with the intelligence and visibility foundations your business needs.', icon: Zap,
    popular: false, features: ['Free AI Business Audit', 'Basic directory listing', 'Basic insights', 'WhatsApp support'],
  },
  {
    id: 'diamond', name: 'Diamond', tagline: 'AI Receptionist for Rentals', description: 'Turn enquiries into handled conversations with AI-powered reception and automation.', icon: DiamondIcon,
    popular: true, features: ['Everything in Start', 'AI receptionist', '500 WhatsApp auto-replies', 'Listing optimizer', 'Priority support', 'R4,995/mo Commercial Lock'],
  },
  {
    id: 'growth', name: 'Gold', tagline: 'Scale Up', description: 'For growing businesses ready to automate more of their customer and revenue operations.', icon: TrendingUp,
    popular: false, features: ['Everything in Diamond', '2,000 AI calls', '200 content generations', 'Advanced analytics', 'Expanded automation', 'Priority support'],
  },
  {
    id: 'platinum', name: 'Platinum', tagline: 'Operate at Scale', description: 'A higher-capacity commercial operating layer for established businesses.', icon: Rocket,
    popular: false, features: ['Everything in Gold', '10,000 AI calls', 'Up to 5 users', 'Advanced automation', 'Advanced analytics', 'Dedicated support'],
  },
  {
    id: 'enterprise', name: 'Enterprise', tagline: 'Custom', description: 'Custom commercial architecture, capacity and support for enterprise requirements.', icon: Building2,
    popular: false, features: ['Everything in Platinum', 'Unlimited AI capacity', 'Unlimited users', 'Custom integrations', 'White-label options', 'Dedicated account management'],
  },
] as const;

export const packages = packagePresentation.map(item => {
  const sku = FRONTEND_TO_COMMERCIAL_SKU[item.id as keyof typeof FRONTEND_TO_COMMERCIAL_SKU];
  const commercial = getCommercialPackage(sku);
  return {
    ...item,
    sku,
    price: commercial.monthlyPriceZar,
    annualPrice: commercial.annualPriceZar,
  };
});

export function Packages() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">C6GROUP Commercial Packages</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {packages.map((pkg) => {
          const Icon = pkg.icon;
          const custom = pkg.price === null;
          return (
            <div key={pkg.id} className={`border rounded-xl p-6 ${pkg.popular ? 'border-primary shadow-lg scale-105' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3 mb-3">
                <Icon className="w-6 h-6" />
                <h3 className="text-xl font-bold">{pkg.name}</h3>
                {pkg.popular && <span className="bg-primary text-white text-xs px-2 py-1 rounded">POPULAR</span>}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{pkg.tagline}</p>
              <p className="text-3xl font-bold mb-4">{custom ? 'Custom' : `R${pkg.price?.toLocaleString('en-ZA')}${pkg.price && pkg.price > 0 ? '/mo' : ''}`}</p>
              <p className="text-sm mb-4">{pkg.description}</p>
              <ul className="space-y-2">
                {pkg.features.map((feature) => <li key={feature} className="flex gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /> {feature}</li>)}
              </ul>
            </div>
          );
        })}
      </div>
      <p className="text-center text-sm text-muted-foreground mt-8">Annual pricing is available at 10 monthly-equivalent payments. Enterprise is custom quoted.</p>
    </div>
  );
}

export const PackagesPage = Packages;
export default Packages;
