import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, CreditCard, Loader2, ShieldCheck } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { paymentApi } from '@/services/api';
import { getCommercialPackage, FRONTEND_TO_COMMERCIAL_SKU } from '../../../shared/commercialContract';

const PACKAGE_LABELS: Record<string, string> = {
  diamond: 'Diamond',
  growth: 'Gold',
  platinum: 'Platinum',
};

export function PaymentCheckout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const packageId = searchParams.get('package') || 'diamond';
  const billingCycle = searchParams.get('billingCycle') === 'ANNUAL' ? 'ANNUAL' : 'MONTHLY';
  const sku = FRONTEND_TO_COMMERCIAL_SKU[packageId as keyof typeof FRONTEND_TO_COMMERCIAL_SKU];
  const commercial = sku ? getCommercialPackage(sku) : null;
  const packageName = PACKAGE_LABELS[packageId];
  const amount = billingCycle === 'ANNUAL' ? commercial?.annualPriceZar : commercial?.monthlyPriceZar;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`, { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  if (!packageName || !commercial || amount === null || amount === undefined) {
    return (
      <div className="min-h-screen bg-slate-50"><Navigation /><main className="container mx-auto px-4 pt-28 pb-16 max-w-2xl"><div className="bg-white border border-red-200 rounded-2xl p-8 text-center"><h1 className="text-2xl font-bold text-slate-900">Package unavailable</h1><p className="text-slate-600 mt-2">This commercial package cannot be checked out online.</p><Link to="/packages" className="inline-flex items-center gap-2 mt-6 text-emerald-600 font-semibold"><ArrowLeft className="w-4 h-4" /> Back to packages</Link></div></main><Footer /></div>
    );
  }

  const handleCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await paymentApi.createPayment({
        amount,
        currency: 'ZAR',
        paymentMethod: 'remote-pay',
        description: `C6GROUP ${packageName} package - ${billingCycle.toLowerCase()}`,
        metadata: { packageId, billingCycle },
      });
      const checkoutUrl = response?.data?.checkoutUrl || response?.data?.paymentUrl;
      const paymentId = response?.data?.paymentId;
      if (!checkoutUrl || !paymentId) throw new Error('Payment checkout was not created. Please try again.');
      window.location.href = checkoutUrl;
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || err?.message || 'Payment checkout could not be started.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50"><Navigation />
      <main className="container mx-auto px-4 pt-28 pb-16 max-w-2xl">
        <Link to="/packages" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6"><ArrowLeft className="w-4 h-4" /> Back to packages</Link>
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">Secure C6 Checkout</p>
            <h1 className="text-3xl font-bold text-slate-900 mt-2">{packageName}</h1>
            <p className="text-slate-500 mt-1">{billingCycle === 'ANNUAL' ? 'Annual billing' : 'Monthly billing'}</p>
          </div>
          <div className="p-8">
            <div className="flex items-end justify-between mb-8"><span className="text-slate-600">Commercial package</span><span className="text-3xl font-bold text-slate-900">R{amount.toLocaleString('en-ZA')}{billingCycle === 'MONTHLY' ? '/mo' : '/yr'}</span></div>
            <div className="space-y-3 mb-8">
              {['Price locked to the C6 commercial catalogue', 'Payment handled through RemotePay', 'Subscription activates after confirmed payment'].map((item) => <div key={item} className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-600" />{item}</div>)}
            </div>
            {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
            <Button onClick={handleCheckout} disabled={loading || authLoading || !isAuthenticated} className="w-full btn-primary py-4 text-base">
              {loading ? <><Loader2 className="mr-2 w-5 h-5 animate-spin" /> Creating secure checkout...</> : <>Continue to Secure Payment <ArrowRight className="ml-2 w-5 h-5" /></>}
            </Button>
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500"><CreditCard className="w-4 h-4" /><ShieldCheck className="w-4 h-4" /> Secure payment via RemotePay</div>
          </div>
        </div>
      </main><Footer />
    </div>
  );
}
