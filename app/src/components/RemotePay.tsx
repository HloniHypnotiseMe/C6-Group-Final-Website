import { useState } from 'react';
import { CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RemotePayProps {
  amount: number;
  description: string;
  merchantId?: string;
  brandId?: string;
  productId?: string;
  offerId?: string;
  customerReference?: string;
  onSuccess?: (paymentUrl: string) => void;
  onCancel?: () => void;
}

interface PaymentLinkResponse {
  payment_id: string;
  transaction_id: string;
  status: string;
  payment_url: string;
  currency: string;
  amount_minor: number;
  merchant_id: string;
  brand_id: string;
}

const REMOTEPAY_API_URL = import.meta.env.VITE_REMOTEPAY_API_URL;
const REMOTEPAY_MERCHANT_ID = import.meta.env.VITE_REMOTEPAY_MERCHANT_ID;
const REMOTEPAY_BRAND_ID = import.meta.env.VITE_REMOTEPAY_BRAND_ID || 'c6-group';

export function RemotePay({
  amount,
  description,
  merchantId,
  brandId,
  productId,
  offerId,
  customerReference,
  onSuccess,
  onCancel,
}: RemotePayProps) {
  const [step, setStep] = useState<'method' | 'processing' | 'success'>('method');
  const [reference, setReference] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [error, setError] = useState('');

  const createPaymentLink = async () => {
    if (!REMOTEPAY_API_URL) {
      setError('RemotePay is not configured for this environment.');
      return;
    }

    const resolvedMerchantId = merchantId || REMOTEPAY_MERCHANT_ID;
    if (!resolvedMerchantId) {
      setError('RemotePay merchant configuration is missing.');
      return;
    }

    setError('');
    setStep('processing');

    const idempotencyKey = `c6-${productId || 'product'}-${offerId || 'offer'}-${crypto.randomUUID()}`;

    try {
      const response = await fetch(`${REMOTEPAY_API_URL.replace(/\/$/, '')}/payment-links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant_id: resolvedMerchantId,
          brand_id: brandId || REMOTEPAY_BRAND_ID,
          source_system: 'c6-group-website',
          customer_reference: customerReference,
          product_id: productId,
          offer_id: offerId,
          description,
          amount_minor: Math.round(amount * 100),
          currency: 'ZAR',
          idempotency_key: idempotencyKey,
          metadata: {
            product: productId || 'c6-group-product',
            offer: offerId || 'c6-group-offer',
            source: 'c6-group-website',
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`RemotePay request failed (${response.status})`);
      }

      const payment = (await response.json()) as PaymentLinkResponse;
      setReference(payment.payment_id);
      setPaymentUrl(payment.payment_url);
      setStep('success');
      onSuccess?.(payment.payment_url);
    } catch (requestError) {
      console.error('RemotePay payment-link creation failed', requestError);
      setError('We could not create the RemotePay payment link. Please try again.');
      setStep('method');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-electric-cyan/20 rounded-full mb-4">
          <CreditCard className="w-8 h-8 text-electric-cyan" />
        </div>
        <h3 className="text-xl font-poppins font-bold mb-1">RemotePay</h3>
        <p className="text-soft-silver text-sm">Secure checkout for C6 Group</p>
      </div>

      <div className="glass-morphism rounded-xl p-4 mb-6 text-center">
        <p className="text-sm text-soft-silver mb-1">Amount to pay</p>
        <p className="text-3xl font-bold text-electric-cyan">R{amount.toFixed(2)}</p>
        <p className="text-xs text-soft-silver mt-1">{description}</p>
      </div>

      {step === 'method' && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={createPaymentLink}
            className={cn('w-full glass-morphism rounded-xl p-4 text-left transition-all duration-300 hover:border-electric-cyan')}
          >
            <p className="font-semibold">Continue with RemotePay</p>
            <p className="text-xs text-soft-silver">Secure payment link powered by RemotePay Fintech Services</p>
          </button>

          {error && <p className="text-sm text-red-400" role="alert">{error}</p>}

          {onCancel && (
            <Button onClick={onCancel} variant="ghost" className="w-full text-soft-silver hover:text-white">
              Cancel
            </Button>
          )}
        </div>
      )}

      {step === 'processing' && (
        <div className="text-center py-8">
          <Loader2 className="w-12 h-12 text-electric-cyan animate-spin mx-auto mb-4" />
          <p className="font-semibold">Creating your RemotePay payment...</p>
          <p className="text-sm text-soft-silver">Please do not close this window</p>
        </div>
      )}

      {step === 'success' && (
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p className="text-xl font-semibold mb-2">RemotePay payment ready</p>
          <p className="text-soft-silver mb-4">
            Reference: <span className="text-electric-cyan font-mono">{reference}</span>
          </p>
          {paymentUrl && (
            <a
              href={paymentUrl}
              className="inline-flex items-center justify-center rounded-md bg-electric-cyan px-6 py-3 font-semibold text-space-navy"
            >
              Open Secure Payment
            </a>
          )}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-white/10 text-center">
        <p className="text-xs text-soft-silver">
          Payments routed through <span className="text-electric-cyan font-semibold">RemotePay Fintech Services</span>
        </p>
      </div>
    </div>
  );
}
