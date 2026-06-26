import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Mail, Lock, User, Building, Phone, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const industries = [
  'Retail & E-commerce', 'Professional Services', 'Hospitality & Tourism',
  'Healthcare & Wellness', 'Education & Training', 'Technology & Software',
  'Manufacturing', 'Construction & Real Estate', 'Agriculture',
  'Creative & Media', 'Food & Beverage', 'Transportation & Logistics',
  'Financial Services', 'Other',
];

export function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    companyName: '', industry: '', password: '', confirmPassword: '', agreeTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const update = (field: string, value: string | boolean) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!formData.firstName.trim()) e.firstName = 'Required';
    if (!formData.lastName.trim()) e.lastName = 'Required';
    if (!formData.email.trim()) e.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Invalid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!formData.password) e.password = 'Required';
    else if (formData.password.length < 8) e.password = 'Min 8 characters';
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!formData.agreeTerms) e.agreeTerms = 'You must agree to the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { if (validateStep1()) setStep(2); return; }
    if (!validateStep2()) return;
    try {
      await register({
        email: formData.email, password: formData.password,
        firstName: formData.firstName, lastName: formData.lastName,
        phone: formData.phone || undefined, companyName: formData.companyName || undefined,
        industry: formData.industry || undefined,
      });
      navigate('/dashboard');
    } catch { /* handled by context */ }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="pt-24 pb-16 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-lg px-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Start Your AI Journey</h1>
              <p className="text-sm text-slate-500">Create your free account and access AI business tools</p>
            </div>

            {/* Progress */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {[1, 2].map((s) => (
                <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                  s === step ? 'bg-emerald-600 text-white' : s < step ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                }`}>{s < step ? <CheckCircle2 className="w-4 h-4" /> : s}</div>
              ))}
              <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: step === 2 ? '100%' : '0%' }} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {step === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input value={formData.firstName} onChange={(e) => update('firstName', e.target.value)}
                          placeholder="John" className={`input-clean pl-9 text-sm ${errors.firstName ? 'border-red-300 ring-2 ring-red-100' : ''}`} />
                      </div>
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input value={formData.lastName} onChange={(e) => update('lastName', e.target.value)}
                          placeholder="Doe" className={`input-clean pl-9 text-sm ${errors.lastName ? 'border-red-300 ring-2 ring-red-100' : ''}`} />
                      </div>
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="email" value={formData.email} onChange={(e) => update('email', e.target.value)}
                        placeholder="you@company.co.za" className={`input-clean pl-9 text-sm ${errors.email ? 'border-red-300 ring-2 ring-red-100' : ''}`} />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone <span className="text-slate-400">(optional)</span></label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="tel" value={formData.phone} onChange={(e) => update('phone', e.target.value)}
                        placeholder="073 555 8440" className="input-clean pl-9 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Company <span className="text-slate-400">(optional)</span></label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input value={formData.companyName} onChange={(e) => update('companyName', e.target.value)}
                        placeholder="Your Company" className="input-clean pl-9 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Industry <span className="text-slate-400">(optional)</span></label>
                    <select value={formData.industry} onChange={(e) => update('industry', e.target.value)} className="input-clean text-sm">
                      <option value="">Select industry</option>
                      {industries.map((i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type={showPassword ? 'text' : 'password'} value={formData.password}
                        onChange={(e) => update('password', e.target.value)} placeholder="Min 8 characters"
                        className={`input-clean pl-9 pr-10 text-sm ${errors.password ? 'border-red-300 ring-2 ring-red-100' : ''}`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="password" value={formData.confirmPassword}
                        onChange={(e) => update('confirmPassword', e.target.value)} placeholder="Repeat password"
                        className={`input-clean pl-9 text-sm ${errors.confirmPassword ? 'border-red-300 ring-2 ring-red-100' : ''}`} />
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.agreeTerms}
                      onChange={(e) => update('agreeTerms', e.target.checked)}
                      className={`mt-0.5 rounded ${errors.agreeTerms ? 'border-red-300' : ''}`} />
                    <span className="text-sm text-slate-600">
                      I agree to the <Link to="/terms" className="link-underline">Terms of Service</Link> and{' '}
                      <Link to="/privacy" className="link-underline">Privacy Policy</Link>. I consent to C6GROUP processing my data in accordance with POPIA.
                    </span>
                  </label>
                  {errors.agreeTerms && <p className="text-red-500 text-xs">{errors.agreeTerms}</p>}
                </>
              )}

              <div className="flex gap-3 pt-2">
                {step === 2 && (
                  <Button type="button" variant="outline" onClick={() => setStep(1)}
                    className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50">Back</Button>
                )}
                <Button type="submit" disabled={isLoading} className="flex-1 btn-primary py-3">
                  {isLoading ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" /> Creating...</>
                    : step === 1 ? <>Continue <ArrowRight className="ml-2 w-4 h-4" /></>
                      : <>Create Free Account <CheckCircle2 className="ml-2 w-4 h-4" /></>}
                </Button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="link-underline font-semibold">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
