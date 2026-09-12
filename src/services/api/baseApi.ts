import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { env } from '@/config/env';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: env.API_BASE_URL,
    credentials: 'include',
  }),
  tagTypes: ['Auth', 'Customer', 'Cart', 'Order', 'Category', 'Product', 'Payment'],
  endpoints: () => ({}),
});
