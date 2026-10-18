import type { Metadata } from 'next';
import { CartPage } from '@/components/cart/CartPage';

export const metadata: Metadata = {
  title: 'Shopping Cart | MUNIAMART',
  description: 'View your shopping cart items, apply discount vouchers, and proceed to secure checkout.',
};

export default function CartPageRoute() {
  return <CartPage />;
}
