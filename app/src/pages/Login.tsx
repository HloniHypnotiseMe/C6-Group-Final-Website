import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Invalid email';
    if (!formData.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch { /* handled by auth context */ }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="pt-24 pb-16 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md px-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h1>
              <p className="text-sm text-slate-500">Sign in to access your AI tools and dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="email" placeholder="you@company.co.za"
                    value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    className={`input-clean pl-10 ${errors.email ? 'border-red-300 ring-2 ring-red-100' : ''}`} />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password"
                    value={formData.password} onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                    className={`input-clean pl-10 pr-10 ${errors.password ? 'border-red-300 ring-2 ring-red-100' : ''}`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-slate-300" />
                  <span className="text-slate-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="link-underline text-sm">Forgot password?</Link>
              </div>

              <Button type="submit" disabled={isLoading}
                className="w-full btn-primary py-3"
              >
                {isLoading ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" /> Signing in...</>
                  : <>Sign In <ArrowRight className="ml-2 w-4 h-4" /></>}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-600">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="link-underline font-semibold">Get Started Free</Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Secured with 256-bit encryption. Your data is protected under POPIA.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
