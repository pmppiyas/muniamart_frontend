import { baseApi } from './baseApi';
import { ApiResponse } from '@/features/auth/authTypes';
import { Product } from '@/types/product';

export interface CreateProductPayload {
  name: string;
  sku: string;
  description?: string;
  photoUrl?: string;
  price: number;
  stock: number;
  categoryId: string;
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  photoUrl?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface GetProductsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: string;
  stockStatus?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<ApiResponse<Product[]>, GetProductsQueryParams | void>({
      query: (params) => ({
        url: '/product',
        method: 'GET',
        params: params || { page: 1, limit: 15 },
      }),
      providesTags: ['Product'],
    }),

    getProductById: builder.query<ApiResponse<Product>, string>({
      query: (id) => ({
        url: `/product/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),

    createProduct: builder.mutation<ApiResponse<Product>, CreateProductPayload | FormData>({
      query: (body) => ({
        url: '/product',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Product'],
    }),

    updateProduct: builder.mutation<
      ApiResponse<Product>,
      { id: string; data: UpdateProductPayload | FormData }
    >({
      query: ({ id, data }) => ({
        url: `/product/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => ['Product', { type: 'Product', id }],
    }),

    deleteProduct: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/product/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllProductsQuery,
  useLazyGetAllProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
