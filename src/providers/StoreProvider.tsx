'use client';

import * as React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { hydrateCart } from '@/features/cart/cartSlice';
import { hydrateWishlist } from '@/features/wishlist/wishlistSlice';
import { AuthInitializer } from './AuthInitializer';
import { CartWishlistSync } from './CartWishlistSync';

const CART_STORAGE_KEY = 'muniamart_cart';
const WISHLIST_STORAGE_KEY = 'muniamart_wishlist';

function StorePersistenceInitializer({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        store.dispatch(hydrateCart(JSON.parse(savedCart)));
      }
    } catch (e) {
      console.warn('Failed to load cart from localStorage', e);
    }

    try {
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        store.dispatch(hydrateWishlist(JSON.parse(savedWishlist)));
      }
    } catch (e) {
      console.warn('Failed to load wishlist from localStorage', e);
    }

    let prevCartState = store.getState().cart;
    let prevWishlistState = store.getState().wishlist;

    const unsubscribe = store.subscribe(() => {
      try {
        const state = store.getState();
        if (state.cart !== prevCartState) {
          prevCartState = state.cart;
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
        }
        if (state.wishlist !== prevWishlistState) {
          prevWishlistState = state.wishlist;
          localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(state.wishlist));
        }
      } catch (e) {
        console.warn('Failed to save state to localStorage', e);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <>{children}</>;
}

interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  return (
    <Provider store={store}>
      <StorePersistenceInitializer>
        <AuthInitializer />
        <CartWishlistSync />
        {children}
      </StorePersistenceInitializer>
    </Provider>
  );
}
