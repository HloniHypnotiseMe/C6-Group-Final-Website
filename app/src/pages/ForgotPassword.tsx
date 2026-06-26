import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    // Simulate API call - in production, connect to backend
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="pt-24 pb-16 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md px-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            {!isSubmitted ? (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">Reset Password</h1>
                  <p className="text-sm text-slate-500">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="email" 
                        placeholder="you@company.co.za"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`input-clean pl-10 ${error ? 'border-red-300 ring-2 ring-red-100' : ''}`}
                      />
                    </div>
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full btn-primary py-3">
                    {isLoading ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" /> Sending...</>
                      : <>Send Reset Link</>}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-slate-900 mb-2">Check Your Email</h2>
                <p className="text-sm text-slate-600 mb-6">
                  If an account exists for <strong>{email}</strong>, we&apos;ve sent password reset instructions.
                </p>
                <p className="text-xs text-slate-500 mb-6">
                  Didn&apos;t receive the email? Check your spam folder or{' '}
                  <button onClick={() => setIsSubmitted(false)} className="text-emerald-600 hover:underline">
                    try again
                  </button>.
                </p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <Link to="/login" className="inline-flex items-center text-sm text-slate-600 hover:text-emerald-600 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
