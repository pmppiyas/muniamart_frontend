export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'CONFIRMED'
  | 'DELIVERY_IN_PROGRESS'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'CANCELED'
  | 'PROCESSING'
  | 'SHIPPED';

export interface OrderItemProduct {
  id: string;
  name: string;
  sku?: string;
  price: number;
  photoUrl?: string | null;
  images?: string[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
  product?: OrderItemProduct;
}

export interface OrderAddress {
  id: string;
  orderId: string;
  customerId?: string | null;
  fullName: string;
  phone: string;
  email?: string | null;
  streetAddress: string;
  apartment?: string | null;
  city: string;
  state: string;
  postalCode: string;
  deliveryNotes?: string | null;
  deliveryMethod?: string | null;
  paymentMethod?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  photoUrl?: string | null;
}

export interface OrderPayment {
  id: string;
  orderId: string;
  amount: number;
  provider: 'STRIPE' | 'BKASH';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  transactionId?: string | null;
  createdAt: string;
}

export interface OrderMetrics {
  total: number;
  pending: number;
  confirmed: number;
  inProgress: number;
  delivered: number;
  canceled: number;
}

export interface OrdersPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  metrics?: OrderMetrics;
}

export interface Order {
  id: string;
  customerId?: string | null;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  address?: OrderAddress | null;
  customer?: OrderCustomer | null;
  payments?: OrderPayment[];
}

export interface GetAllOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateOrderPayload {
  id: string;
  status?: OrderStatus;
  shippingAddress?: Partial<OrderAddress>;
}
