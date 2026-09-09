import { baseApi } from './baseApi';
import { ApiResponse } from '@/features/auth/authTypes';
import { Order, GetAllOrdersParams, UpdateOrderPayload, OrdersPaginationMeta } from '@/types/order';

export interface CreateOrderPayload {
  items: { productId: string; quantity: number }[];
  shippingAddress?: {
    fullName: string;
    phone: string;
    email?: string;
    streetAddress: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    deliveryNotes?: string;
    deliveryMethod?: string;
    paymentMethod?: string;
  };
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query<
      { success: boolean; message: string; meta?: OrdersPaginationMeta; data: Order[] },
      GetAllOrdersParams | void
    >({
      query: (params) => {
        const queryParams: Record<string, string | number> = {};
        if (params?.page) queryParams.page = params.page;
        if (params?.limit) queryParams.limit = params.limit;
        if (params?.search) queryParams.search = params.search;
        if (params?.status && params.status !== 'ALL') queryParams.status = params.status;
        if (params?.startDate) queryParams.startDate = params.startDate;
        if (params?.endDate) queryParams.endDate = params.endDate;

        return {
          url: '/order',
          method: 'GET',
          params: queryParams,
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),

    getMyOrders: builder.query<ApiResponse<Order[]>, void>({
      query: () => ({
        url: '/order/my',
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),

    getOrderById: builder.query<ApiResponse<Order>, string>({
      query: (id) => ({
        url: `/order/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),

    createOrder: builder.mutation<ApiResponse<Order>, CreateOrderPayload>({
      query: (body) => ({
        url: '/order',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Order', 'Cart'],
    }),

    updateOrder: builder.mutation<ApiResponse<Order>, UpdateOrderPayload>({
      query: ({ id, ...body }) => ({
        url: `/order/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
      ],
    }),

    deleteOrder: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (id) => ({
        url: `/order/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllOrdersQuery,
  useGetMyOrdersQuery,
  useLazyGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
