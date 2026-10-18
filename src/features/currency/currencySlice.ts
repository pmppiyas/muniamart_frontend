import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Currency, DEFAULT_CURRENCY } from '@/config/currency';

export interface CurrencyState {
  current: Currency;
}

const STORAGE_KEY = 'muniamart_currency';

const getInitialCurrency = (): Currency => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === 'BDT' || saved === 'USD' || saved === 'EUR')) {
        return saved as Currency;
      }
    } catch {}
  }
  return DEFAULT_CURRENCY;
};

const initialState: CurrencyState = {
  current: getInitialCurrency(),
};

export const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<Currency>) => {
      state.current = action.payload;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, action.payload);
        } catch {}
      }
    },
  },
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;
