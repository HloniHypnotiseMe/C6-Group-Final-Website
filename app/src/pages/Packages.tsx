import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SimplyBluPaymentButton } from '@/components/SimplyBluPayment';
import {
  CheckCircle2, X, Zap, MessageSquare, TrendingUp, Rocket,
  Globe, ChevronRight, Building2, Mail
} from 'lucide-react';

const packages = [
  {
    id: 'start',
    name: 'Start',
    tagline: 'Get Found & Get Leads',
    description: 'Get started with a free AI business audit and the tools you need to be discovered online.',
    monthlyPrice: 0,
    annualPrice: 0,
    popular: false,
    icon: Zap,
    features: [
      { text: '1 Free AI Business Audit', included: true },
      { text: 'Basic Business Directory Listing', included: true },
      { text: '10 AI Tool Uses/Month', included: true },
      { text: 'Basic Analytics Dashboard', included: true },
      { text: 'WhatsApp Support', included: true },
      { text: 'Email Marketing Suite', included: false },
      { text: 'Social Media Automation', included: false },
      { text: 'Advanced Analytics', included: false },
      { text: 'Priority Support', included: false },
      { text: 'Custom Integrations', included: false },
    ],
  },
  {
    id: 'grow',
    name: 'Grow',
    tagline: 'Automated Engagement',
    description: 'Automate your marketing and customer engagement so you can focus on running your business.',
    monthlyPrice: 299,
    annualPrice: 249,
    popular: true,
    icon: MessageSquare,
    features: [
      { text: '5 AI Business Audits/Month', included: true },
      { text: 'Enhanced Directory Listing', included: true },
      { text: '50 AI Tool Uses/Month', included: true },
      { text: 'Email Marketing Suite (Unlimited Sends)', included: true },
      { text: 'Social Media Automation', included: true },
      { text: 'Basic Analytics Dashboard', included: true },
      { text: 'WhatsApp & Email Support', included: true },
      { text: 'Advanced AI Analytics', included: false },
      { text: 'Priority Support', included: false },
      { text: 'Custom Integrations', included: false },
    ],
  },
  {
    id: 'scale',
    name: 'Scale',
    tagline: 'Revenue & Customer Growth',
    description: 'Advanced automation, AI-powered lead generation, and the tools to scale your revenue.',
    monthlyPrice: 699,
    annualPrice: 599,
    popular: false,
    icon: TrendingUp,
    features: [
      { text: '10 AI Business Audits/Month', included: true },
      { text: 'Premium Directory Listing', included: true },
      { text: '200 AI Tool Uses/Month', included: true },
      { text: 'Email Marketing Suite (Unlimited Sends)', included: true },
      { text: 'Advanced Social Media Automation', included: true },
      { text: 'Full Analytics Suite with AI Insights', included: true },
      { text: 'AI-Powered Lead Generation', included: true },
      { text: 'Priority WhatsApp, Email & Phone Support', included: true },
      { text: 'Custom API Integrations', included: true },
      { text: 'Dedicated Account Manager', included: false },
    ],
  },
];

const aiLimits = [
  { feature: 'AI Business Audit', start: '1/month', grow: '5/month', scale: '10/month' },
  { feature: 'Email Marketing Sends', start: '-', grow: 'Unlimited', scale: 'Unlimited' },
  { feature: 'Social Media Posts', start: '-', grow: 'Auto-scheduled', scale: 'Auto-scheduled + AI' },
  { feature: 'AI Content Generation', start: '3/month', grow: '20/month', scale: '100/month' },
  { feature: 'SEO Analyzer', start: '1/month', grow: '10/month', scale: '50/month' },
  { feature: 'Email Assistant', start: '-', grow: '50/month', scale: '200/month' },
  { feature: 'Chatbot Interactions', start: '10/month', grow: '100/month', scale: '500/month' },
  { feature: 'Sales Assistant', start: '-', grow: '20/month', scale: '100/month' },
  { feature: 'Marketing Strategy', start: '1/month', grow: '5/month', scale: '20/month' },
  { feature: 'Data Analyst', start: '-', grow: '-', scale: '50/month' },
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
            <h1 className="mb-4">Start Free. Grow Smart. Scale Fast.</h1>
            <p className="text-slate-600 mx-auto mb-8">
              Choose the plan that matches your business stage. Every plan is built to help you 
              get found, engage customers, and grow revenue. All paid plans include a 14-day free trial.
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
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
                  <p className={`text-xs font-medium uppercase tracking-wide mb-2 ${pkg.popular ? 'text-emerald-400' : 'text-emerald-600'}`}>{pkg.tagline}</p>
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
                    variant="primary"
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

        {/* Enterprise Section */}
        <div className="container-max section-padding mb-20">
          <div className="max-w-4xl mx-auto bg-slate-900 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-8 h-8 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-semibold uppercase tracking-wide">Enterprise</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Dominance & Custom Solutions
              </h2>
              <p className="text-slate-300 max-w-2xl mb-6">
                For large organisations and businesses with unique needs. Fully custom infrastructure, 
                dedicated team, hands-on consulting, and white-label solutions. We build exactly what you need.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Dedicated Development Team
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Custom AI Model Training
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> White-label Solutions
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> On-premise Deployment
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> 24/7 Priority Support
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Dedicated Account Manager
                  </li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <span className="text-3xl font-bold text-white">From R500k<span className="text-lg font-normal text-slate-400">/year</span></span>
                <a href="https://wa.me/27735558440" target="_blank" rel="noopener noreferrer"
                  className="btn-primary bg-emerald-600 hover:bg-emerald-500"
                >
                  Contact Us for a Quote <ChevronRight className="ml-1 w-4 h-4" />
                </a>
              </div>
            </div>
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
                    <th className="text-center py-3 px-4 font-semibold text-slate-500">Start</th>
                    <th className="text-center py-3 px-4 font-semibold text-emerald-600">Grow</th>
                    <th className="text-center py-3 px-4 font-semibold text-amber-600">Scale</th>
                  </tr>
                </thead>
                <tbody>
                  {aiLimits.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-700">{row.feature}</td>
                      <td className="text-center py-3 px-4 text-slate-500">{row.start}</td>
                      <td className="text-center py-3 px-4 text-emerald-600 font-medium">{row.grow}</td>
                      <td className="text-center py-3 px-4 text-amber-600 font-medium">{row.scale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Email Suite Standalone CTA */}
        <div className="container-max section-padding mb-20">
          <div className="max-w-2xl mx-auto text-center bg-emerald-50 rounded-2xl p-10">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Just Need Email Marketing?</h2>
            <p className="text-slate-600 mb-6">
              Our Email Marketing Suite is included in Grow and Scale plans. But if you only need email, 
              you can get it standalone for <strong className="text-emerald-600">R199/month</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/email-suite" className="btn-primary">
                Learn About Email Suite <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
              <a href="https://wa.me/27735558440" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Get Email Suite
              </a>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="container-max section-padding">
          <div className="max-w-2xl mx-auto text-center bg-slate-50 rounded-2xl p-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Need a Custom Solution?</h2>
            <p className="text-slate-600 mb-6">
              For larger teams or specific requirements, contact us for a tailored enterprise package.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://wa.me/27735558440" target="_blank" rel="noopener noreferrer" className="btn-primary">
                <MessageSquare className="w-4 h-4 mr-2" /> WhatsApp Us
              </a>
              <Link to="/audit" className="btn-secondary">
                Take the Free Audit <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
