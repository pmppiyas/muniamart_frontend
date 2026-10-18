import { baseApi } from './baseApi';
import {
  ApiResponse,
  CustomerUser,
  LoginRequest,
  LoginResponseData,
  RegisterRequest,
  RegisterResponseData,
} from '@/features/auth/authTypes';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginResponseData>, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/signin',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth', 'Customer', 'Cart'],
    }),

    register: builder.mutation<ApiResponse<RegisterResponseData>, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
      }),
    }),

    getMe: builder.query<ApiResponse<CustomerUser>, void>({
      query: () => ({
        url: '/customer/me',
        method: 'GET',
      }),
      providesTags: ['Customer', 'Auth'],
    }),

    logout: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'Customer', 'Cart'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useLogoutMutation,
} = authApi;
