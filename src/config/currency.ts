export type Currency = 'BDT' | 'USD' | 'EUR';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  name: string;
  flag: string;
  rateToBDT: number;
}

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  BDT: {
    code: 'BDT',
    symbol: '৳',
    name: 'Bangladeshi Taka',
    flag: '🇧🇩',
    rateToBDT: 1,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    rateToBDT: 120,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    rateToBDT: 130,
  },
};

export const DEFAULT_CURRENCY: Currency = 'BDT';
