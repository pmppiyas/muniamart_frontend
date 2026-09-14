'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { OrderSuccessReceipt } from '@/components/checkout/OrderSuccessReceipt';
import { OrderConfirmationData } from '@/features/checkout/checkoutTypes';
import { useCart } from '@/hooks/useCart';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderIdFromUrl = searchParams.get('orderId');
  const [orderData, setOrderData] =
    React.useState<OrderConfirmationData | null>(null);
  const { clearAll } = useCart();

  React.useEffect(() => {
    clearAll();
  }, [clearAll]);

  React.useEffect(() => {
    try {
      const stored = sessionStorage.getItem('lastOrder');
      if (stored) {
        const parsed = JSON.parse(stored);
        setOrderData(parsed);
      } else if (orderIdFromUrl) {
        setOrderData({
          orderId: orderIdFromUrl,
          customerName: 'Valued Customer',
          email: '',
          phone: '',
          streetAddress: 'Delivery Address',
          city: 'Dhaka',
          state: 'Bangladesh',
          postalCode: '',
          deliveryMethod: 'standard',
          paymentMethod: 'cod',
          totalAmount: 0,
          items: [],
          createdAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [orderIdFromUrl]);

  if (!orderData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <OrderSuccessReceipt orderData={orderData} />;
}

export default function CheckoutSuccessPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </React.Suspense>
  );
}
