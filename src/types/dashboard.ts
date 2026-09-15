export interface DashboardMetrics {
  totalRevenue: number;
  revenueChange: string;
  totalOrders: number;
  ordersChange: string;
  pendingOrders?: number;
  totalCustomers: number;
  customersChange: string;
  totalProducts: number;
  lowStockCount: number;
  totalCategories: number;
  thisWeekRevenue: number;
}

export interface OrderStatusChartItem {
  status: string;
  label: string;
  count: number;
  color: string;
  percentage: number;
}

export interface PaymentMethodChartItem {
  name: string;
  provider: string;
  count: number;
  revenue: number;
  percentage: number;
  color: string;
}

export interface WeeklySalesItem {
  day: string;
  amount: number;
  height: string;
}

export interface DashboardRecentOrderItem {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  items: number;
  amount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

export interface DashboardCharts {
  ordersByStatus: OrderStatusChartItem[];
  paymentMethodsBreakdown: PaymentMethodChartItem[];
  weeklySales: WeeklySalesItem[];
}

export interface DashboardMetadata {
  metrics: DashboardMetrics;
  charts: DashboardCharts;
  recentOrders: DashboardRecentOrderItem[];
}
