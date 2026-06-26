import { useState } from 'react';
import { CreditCard, Lock, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface RemotePayProps {
  amount: number;
  description: string;
  onSuccess?: (reference: string) => void;
  onCancel?: () => void;
}

type PaymentMethod = 'card' | 'eft' | 'snapscan' | 'zapper';

export function RemotePay({ amount, description, onSuccess, onCancel }: RemotePayProps) {
  const [step, setStep] = useState<'method' | 'details' | 'processing' | 'success'>('method');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [email, setEmail] = useState('');
  const [reference, setReference] = useState('');

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    }
    return v;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(formatExpiryDate(e.target.value));
  };

  const handleSubmit = async () => {
    setStep('processing');
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const ref = 'REM' + Date.now().toString(36).toUpperCase();
    setReference(ref);
    setStep('success');
    
    if (onSuccess) {
      onSuccess(ref);
    }
  };

  const paymentMethods = [
    { id: 'card' as PaymentMethod, name: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard, Maestro' },
    { id: 'eft' as PaymentMethod, name: 'Instant EFT', icon: '🏦', description: 'Pay via your bank' },
    { id: 'snapscan' as PaymentMethod, name: 'SnapScan', icon: '📱', description: 'Scan & pay with app' },
    { id: 'zapper' as PaymentMethod, name: 'Zapper', icon: '⚡', description: 'Quick mobile payment' },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-electric-cyan/20 rounded-full mb-4">
          <CreditCard className="w-8 h-8 text-electric-cyan" />
        </div>
        <h3 className="text-xl font-poppins font-bold mb-1">RemotePay</h3>
        <p className="text-soft-silver text-sm">Secure payment for South African businesses</p>
      </div>

      {/* Amount Display */}
      <div className="glass-morphism rounded-xl p-4 mb-6 text-center">
        <p className="text-sm text-soft-silver mb-1">Amount to pay</p>
        <p className="text-3xl font-bold text-electric-cyan">R{amount.toFixed(2)}</p>
        <p className="text-xs text-soft-silver mt-1">{description}</p>
      </div>

      {/* Step 1: Select Payment Method */}
      {step === 'method' && (
        <div className="space-y-3">
          <p className="text-sm font-semibold mb-3">Select payment method</p>
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => {
                setSelectedMethod(method.id);
                setStep('details');
              }}
              className={cn(
                'w-full glass-morphism rounded-xl p-4 flex items-center transition-all duration-300 hover:border-electric-cyan',
                selectedMethod === method.id && 'border-2 border-electric-cyan'
              )}
            >
              <span className="text-2xl mr-4">{method.icon}</span>
              <div className="text-left">
                <p className="font-semibold">{method.name}</p>
                <p className="text-xs text-soft-silver">{method.description}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Payment Details */}
      {step === 'details' && selectedMethod === 'card' && (
        <div className="space-y-4">
          <button
            onClick={() => setStep('method')}
            className="text-sm text-electric-cyan hover:underline"
          >
            ← Back to payment methods
          </button>

          <div>
            <Label className="text-sm mb-2 block">Email Address</Label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-space-navy border-soft-silver text-white"
            />
          </div>

          <div>
            <Label className="text-sm mb-2 block">Card Number</Label>
            <Input
              type="text"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
              className="w-full bg-space-navy border-soft-silver text-white font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm mb-2 block">Expiry Date</Label>
              <Input
                type="text"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={handleExpiryChange}
                maxLength={5}
                className="w-full bg-space-navy border-soft-silver text-white font-mono"
              />
            </div>
            <div>
              <Label className="text-sm mb-2 block">CVV</Label>
              <Input
                type="password"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                maxLength={3}
                className="w-full bg-space-navy border-soft-silver text-white font-mono"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm mb-2 block">Cardholder Name</Label>
            <Input
              type="text"
              placeholder="Name on card"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              className="w-full bg-space-navy border-soft-silver text-white"
            />
          </div>

          <div className="flex items-center text-xs text-soft-silver">
            <Lock className="w-4 h-4 mr-2" />
            <span>Your payment is secured with 256-bit SSL encryption</span>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!email || cardNumber.length < 16 || expiryDate.length < 5 || cvv.length < 3 || !cardholderName}
            className="w-full bg-electric-cyan text-space-navy hover:bg-warm-gold font-semibold py-6"
          >
            Pay R{amount.toFixed(2)}
          </Button>

          {onCancel && (
            <Button
              onClick={onCancel}
              variant="ghost"
              className="w-full text-soft-silver hover:text-white"
            >
              Cancel
            </Button>
          )}
        </div>
      )}

      {/* EFT Payment */}
      {step === 'details' && selectedMethod === 'eft' && (
        <div className="space-y-4">
          <button
            onClick={() => setStep('method')}
            className="text-sm text-electric-cyan hover:underline"
          >
            ← Back to payment methods
          </button>

          <div className="glass-morphism rounded-xl p-6 text-center">
            <p className="text-4xl mb-4">🏦</p>
            <p className="font-semibold mb-2">Instant EFT</p>
            <p className="text-sm text-soft-silver mb-4">
              You will be redirected to your bank to complete the payment securely.
            </p>
            <Button
              onClick={handleSubmit}
              className="w-full bg-electric-cyan text-space-navy hover:bg-warm-gold font-semibold"
            >
              Continue to Bank
            </Button>
          </div>
        </div>
      )}

      {/* SnapScan Payment */}
      {step === 'details' && selectedMethod === 'snapscan' && (
        <div className="space-y-4">
          <button
            onClick={() => setStep('method')}
            className="text-sm text-electric-cyan hover:underline"
          >
            ← Back to payment methods
          </button>

          <div className="glass-morphism rounded-xl p-6 text-center">
            <p className="text-4xl mb-4">📱</p>
            <p className="font-semibold mb-2">Pay with SnapScan</p>
            <div className="bg-white p-4 rounded-lg inline-block mb-4">
              {/* QR Code Placeholder */}
              <div className="w-40 h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded flex items-center justify-center">
                <span className="text-white text-xs">QR Code</span>
              </div>
            </div>
            <p className="text-sm text-soft-silver">
              Open SnapScan and scan the code to pay
            </p>
          </div>
        </div>
      )}

      {/* Zapper Payment */}
      {step === 'details' && selectedMethod === 'zapper' && (
        <div className="space-y-4">
          <button
            onClick={() => setStep('method')}
            className="text-sm text-electric-cyan hover:underline"
          >
            ← Back to payment methods
          </button>

          <div className="glass-morphism rounded-xl p-6 text-center">
            <p className="text-4xl mb-4">⚡</p>
            <p className="font-semibold mb-2">Pay with Zapper</p>
            <div className="bg-white p-4 rounded-lg inline-block mb-4">
              {/* QR Code Placeholder */}
              <div className="w-40 h-40 bg-gradient-to-br from-purple-600 to-purple-800 rounded flex items-center justify-center">
                <span className="text-white text-xs">QR Code</span>
              </div>
            </div>
            <p className="text-sm text-soft-silver">
              Open Zapper and scan the code to pay
            </p>
          </div>
        </div>
      )}

      {/* Processing */}
      {step === 'processing' && (
        <div className="text-center py-8">
          <Loader2 className="w-12 h-12 text-electric-cyan animate-spin mx-auto mb-4" />
          <p className="font-semibold">Processing your payment...</p>
          <p className="text-sm text-soft-silver">Please do not close this window</p>
        </div>
      )}

      {/* Success */}
      {step === 'success' && (
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p className="text-xl font-semibold mb-2">Payment Successful!</p>
          <p className="text-soft-silver mb-4">
            Reference: <span className="text-electric-cyan font-mono">{reference}</span>
          </p>
          <p className="text-sm text-soft-silver">
            A confirmation email has been sent to your inbox.
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white/10 text-center">
        <p className="text-xs text-soft-silver">
          Secured by <span className="text-electric-cyan font-semibold">RemotePay</span>
        </p>
        <p className="text-xs text-soft-silver mt-1">
          Need help? Call 073 555 8440
        </p>
      </div>
    </div>
  );
}
