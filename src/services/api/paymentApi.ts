import { baseApi } from './baseApi';
import { ApiResponse } from '@/features/auth/authTypes';
import {
  GetAllPaymentsResponse,
  PaymentItem,
  PaymentQueryParams,
} from '@/types/payment';

export interface CreatePaymentRequest {
  orderId: string;
  provider: 'STRIPE' | 'BKASH';
}

export interface CreatePaymentResponse {
  paymentId: string;
  clientSecret: string;
  transactionId: string;
}

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPayment: builder.mutation<
      ApiResponse<CreatePaymentResponse>,
      CreatePaymentRequest
    >({
      query: (body) => ({
        url: '/payment',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Order', 'Payment'],
    }),

    getAllPayments: builder.query<
      GetAllPaymentsResponse,
      PaymentQueryParams | void
    >({
      query: (params) => {
        const queryParams: Record<string, string | number> = {};
        if (params?.page) queryParams.page = params.page;
        if (params?.limit) queryParams.limit = params.limit;
        if (params?.search) queryParams.search = params.search;
        if (params?.provider && params.provider !== 'ALL') {
          queryParams.provider = params.provider;
        }
        if (params?.status && params.status !== 'ALL') {
          queryParams.status = params.status;
        }
        if (params?.startDate) queryParams.startDate = params.startDate;
        if (params?.endDate) queryParams.endDate = params.endDate;

        return {
          url: '/payment',
          method: 'GET',
          params: queryParams,
        };
      },
      providesTags: ['Payment'],
    }),

    getSinglePayment: builder.query<ApiResponse<PaymentItem>, string>({
      query: (id) => ({
        url: `/payment/${id}`,
        method: 'GET',
      }),
      providesTags: ['Payment'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreatePaymentMutation,
  useGetAllPaymentsQuery,
  useGetSinglePaymentQuery,
} = paymentApi;
