export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  photoUrl?: string | null;
  role?: 'ADMIN' | 'SUPER_ADMIN' | 'CUSTOMER' | string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | string;
  createdAt: string;
  _count?: {
    orders?: number;
  };
}

export interface AuthState {
  user: CustomerUser | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  photoUrl?: string;
}

export interface ApiMeta {
  page?: number;
  limit?: number;
  total: number;
  totalPage?: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: ApiMeta;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  user?: CustomerUser;
}

export type RegisterResponseData = CustomerUser;
