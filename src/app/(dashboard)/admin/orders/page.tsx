'use client';

import * as React from 'react';
import { toast } from 'sonner';
import {
  OrdersHeader,
  OrdersFilterBar,
  OrdersTable,
  OrderDeleteDialog,
} from '@/components/admin/orders';
import { useGetAllOrdersQuery } from '@/services/api/orderApi';
import { Order } from '@/types/order';

export default function AdminOrdersPage() {
  // 1. Filter & Pagination States
  const [page, setPage] = React.useState(1);
  const limit = 15;

  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('ALL');
  const [dateFilter, setDateFilter] = React.useState('ALL');

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Calculate date range from dateFilter
  const { startDate, endDate } = React.useMemo(() => {
    const now = new Date();
    if (dateFilter === 'TODAY') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return { startDate: start.toISOString(), endDate: undefined };
    }
    if (dateFilter === 'LAST_7_DAYS') {
      const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return { startDate: start.toISOString(), endDate: undefined };
    }
    if (dateFilter === 'LAST_30_DAYS') {
      const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return { startDate: start.toISOString(), endDate: undefined };
    }
    return { startDate: undefined, endDate: undefined };
  }, [dateFilter]);

  // Fetch orders from backend
  const {
    data: ordersResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllOrdersQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
    status: selectedStatus,
    startDate,
    endDate,
  });

  const orders: Order[] = ordersResponse?.data || [];
  const meta = ordersResponse?.meta;
  const totalCount = meta?.total ?? orders.length;
  const totalPage = meta?.totalPage ?? Math.ceil(totalCount / limit);
  const metrics = meta?.metrics;

  // Handlers
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setPage(1);
  };

  const handleDateFilterChange = (val: string) => {
    setDateFilter(val);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedStatus('ALL');
    setDateFilter('ALL');
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedStatus !== 'ALL' ||
    dateFilter !== 'ALL'
  );

  // Delete modal state
  const [selectedOrderForDelete, setSelectedOrderForDelete] =
    React.useState<Order | null>(null);

  // CSV Export
  const handleExportCSV = () => {
    if (orders.length === 0) {
      toast.info('No orders available to export');
      return;
    }

    const headers = [
      'Order ID',
      'Customer Name',
      'Email',
      'Phone',
      'Total Amount ($)',
      'Status',
      'Items Count',
      'Payment Method',
      'Address',
      'City',
      'Date',
    ];

    const rows = orders.map((o) => {
      const orderNumber = o.id.toUpperCase().startsWith('ORD-')
        ? o.id.toUpperCase()
        : `ORD-${o.id}`;

      return [
        `"${orderNumber}"`,
        `"${(o.customer?.name || o.address?.fullName || 'Customer').replace(/"/g, '""')}"`,
        `"${(o.customer?.email || o.address?.email || '').replace(/"/g, '""')}"`,
        `"${(o.customer?.phone || o.address?.phone || '').replace(/"/g, '""')}"`,
        Number(o.totalAmount || 0).toFixed(2),
        `"${o.status}"`,
        o.items?.length || 0,
        `"${o.address?.paymentMethod || 'COD'}"`,
        `"${(o.address?.streetAddress || '').replace(/"/g, '""')}"`,
        `"${(o.address?.city || '').replace(/"/g, '""')}"`,
        `"${o.createdAt ? new Date(o.createdAt).toISOString() : ''}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `orders-export-${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Orders exported successfully');
  };

  return (
    <div className="space-y-4">
      {/* 1. Header with Title, Count, Quick Metrics, and Actions */}
      <OrdersHeader
        totalCount={totalCount}
        metrics={metrics}
        selectedStatus={selectedStatus}
        onStatusSelect={handleStatusChange}
        isFetching={isFetching}
        onRefresh={() => refetch()}
        onExport={handleExportCSV}
      />

      {/* 2. Filter Bar (Search + Status + Timeframe) */}
      <OrdersFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        dateFilter={dateFilter}
        onDateFilterChange={handleDateFilterChange}
        onReset={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 3. Orders Table */}
      <OrdersTable
        orders={orders}
        isLoading={isLoading}
        page={page}
        totalPage={totalPage}
        totalOrders={totalCount}
        limit={limit}
        onPageChange={setPage}
        onDeleteClick={(order) => setSelectedOrderForDelete(order)}
        isFiltering={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      {/* 4. Delete Confirmation Dialog */}
      <OrderDeleteDialog
        order={selectedOrderForDelete}
        isOpen={Boolean(selectedOrderForDelete)}
        onClose={() => setSelectedOrderForDelete(null)}
      />
    </div>
  );
}
