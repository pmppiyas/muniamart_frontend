import { baseApi } from './baseApi';
import { ApiResponse } from '@/features/auth/authTypes';
import {
  AdminItem,
  AdminQueryParams,
  CreateAdminPayload,
  GetAllAdminsResponse,
  PermissionDefinition,
  UpdateAdminPayload,
} from '@/types/admin';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAdmins: builder.query<GetAllAdminsResponse, AdminQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.searchTerm) queryParams.append('searchTerm', params.searchTerm);
        if (params?.role && params.role !== 'ALL') queryParams.append('role', params.role);
        if (params?.status && params.status !== 'ALL') queryParams.append('status', params.status);
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

        const queryString = queryParams.toString();
        return `/admin${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Admin' as const, id })),
              { type: 'Admin', id: 'LIST' },
            ]
          : [{ type: 'Admin', id: 'LIST' }],
    }),

    getSingleAdmin: builder.query<ApiResponse<AdminItem>, string>({
      query: (id) => `/admin/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Admin', id }],
    }),

    getAvailablePermissions: builder.query<ApiResponse<PermissionDefinition[]>, void>({
      query: () => '/admin/permissions',
    }),

    createAdmin: builder.mutation<ApiResponse<AdminItem>, CreateAdminPayload>({
      query: (body) => ({
        url: '/admin',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Admin', id: 'LIST' }],
    }),

    updateAdmin: builder.mutation<
      ApiResponse<AdminItem>,
      { id: string; body: UpdateAdminPayload }
    >({
      query: ({ id, body }) => ({
        url: `/admin/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Admin', id },
        { type: 'Admin', id: 'LIST' },
        'Auth',
      ],
    }),

    deleteAdmin: builder.mutation<ApiResponse<AdminItem>, string>({
      query: (id) => ({
        url: `/admin/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Admin', id },
        { type: 'Admin', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAllAdminsQuery,
  useGetSingleAdminQuery,
  useGetAvailablePermissionsQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} = adminApi;
