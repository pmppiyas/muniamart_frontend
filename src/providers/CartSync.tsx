'use client';

import * as React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated, selectIsAdmin } from '@/features/auth/authSelectors';
import { clearCart } from '@/features/cart/cartSlice';
import { useLazyGetCartQuery, useAddToCartMutation } from '@/services/api/cartApi';

const CART_STORAGE_KEY = 'muniamart_cart';

export function CartSync() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);
  const prevAuthRef = React.useRef<boolean>(false);
  const hasMergedGuestItemsRef = React.useRef<boolean>(false);

  const [fetchCart] = useLazyGetCartQuery();
  const [addToCartApi] = useAddToCartMutation();

  React.useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      const syncWithDatabase = async () => {
        try {
          const cartRes = await fetchCart().unwrap().catch((e) => {
            console.warn('Could not fetch cart from server:', e);
            return null;
          });

          if (!hasMergedGuestItemsRef.current) {
            hasMergedGuestItemsRef.current = true;

            const serverCartItemsCount = cartRes?.data?.items?.length ?? 0;
            if (serverCartItemsCount === 0) {
              try {
                const localCartRaw = localStorage.getItem(CART_STORAGE_KEY);
                if (localCartRaw) {
                  const localCart = JSON.parse(localCartRaw);
                  if (Array.isArray(localCart?.items) && localCart.items.length > 0) {
                    for (const item of localCart.items) {
                      await addToCartApi({
                        productId: item.productId,
                        quantity: item.quantity,
                        selectedVariants: item.selectedVariants,
                      }).unwrap().catch(() => {});
                    }
                  }
                }
              } catch {}
            }
          }
        } catch (err) {
          console.warn('Error synchronizing cart with database:', err);
        }
      };

      syncWithDatabase();
    } else if (prevAuthRef.current && !isAuthenticated) {
      hasMergedGuestItemsRef.current = false;
      dispatch(clearCart());
      try {
        localStorage.removeItem(CART_STORAGE_KEY);
      } catch {}
    }

    prevAuthRef.current = isAuthenticated;
  }, [
    isAuthenticated,
    dispatch,
    fetchCart,
    addToCartApi,
  ]);

  return null;
}
