import { baseApi } from './baseApi';
import { ApiResponse } from '@/features/auth/authTypes';

export interface BackendCartProduct {
  id: string;
  name: string;
  sku: string;
  price: number | string;
  stock: number;
  photoUrl: string | null;
  status: string;
}

export interface BackendCartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  selectedVariants?: Record<string, string> | null;
  createdAt: string;
  updatedAt: string;
  product: BackendCartProduct;
}

export interface BackendCartResponseData {
  id: string;
  items: BackendCartItem[];
  totalQuantity: number;
  subtotal: number;
}

export interface AddToCartPayload {
  productId: string;
  quantity?: number;
  selectedVariants?: Record<string, string>;
}

export interface UpdateCartItemPayload {
  id: string;
  quantity: number;
}

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<ApiResponse<BackendCartResponseData>, void>({
      query: () => ({
        url: '/cart',
        method: 'GET',
      }),
      providesTags: ['Cart'],
    }),

    addToCart: builder.mutation<ApiResponse<BackendCartResponseData>, AddToCartPayload>({
      query: (body) => ({
        url: '/cart',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cart'],
    }),

    updateCartItemQuantity: builder.mutation<
      ApiResponse<BackendCartResponseData>,
      UpdateCartItemPayload
    >({
      query: ({ id, quantity }) => ({
        url: `/cart/${id}`,
        method: 'PATCH',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),

    removeCartItem: builder.mutation<ApiResponse<BackendCartResponseData>, string>({
      query: (cartItemId) => ({
        url: `/cart/${cartItemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),

    clearCart: builder.mutation<ApiResponse<{ message: string }>, void>({
      query: () => ({
        url: '/cart',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCartQuery,
  useLazyGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemQuantityMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApi;
