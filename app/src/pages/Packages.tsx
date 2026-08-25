import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { RemotePay } from '@/components/RemotePay';
import { CheckCircle2, Zap, TrendingUp, Rocket, Building2, MessageSquare, ChevronRight } from 'lucide-react';

const packages = [
  {
    id: 'start',
    name: 'Start',
    price: 0,
    tagline: 'Get Found',
    description: 'Start with the intelligence and visibility foundations your business needs.',
    icon: Zap,
    popular: false,
    features: [
      'Free AI Business Audit',
      'Basic business directory listing',
      '10 AI tool uses per month',
      'Basic growth insights',
      'WhatsApp support',
    ],
  },
  {
    id: 'visibility',
    name: 'Visibility Machine',
    price: 499,
    tagline: 'Get Found & Get Leads',
    description: 'Build a stronger digital presence and turn local attention into enquiries.',
    icon: TrendingUp,
    popular: true,
    features: [
      'Everything in Start',
      'Enhanced directory presence',
      'AI-assisted content creation',
      'Search & visibility support',
      'Reputation and review support',
      'Growth reporting',
    ],
  },
  {
    id: 'growth',
    name: 'Customer Growth Machine',
    price: 1499,
    tagline: 'Turn Attention Into Customers',
    description: 'Connect marketing, lead generation and customer engagement into one growth system.',
    icon: Rocket,
    popular: false,
    features: [
      'Everything in Visibility Machine',
      'Lead generation workflows',
      'Email marketing automation',
      'Social content & campaign support',
      'AI customer engagement',
      'Advanced growth analytics',
    ],
  },
];

export function PackagesPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-24 pb-20">
        <section className="container-max section-padding mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="eyebrow mb-3 inline-block">Business Growth Systems</span>
            <h1 className="mb-4">Choose the machine your business needs.</h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              C6 combines AI agents, automation, analytics and business intelligence into practical systems that help South African businesses get found, win customers and grow. Start with the free audit and upgrade when you are ready.
            </p>
          </div>
        </section>

        <section className="container-max section-padding mb-20">
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {packages.map((pkg) => {
              const Icon = pkg.icon;
              return (
                <div
                  key={pkg.id}
                  className={`relative rounded-2xl p-6 flex flex-col ${pkg.popular
                    ? 'bg-slate-900 text-white ring-2 ring-emerald-500 shadow-xl'
                    : 'bg-white border border-slate-200 shadow-sm'}`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge-emerald text-[10px] px-3 py-1">
                      MOST POPULAR
                    </span>
                  )}

                  <div className="mb-5">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${pkg.popular ? 'bg-emerald-600' : 'bg-emerald-100'}`}>
                      <Icon className={`w-5 h-5 ${pkg.popular ? 'text-white' : 'text-emerald-600'}`} />
                    </div>
                    <h2 className={`text-xl font-bold mb-1 ${pkg.popular ? 'text-white' : 'text-slate-900'}`}>{pkg.name}</h2>
                    <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${pkg.popular ? 'text-emerald-400' : 'text-emerald-600'}`}>{pkg.tagline}</p>
                    <p className={`text-sm leading-relaxed ${pkg.popular ? 'text-slate-300' : 'text-slate-500'}`}>{pkg.description}</p>
                  </div>

                  <div className="mb-6">
                    <span className={`text-3xl font-bold ${pkg.popular ? 'text-white' : 'text-slate-900'}`}>
                      {pkg.price === 0 ? 'Free' : `R${pkg.price}`}
                    </span>
                    {pkg.price > 0 && <span className={`text-sm ml-1 ${pkg.popular ? 'text-slate-400' : 'text-slate-500'}`}>/month</span>}
                    {pkg.price === 0 && <p className="text-xs text-slate-500 mt-1">No card required</p>}
                  </div>

                  <ul className="space-y-3 mb-7 flex-1">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${pkg.popular ? 'text-emerald-400' : 'text-emerald-500'}`} />
                        <span className={pkg.popular ? 'text-slate-200' : 'text-slate-600'}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {pkg.price === 0 ? (
                    <Link to="/audit" className="block text-center py-3 rounded-lg font-semibold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                      Get My Free Audit
                    </Link>
                  ) : isAuthenticated ? (
                    <RemotePay
                      amount={pkg.price}
                      description={`${pkg.name} - Monthly Subscription`}
                      merchantId={undefined}
                      brandId="c6-group"
                      productId={`c6-${pkg.id}`}
                      offerId={pkg.id}
                    />
                  ) : (
                    <Link to="/register" className="block text-center py-3 rounded-lg font-semibold text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
                      Create Account & Start
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="container-max section-padding mb-20">
          <div className="max-w-4xl mx-auto rounded-2xl bg-slate-900 p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-7 h-7 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-semibold uppercase tracking-wide">Custom Business Intelligence</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Need a deeper operating system?</h2>
              <p className="text-slate-300 max-w-2xl mb-7">
                For larger organisations, C6 can combine AI agents, automation, analytics, integrations and implementation into a tailored system. We scope the requirement first and price against the actual work and value delivered.
              </p>
              <a href="https://wa.me/27735558440" target="_blank" rel="noopener noreferrer" className="inline-flex items-center btn-primary bg-emerald-600 hover:bg-emerald-500">
                Talk to C6 <ChevronRight className="ml-1 w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        <section className="container-max section-padding mb-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-3">Not sure what you need?</h2>
            <p className="text-slate-600 mb-6">Start with the business audit. C6 will identify the biggest opportunities before you choose a machine.</p>
            <Link to="/audit" className="btn-primary inline-flex items-center">
              Take the Free AI Business Audit <ChevronRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="container-max section-padding">
          <div className="max-w-3xl mx-auto rounded-2xl bg-emerald-50 p-8 text-center">
            <MessageSquare className="w-7 h-7 text-emerald-600 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Need help choosing?</h2>
            <p className="text-slate-600 mb-5">Tell us what you are trying to achieve and we will point you toward the simplest starting point.</p>
            <a href="https://wa.me/27735558440" target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex items-center">
              WhatsApp C6
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
