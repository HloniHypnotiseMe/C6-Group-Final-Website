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
    id: 'audit',
    name: 'Business Audit',
    price: 0,
    description: 'Find the biggest opportunities hiding inside your business.',
    features: [
      'AI business health assessment',
      'Digital visibility review',
      'Customer acquisition review',
      'Revenue opportunity analysis',
      'Personalised growth recommendations'
    ],
    ctaText: 'Get My Free Audit'
  },
  {
    id: 'visibility',
    name: 'Visibility Machine',
    price: 499,
    description: 'Get found, look credible, and turn local attention into enquiries.',
    features: [
      'Business listing & profile optimisation',
      'AI-assisted content creation',
      'Search & visibility support',
      'Reputation and review support',
      'Growth reporting'
    ],
    highlighted: true,
    ctaText: 'Build My Visibility'
  },
  {
    id: 'growth',
    name: 'Customer Growth Machine',
    price: 1499,
    description: 'Turn attention into leads with a connected AI growth workforce.',
    features: [
      'Everything in Visibility Machine',
      'Lead generation workflows',
      'Email marketing automation',
      'Social content & campaign support',
      'AI customer engagement',
      'Advanced growth analytics'
    ],
    ctaText: 'Grow My Customer Base'
  },
  {
    id: 'revenue',
    name: 'Revenue Machine',
    price: 3499,
    description: 'A deeper AI operating layer for businesses ready to scale revenue.',
    features: [
      'Everything in Customer Growth Machine',
      'AI sales & follow-up workflows',
      'Business intelligence reporting',
      'Advanced customer segmentation',
      'Custom automation workflows',
      'Priority support'
    ],
    ctaText: 'Scale My Revenue'
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
                  {pkg.price === 0 ? 'Free' : formatCurrency(pkg.price)}
                </div>
                <div className="text-sm text-soft-silver">
                  {pkg.price === 0 ? 'No card required' : 'per month'}
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
