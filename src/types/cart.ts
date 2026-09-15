export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug?: string;
  sku: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  photoUrl?: string | null;
  category?: string;
  brand?: string;
  selectedVariants?: Record<string, string>;
  stock: number;
}

export interface AppliedCoupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
}

export interface CartState {
  items: CartItem[];
  coupon: AppliedCoupon | null;
}
