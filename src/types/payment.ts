export type PaymentProvider = 'STRIPE' | 'BKASH';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface PaymentCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  photoUrl?: string | null;
}

export interface PaymentAddress {
  fullName: string;
  phone: string;
  email?: string | null;
  streetAddress: string;
  city: string;
}

export interface PaymentOrder {
  id: string;
  totalAmount: number | string;
  status: string;
  createdAt: string;
  customer?: PaymentCustomer | null;
  address?: PaymentAddress | null;
  items?: {
    id: number;
    quantity: number;
    price: number | string;
    subtotal: number | string;
    product: {
      id: string;
      name: string;
      photoUrl?: string | null;
      price: number | string;
    };
  }[];
}

export interface PaymentItem {
  id: string;
  orderId: string;
  provider: PaymentProvider;
  transactionId: string;
  status: PaymentStatus;
  rawResponse?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
  order?: PaymentOrder;
}

export interface PaymentMetrics {
  totalPayments: number;
  successfulCount: number;
  pendingCount: number;
  failedCount: number;
  totalRevenue: number;
  stripeRevenue: number;
  bkashRevenue: number;
}

export interface PaymentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  provider?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaymentPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  metrics?: PaymentMetrics;
}

export interface GetAllPaymentsResponse {
  success: boolean;
  message: string;
  meta: PaymentPaginationMeta;
  data: PaymentItem[];
}
