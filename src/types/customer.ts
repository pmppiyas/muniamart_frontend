export type CustomerStatusType = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';

export interface StatusWiseOrderCount {
  PENDING: number;
  PAID: number;
  CONFIRMED: number;
  DELIVERY_IN_PROGRESS: number;
  DELIVERED: number;
  CANCELED: number;
}

export interface CustomerListItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  photoUrl: string | null;
  status: CustomerStatusType;
  createdAt: string;
  updatedAt: string;
  orderCount: number;
  totalSpent: number;
  statusWiseOrderCount: StatusWiseOrderCount;
}

export interface CustomerMetrics {
  totalCustomers: number;
  activeCount: number;
  inactiveCount: number;
  blockedCount: number;
  totalOrdersCount: number;
}

export interface CustomerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface CustomerAddress {
  id: string;
  fullName: string;
  phone: string;
  email?: string | null;
  streetAddress: string;
  apartment?: string | null;
  city: string;
  state: string;
  postalCode: string;
  deliveryNotes?: string | null;
  deliveryMethod?: string;
  paymentMethod?: string;
}

export interface CustomerOrderSummary {
  id: string;
  totalAmount: number | string;
  status: string;
  createdAt: string;
  items: {
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
  address?: CustomerAddress | null;
}

export interface CustomerDetails extends CustomerListItem {
  addresses: CustomerAddress[];
  orders: CustomerOrderSummary[];
}
