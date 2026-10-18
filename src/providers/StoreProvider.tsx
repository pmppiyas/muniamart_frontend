'use client';

import * as React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { hydrateCart } from '@/features/cart/cartSlice';
import { AuthInitializer } from './AuthInitializer';
import { CartSync } from './CartSync';

const CART_STORAGE_KEY = 'muniamart_cart';

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

    let prevCartState = store.getState().cart;

    const unsubscribe = store.subscribe(() => {
      try {
        const state = store.getState();
        if (state.cart !== prevCartState) {
          prevCartState = state.cart;
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
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
        <CartSync />
        {children}
      </StorePersistenceInitializer>
    </Provider>
  );
}
