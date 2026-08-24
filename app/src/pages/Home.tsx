import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { WhatsAppChat } from '@/components/WhatsAppChat';
import { ArrowRight, TrendingUp, Bot, Zap, BarChart3, CheckCircle2, MessageCircle, Mail, ShieldCheck } from 'lucide-react';

function TrustLogos() {
  const logos = ['Shopify', 'WooCommerce', 'WordPress', 'Google', 'Meta', 'RemotePay'];
  return (
    <section className="border-y border-slate-100 bg-slate-50/50">
      <div className="container-max py-8 section-padding">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 mb-6">
          Built to work with the tools South African businesses already use
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {logos.map((name) => <span key={name} className="text-lg font-bold text-slate-300 select-none">{name}</span>)}
        </div>
      </div>
    </section>
  );
}

function HeroSection() {
  return (
    <section className="pt-24 pb-16 md:pt-28 md:pb-20 overflow-hidden">
      <div className="container-max section-padding">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="max-w-xl">
            <span className="eyebrow mb-4 inline-block">AI-Powered Business Intelligence</span>
            <h1 className="mb-6">
              Understand your business.{' '}
              <span className="text-emerald-600">Then build the growth machine.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              C6GROUP audits your business, identifies practical opportunities and connects you with AI-powered tools and growth systems designed for South African businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link to="/audit" className="btn-primary">Free AI Business Audit <ArrowRight className="ml-2 w-4 h-4" /></Link>
              <Link to="/ai-tools" className="btn-secondary">Explore AI Tools</Link>
            </div>
            <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Start with an audit</span>
            </div>
          </div>
          <div className="relative">
            <img src="/hero-main.jpg" alt="South African business owner using C6GROUP business tools" className="rounded-2xl shadow-xl w-full object-cover aspect-[4/3]" />
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg border border-slate-100 p-4 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center"><TrendingUp className="w-5 h-5 text-emerald-600" /></div>
                <div><p className="text-sm font-bold text-slate-900">Business Audit</p><p className="text-xs text-slate-500">Find your biggest opportunities</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { icon: Bot, title: 'AI Tools', description: 'A growing suite of specialised AI tools for content, analysis, customer engagement and everyday business work.', image: '/feature-ai-tools.jpg' },
    { icon: Mail, title: 'Customer Engagement', description: 'Use AI-assisted email and marketing workflows to communicate consistently with customers.', image: '/feature-email.jpg' },
    { icon: BarChart3, title: 'Business Analytics', description: 'Turn business information into practical insights so you can see where attention and effort should go next.', image: '/feature-analytics.jpg' },
    { icon: Zap, title: 'Marketing Automation', description: 'Reduce repetitive marketing work with intelligent workflows and reusable business systems.', image: '/feature-marketing.jpg' },
  ];
  return (
    <section className="py-20 md:py-24 bg-slate-50">
      <div className="container-max section-padding">
        <div className="text-center max-w-2xl mx-auto mb-16"><span className="eyebrow mb-4 inline-block">The C6 Toolkit</span><h2 className="mb-4">Business outcomes first. AI underneath.</h2><p className="text-slate-600">C6 packages AI capabilities into practical systems rather than asking you to figure out which AI tool to use.</p></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => <div key={feature.title} className="card-clean overflow-hidden group"><div className="aspect-[3/2] overflow-hidden -mx-6 -mt-6 mb-5"><img src={feature.image} alt={feature.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /></div><div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4"><feature.icon className="w-5 h-5 text-emerald-600" /></div><h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3><p className="text-sm text-slate-600">{feature.description}</p></div>)}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { number: '01', title: 'Get Audited', description: 'Tell C6 about your business and let the audit identify visibility, customer acquisition and growth opportunities.' },
    { number: '02', title: 'Get Your Recommendations', description: 'Receive practical recommendations based on your business rather than a generic list of AI tools.' },
    { number: '03', title: 'Deploy the Right Machine', description: 'Choose the simplest package that addresses the opportunity, then use C6 tools and workflows to execute.' },
  ];
  return (
    <section className="py-20 md:py-24"><div className="container-max section-padding"><div className="grid lg:grid-cols-2 gap-16 items-center"><div className="order-2 lg:order-1"><img src="/feature-small-business.jpg" alt="South African business owner using C6GROUP" className="rounded-2xl shadow-lg w-full object-cover aspect-[4/3]" /></div><div className="order-1 lg:order-2"><span className="eyebrow mb-4 inline-block">How C6 Works</span><h2 className="mb-8">From business reality to practical action.</h2><div className="space-y-8">{steps.map((step) => <div key={step.number} className="flex gap-5"><span className="text-2xl font-bold text-emerald-600 shrink-0 w-12">{step.number}</span><div><h3 className="text-lg font-semibold text-slate-900 mb-1">{step.title}</h3><p className="text-sm text-slate-600">{step.description}</p></div></div>)}</div><div className="mt-8"><Link to="/audit" className="btn-primary">Start Your Free Audit <ArrowRight className="ml-2 w-4 h-4" /></Link></div></div></div></div></section>
  );
}

function PackagesSection() {
  const packages = [
    { name: 'Start', tagline: 'Get Found', price: 'Free', description: 'Begin with business intelligence and visibility foundations.', features: ['Free AI Business Audit', 'Basic Directory Listing', 'AI tool access', 'Basic growth insights'], href: '/audit', cta: 'Get My Free Audit', featured: false },
    { name: 'Visibility Machine', tagline: 'Get Found & Get Leads', price: 'R499', period: '/month', description: 'Build a stronger presence and turn local attention into enquiries.', features: ['Enhanced visibility', 'AI-assisted content', 'Search support', 'Reputation support'], href: '/packages', cta: 'Build My Visibility', featured: true },
    { name: 'Customer Growth Machine', tagline: 'Turn Attention Into Customers', price: 'R1,499', period: '/month', description: 'Connect lead generation, marketing and customer engagement.', features: ['Lead workflows', 'Email automation', 'Social campaign support', 'Advanced growth analytics'], href: '/packages', cta: 'Grow My Customer Base', featured: false },
  ];
  return (
    <section className="py-20 md:py-24 bg-slate-50"><div className="container-max section-padding"><div className="text-center max-w-2xl mx-auto mb-16"><span className="eyebrow mb-4 inline-block">Pricing</span><h2 className="mb-4">Buy the outcome. C6 provides the machinery.</h2><p className="text-slate-600">Start free, then choose the business growth system that matches the problem you actually need to solve.</p></div><div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">{packages.map((pkg) => <div key={pkg.name} className={`rounded-2xl p-6 ${pkg.featured ? 'bg-slate-900 text-white ring-2 ring-emerald-500 shadow-xl' : 'bg-white border border-slate-200'}`}>{pkg.featured && <span className="badge-emerald mb-4 inline-block">Most Popular</span>}<h3 className={`text-lg font-semibold mb-1 ${pkg.featured ? 'text-white' : 'text-slate-900'}`}>{pkg.name}</h3><p className={`text-xs font-medium uppercase tracking-wide mb-2 ${pkg.featured ? 'text-emerald-400' : 'text-emerald-600'}`}>{pkg.tagline}</p><div className="flex items-baseline gap-1 mb-2"><span className={`text-3xl font-bold ${pkg.featured ? 'text-white' : 'text-slate-900'}`}>{pkg.price}</span>{pkg.period && <span className={pkg.featured ? 'text-slate-300' : 'text-slate-500'}>{pkg.period}</span>}</div><p className={`text-sm mb-6 ${pkg.featured ? 'text-slate-300' : 'text-slate-600'}`}>{pkg.description}</p><ul className="space-y-3 mb-8">{pkg.features.map((f) => <li key={f} className="flex items-start gap-2 text-sm"><CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${pkg.featured ? 'text-emerald-400' : 'text-emerald-500'}`} /><span className={pkg.featured ? 'text-slate-200' : 'text-slate-600'}>{f}</span></li>)}</ul><Link to={pkg.href} className={`block text-center py-3 rounded-lg font-semibold text-sm ${pkg.featured ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{pkg.cta}</Link></div>)}</div><p className="text-center text-sm text-slate-500 mt-8">Need a custom system? <Link to="/packages" className="font-medium text-emerald-700">Request a scoped plan</Link>.</p></div></section>
  );
}

function EcosystemSection() {
  const ecosystem = [
    { name: 'C6 Group', role: 'Parent commercial ecosystem', description: 'The intelligence and commercial layer that diagnoses business needs and connects customers to the right growth system.', href: '/about' },
    { name: 'Ubernie', role: 'Business intelligence & operating product', description: 'The business-focused operating layer for audits, recommendations, growth opportunities and execution.', href: '/audit' },
    { name: 'RemotePay', role: 'Payment infrastructure', description: 'The payment layer used by C6, Ubernie and other verticals. RemotePay Fintech Services is the current payment entity; the underlying processor remains behind the payment boundary.', href: '/packages' },
  ];

  return <section className="py-20 md:py-24"><div className="container-max section-padding"><div className="max-w-5xl mx-auto rounded-2xl bg-slate-900 p-8 md:p-12 text-white"><span className="eyebrow text-emerald-400 mb-4 inline-block">The C6 Business Ecosystem</span><h2 className="text-white mb-4">One intelligence layer. Multiple machines. One commercial path.</h2><p className="text-slate-300 text-lg leading-relaxed mb-8">C6 understands the business, recommends the right machine and connects the customer to the appropriate product. Payments are routed through RemotePay rather than forcing every C6 product to build its own payment stack.</p><div className="grid md:grid-cols-3 gap-4">{ecosystem.map((item) => <Link key={item.name} to={item.href} className="rounded-xl bg-white/5 p-5 hover:bg-white/10 transition-colors"><strong className="text-emerald-400">{item.name}</strong><p className="text-white text-sm font-semibold mt-2">{item.role}</p><p className="text-slate-300 text-sm mt-2 leading-relaxed">{item.description}</p><span className="inline-flex items-center text-emerald-400 text-sm font-medium mt-4">Explore <ArrowRight className="ml-1 w-4 h-4" /></span></Link>)}</div></div></div></section>;
}

function CTASection() {
  return <section className="py-20 md:py-24 bg-emerald-600"><div className="container-max section-padding"><div className="max-w-3xl mx-auto text-center"><h2 className="text-white mb-4">Find out what your business should do next.</h2><p className="text-emerald-100 text-lg mb-8">Start with the free AI business audit. No need to guess which tool, service or package you need.</p><div className="flex flex-col sm:flex-row gap-4 justify-center"><Link to="/audit" className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-700 font-bold rounded-lg hover:bg-emerald-50">Get Your Free AI Audit <ArrowRight className="ml-2 w-5 h-5" /></Link><a href="https://wa.me/27735558440" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 border border-emerald-500"><MessageCircle className="mr-2 w-5 h-5" />Chat on WhatsApp</a></div></div></div></section>;
}

export function Home() {
  return <div className="min-h-screen bg-white"><Navigation /><main><HeroSection /><TrustLogos /><FeaturesSection /><HowItWorksSection /><PackagesSection /><EcosystemSection /><CTASection /></main><Footer /><WhatsAppChat /></div>;
}
