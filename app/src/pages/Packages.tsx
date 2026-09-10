import { Link, useNavigate } from 'react-router-dom';
import { Zap, Diamond as DiamondIcon, TrendingUp, Rocket, Building2, Check, ArrowRight, MessageCircle } from 'lucide-react';
import { getCommercialPackage, FRONTEND_TO_COMMERCIAL_SKU } from '../../../shared/commercialContract';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

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
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const startCheckout = (packageId: string) => {
    if (packageId === 'start') {
      navigate('/audit');
      return;
    }
    if (packageId === 'enterprise') {
      window.location.href = 'mailto:hello@c6group.co.za?subject=C6%20Enterprise%20Enquiry';
      return;
    }

    const target = `/payment/checkout?package=${encodeURIComponent(packageId)}&billingCycle=MONTHLY`;
    navigate(isAuthenticated ? target : `/login?redirect=${encodeURIComponent(target)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="container mx-auto px-4 pt-28 pb-16">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 mb-2">C6GROUP Commercial Packages</p>
          <h1 className="text-4xl font-bold text-slate-900">Choose the operating layer your business needs</h1>
          <p className="max-w-2xl mx-auto mt-4 text-slate-600">Start free, then activate the C6 tools that help your business get found, handle customers and grow revenue.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 items-stretch">
          {packages.map((pkg) => {
            const Icon = pkg.icon;
            const custom = pkg.price === null;
            const isFree = pkg.id === 'start';
            return (
              <div key={pkg.id} className={`flex flex-col border rounded-xl p-6 bg-white ${pkg.popular ? 'border-primary shadow-lg xl:scale-105' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-xl font-bold text-slate-900">{pkg.name}</h3>
                  {pkg.popular && <span className="bg-primary text-white text-xs px-2 py-1 rounded">POPULAR</span>}
                </div>
                <p className="text-sm text-slate-500 mb-2">{pkg.tagline}</p>
                <p className="text-3xl font-bold text-slate-900 mb-4">{custom ? 'Custom' : `R${pkg.price?.toLocaleString('en-ZA')}${pkg.price && pkg.price > 0 ? '/mo' : ''}`}</p>
                <p className="text-sm text-slate-600 mb-4">{pkg.description}</p>
                <ul className="space-y-2 flex-1">
                  {pkg.features.map((feature) => <li key={feature} className="flex gap-2 text-sm text-slate-700"><Check className="w-4 h-4 text-green-500 shrink-0" /> {feature}</li>)}
                </ul>
                <Button onClick={() => startCheckout(pkg.id)} className="w-full mt-6 btn-primary">
                  {isFree ? 'Start Free Audit' : custom ? 'Talk to C6' : 'Get Started'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                {!isFree && !custom && <p className="text-xs text-center text-slate-400 mt-2">Secure checkout via RemotePay</p>}
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-slate-500">Annual pricing is available at 10 monthly-equivalent payments. Enterprise is custom quoted.</p>
          <Link to="/audit" className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-emerald-600 hover:text-emerald-700">
            <MessageCircle className="w-4 h-4" /> Not sure what you need? Run the free AI Business Audit
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export const PackagesPage = Packages;
export default Packages;
