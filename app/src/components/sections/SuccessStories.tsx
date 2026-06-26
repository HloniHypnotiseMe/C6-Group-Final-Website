import { useEffect, useRef } from 'react';
// @ts-ignore - animejs v4 uses named exports
import { animate, stagger } from 'animejs';
import { testimonials } from '@/data/content';
import { cn } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';

export function SuccessStories() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate('.stories-title', {
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 800,
              ease: 'outQuart'
            });

            animate('.testimonial-card', {
              opacity: [0, 1],
              translateY: [50, 0],
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

  return (
    <section ref={sectionRef} className="py-20 bg-deep-space">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="stories-title opacity-0 text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-poppins font-bold mb-6">
            South African <span className="gradient-text">Success Stories</span>
          </h2>
          <p className="text-lg sm:text-xl text-soft-silver max-w-3xl mx-auto">
            Real businesses, real results. See how our AI ecosystem is transforming South African SMEs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="testimonial-card opacity-0 glass-morphism rounded-xl p-6 hover:transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center text-space-navy font-bold text-xl',
                    index % 2 === 0 ? 'bg-electric-cyan' : 'bg-warm-gold'
                  )}
                >
                  {testimonial.avatar}
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-soft-silver">{testimonial.location}</p>
                </div>
              </div>

              <p className="text-soft-silver mb-4 text-sm leading-relaxed">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center text-electric-cyan">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span className="font-bold text-sm">{testimonial.metric}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="testimonial-card opacity-0 text-center">
            <div className="text-3xl sm:text-4xl font-bold text-electric-cyan mb-2">2,500+</div>
            <div className="text-sm text-soft-silver">Active Businesses</div>
          </div>
          <div className="testimonial-card opacity-0 text-center">
            <div className="text-3xl sm:text-4xl font-bold text-warm-gold mb-2">89%</div>
            <div className="text-sm text-soft-silver">Avg. Revenue Growth</div>
          </div>
          <div className="testimonial-card opacity-0 text-center">
            <div className="text-3xl sm:text-4xl font-bold text-electric-cyan mb-2">4.9/5</div>
            <div className="text-sm text-soft-silver">Customer Rating</div>
          </div>
          <div className="testimonial-card opacity-0 text-center">
            <div className="text-3xl sm:text-4xl font-bold text-warm-gold mb-2">24/7</div>
            <div className="text-sm text-soft-silver">AI Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}
