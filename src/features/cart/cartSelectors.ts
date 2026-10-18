import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';

export const selectCartState = (state: RootState) => state.cart;

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartCoupon = (state: RootState) => state.cart.coupon;

export const selectCartTotalQuantity = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => total + item.quantity, 0)
);

export const selectCartSubtotal = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => total + item.price * item.quantity, 0)
);

export const selectCartDiscount = createSelector(
  [selectCartSubtotal, selectCartCoupon],
  (subtotal, coupon) => {
    if (!coupon || subtotal === 0) return 0;
    if (coupon.discountType === 'percentage') {
      return (subtotal * coupon.discountValue) / 100;
    }
    return Math.min(subtotal, coupon.discountValue);
  }
);

export const selectCartShipping = createSelector(
  [selectCartSubtotal],
  (subtotal) => {
    if (subtotal === 0) return 0;
    return subtotal >= 50 ? 0 : 9.99;
  }
);

export const selectCartGrandTotal = createSelector(
  [selectCartSubtotal, selectCartDiscount, selectCartShipping],
  (subtotal, discount, shipping) => Math.max(0, subtotal - discount + shipping)
);

export const selectFreeShippingRemaining = createSelector(
  [selectCartSubtotal],
  (subtotal) => {
    if (subtotal >= 50) return 0;
    return Math.max(0, 50 - subtotal);
  }
);
