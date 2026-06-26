import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SimplyBluPaymentButton } from '@/components/SimplyBluPayment';
import {
  CheckCircle2, X, Bot, MessageSquare,
  Globe, Shield, ChevronRight, Zap
} from 'lucide-react';

const packages = [
  {
    id: 'lead',
    name: 'Lead',
    description: 'Get started with a free AI business audit and basic AI tools.',
    monthlyPrice: 0,
    annualPrice: 0,
    popular: false,
    icon: Zap,
    features: [
      { text: '1 AI Business Audit', included: true },
      { text: '10 AI Tool uses/month', included: true },
      { text: 'Basic Analytics Dashboard', included: true },
      { text: 'WhatsApp Support', included: true },
      { text: 'Email Support', included: false },
      { text: 'Marketing Automation', included: false },
      { text: 'Priority Support', included: false },
      { text: 'Custom Integrations', included: false },
      { text: 'Advanced Analytics', included: false },
      { text: 'Dedicated Account Manager', included: false },
    ],
  },
  {
    id: 'diamond',
    name: 'Diamond',
    description: 'Perfect for small businesses ready to leverage AI for growth.',
    monthlyPrice: 299,
    annualPrice: 249,
    popular: true,
    icon: Bot,
    features: [
      { text: '5 AI Business Audits/month', included: true },
      { text: '50 AI Tool uses/month', included: true },
      { text: 'Advanced Analytics Dashboard', included: true },
      { text: 'WhatsApp & Email Support', included: true },
      { text: 'Marketing Automation Suite', included: true },
      { text: 'Social Media Management', included: true },
      { text: 'Priority Support', included: false },
      { text: 'Custom Integrations', included: false },
      { text: 'Advanced Analytics', included: false },
      { text: 'Dedicated Account Manager', included: false },
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    description: 'For growing businesses that need more AI power and support.',
    monthlyPrice: 699,
    annualPrice: 599,
    popular: false,
    icon: Shield,
    features: [
      { text: '10 AI Business Audits/month', included: true },
      { text: '200 AI Tool uses/month', included: true },
      { text: 'Full Analytics Suite', included: true },
      { text: 'Priority WhatsApp, Email & Phone', included: true },
      { text: 'Full Marketing Automation', included: true },
      { text: 'Advanced SEO Tools', included: true },
      { text: 'Priority Support', included: true },
      { text: 'Custom API Integrations', included: true },
      { text: 'Team Collaboration', included: true },
      { text: 'Dedicated Account Manager', included: false },
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    description: 'Enterprise-grade AI solutions with unlimited access.',
    monthlyPrice: 1499,
    annualPrice: 1299,
    popular: false,
    icon: Globe,
    features: [
      { text: 'Unlimited AI Business Audits', included: true },
      { text: 'Unlimited AI Tool uses', included: true },
      { text: 'Enterprise Analytics Suite', included: true },
      { text: '24/7 Priority Support', included: true },
      { text: 'Full Marketing Automation', included: true },
      { text: 'Advanced SEO & SEM Tools', included: true },
      { text: 'White-label Solutions', included: true },
      { text: 'Custom API Integrations', included: true },
      { text: 'Unlimited Team Members', included: true },
      { text: 'Dedicated Account Manager', included: true },
    ],
  },
];

const aiLimits = [
  { feature: 'AI Business Audit', lead: '1/month', diamond: '5/month', gold: '10/month', platinum: 'Unlimited' },
  { feature: 'Content Generator', lead: '3/month', diamond: '20/month', gold: '100/month', platinum: 'Unlimited' },
  { feature: 'SEO Analyzer', lead: '1/month', diamond: '10/month', gold: '50/month', platinum: 'Unlimited' },
  { feature: 'Email Assistant', lead: '5/month', diamond: '50/month', gold: '200/month', platinum: 'Unlimited' },
  { feature: 'Chatbot', lead: '10/month', diamond: '100/month', gold: '500/month', platinum: 'Unlimited' },
  { feature: 'Sales Assistant', lead: '3/month', diamond: '20/month', gold: '100/month', platinum: 'Unlimited' },
  { feature: 'Marketing Strategy', lead: '1/month', diamond: '5/month', gold: '20/month', platinum: 'Unlimited' },
  { feature: 'Data Analyst', lead: '-', diamond: '-', gold: '50/month', platinum: 'Unlimited' },
  { feature: 'Code Assistant', lead: '-', diamond: '-', gold: '20/month', platinum: 'Unlimited' },
];

export function PackagesPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-24 pb-20">
        {/* Header */}
        <div className="container-max section-padding mb-16">
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow mb-3 inline-block">Pricing</span>
            <h1 className="mb-4">Simple, Transparent Pricing</h1>
            <p className="text-slate-600 mx-auto mb-8">
              Choose the plan that fits your business. All paid plans include a 14-day free trial. No credit card required.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-3 bg-slate-100 rounded-full p-1">
              <button onClick={() => setIsAnnual(false)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${!isAnnual ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >Monthly</button>
              <button onClick={() => setIsAnnual(true)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${isAnnual ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >Annual <span className="badge-emerald text-[10px]">Save 20%</span></button>
            </div>
          </div>
        </div>

        {/* Package Cards */}
        <div className="container-max section-padding mb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id}
                className={`relative rounded-2xl p-6 flex flex-col ${pkg.popular
                  ? 'bg-slate-900 text-white ring-2 ring-emerald-500 shadow-xl'
                  : 'bg-white border border-slate-200'
                  }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge-emerald text-[10px] px-3 py-1">
                    Most Popular
                  </span>
                )}
                <div className="mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${pkg.popular ? 'bg-emerald-600' : 'bg-emerald-100'}`}>
                    <pkg.icon className={`w-5 h-5 ${pkg.popular ? 'text-white' : 'text-emerald-600'}`} />
                  </div>
                  <h3 className={`text-lg font-semibold mb-1 ${pkg.popular ? 'text-white' : 'text-slate-900'}`}>{pkg.name}</h3>
                  <p className={`text-sm ${pkg.popular ? 'text-slate-300' : 'text-slate-500'}`}>{pkg.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-bold ${pkg.popular ? 'text-white' : 'text-slate-900'}`}>
                      {pkg.monthlyPrice === 0 ? 'Free' : `R${isAnnual ? pkg.annualPrice : pkg.monthlyPrice}`}
                    </span>
                    {pkg.monthlyPrice > 0 && (
                      <span className={`text-sm ${pkg.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                        /{isAnnual ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  {isAnnual && pkg.monthlyPrice > 0 && (
                    <p className={`text-xs mt-1 ${pkg.popular ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      Save R{(pkg.monthlyPrice - pkg.annualPrice) * 12}/year
                    </p>
                  )}
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {pkg.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2 text-sm">
                      {f.included ? (
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${pkg.popular ? 'text-emerald-400' : 'text-emerald-500'}`} />
                      ) : (
                        <X className="w-4 h-4 shrink-0 mt-0.5 text-slate-300" />
                      )}
                      <span className={f.included ? (pkg.popular ? 'text-slate-200' : 'text-slate-600') : (pkg.popular ? 'text-slate-500' : 'text-slate-300')}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {pkg.monthlyPrice === 0 ? (
                  <Link to="/register"
                    className="block text-center py-3 rounded-lg font-semibold text-sm transition-colors bg-slate-100 text-slate-700 hover:bg-slate-200"
                  >
                    Get Started Free
                  </Link>
                ) : isAuthenticated ? (
                  <SimplyBluPaymentButton
                    amount={isAnnual ? pkg.annualPrice : pkg.monthlyPrice}
                    description={`${pkg.name} Plan - ${isAnnual ? 'Annual' : 'Monthly'} Subscription`}
                    packageId={pkg.id}
                    buttonText={isAnnual ? `Subscribe Annually (R${pkg.annualPrice})` : `Subscribe Monthly (R${pkg.monthlyPrice})`}
                    variant={pkg.popular ? 'primary' : 'primary'}
                    className={pkg.popular ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-0' : ''}
                  />
                ) : (
                  <Link to="/register"
                    className={`block text-center py-3 rounded-lg font-semibold text-sm transition-colors ${pkg.popular
                      ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    Start Free Trial
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Usage Limits Table */}
        <div className="container-max section-padding mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center mb-2">AI Usage Limits Per Plan</h2>
            <p className="text-center text-slate-600 mb-8">See how many AI calls you get with each package.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">AI Feature</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-500">Lead</th>
                    <th className="text-center py-3 px-4 font-semibold text-emerald-600">Diamond</th>
                    <th className="text-center py-3 px-4 font-semibold text-amber-600">Gold</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-900">Platinum</th>
                  </tr>
                </thead>
                <tbody>
                  {aiLimits.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-700">{row.feature}</td>
                      <td className="text-center py-3 px-4 text-slate-500">{row.lead}</td>
                      <td className="text-center py-3 px-4 text-emerald-600 font-medium">{row.diamond}</td>
                      <td className="text-center py-3 px-4 text-amber-600 font-medium">{row.gold}</td>
                      <td className="text-center py-3 px-4 text-slate-900 font-medium">{row.platinum}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="container-max section-padding">
          <div className="max-w-2xl mx-auto text-center bg-emerald-50 rounded-2xl p-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Need a Custom Solution?</h2>
            <p className="text-slate-600 mb-6">
              For larger teams or specific requirements, contact us for a tailored enterprise package.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://wa.me/27735558440" target="_blank" rel="noopener noreferrer" className="btn-primary">
                <MessageSquare className="w-4 h-4 mr-2" /> WhatsApp Us
              </a>
              <Link to="/audit" className="btn-secondary">
                Take the Free Audit <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
