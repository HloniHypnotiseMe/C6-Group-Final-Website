import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore - animejs v4 uses named exports
import { animate, stagger } from 'animejs';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Phone, MessageCircle } from 'lucide-react';

export function HeroSection() {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate particles
    if (particlesRef.current) {
      const particles = particlesRef.current.querySelectorAll('.particle');
      animate(particles, {
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 2000,
        delay: stagger(200),
        ease: 'outQuart'
      });
    }

    // Animate hero content
    animate('.hero-title', {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 1000,
      delay: 300,
      ease: 'outQuart'
    });

    animate('.hero-subtitle', {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 1000,
      delay: 500,
      ease: 'outQuart'
    });

    animate('.hero-cta', {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 1000,
      delay: 700,
      ease: 'outQuart'
    });

    animate('.hero-stats', {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 1000,
      delay: 900,
      ease: 'outQuart'
    });

    animate('.hero-contact', {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 1000,
      delay: 1100,
      ease: 'outQuart'
    });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center aurora-bg overflow-hidden">
      {/* Floating Particles */}
      <div ref={particlesRef} className="floating-particles">
        <div 
          className="particle w-2 h-2" 
          style={{ left: '10%', top: '20%', animationDelay: '0s' }} 
        />
        <div 
          className="particle w-3 h-3" 
          style={{ left: '80%', top: '30%', animationDelay: '2s' }} 
        />
        <div 
          className="particle w-1 h-1" 
          style={{ left: '60%', top: '70%', animationDelay: '4s' }} 
        />
        <div 
          className="particle w-2 h-2" 
          style={{ left: '30%', top: '80%', animationDelay: '1s' }} 
        />
        <div 
          className="particle w-4 h-4" 
          style={{ left: '90%', top: '60%', animationDelay: '3s' }} 
        />
        <div 
          className="particle w-2 h-2" 
          style={{ left: '20%', top: '50%', animationDelay: '1.5s' }} 
        />
        <div 
          className="particle w-3 h-3" 
          style={{ left: '70%', top: '80%', animationDelay: '2.5s' }} 
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <div className="hero-title opacity-0">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-electric-cyan" />
            <span className="text-sm text-soft-silver">AI-Powered Business Growth</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-poppins font-bold mb-6 leading-tight">
            Transform Your{' '}
            <span className="gradient-text">South African Business</span>{' '}
            with AI
          </h1>
        </div>

        <div className="hero-subtitle opacity-0">
          <p className="text-lg sm:text-xl md:text-2xl text-soft-silver mb-8 max-w-4xl mx-auto">
            The complete AI-driven ecosystem for SMEs, entrepreneurs, and creators. 
            Website builder, AI tools, RemotePay, analytics, and passive income engines—all in one platform.
          </p>
        </div>

        <div className="hero-cta opacity-0 flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            asChild
            size="lg"
            className="bg-electric-cyan text-space-navy hover:bg-warm-gold font-semibold text-lg px-8 py-6 animate-pulse-glow"
          >
            <Link to="/audit">
              Get Your Free AI Business Audit
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-electric-cyan text-electric-cyan hover:bg-electric-cyan hover:text-space-navy font-semibold text-lg px-8 py-6"
          >
            <Link to="/packages">View Packages</Link>
          </Button>
        </div>

        <div className="hero-stats opacity-0">
          <div className="text-sm text-soft-silver mb-6">
            Trusted by 2,500+ South African Businesses
          </div>
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-electric-cyan">R125M+</div>
              <div className="text-xs sm:text-sm text-soft-silver">Revenue Generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-electric-cyan">89%</div>
              <div className="text-xs sm:text-sm text-soft-silver">Revenue Growth</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-electric-cyan">24/7</div>
              <div className="text-xs sm:text-sm text-soft-silver">AI Support</div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="hero-contact opacity-0 mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="tel:+27735558440"
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 hover:bg-white/20 transition-all duration-300"
          >
            <Phone className="w-5 h-5 text-electric-cyan" />
            <span className="text-soft-silver font-medium">073 555 8440</span>
          </a>
          <a
            href="https://wa.me/27735558440"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366]/20 backdrop-blur-sm rounded-full px-6 py-3 hover:bg-[#25D366]/30 transition-all duration-300"
          >
            <MessageCircle className="w-5 h-5 text-[#25D366]" />
            <span className="text-soft-silver font-medium">Chat on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-electric-cyan rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
