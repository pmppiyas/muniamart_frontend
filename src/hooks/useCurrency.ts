'use client';

import * as React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCurrency } from '@/features/currency/currencySlice';
import { selectCurrentCurrency } from '@/features/currency/currencySelectors';
import { Currency, CURRENCIES } from '@/config/currency';
import { formatCurrencyAmount } from '@/lib/utils';

export function useCurrency() {
  const dispatch = useAppDispatch();
  const current = useAppSelector(selectCurrentCurrency);

  const config = CURRENCIES[current] || CURRENCIES.BDT;

  const convertPrice = React.useCallback(
    (priceInBDT: number | string): number => {
      const numeric =
        typeof priceInBDT === 'string'
          ? parseFloat(priceInBDT) || 0
          : priceInBDT || 0;
      if (current === 'BDT') return numeric;
      return numeric / config.rateToBDT;
    },
    [current, config.rateToBDT]
  );

  const formatPrice = React.useCallback(
    (
      priceInBDT: number | string,
      options?: { notation?: Intl.NumberFormatOptions['notation'] }
    ): string => {
      const converted = convertPrice(priceInBDT);
      return formatCurrencyAmount(converted, current, options?.notation);
    },
    [convertPrice, current]
  );

  const handleSetCurrency = React.useCallback(
    (newCurrency: Currency) => {
      dispatch(setCurrency(newCurrency));
    },
    [dispatch]
  );

  return {
    currency: current,
    setCurrency: handleSetCurrency,
    config,
    symbol: config.symbol,
    convertPrice,
    formatPrice,
  };
}
