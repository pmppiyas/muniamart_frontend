import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Currency, CURRENCIES, DEFAULT_CURRENCY } from '@/config/currency';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a numeric amount directly in a given currency with correct symbols
 */
export function formatCurrencyAmount(
  amount: number,
  currency: Currency = DEFAULT_CURRENCY,
  notation?: Intl.NumberFormatOptions['notation']
): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;

  if (currency === 'BDT') {
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      notation,
    }).format(safeAmount);
    return `৳${formatted}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    notation,
  }).format(safeAmount);
}

/**
 * Formats a BDT price (as stored in database) into the requested currency
 * Defaults to BDT (৳) if no currency specified
 */
export function formatPrice(
  priceInBDT: number | string,
  options: {
    currency?: Currency;
    notation?: Intl.NumberFormatOptions['notation'];
  } = {}
): string {
  const { currency = DEFAULT_CURRENCY, notation } = options;
  const numeric =
    typeof priceInBDT === 'string'
      ? parseFloat(priceInBDT) || 0
      : priceInBDT || 0;

  const rateToBDT = CURRENCIES[currency]?.rateToBDT || 1;
  const convertedAmount = currency === 'BDT' ? numeric : numeric / rateToBDT;

  return formatCurrencyAmount(convertedAmount, currency, notation);
}
