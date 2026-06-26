import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore - animejs v4 uses named exports
import { animate } from 'animejs';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Clock, Headphones, Phone, MessageCircle } from 'lucide-react';

export function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate('.cta-content', {
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 800,
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
    <section ref={sectionRef} className="py-20 bg-space-navy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="cta-content opacity-0 text-center">
          <h2 className="text-3xl sm:text-4xl font-poppins font-bold mb-6">
            Ready to <span className="gradient-text">Transform Your Business?</span>
          </h2>
          <p className="text-lg sm:text-xl text-soft-silver mb-8 max-w-2xl mx-auto">
            Join 2,500+ South African businesses already using our AI ecosystem to grow revenue, 
            save time, and compete globally.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              asChild
              size="lg"
              className="bg-electric-cyan text-space-navy hover:bg-warm-gold font-semibold text-lg px-8 py-6 animate-pulse-glow"
            >
              <Link to="/audit">
                Start Your Free AI Audit
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-electric-cyan text-electric-cyan hover:bg-electric-cyan hover:text-space-navy font-semibold text-lg px-8 py-6"
            >
              <Link to="/packages">Compare Packages</Link>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-soft-silver mb-8">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-electric-cyan" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-electric-cyan" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center">
              <Headphones className="w-4 h-4 mr-2 text-electric-cyan" />
              <span>24/7 support</span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="glass-morphism rounded-xl p-6 inline-block">
            <p className="text-sm text-soft-silver mb-3">Have questions? We're here to help!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:0735558440" 
                className="flex items-center text-electric-cyan hover:text-warm-gold transition-colors"
              >
                <Phone className="w-4 h-4 mr-2" />
                <span className="font-semibold">073 555 8440</span>
              </a>
              <a 
                href="https://wa.me/27735558440" 
                className="flex items-center text-green-500 hover:text-green-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                <span className="font-semibold">WhatsApp Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
