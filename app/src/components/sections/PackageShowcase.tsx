import { getCommercialPrice } from '../../config/commercial';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore - animejs v4 uses named exports
import { animate, stagger } from 'animejs';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';

/**
 * Commercial packaging principle:
 * Customers buy business outcomes, not AI calls.
 * The AI tools remain the delivery infrastructure underneath each package.
 * Pricing is intentionally positioned as an introductory commercial ladder and
 * should be validated against delivery cost and customer economics before launch.
 */
const packages = [
  {
    id: 'diamond',
    name: 'Diamond',
    price: getCommercialPrice("DIAMOND", "MONTHLY"),
    description: 'Foundational C6 business growth and automation package.',
    features: [
      'Business visibility & reputation tools',
      'AI Chatbot trained on your business',
      'Up to 2 enabled AI tools',
      'Basic analytics',
      'Email support',
      '500 chatbot messages/month',
      '50 content generations/month',
      '20 SEO analyses/month'
    ],
    highlighted: true,
    ctaText: 'Start Diamond Package'
  },
  {
    id: 'gold',
    name: 'Gold',
    price: getCommercialPrice("GOLD", "MONTHLY"),
    description: 'Expanded growth, automation and intelligence package.',
    features: [
      'Everything in Diamond',
      'Traffic & growth analyst',
      'Up to 3 enabled AI tools',
      'Advanced analytics',
      'Priority support',
      '1-on-1 onboarding',
      '2000 chatbot messages/month',
      '200 content generations/month',
      '100 SEO analyses/month'
    ],
    ctaText: 'Start Gold Package'
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: getCommercialPrice("PLATINUM", "MONTHLY"),
    description: 'Advanced C6 intelligence, growth and implementation package.',
    features: [
      'Everything in Gold',
      '1 AI Staff Member',
      'Business Intelligence Dashboard',
      'Dedicated account manager',
      'Priority phone support',
      'Custom integrations',
      'High-volume AI allowance with fair-use controls',
      'White-label options'
    ],
    ctaText: 'Start Platinum Package'
  }
];

export function PackageShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate('.package-title', {
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 800,
              ease: 'outQuart'
            });

            animate('.package-card-item', {
              opacity: [0, 1],
              translateY: [50, 0],
              scale: [0.9, 1],
              duration: 800,
              delay: stagger(150, { start: 300 }),
              ease: 'outQuart'
            });

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-deep-space">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="package-title opacity-0 text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-poppins font-bold mb-6">
            Choose Your <span className="gradient-text">Business Growth Machine</span>
          </h2>
          <p className="text-lg sm:text-xl text-soft-silver max-w-3xl mx-auto">
            We combine AI agents, automation, analytics and business intelligence into practical growth systems. You buy the outcome — C6 provides the machinery behind it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={cn(
                'package-card-item opacity-0 glass-morphism rounded-2xl p-6 sm:p-8 relative',
                pkg.highlighted && 'package-card featured border-2 border-warm-gold'
              )}
            >
              {pkg.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-warm-gold text-space-navy px-4 py-1 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-poppins font-bold mb-2">{pkg.name}</h3>
                <div className="text-4xl font-bold text-electric-cyan mb-2">
                  {pkg.price === null
                    ? 'Custom pricing'
                    : pkg.price === 0
                      ? 'Free'
                      : formatCurrency(pkg.price)}
                </div>
                <div className="text-sm text-soft-silver">
                  {pkg.price === null
                    ? 'Contact sales'
                    : pkg.price === 0
                      ? 'No card required'
                      : 'per month'}
                </div>
                <div className="text-xs text-soft-silver mt-2">{pkg.description}</div>
              </div>

              <div className="space-y-3 mb-8">
                {pkg.features.map((feature) => (
                  <div key={feature} className="flex items-start text-sm">
                    <Check
                      className={cn(
                        'w-5 h-5 mr-3 mt-0.5 flex-shrink-0',
                        pkg.highlighted ? 'text-warm-gold' : 'text-electric-cyan'
                      )}
                    />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                asChild
                className={cn(
                  'w-full font-semibold',
                  pkg.highlighted
                    ? 'bg-warm-gold text-space-navy hover:bg-electric-cyan'
                    : 'bg-electric-cyan text-space-navy hover:bg-warm-gold'
                )}
              >
                <Link to={pkg.price === 0 ? '/audit' : '/packages'}>{pkg.ctaText}</Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="package-card-item opacity-0 mt-12">
          <div className="glass-morphism rounded-xl p-6 max-w-3xl mx-auto text-center">
            <div className="text-2xl font-bold text-electric-cyan mb-2">Custom Business Intelligence</div>
            <p className="text-sm text-soft-silver mb-4">
              Larger organisations can combine C6 AI agents, automation, analytics and custom integrations into a tailored operating system. Pricing follows the audit and scope — not an arbitrary headline number.
            </p>
            <Button asChild className="bg-electric-cyan text-space-navy hover:bg-warm-gold font-semibold">
              <Link to="/packages">Request a Custom Plan</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
