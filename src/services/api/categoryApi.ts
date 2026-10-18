import { baseApi } from './baseApi';
import { ApiResponse } from '@/features/auth/authTypes';

export interface BackendSubCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children?: BackendSubCategory[];
  description?: string | null;
  imageUrl?: string | null;
  itemCount?: number;
  icon?: string | null;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    products?: number;
    children?: number;
  };
}

export interface BackendCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  description?: string | null;
  imageUrl?: string | null;
  icon?: string | null;
  itemCount?: number;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    products?: number;
    children?: number;
  };
  children: BackendSubCategory[];
}

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query<ApiResponse<BackendCategory[]>, void>({
      query: () => ({
        url: '/category',
        method: 'GET',
      }),
      providesTags: ['Category'],
    }),

    getCategoryById: builder.query<ApiResponse<BackendCategory>, string>({
      query: (id) => ({
        url: `/category/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Category', id }],
    }),

    createCategory: builder.mutation<
      ApiResponse<BackendCategory>,
      FormData | { name: string; parentId?: string | null; description?: string; imageUrl?: string; icon?: string }
    >({
      query: (body) => ({
        url: '/category',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Category', 'Product'],
    }),

    updateCategory: builder.mutation<
      ApiResponse<BackendCategory>,
      { id: string; data: FormData | Record<string, any> }
    >({
      query: ({ id, data }) => ({
        url: `/category/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Category', 'Product'],
    }),

    deleteCategory: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/category/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category', 'Product'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllCategoriesQuery,
  useLazyGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
