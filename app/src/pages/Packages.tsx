import { Zap, TrendingUp, Rocket, Building2, Check } from "lucide-react";

export const packages = [
  {
    id: 'start',
    name: 'Start',
    price: 0,
    tagline: 'Get Found',
    description: 'Start with the intelligence and visibility foundations your business needs.',
    icon: Zap,
    popular: false,
    features: ['Free AI Business Audit','Basic directory listing','10 AI tool uses/mo','Basic insights','WhatsApp support'],
  },
  {
    id: 'diamond',
    name: 'Diamond',
    price: 4995,
    tagline: 'AI Receptionist for Rentals',
    description: 'Rental enquiries, WhatsApp auto-replies, listing optimizer.',
    icon: TrendingUp,
    popular: true,
    features: ['Everything in Start','AI receptionist for rentals','500 WhatsApp auto-replies','Listing optimizer','Priority support','R4,995/mo Commercial Lock'],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 1495,
    tagline: 'Scale Up',
    description: 'For growing businesses ready to scale.',
    icon: Rocket,
    popular: false,
    features: ['Everything in Diamond','1,000 AI calls','Advanced analytics','Custom branding'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 2995,
    tagline: 'Dominate',
    description: 'For businesses ready to dominate.',
    icon: Building2,
    popular: false,
    features: ['Everything in Growth','Unlimited AI','White-label','Dedicated account manager'],
  },
];

export function Packages() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Packages - R4,995 Commercial Lock</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {packages.map((pkg) => {
          const Icon = pkg.icon;
          return (
            <div key={pkg.id} className={`border rounded-xl p-6 ${pkg.popular ? 'border-primary shadow-lg scale-105' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3 mb-3">
                <Icon className="w-6 h-6" />
                <h3 className="text-xl font-bold">{pkg.name}</h3>
                {pkg.popular && <span className="bg-primary text-white text-xs px-2 py-1 rounded">POPULAR</span>}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{pkg.tagline}</p>
              <p className="text-3xl font-bold mb-4">R{pkg.price}{pkg.price > 0 ? '/mo' : ''}</p>
              <p className="text-sm mb-4">{pkg.description}</p>
              <ul className="space-y-2">
                {pkg.features.map((f, i) => (
                  <li key={i} className="flex gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /> {f}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const PackagesPage = Packages;
export default Packages;
