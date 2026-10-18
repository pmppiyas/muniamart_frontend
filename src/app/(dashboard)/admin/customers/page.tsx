'use client';

import * as React from 'react';
import { toast } from 'sonner';
import {
  CustomersHeader,
  CustomersFilterBar,
  CustomersTable,
  CustomerDetailsModal,
  CustomerStatusDialog,
} from '@/components/admin/customers';
import { useGetAllCustomersQuery } from '@/services/api/customerApi';
import { CustomerListItem } from '@/types/customer';
import { AdminPermissionGuard } from '@/components/admin/AdminPermissionGuard';

export default function AdminCustomersPage() {
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('ALL');

  const [selectedCustomerForDetails, setSelectedCustomerForDetails] =
    React.useState<CustomerListItem | null>(null);
  const [selectedCustomerForStatus, setSelectedCustomerForStatus] =
    React.useState<CustomerListItem | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: customersResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllCustomersQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
    status: selectedStatus,
  });

  const customers: CustomerListItem[] = customersResponse?.data || [];
  const meta = customersResponse?.meta;
  const totalCount = meta?.total ?? customers.length;
  const totalPage = meta?.totalPage ?? Math.ceil(totalCount / limit);
  const metrics = meta?.metrics;

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedStatus('ALL');
    setPage(1);
  };

  const hasActiveFilters = Boolean(searchQuery || selectedStatus !== 'ALL');

  const handleExportCSV = () => {
    if (customers.length === 0) {
      toast.info('No customers available to export');
      return;
    }

    const headers = [
      'Customer ID',
      'Name',
      'Email',
      'Phone',
      'Status',
      'Total Orders',
      'Pending Orders',
      'Paid Orders',
      'Confirmed Orders',
      'In Delivery Orders',
      'Delivered Orders',
      'Canceled Orders',
      'Total Spent ($)',
      'Joined Date',
    ];

    const rows = customers.map((c) => {
      const s = c.statusWiseOrderCount;
      return [
        `"${c.id}"`,
        `"${(c.name || '').replace(/"/g, '""')}"`,
        `"${(c.email || '').replace(/"/g, '""')}"`,
        `"${(c.phone || '').replace(/"/g, '""')}"`,
        `"${c.status}"`,
        c.orderCount,
        s.PENDING,
        s.PAID,
        s.CONFIRMED,
        s.DELIVERY_IN_PROGRESS,
        s.DELIVERED,
        s.CANCELED,
        Number(c.totalSpent || 0).toFixed(2),
        `"${c.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] : ''}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `customers-export-${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Customers list exported successfully');
  };

  return (
    <AdminPermissionGuard requiredPermission="MANAGE_CUSTOMERS" moduleName="Customers">
      <div className="space-y-4">
        <CustomersHeader
          totalCount={totalCount}
          metrics={metrics}
          isFetching={isFetching}
          onRefresh={() => refetch()}
          onExport={handleExportCSV}
        />

        <CustomersFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
          onReset={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <CustomersTable
          customers={customers}
          isLoading={isLoading}
          page={page}
          totalPage={totalPage}
          totalCustomers={totalCount}
          limit={limit}
          onPageChange={setPage}
          onViewCustomer={(customer) => setSelectedCustomerForDetails(customer)}
          onChangeStatus={(customer) => setSelectedCustomerForStatus(customer)}
          isFiltering={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />

        <CustomerDetailsModal
          customerId={selectedCustomerForDetails?.id || null}
          isOpen={Boolean(selectedCustomerForDetails)}
          onClose={() => setSelectedCustomerForDetails(null)}
          onOpenStatusDialog={() => {
            setSelectedCustomerForStatus(selectedCustomerForDetails);
            setSelectedCustomerForDetails(null);
          }}
        />

        <CustomerStatusDialog
          customer={selectedCustomerForStatus}
          isOpen={Boolean(selectedCustomerForStatus)}
          onClose={() => setSelectedCustomerForStatus(null)}
        />
      </div>
    </AdminPermissionGuard>
  );
}
