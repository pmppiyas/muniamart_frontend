import type { Metadata } from 'next';
import { CheckoutPage } from '@/components/checkout/CheckoutPage';

export const metadata: Metadata = {
  title: 'Secure Checkout | MUNIAMART',
  description: 'Complete your purchase with fast delivery and 100% secure payment.',
};

export default function Checkout() {
  return <CheckoutPage />;
}
