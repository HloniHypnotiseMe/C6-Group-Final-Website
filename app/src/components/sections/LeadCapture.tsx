import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore - animejs v4 uses named exports
import { animate } from 'animejs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { industries } from '@/data/content';
import { cn, isValidEmail, isValidPhone } from '@/lib/utils';
import { CheckCircle, Loader2 } from 'lucide-react';

export function LeadCapture() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    contactName: '',
    phone: '',
    email: '',
    challenge: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate('.lead-title', {
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 800,
              ease: 'outQuart'
            });

            animate('.lead-form-container', {
              opacity: [0, 1],
              translateY: [50, 0],
              duration: 800,
              delay: 300,
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Contact name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid South African phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Show success animation
    animate('.success-message', {
      opacity: [0, 1],
      scale: [0.8, 1],
      duration: 500,
      ease: 'outQuart'
    });

    // Redirect to audit page after delay
    setTimeout(() => {
      navigate('/audit');
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <section ref={sectionRef} id="lead-capture" className="py-20 bg-space-navy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lead-title opacity-0 text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-poppins font-bold mb-6">
            Get Your <span className="gradient-text">Free AI Business Audit</span>
          </h2>
          <p className="text-lg sm:text-xl text-soft-silver max-w-3xl mx-auto">
            Discover hidden revenue opportunities, SEO gaps, and conversion leaks in your business. 
            Get personalized AI recommendations in just 3 minutes.
          </p>
        </div>

        <div className="lead-form-container opacity-0 lead-form glass-morphism rounded-2xl p-6 sm:p-8">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="companyName" className="text-sm font-semibold mb-2 block">
                    Company Name
                  </Label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Your company name"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className={cn(
                      'w-full px-4 py-3 bg-space-navy border rounded-lg text-white',
                      errors.companyName ? 'border-alert-orange' : 'border-soft-silver'
                    )}
                  />
                  {errors.companyName && (
                    <p className="text-alert-orange text-xs mt-1">{errors.companyName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="industry" className="text-sm font-semibold mb-2 block">
                    Industry
                  </Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => handleInputChange('industry', value)}
                  >
                    <SelectTrigger
                      className={cn(
                        'w-full px-4 py-3 bg-space-navy border rounded-lg text-white',
                        errors.industry ? 'border-alert-orange' : 'border-soft-silver'
                      )}
                    >
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent className="bg-space-navy border-soft-silver">
                      {industries.map((industry) => (
                        <SelectItem
                          key={industry.value}
                          value={industry.value}
                          className="text-white hover:bg-electric-cyan/20"
                        >
                          {industry.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.industry && (
                    <p className="text-alert-orange text-xs mt-1">{errors.industry}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="contactName" className="text-sm font-semibold mb-2 block">
                    Your Name
                  </Label>
                  <Input
                    id="contactName"
                    type="text"
                    placeholder="Your full name"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    className={cn(
                      'w-full px-4 py-3 bg-space-navy border rounded-lg text-white',
                      errors.contactName ? 'border-alert-orange' : 'border-soft-silver'
                    )}
                  />
                  {errors.contactName && (
                    <p className="text-alert-orange text-xs mt-1">{errors.contactName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-semibold mb-2 block">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+27 82 555 0123"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={cn(
                      'w-full px-4 py-3 bg-space-navy border rounded-lg text-white',
                      errors.phone ? 'border-alert-orange' : 'border-soft-silver'
                    )}
                  />
                  {errors.phone && (
                    <p className="text-alert-orange text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-semibold mb-2 block">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={cn(
                    'w-full px-4 py-3 bg-space-navy border rounded-lg text-white',
                    errors.email ? 'border-alert-orange' : 'border-soft-silver'
                  )}
                />
                {errors.email && (
                  <p className="text-alert-orange text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="challenge" className="text-sm font-semibold mb-2 block">
                  What's your biggest business challenge?
                </Label>
                <Textarea
                  id="challenge"
                  rows={3}
                  placeholder="Describe your main challenge..."
                  value={formData.challenge}
                  onChange={(e) => handleInputChange('challenge', e.target.value)}
                  className="w-full px-4 py-3 bg-space-navy border border-soft-silver rounded-lg text-white resize-none"
                />
              </div>

              <div className="text-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="bg-electric-cyan text-space-navy hover:bg-warm-gold font-semibold text-lg px-8 py-6 animate-pulse-glow"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Get My Free AI Audit Report'
                  )}
                </Button>
                <p className="text-xs text-soft-silver mt-4">
                  ✓ No credit card required • ✓ Instant results • ✓ 30-day money-back guarantee
                </p>
              </div>
            </form>
          ) : (
            <div className="success-message opacity-0 text-center py-8">
              <CheckCircle className="w-16 h-16 text-warm-gold mx-auto mb-4" />
              <h3 className="text-2xl font-poppins font-bold mb-2">Thank You!</h3>
              <p className="text-soft-silver mb-4">
                Your AI audit report will be ready in just a moment. Redirecting you to the audit tool...
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
