'use client';

import * as React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated, selectIsAdmin } from '@/features/auth/authSelectors';
import { clearCart } from '@/features/cart/cartSlice';
import { clearWishlist } from '@/features/wishlist/wishlistSlice';
import { useLazyGetCartQuery, useAddToCartMutation } from '@/services/api/cartApi';
import { useLazyGetWishlistQuery, useAddToWishlistMutation } from '@/services/api/wishlistApi';

const CART_STORAGE_KEY = 'muniamart_cart';
const WISHLIST_STORAGE_KEY = 'muniamart_wishlist';

export function CartWishlistSync() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);
  const prevAuthRef = React.useRef<boolean>(false);
  const hasMergedGuestItemsRef = React.useRef<boolean>(false);

  const [fetchCart] = useLazyGetCartQuery();
  const [fetchWishlist] = useLazyGetWishlistQuery();
  const [addToCartApi] = useAddToCartMutation();
  const [addToWishlistApi] = useAddToWishlistMutation();

  React.useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      const syncWithDatabase = async () => {
        try {
          const [cartRes, wishlistRes] = await Promise.all([
            fetchCart().unwrap().catch((e) => {
              console.warn('Could not fetch cart from server:', e);
              return null;
            }),
            fetchWishlist().unwrap().catch((e) => {
              console.warn('Could not fetch wishlist from server:', e);
              return null;
            }),
          ]);

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

            const serverWishlistCount = wishlistRes?.data?.items?.length ?? 0;
            if (serverWishlistCount === 0) {
              try {
                const localWishlistRaw = localStorage.getItem(WISHLIST_STORAGE_KEY);
                if (localWishlistRaw) {
                  const localWishlist = JSON.parse(localWishlistRaw);
                  if (Array.isArray(localWishlist?.items) && localWishlist.items.length > 0) {
                    for (const item of localWishlist.items) {
                      await addToWishlistApi({
                        productId: item.productId,
                      }).unwrap().catch(() => {});
                    }
                  }
                }
              } catch {}
            }
          }
        } catch (err) {
          console.warn('Error synchronizing cart/wishlist with database:', err);
        }
      };

      syncWithDatabase();
    } else if (prevAuthRef.current && !isAuthenticated) {
      hasMergedGuestItemsRef.current = false;
      dispatch(clearCart());
      dispatch(clearWishlist());
      try {
        localStorage.removeItem(CART_STORAGE_KEY);
        localStorage.removeItem(WISHLIST_STORAGE_KEY);
      } catch {}
    }

    prevAuthRef.current = isAuthenticated;
  }, [
    isAuthenticated,
    dispatch,
    fetchCart,
    fetchWishlist,
    addToCartApi,
    addToWishlistApi,
  ]);

  return null;
}
