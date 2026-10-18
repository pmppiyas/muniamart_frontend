export type AdminRole = 'SUPER_ADMIN' | 'ADMIN';
export type AdminStatus = 'ACTIVE' | 'INACTIVE';

export type AdminPermissionKey =
  | 'MANAGE_PRODUCTS'
  | 'MANAGE_CATEGORIES'
  | 'MANAGE_ORDERS'
  | 'MANAGE_CUSTOMERS'
  | 'MANAGE_PAYMENTS';

export interface PermissionDefinition {
  key: AdminPermissionKey;
  name: string;
  module: string;
  description: string;
}

export interface AdminItem {
  id: string;
  name: string;
  email: string;
  photoUrl: string | null;
  role: AdminRole;
  status: AdminStatus;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminMetrics {
  totalAdmins: number;
  superAdmins: number;
  regularAdmins: number;
  activeAdmins: number;
  inactiveAdmins: number;
}

export interface AdminQueryParams {
  searchTerm?: string;
  role?: AdminRole | string;
  status?: AdminStatus | string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateAdminPayload {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
  status: AdminStatus;
  permissions: string[];
}

export interface UpdateAdminPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: AdminRole;
  status?: AdminStatus;
  permissions?: string[];
}

export interface GetAllAdminsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: AdminItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
    metrics: AdminMetrics;
  };
}
