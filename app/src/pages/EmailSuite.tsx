import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import {
  Mail, Shield, BarChart3, Zap, Globe, CheckCircle2, ArrowRight, Send, Server
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Self-Hosted & Privacy-First',
    description: 'Your data stays on your infrastructure. No third-party snooping. Full POPIA compliance built-in.',
  },
  {
    icon: Send,
    title: 'Unlimited Email Sends',
    description: 'Send as many emails as you need. No caps, no throttling, no extra fees per email.',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track open rates, click rates, conversions, and revenue attribution in real-time.',
  },
  {
    icon: Zap,
    title: 'AI-Powered Content Generation',
    description: 'Let our AI write compelling subject lines, body copy, and CTAs tailored to your audience.',
  },
  {
    icon: Server,
    title: 'Dedicated IP & High Deliverability',
    description: 'Get your own sending IP with warmup support. Land in inboxes, not spam folders.',
  },
  {
    icon: Globe,
    title: 'Built for South Africa',
    description: 'Local infrastructure, local support, and compliance with South African data protection laws.',
  },
];

const pricingTiers = [
  {
    name: 'Included in Grow',
    price: 'R299/mo',
    description: 'Email Suite + all Grow features',
    features: ['Unlimited email sends', 'Basic templates', 'AI content generation', 'Standard analytics'],
    cta: 'Get Grow Plan',
    href: '/packages',
    featured: false,
  },
  {
    name: 'Included in Scale',
    price: 'R699/mo',
    description: 'Email Suite + all Scale features',
    features: ['Unlimited email sends', 'Premium templates', 'Advanced AI content', 'Full analytics suite', 'Dedicated IP', 'Priority support'],
    cta: 'Get Scale Plan',
    href: '/packages',
    featured: true,
  },
  {
    name: 'Standalone Email',
    price: 'R199/mo',
    description: 'Email Suite only',
    features: ['Unlimited email sends', 'Basic templates', 'Standard analytics', 'Email support'],
    cta: 'Get Email Suite',
    href: 'https://wa.me/27735558440',
    featured: false,
  },
];

export function EmailSuitePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="pb-16 md:pb-20">
          <div className="container-max section-padding">
            <div className="text-center max-w-3xl mx-auto">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="w-7 h-7 text-emerald-600" />
              </div>
              <span className="eyebrow mb-4 inline-block">Email Marketing</span>
              <h1 className="mb-6">
                Launch Professional Email Campaigns with{' '}
                <span className="text-emerald-600">C6GROUP</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                A self-hosted, privacy-first email marketing suite built for South African businesses. 
                Unlimited sends, AI-powered content, and advanced analytics — all included in your C6GROUP plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/packages" className="btn-primary">
                  Get Started with Grow <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <a href="https://wa.me/27735558440" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  Talk to Sales
                </a>
              </div>
              <p className="text-sm text-slate-500 mt-4">
                Included in Grow & Scale plans. Standalone option available at R199/month.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 md:py-24 bg-slate-50">
          <div className="container-max section-padding">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="eyebrow mb-4 inline-block">Features</span>
              <h2 className="mb-4">Everything You Need for Email Success</h2>
              <p className="text-slate-600 mx-auto">
                From AI-generated content to deliverability management, our Email Suite handles it all.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <div key={i} className="card-clean">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 md:py-24">
          <div className="container-max section-padding">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="eyebrow mb-4 inline-block">How It Works</span>
              <h2 className="mb-4">Send Better Emails in 3 Steps</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { step: '01', title: 'Connect Your Domain', description: 'Verify your domain and get a dedicated sending IP. We guide you through DNS setup.' },
                { step: '02', title: 'Build Your Campaign', description: 'Use AI to generate subject lines and body copy, or choose from our template library.' },
                { step: '03', title: 'Launch & Analyse', description: 'Send to your list and watch real-time analytics: opens, clicks, conversions, and revenue.' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-emerald-600 font-bold">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 md:py-24 bg-slate-50">
          <div className="container-max section-padding">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="eyebrow mb-4 inline-block">Pricing</span>
              <h2 className="mb-4">Simple Email Pricing</h2>
              <p className="text-slate-600 mx-auto">
                The Email Suite is included in our Grow and Scale plans. Need it standalone? We have that too.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`rounded-2xl p-6 ${tier.featured
                    ? 'bg-slate-900 text-white ring-2 ring-emerald-500 shadow-xl'
                    : 'bg-white border border-slate-200'
                    }`}
                >
                  {tier.featured && (
                    <span className="badge-emerald mb-4 inline-block">Recommended</span>
                  )}
                  <h3 className={`text-lg font-semibold mb-1 ${tier.featured ? 'text-white' : 'text-slate-900'}`}>
                    {tier.name}
                  </h3>
                  <p className={`text-sm mb-4 ${tier.featured ? 'text-slate-300' : 'text-slate-500'}`}>{tier.description}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className={`text-3xl font-bold ${tier.featured ? 'text-white' : 'text-slate-900'}`}>{tier.price}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${tier.featured ? 'text-emerald-400' : 'text-emerald-500'}`} />
                        <span className={tier.featured ? 'text-slate-200' : 'text-slate-600'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  {tier.href.startsWith('http') ? (
                    <a href={tier.href} target="_blank" rel="noopener noreferrer"
                      className={`block text-center py-3 rounded-lg font-semibold text-sm transition-colors ${tier.featured
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {tier.cta}
                    </a>
                  ) : (
                    <Link to={tier.href}
                      className={`block text-center py-3 rounded-lg font-semibold text-sm transition-colors ${tier.featured
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {tier.cta}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-24">
          <div className="container-max section-padding">
            <div className="max-w-2xl mx-auto text-center bg-emerald-600 rounded-2xl p-10">
              <h2 className="text-white mb-3">Ready to Launch Your Email Campaigns?</h2>
              <p className="text-emerald-100 mb-8">
                Start with the Email Suite included in our Grow plan, or get it standalone for R199/month.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/packages" className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-700 font-bold rounded-lg hover:bg-emerald-50 transition-colors">
                  View Plans <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <a href="https://wa.me/27735558440" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors border border-emerald-500"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
