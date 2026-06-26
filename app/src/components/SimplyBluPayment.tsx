import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, Shield } from 'lucide-react';

interface SimplyBluPaymentProps {
  amount: number;
  description: string;
  packageId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  buttonText?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

/**
 * SimplyBlu Payment Button Component
 * 
 * SimplyBlu is Standard Bank's white-label payment solution powered by Mastercard.
 * This component uses the Hosted Payments approach - the simplest integration method.
 * 
 * SETUP REQUIRED:
 * 1. Sign up as a SimplyBlu merchant at https://simplyblu.standardbank.co.za
 * 2. Generate API keys (public + private) in the merchant portal
 * 3. Enable "Hosted Payments" on your API key pair
 * 4. Add your SIMPLYBLU_PUBLIC_KEY and SIMPLYBLU_PRIVATE_KEY to .env
 * 5. Configure your backend webhook endpoint at /api/v1/webhooks/simplyblu
 * 
 * For testing, use Sandbox API keys and test card numbers from SimplyBlu docs.
 */
export function SimplyBluPaymentButton({
  amount,
  description,
  packageId,
  onSuccess,
  onCancel,
  buttonText = 'Pay Securely',
  variant = 'primary',
  className = '',
}: SimplyBluPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Step 1: Create payment session via backend
      const response = await fetch('/api/v1/payments/simplyblu/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents for API
          currency: 'ZAR',
          description,
          packageId,
          metadata: {
            source: 'website',
            timestamp: new Date().toISOString(),
          },
        }),
      });

      const data = await response.json();

      if (!data.success || !data.data?.checkoutUrl) {
        throw new Error(data.error?.message || 'Failed to initialize payment');
      }

      // Step 2: Redirect to SimplyBlu hosted checkout
      window.location.href = data.data.checkoutUrl;

    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment initialization failed. Please try again.');
      setIsLoading(false);
    }
  };

  const buttonStyles = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50',
  };

  return (
    <div className="w-full">
      <Button
        onClick={handlePayment}
        disabled={isLoading}
        className={`w-full py-3 font-semibold ${buttonStyles[variant]} ${className}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 w-4 h-4" />
            {buttonText}
          </>
        )}
      </Button>
      
      {error && (
        <p className="text-red-500 text-xs mt-2 text-center">{error}</p>
      )}
      
      <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500">
        <Shield className="w-3 h-3" />
        <span>Secured by Standard Bank SimplyBlu</span>
      </div>
    </div>
  );
}

/**
 * SimplyBlu Payment Modal (Alternative: Embedded/Modal approach)
 * For a fully embedded checkout experience, SimplyBlu supports iframe/modal integration.
 * This requires additional configuration in the SimplyBlu merchant portal.
 */
export function SimplyBluPaymentModal({
  isOpen,
  onClose,
  amount,
  description,
  packageId,
}: {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  description: string;
  packageId: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CreditCard className="w-6 h-6 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Complete Your Payment</h2>
          <p className="text-sm text-slate-500 mt-1">{description}</p>
          <p className="text-2xl font-bold text-emerald-600 mt-3">R{amount.toFixed(2)}</p>
        </div>

        <div className="space-y-3">
          <SimplyBluPaymentButton
            amount={amount}
            description={description}
            packageId={packageId}
            onSuccess={onClose}
            buttonText="Pay with Card"
            variant="primary"
          />
          
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            Payments processed securely by Standard Bank SimplyBlu. PCI DSS compliant.
          </p>
        </div>
      </div>
    </div>
  );
}
