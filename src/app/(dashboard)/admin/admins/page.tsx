'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { AdminPermissionGuard } from '@/components/admin/AdminPermissionGuard';
import { AdminsHeader } from '@/components/admin/admins/AdminsHeader';
import { AdminsFilterBar } from '@/components/admin/admins/AdminsFilterBar';
import { AdminsTable } from '@/components/admin/admins/AdminsTable';
import { AdminFormModal } from '@/components/admin/admins/AdminFormModal';
import { AdminDeleteDialog } from '@/components/admin/admins/AdminDeleteDialog';
import { useGetAllAdminsQuery } from '@/services/api/adminApi';
import { AdminItem } from '@/types/admin';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/features/auth/authSelectors';

export default function AdminsManagementPage() {
  const currentUser = useAppSelector(selectCurrentUser);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState('ALL');
  const [selectedStatus, setSelectedStatus] = React.useState('ALL');
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [adminToEdit, setAdminToEdit] = React.useState<AdminItem | null>(null);
  const [adminToDelete, setAdminToDelete] = React.useState<AdminItem | null>(null);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data, isLoading, isFetching, refetch } = useGetAllAdminsQuery({
    searchTerm: debouncedSearch || undefined,
    role: selectedRole !== 'ALL' ? selectedRole : undefined,
    status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
    page,
    limit,
  });

  const admins = React.useMemo(() => {
    const list = data?.data || [];
    return [...list].sort((a, b) => {
      if (a.role === 'SUPER_ADMIN' && b.role !== 'SUPER_ADMIN') return -1;
      if (a.role !== 'SUPER_ADMIN' && b.role === 'SUPER_ADMIN') return 1;

      if (a.role === 'SUPER_ADMIN' && b.role === 'SUPER_ADMIN') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [data?.data]);
  const meta = data?.meta;
  const metrics = meta?.metrics;
  const totalCount = meta?.total || 0;
  const totalPage = meta?.totalPage || 1;

  const hasActiveFilters =
    Boolean(searchQuery) || selectedRole !== 'ALL' || selectedStatus !== 'ALL';

  const handleResetFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedRole('ALL');
    setSelectedStatus('ALL');
    setPage(1);
  };

  const handleOpenCreate = () => {
    setAdminToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (admin: AdminItem) => {
    setAdminToEdit(admin);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (admin: AdminItem) => {
    setAdminToDelete(admin);
  };

  const handleExportCSV = () => {
    if (admins.length === 0) {
      toast.error('No administrators available to export');
      return;
    }

    const headers = [
      'ID',
      'Name',
      'Email',
      'Role',
      'Status',
      'Permissions',
      'Created At',
    ];

    const rows = admins.map((admin) => [
      admin.id,
      `"${admin.name.replace(/"/g, '""')}"`,
      admin.email,
      admin.role,
      admin.status,
      `"${(admin.permissions || []).join(', ')}"`,
      admin.createdAt,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `administrators_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Administrators CSV exported successfully');
  };

  return (
    <AdminPermissionGuard superAdminOnly moduleName="Admins & Roles">
      <div className="space-y-6 pb-12">
        <AdminsHeader
          totalCount={totalCount}
          metrics={metrics}
          isFetching={isFetching}
          onRefresh={refetch}
          onExport={handleExportCSV}
          onAddAdmin={handleOpenCreate}
        />

        <AdminsFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedRole={selectedRole}
          onRoleChange={(role) => {
            setSelectedRole(role);
            setPage(1);
          }}
          selectedStatus={selectedStatus}
          onStatusChange={(status) => {
            setSelectedStatus(status);
            setPage(1);
          }}
          onReset={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <AdminsTable
          admins={admins}
          isLoading={isLoading}
          page={page}
          totalPage={totalPage}
          totalAdmins={totalCount}
          limit={limit}
          currentUserId={currentUser?.id}
          onPageChange={setPage}
          onEditAdmin={handleOpenEdit}
          onDeleteAdmin={handleOpenDelete}
          isFiltering={hasActiveFilters}
          onClearFilters={handleResetFilters}
          onAddAdmin={handleOpenCreate}
        />

        <AdminFormModal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setAdminToEdit(null);
          }}
          adminToEdit={adminToEdit}
          currentUserId={currentUser?.id}
        />

        <AdminDeleteDialog
          isOpen={!!adminToDelete}
          onClose={() => setAdminToDelete(null)}
          admin={adminToDelete}
          currentUserId={currentUser?.id}
        />
      </div>
    </AdminPermissionGuard>
  );
}
