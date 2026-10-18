import { baseApi } from './baseApi';
import { ApiResponse, CustomerUser } from '@/features/auth/authTypes';
import {
  CustomerListItem,
  CustomerDetails,
  CustomerMetrics,
  CustomerQueryParams,
} from '@/types/customer';

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  photoUrl?: string;
}

export interface CustomersPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  metrics?: CustomerMetrics;
}

export interface GetAllCustomersResponse {
  success: boolean;
  message: string;
  meta: CustomersPaginationMeta;
  data: CustomerListItem[];
}

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ApiResponse<CustomerUser>, void>({
      query: () => ({
        url: '/customer/me',
        method: 'GET',
      }),
      providesTags: ['Customer'],
    }),

    updateProfile: builder.mutation<ApiResponse<CustomerUser>, UpdateProfileRequest>({
      query: (payload) => ({
        url: '/customer/me',
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['Customer', 'Auth'],
    }),

    getAllCustomers: builder.query<GetAllCustomersResponse, CustomerQueryParams | void>({
      query: (params) => {
        const queryParams: Record<string, string | number> = {};
        if (params?.page) queryParams.page = params.page;
        if (params?.limit) queryParams.limit = params.limit;
        if (params?.search) queryParams.search = params.search;
        if (params?.status && params.status !== 'ALL') queryParams.status = params.status;

        return {
          url: '/customer',
          method: 'GET',
          params: queryParams,
        };
      },
      providesTags: ['Customer'],
    }),

    getSingleCustomer: builder.query<ApiResponse<CustomerDetails>, string>({
      query: (id) => ({
        url: `/customer/${id}`,
        method: 'GET',
      }),
      providesTags: ['Customer'],
    }),

    updateCustomerStatus: builder.mutation<
      ApiResponse<CustomerListItem>,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/customer/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Customer'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
  useGetAllCustomersQuery,
  useGetSingleCustomerQuery,
  useLazyGetSingleCustomerQuery,
  useUpdateCustomerStatusMutation,
} = customerApi;
