import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { WhatsAppChat } from '@/components/WhatsAppChat';
import { ArrowRight, TrendingUp, Bot, Zap, BarChart3, CheckCircle2, Star, Phone, MessageCircle, Mail } from 'lucide-react';

/* ── Trust logos ── */
function TrustLogos() {
  const logos = ['Shopify', 'WooCommerce', 'WordPress', 'Google', 'Meta', 'PayFast'];
  return (
    <section className="border-y border-slate-100 bg-slate-50/50">
      <div className="container-max py-8 section-padding">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 mb-6">
          Trusted by 2,500+ South African businesses
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {logos.map((name) => (
            <span key={name} className="text-lg font-bold text-slate-300 select-none">{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Hero ── */
function HeroSection() {
  return (
    <section className="pt-24 pb-16 md:pt-28 md:pb-20 overflow-hidden">
      <div className="container-max section-padding">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="max-w-xl">
            <span className="eyebrow mb-4 inline-block">AI-Powered Business Growth</span>
            <h1 className="mb-6">
              Automate Your Marketing, Grow Your{' '}
              <span className="text-emerald-600">South African Business</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              C6GROUP helps SMEs get found online, engage customers automatically, and grow revenue
              using AI-powered tools designed for the South African market.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link to="/audit" className="btn-primary">
                Free AI Business Audit
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link to="/ai-tools" className="btn-secondary">
                Explore AI Tools
              </Link>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 3-minute audit
              </span>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative">
            <img
              src="/hero-main.jpg"
              alt="South African business team using C6GROUP AI tools"
              className="rounded-2xl shadow-xl w-full object-cover aspect-[4/3]"
            />
            {/* Floating stat card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg border border-slate-100 p-4 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">89%</p>
                  <p className="text-xs text-slate-500">Avg. revenue growth</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Features ── */
function FeaturesSection() {
  const features = [
    {
      icon: Bot,
      title: '100+ AI Tools',
      description: 'From content creation to analytics, access specialised AI tools built for South African businesses.',
      image: '/feature-ai-tools.jpg',
    },
    {
      icon: Mail,
      title: 'Email Marketing Suite',
      description: 'Launch high-deliverability email campaigns with unlimited sends and AI-powered content generation.',
      image: '/feature-email.jpg',
    },
    {
      icon: BarChart3,
      title: 'Business Analytics',
      description: 'Track revenue, customer behaviour, and growth metrics with AI-powered dashboards.',
      image: '/feature-analytics.jpg',
    },
    {
      icon: Zap,
      title: 'Marketing Automation',
      description: 'Automate social media, email campaigns, and SEO with intelligent AI agents.',
      image: '/feature-marketing.jpg',
    },
  ];

  return (
    <section className="py-20 md:py-24 bg-slate-50">
      <div className="container-max section-padding">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="eyebrow mb-4 inline-block">Features</span>
          <h2 className="mb-4">Everything You Need to Grow</h2>
          <p className="text-slate-600 mx-auto">
            A complete suite of AI-powered tools designed specifically for South African SMEs,
            from content creation to customer analytics.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="card-clean overflow-hidden group">
              <div className="aspect-[3/2] overflow-hidden -mx-6 -mt-6 mb-5">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
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
  );
}

/* ── How It Works ── */
function HowItWorksSection() {
  const steps = [
    { number: '01', title: 'Free AI Audit', description: 'Answer a few questions about your business. Our AI analyses your current performance and identifies growth opportunities.' },
    { number: '02', title: 'Get Your Plan', description: 'Receive a personalised growth strategy with specific recommendations tailored to your industry and goals.' },
    { number: '03', title: 'Start Growing', description: 'Implement the recommendations using our AI tools, or let our team handle it for you. Watch your revenue grow.' },
  ];

  return (
    <section className="py-20 md:py-24">
      <div className="container-max section-padding">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <div className="order-2 lg:order-1">
            <img
              src="/feature-small-business.jpg"
              alt="South African business owner using C6GROUP"
              className="rounded-2xl shadow-lg w-full object-cover aspect-[4/3]"
            />
          </div>

          {/* Right: Steps */}
          <div className="order-1 lg:order-2">
            <span className="eyebrow mb-4 inline-block">How It Works</span>
            <h2 className="mb-8">Three Steps to Business Growth</h2>
            <div className="space-y-8">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-5">
                  <span className="text-2xl font-bold text-emerald-600 shrink-0 w-12">{step.number}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-slate-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link to="/audit" className="btn-primary">
                Start Your Free Audit
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Packages Preview ── */
function PackagesSection() {
  const packages = [
    {
      name: 'Start',
      tagline: 'Get Found & Get Leads',
      price: 'Free',
      description: 'Start your AI journey with a free business audit and online visibility.',
      features: ['1 Free AI Business Audit', 'Basic Directory Listing', '10 AI Tool Uses/Month', 'WhatsApp Support'],
      cta: 'Get Started',
      href: '/register',
      featured: false,
    },
    {
      name: 'Grow',
      tagline: 'Automated Engagement',
      price: 'R299',
      period: '/month',
      description: 'Automate your marketing and customer engagement.',
      features: ['5 AI Audits/Month', 'Email Marketing Suite', 'Social Media Automation', '50 AI Tool Uses/Month'],
      cta: 'Start Free Trial',
      href: '/register',
      featured: true,
    },
    {
      name: 'Scale',
      tagline: 'Revenue & Customer Growth',
      price: 'R699',
      period: '/month',
      description: 'Advanced automation and AI-powered lead generation.',
      features: ['10 AI Audits/Month', 'Advanced Analytics', 'AI Lead Generation', '200 AI Tool Uses/Month'],
      cta: 'Start Free Trial',
      href: '/register',
      featured: false,
    },
  ];

  return (
    <section className="py-20 md:py-24 bg-slate-50">
      <div className="container-max section-padding">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="eyebrow mb-4 inline-block">Pricing</span>
          <h2 className="mb-4">Simple, Transparent Pricing</h2>
          <p className="text-slate-600 mx-auto">
            Choose the plan that fits your business. All plans include a free trial. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`rounded-2xl p-6 ${pkg.featured
                ? 'bg-slate-900 text-white ring-2 ring-emerald-500 shadow-xl'
                : 'bg-white border border-slate-200'
                }`}
            >
              {pkg.featured && (
                <span className="badge-emerald mb-4 inline-block">Most Popular</span>
              )}
              <h3 className={`text-lg font-semibold mb-1 ${pkg.featured ? 'text-white' : 'text-slate-900'}`}>
                {pkg.name}
              </h3>
              <p className={`text-xs font-medium uppercase tracking-wide mb-2 ${pkg.featured ? 'text-emerald-400' : 'text-emerald-600'}`}>{pkg.tagline}</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className={`text-3xl font-bold ${pkg.featured ? 'text-white' : 'text-slate-900'}`}>{pkg.price}</span>
                {pkg.period && <span className={`text-sm ${pkg.featured ? 'text-slate-300' : 'text-slate-500'}`}>{pkg.period}</span>}
              </div>
              <p className={`text-sm mb-6 ${pkg.featured ? 'text-slate-300' : 'text-slate-600'}`}>{pkg.description}</p>
              <ul className="space-y-3 mb-8">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${pkg.featured ? 'text-emerald-400' : 'text-emerald-500'}`} />
                    <span className={pkg.featured ? 'text-slate-200' : 'text-slate-600'}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={pkg.href}
                className={`block text-center py-3 rounded-lg font-semibold text-sm transition-colors ${pkg.featured
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                {pkg.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-slate-500 mt-8">
          Need a custom solution?{' '}
          <span className="font-medium text-slate-700">Enterprise plans start from R500k/year.</span>{' '}
          <a href="https://wa.me/27735558440" className="link-underline">Contact us</a> for enterprise pricing.
        </p>
      </div>
    </section>
  );
}

/* ── Enterprise CTA ── */
function EnterpriseSection() {
  return (
    <section className="py-16 md:py-20 bg-slate-900">
      <div className="container-max section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-white mb-3">Need a Custom Solution?</h2>
          <p className="text-slate-300 text-lg mb-2 max-w-2xl mx-auto">
            For large organisations and businesses with unique needs, we build fully custom AI infrastructure 
            and dedicated teams to handle your exact requirements.
          </p>
          <p className="text-emerald-400 font-bold text-2xl mb-6">
            Enterprise plans start from R500k/year
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/27735558440" target="_blank" rel="noopener noreferrer"
              className="btn-primary bg-emerald-600 hover:bg-emerald-500"
            >
              Contact Us for a Quote <ArrowRight className="ml-2 w-4 h-4" />
            </a>
            <a href="tel:+27735558440" className="btn-secondary bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
              Call Us: 073 555 8440
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ── */
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "C6GROUP's AI audit identified R45,000 in monthly revenue we were leaving on the table. Within two months, we saw a 67% increase in qualified leads.",
      author: 'Thandi Nkosi',
      role: 'Founder, Nkosi Consulting',
      image: '/testimonial-1.jpg',
      rating: 5,
    },
    {
      quote: "The AI content generator alone saved us 15 hours per week. Our social media engagement is up 340% since we started using C6GROUP's marketing tools.",
      author: 'Marcus van der Berg',
      role: 'CEO, Cape Digital Agency',
      image: '/testimonial-2.jpg',
      rating: 5,
    },
    {
      quote: "We went from zero online presence to ranking on page one of Google within 6 weeks. The SEO tools are incredibly powerful and easy to use.",
      author: 'Lesedi Mokoena',
      role: 'Director, Jozi Home Services',
      image: '/testimonial-3.jpg',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 md:py-24">
      <div className="container-max section-padding">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="eyebrow mb-4 inline-block">Testimonials</span>
          <h2 className="mb-4">Trusted by South African Businesses</h2>
          <p className="text-slate-600 mx-auto">
            See how businesses across South Africa are growing with C6GROUP's AI-powered platform.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <div key={i} className="card-clean flex flex-col">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed mb-6 flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img src={t.image} alt={t.author} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.author}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA Section ── */
function CTASection() {
  return (
    <section className="py-20 md:py-24 bg-emerald-600">
      <div className="container-max section-padding">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-white mb-4">Start Growing Your Business Today</h2>
          <p className="text-emerald-100 text-lg mb-8 mx-auto">
            Join 2,500+ South African businesses already using C6GROUP to automate,
            optimise, and grow with AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/audit" className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-700 font-bold rounded-lg hover:bg-emerald-50 transition-colors">
              Get Your Free AI Audit
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <a href="https://wa.me/27735558440" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors border border-emerald-500"
            >
              <MessageCircle className="mr-2 w-5 h-5" />
              Chat on WhatsApp
            </a>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-emerald-200 text-sm">
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> 073 555 8440
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Home Page ── */
export function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <HeroSection />
        <TrustLogos />
        <FeaturesSection />
        <HowItWorksSection />
        <PackagesSection />
        <TestimonialsSection />
        <EnterpriseSection />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppChat />
    </div>
  );
}
