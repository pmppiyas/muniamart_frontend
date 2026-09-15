'use client';

import * as React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectCartItems,
  selectCartTotalQuantity,
  selectCartSubtotal,
  selectCartCoupon,
} from '@/features/cart/cartSelectors';
import {
  addToCart as addToCartRedux,
  removeFromCart as removeFromCartRedux,
  updateQuantity as updateQuantityRedux,
  clearCart as clearCartRedux,
} from '@/features/cart/cartSlice';
import { selectIsAuthenticated } from '@/features/auth/authSelectors';
import {
  useAddToCartMutation,
  useUpdateCartItemQuantityMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} from '@/services/api/cartApi';
import { CartItem } from '@/types/cart';

export function useCart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const totalQuantity = useAppSelector(selectCartTotalQuantity);
  const subtotal = useAppSelector(selectCartSubtotal);
  const coupon = useAppSelector(selectCartCoupon);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [addToCartApi] = useAddToCartMutation();
  const [updateCartItemQuantityApi] = useUpdateCartItemQuantityMutation();
  const [removeCartItemApi] = useRemoveCartItemMutation();
  const [clearCartApi] = useClearCartMutation();

  const addItem = React.useCallback(
    async (item: Omit<CartItem, 'id'> & { id?: string }) => {
      dispatch(addToCartRedux(item));

      if (isAuthenticated) {
        try {
          await addToCartApi({
            productId: item.productId,
            quantity: item.quantity,
            selectedVariants: item.selectedVariants,
          }).unwrap();
        } catch (error) {
          console.warn('Failed to sync add-to-cart to database:', error);
        }
      }
    },
    [dispatch, isAuthenticated, addToCartApi]
  );

  const updateItemQuantity = React.useCallback(
    async (id: string, quantity: number) => {
      dispatch(updateQuantityRedux({ id, quantity }));

      if (isAuthenticated) {
        try {
          await updateCartItemQuantityApi({ id, quantity }).unwrap();
        } catch (error) {
          console.warn('Failed to sync cart quantity to database:', error);
        }
      }
    },
    [dispatch, isAuthenticated, updateCartItemQuantityApi]
  );

  const removeItem = React.useCallback(
    async (id: string) => {
      dispatch(removeFromCartRedux(id));

      if (isAuthenticated) {
        try {
          await removeCartItemApi(id).unwrap();
        } catch (error) {
          console.warn('Failed to sync remove cart item to database:', error);
        }
      }
    },
    [dispatch, isAuthenticated, removeCartItemApi]
  );

  const clearAll = React.useCallback(async () => {
    dispatch(clearCartRedux());

    if (isAuthenticated) {
      try {
        await clearCartApi().unwrap();
      } catch (error) {
        console.warn('Failed to sync clear cart to database:', error);
      }
    }
  }, [dispatch, isAuthenticated, clearCartApi]);

  return {
    items,
    totalQuantity,
    subtotal,
    coupon,
    isAuthenticated,
    addItem,
    updateItemQuantity,
    removeItem,
    clearAll,
  };
}
