'use client';

import * as React from 'react';
import { useMounted } from './useMounted';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectWishlistItems,
  selectWishlistTotalCount,
} from '@/features/wishlist/wishlistSelectors';
import {
  toggleWishlist as toggleWishlistRedux,
  removeFromWishlist as removeFromWishlistRedux,
  clearWishlist as clearWishlistRedux,
} from '@/features/wishlist/wishlistSlice';
import { selectIsAuthenticated } from '@/features/auth/authSelectors';
import {
  useToggleWishlistMutation,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
} from '@/services/api/wishlistApi';
import { WishlistItem } from '@/types/wishlist';

export function useWishlist() {
  const dispatch = useAppDispatch();
  const mounted = useMounted();
  const items = useAppSelector(selectWishlistItems);
  const rawTotalCount = useAppSelector(selectWishlistTotalCount);
  const totalCount = mounted ? rawTotalCount : 0;
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [toggleWishlistApi] = useToggleWishlistMutation();
  const [removeFromWishlistApi] = useRemoveFromWishlistMutation();
  const [clearWishlistApi] = useClearWishlistMutation();

  const isInWishlist = React.useCallback(
    (productId: string) => {
      if (!mounted) return false;
      return items.some((item) => item.productId === productId);
    },
    [items, mounted]
  );

  const toggleItem = React.useCallback(
    async (item: Omit<WishlistItem, 'addedAt' | 'id'> & { id?: string; addedAt?: string }) => {
      dispatch(toggleWishlistRedux(item));

      if (isAuthenticated) {
        try {
          await toggleWishlistApi({ productId: item.productId }).unwrap();
        } catch (error) {
          console.warn('Failed to sync wishlist toggle to database:', error);
        }
      }
    },
    [dispatch, isAuthenticated, toggleWishlistApi]
  );

  const removeItem = React.useCallback(
    async (productId: string) => {
      dispatch(removeFromWishlistRedux(productId));

      if (isAuthenticated) {
        try {
          await removeFromWishlistApi(productId).unwrap();
        } catch (error) {
          console.warn('Failed to sync remove wishlist item to database:', error);
        }
      }
    },
    [dispatch, isAuthenticated, removeFromWishlistApi]
  );

  const clearAll = React.useCallback(async () => {
    dispatch(clearWishlistRedux());

    if (isAuthenticated) {
      try {
        await clearWishlistApi().unwrap();
      } catch (error) {
        console.warn('Failed to sync clear wishlist to database:', error);
      }
    }
  }, [dispatch, isAuthenticated, clearWishlistApi]);

  return {
    items: mounted ? items : [],
    totalCount,
    isAuthenticated,
    isInWishlist,
    toggleItem,
    removeItem,
    clearAll,
    isMounted: mounted,
  };
}
