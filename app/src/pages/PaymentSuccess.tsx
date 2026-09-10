import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Clock3, Loader2, XCircle } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { paymentApi } from '@/services/api';

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('paymentId');
  const [status, setStatus] = useState<'checking' | 'completed' | 'pending' | 'failed'>('checking');

  useEffect(() => {
    if (!paymentId) { setStatus('failed'); return; }
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const check = async () => {
      try {
        const response = await paymentApi.getPaymentStatus(paymentId);
        const next = String(response?.data?.status || '').toUpperCase();
        if (next === 'COMPLETED' || next === 'ACTIVE') { setStatus('completed'); return; }
        if (next === 'FAILED') { setStatus('failed'); return; }
        setStatus('pending');
      } catch {
        setStatus('pending');
      }
      attempts += 1;
      if (attempts < 10) timer = setTimeout(check, 3000);
    };
    check();
    return () => { if (timer) clearTimeout(timer); };
  }, [paymentId]);

  const content = {
    checking: { icon: <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />, title: 'Confirming your payment', text: 'We are checking the payment status with RemotePay.' },
    pending: { icon: <Clock3 className="w-10 h-10 text-amber-500" />, title: 'Payment received — confirmation pending', text: 'Your checkout has been created. We are waiting for the confirmed payment notification.' },
    completed: { icon: <CheckCircle2 className="w-10 h-10 text-emerald-600" />, title: 'Payment confirmed', text: 'Your C6 package payment is confirmed. Your subscription can now be activated.' },
    failed: { icon: <XCircle className="w-10 h-10 text-red-500" />, title: 'Payment could not be confirmed', text: 'The payment could not be confirmed. Please return to packages and try again or contact C6 support.' },
  }[status];

  return <div className="min-h-screen bg-slate-50"><Navigation /><main className="container mx-auto px-4 pt-28 pb-16 max-w-xl"><div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-10 text-center"><div className="flex justify-center mb-5">{content.icon}</div><h1 className="text-2xl font-bold text-slate-900">{content.title}</h1><p className="text-slate-600 mt-3">{content.text}</p><Link to={status === 'failed' ? '/packages' : '/dashboard'} className="inline-flex mt-7 btn-primary px-5 py-3">{status === 'failed' ? 'Return to Packages' : 'Continue to C6 Dashboard'}</Link></div></main><Footer /></div>;
}
