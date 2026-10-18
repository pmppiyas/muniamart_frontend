'use client';

import * as React from 'react';
import { toast } from 'sonner';
import {
  PaymentsHeader,
  PaymentsFilterBar,
  PaymentsTable,
  PaymentDetailsModal,
} from '@/components/admin/payments';
import { useGetAllPaymentsQuery } from '@/services/api/paymentApi';
import { PaymentItem } from '@/types/payment';
import { AdminPermissionGuard } from '@/components/admin/AdminPermissionGuard';

export default function AdminPaymentsPage() {
  const [page, setPage] = React.useState(1);
  const limit = 15;

  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [selectedProvider, setSelectedProvider] = React.useState('ALL');
  const [selectedStatus, setSelectedStatus] = React.useState('ALL');

  const [selectedPaymentForDetails, setSelectedPaymentForDetails] =
    React.useState<PaymentItem | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: paymentsResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllPaymentsQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
    provider: selectedProvider,
    status: selectedStatus,
  });

  const payments: PaymentItem[] = paymentsResponse?.data || [];
  const meta = paymentsResponse?.meta;
  const totalCount = meta?.total ?? payments.length;
  const totalPage = meta?.totalPage ?? Math.max(1, Math.ceil(totalCount / limit));
  const metrics = meta?.metrics;

  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider);
    setPage(1);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedProvider('ALL');
    setSelectedStatus('ALL');
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedProvider !== 'ALL' ||
    selectedStatus !== 'ALL'
  );

  const handleExportCSV = () => {
    if (payments.length === 0) {
      toast.info('No payment records to export');
      return;
    }

    const headers = [
      'Transaction ID',
      'Order ID',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Gateway Provider',
      'Amount ($)',
      'Status',
      'Date & Time',
    ];

    const rows = payments.map((p) => {
      const customer = p.order?.customer;
      const address = p.order?.address;
      const amount = p.order?.totalAmount
        ? Number(p.order.totalAmount).toFixed(2)
        : '0.00';

      return [
        `"${p.transactionId}"`,
        `"${p.orderId}"`,
        `"${(customer?.name || address?.fullName || 'Customer').replace(/"/g, '""')}"`,
        `"${(customer?.email || address?.email || '').replace(/"/g, '""')}"`,
        `"${(customer?.phone || address?.phone || '').replace(/"/g, '""')}"`,
        `"${p.provider}"`,
        amount,
        `"${p.status}"`,
        `"${p.createdAt ? new Date(p.createdAt).toISOString() : ''}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `payments-export-${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Payments exported to CSV successfully');
  };

  return (
    <AdminPermissionGuard requiredPermission="MANAGE_PAYMENTS" moduleName="Payments">
      <div className="space-y-4">
        <PaymentsHeader
          totalCount={totalCount}
          metrics={metrics}
          isFetching={isFetching}
          onRefresh={() => refetch()}
          onExport={handleExportCSV}
        />

        <PaymentsFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedProvider={selectedProvider}
          onProviderChange={handleProviderChange}
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
          onReset={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <PaymentsTable
          payments={payments}
          isLoading={isLoading}
          page={page}
          totalPage={totalPage}
          totalPayments={totalCount}
          limit={limit}
          onPageChange={setPage}
          onViewPayment={(p) => setSelectedPaymentForDetails(p)}
          isFiltering={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />

        <PaymentDetailsModal
          payment={selectedPaymentForDetails}
          isOpen={Boolean(selectedPaymentForDetails)}
          onClose={() => setSelectedPaymentForDetails(null)}
        />
      </div>
    </AdminPermissionGuard>
  );
}
