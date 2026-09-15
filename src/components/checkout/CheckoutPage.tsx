'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '@/hooks/useCart';
import { useAppSelector } from '@/store/hooks';
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from '@/features/auth/authSelectors';
import { useCreateOrderMutation } from '@/services/api/orderApi';
import { useCreatePaymentMutation } from '@/services/api/paymentApi';
import { CheckoutForm } from './CheckoutForm';
import { CheckoutOrderSummary } from './CheckoutOrderSummary';
import { StripePaymentForm } from './StripePaymentForm';
import {
  CheckoutFormData,
  DeliveryMethod,
  OrderConfirmationData,
} from '@/features/checkout/checkoutTypes';
import { env } from '@/config/env';
import { toast } from 'sonner';

const stripePromise = env.STRIPE_PUBLISHABLE_KEY
  ? loadStripe(env.STRIPE_PUBLISHABLE_KEY)
  : null;

export function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, coupon, clearAll } = useCart();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [createOrderApi, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();
  const [createPaymentApi, { isLoading: isCreatingPayment }] =
    useCreatePaymentMutation();

  const [deliveryMethod, setDeliveryMethod] =
    React.useState<DeliveryMethod>('standard');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [stripeClientSecret, setStripeClientSecret] = React.useState<
    string | null
  >(null);
  const [pendingOrderId, setPendingOrderId] = React.useState<string | null>(
    null
  );
  const [pendingConfirmation, setPendingConfirmation] =
    React.useState<OrderConfirmationData | null>(null);

  const standardFee = 0;
  const expressFee = 0;
  const shippingFee = 0;

  const discount = React.useMemo(() => {
    if (!coupon) return 0;
    if (coupon.discountType === 'percentage') {
      return (subtotal * coupon.discountValue) / 100;
    }
    return Math.min(subtotal, coupon.discountValue);
  }, [coupon, subtotal]);

  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (mounted && items.length === 0 && !stripeClientSecret) {
      toast.info('Your cart is empty. Please add items to checkout.');
      router.push('/cart');
    }
  }, [mounted, items.length, router, stripeClientSecret]);

  React.useEffect(() => {
    if (!mounted) return;
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('paymentStatus');
    if (paymentStatus === 'cancel') {
      toast.info('bKash payment was cancelled.');
      window.history.replaceState({}, '', window.location.pathname);
    } else if (paymentStatus === 'failed') {
      toast.error('bKash payment failed. Please try again.');
      window.history.replaceState({}, '', window.location.pathname);
    } else if (paymentStatus === 'error') {
      const msg = params.get('message') || 'Payment processing error.';
      toast.error(msg);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [mounted]);

  const buildConfirmationData = (
    formData: CheckoutFormData,
    orderId: string
  ): OrderConfirmationData => ({
    orderId,
    customerName: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    streetAddress:
      formData.streetAddress +
      (formData.apartment ? `, ${formData.apartment}` : ''),
    city: formData.city,
    state: formData.state,
    postalCode: formData.postalCode,
    deliveryMethod,
    paymentMethod: formData.paymentMethod,
    totalAmount: grandTotal,
    items: items.map((i) => ({
      id: i.id,
      productId: i.productId,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      photoUrl: i.photoUrl,
    })),
    createdAt: new Date().toISOString(),
  });

  const saveAndRedirectSuccess = async (
    confirmationData: OrderConfirmationData
  ) => {
    try {
      sessionStorage.setItem('lastOrder', JSON.stringify(confirmationData));
    } catch {}
    await clearAll();
    toast.success('Order placed successfully!');
    router.push(`/checkout/success?orderId=${confirmationData.orderId}`);
  };

  const handleFormSubmit = async (formData: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const apiRes = await createOrderApi({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          streetAddress: formData.streetAddress,
          apartment: formData.apartment || undefined,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          deliveryNotes: formData.deliveryNotes || undefined,
          deliveryMethod,
          paymentMethod: formData.paymentMethod,
        },
      }).unwrap();

      const orderId = apiRes.data?.id;
      if (!orderId) {
        throw new Error('Failed to create order - no order ID returned');
      }

      const confirmationData = buildConfirmationData(formData, orderId);

      if (formData.paymentMethod === 'cod') {
        await saveAndRedirectSuccess(confirmationData);
      } else if (formData.paymentMethod === 'card') {
        const paymentRes = await createPaymentApi({
          orderId,
          provider: 'STRIPE',
        }).unwrap();

        const stripeURL =
          paymentRes.data?.redirectUrl ||
          paymentRes.data?.clientSecret;

        if (!stripeURL) {
          throw new Error(
            'Failed to create Stripe payment - no checkout URL returned'
          );
        }

        try {
          sessionStorage.setItem('lastOrder', JSON.stringify(confirmationData));
        } catch {}

        toast.info('Redirecting to Stripe Checkout...');
        window.location.href = stripeURL;
        return;
      } else if (formData.paymentMethod === 'bkash') {
        const paymentRes = await createPaymentApi({
          orderId,
          provider: 'BKASH',
        }).unwrap();

        const bkashURL = paymentRes.data?.clientSecret;
        if (!bkashURL) {
          throw new Error(
            'Failed to create bKash payment - no redirect URL returned'
          );
        }

        try {
          sessionStorage.setItem('lastOrder', JSON.stringify(confirmationData));
        } catch {}

        toast.info('Redirecting to bKash...');
        window.location.href = bkashURL;
        return;
      }
    } catch (error: any) {
      console.error('Order submission error:', error);
      const msg =
        error?.data?.message ||
        error?.message ||
        'Failed to process order. Please try again.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStripeSuccess = async () => {
    if (pendingConfirmation) {
      await saveAndRedirectSuccess(pendingConfirmation);
    }
    setStripeClientSecret(null);
    setPendingOrderId(null);
    setPendingConfirmation(null);
  };

  const handleStripeCancel = () => {
    setStripeClientSecret(null);
    setPendingOrderId(null);
    setPendingConfirmation(null);
    toast.info('Payment cancelled. Your order is saved as pending.');
  };

  if (!mounted || (items.length === 0 && !stripeClientSecret)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-muted/20 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center justify-between"
          >
            <ol className="flex items-center space-x-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  <Home className="h-3.5 w-3.5" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li>
                <Link href="/cart" className="hover:text-foreground">
                  Cart
                </Link>
              </li>
              <li>
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li className="font-bold text-foreground">Checkout</li>
            </ol>

            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Cart</span>
            </Link>
          </nav>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Secure Checkout
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Please fill in your delivery details and choose your preferred
              payment method.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 xl:col-span-8">
              <CheckoutForm
                user={user}
                isAuthenticated={isAuthenticated}
                standardFee={standardFee}
                expressFee={expressFee}
                deliveryMethod={deliveryMethod}
                onDeliveryMethodChange={setDeliveryMethod}
                onSubmit={handleFormSubmit}
                isSubmitting={
                  isSubmitting || isCreatingOrder || isCreatingPayment
                }
              />
            </div>

            <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
              <CheckoutOrderSummary
                items={items}
                subtotal={subtotal}
                discount={discount}
                shippingFee={shippingFee}
                grandTotal={grandTotal}
                coupon={coupon}
              />
            </div>
          </div>
        </div>
      </div>

      {stripeClientSecret && stripePromise && pendingOrderId && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: stripeClientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                borderRadius: '12px',
                fontFamily: 'inherit',
              },
            },
          }}
        >
          <StripePaymentForm
            orderId={pendingOrderId}
            onSuccess={handleStripeSuccess}
            onCancel={handleStripeCancel}
          />
        </Elements>
      )}
    </>
  );
}
