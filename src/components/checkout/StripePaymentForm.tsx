'use client';

import * as React from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface StripePaymentFormProps {
  orderId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function StripePaymentForm({
  orderId,
  onSuccess,
  onCancel,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success?orderId=${orderId}`,
        },
        redirect: 'if_required',
      });

      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setErrorMessage(error.message || 'Payment failed. Please try again.');
        } else {
          setErrorMessage('An unexpected error occurred. Please try again.');
        }
        toast.error(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast.success('Payment completed successfully!');
        onSuccess();
      }
    } catch (err) {
      setErrorMessage('Something went wrong. Please try again.');
      toast.error('Payment processing error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5 my-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-card pb-2 pt-1 border-b border-border/50">
          <h3 className="text-lg font-bold text-foreground">
            Complete Payment
          </h3>
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="rounded-xl px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-2xl border border-border bg-background p-4">
            <PaymentElement
              options={{
                layout: 'tabs',
              }}
            />
          </div>

          {errorMessage && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-3 py-2 text-xs text-destructive font-semibold">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing || !stripe || !elements}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-lg hover:bg-primary-hover active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>Pay Now</span>
              </div>
            )}
          </button>

          <p className="text-center text-[10px] text-muted-foreground">
            Secured by Stripe. Your card details are never stored on our
            servers.
          </p>
        </form>
      </div>
    </div>
  );
}
