import { RootState } from '@/store';
import { Currency, CURRENCIES } from '@/config/currency';

export const selectCurrentCurrency = (state: RootState): Currency =>
  state.currency?.current || 'BDT';

export const selectCurrencyConfig = (state: RootState) => {
  const current = selectCurrentCurrency(state);
  return CURRENCIES[current] || CURRENCIES.BDT;
};
