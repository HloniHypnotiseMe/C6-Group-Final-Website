import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore - animejs v4 uses named exports
import { animate, stagger } from 'animejs';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { packages } from '@/data/content';
import { cn, formatCurrency } from '@/lib/utils';

export function PackageShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate section title
            animate('.package-title', {
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 800,
              ease: 'outQuart'
            });

            // Animate package cards
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const displayPackages = packages.slice(0, 3); // Show Lead, Diamond, Gold

  return (
    <section ref={sectionRef} className="py-20 bg-deep-space">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="package-title opacity-0 text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-poppins font-bold mb-6">
            Choose Your <span className="gradient-text">AI Growth Package</span>
          </h2>
          <p className="text-lg sm:text-xl text-soft-silver max-w-3xl mx-auto">
            Transparent pricing for South African SMEs. No setup fees, no hidden costs. 
            Just powerful AI tools to grow your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPackages.map((pkg) => (
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
                  {pkg.price === 0 ? 'Forever' : 'per month'}
                </div>
                <div className="text-xs text-soft-silver mt-2">{pkg.description}</div>
              </div>

              <div className="space-y-3 mb-8">
                {pkg.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center text-sm">
                    <Check
                      className={cn(
                        'w-5 h-5 mr-3 flex-shrink-0',
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
                <Link to="/packages">{pkg.ctaText}</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="package-card-item opacity-0 mt-12">
          <div className="glass-morphism rounded-xl p-6 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-electric-cyan">Enterprise</div>
                <div className="text-sm text-soft-silver">Custom solutions for large businesses</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-lg font-semibold">SuperAI Agents</div>
                <div className="text-sm text-soft-silver">Dedicated consultant</div>
              </div>
              <Button
                asChild
                className="bg-electric-cyan text-space-navy hover:bg-warm-gold font-semibold"
              >
                <Link to="/packages">View All Packages</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
