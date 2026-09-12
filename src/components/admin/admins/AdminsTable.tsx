'use client';

import * as React from 'react';
import {
  Crown,
  ShieldCheck,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Sparkles,
  Shield,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminItem } from '@/types/admin';
import { cn } from '@/lib/utils';
import { AdminsTableSkeleton } from './AdminsTableSkeleton';
import { AdminsEmptyState } from './AdminsEmptyState';

interface AdminsTableProps {
  admins: AdminItem[];
  isLoading: boolean;
  page: number;
  totalPage: number;
  totalAdmins: number;
  limit: number;
  currentUserId?: string;
  onPageChange: (page: number) => void;
  onEditAdmin: (admin: AdminItem) => void;
  onDeleteAdmin: (admin: AdminItem) => void;
  isFiltering: boolean;
  onClearFilters: () => void;
  onAddAdmin: () => void;
}

const PERMISSION_LABELS: Record<
  string,
  { label: string; color: string }
> = {
  MANAGE_PRODUCTS: {
    label: 'Products',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
  MANAGE_CATEGORIES: {
    label: 'Categories',
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  },
  MANAGE_ORDERS: {
    label: 'Orders',
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  MANAGE_CUSTOMERS: {
    label: 'Customers',
    color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
  },
  MANAGE_PAYMENTS: {
    label: 'Payments',
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
};

export function AdminsTable({
  admins,
  isLoading,
  page,
  totalPage,
  totalAdmins,
  limit,
  currentUserId,
  onPageChange,
  onEditAdmin,
  onDeleteAdmin,
  isFiltering,
  onClearFilters,
  onAddAdmin,
}: AdminsTableProps) {
  if (isLoading) {
    return <AdminsTableSkeleton />;
  }

  if (admins.length === 0) {
    return (
      <AdminsEmptyState
        isFiltering={isFiltering}
        onClearFilters={onClearFilters}
        onAddAdmin={onAddAdmin}
      />
    );
  }

  const startIdx = (page - 1) * limit + 1;
  const endIdx = Math.min(page * limit, totalAdmins);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border/80">
              <TableHead className="w-[280px] text-xs font-bold text-muted-foreground uppercase tracking-wider py-3.5 pl-5">
                Administrator
              </TableHead>
              <TableHead className="w-[140px] text-xs font-bold text-muted-foreground uppercase tracking-wider py-3.5">
                Role
              </TableHead>
              <TableHead className="w-[120px] text-xs font-bold text-muted-foreground uppercase tracking-wider py-3.5">
                Status
              </TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-3.5">
                Granted Permissions
              </TableHead>
              <TableHead className="w-[130px] text-xs font-bold text-muted-foreground uppercase tracking-wider py-3.5">
                Created
              </TableHead>
              <TableHead className="w-[100px] text-right text-xs font-bold text-muted-foreground uppercase tracking-wider py-3.5 pr-5">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-border/60">
            {admins.map((admin, index) => {
              const isSuper = admin.role === 'SUPER_ADMIN';
              const isPrimarySuperAdmin = isSuper && index === 0;
              const isSelf = admin.id === currentUserId;
              const isActive = admin.status === 'ACTIVE';

              return (
                <TableRow
                  key={admin.id}
                  className={cn(
                    'hover:bg-muted/40 transition-colors group',
                    isPrimarySuperAdmin && 'bg-purple-500/[0.02]'
                  )}
                >
                  <TableCell className="py-3.5 pl-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-xs border shadow-2xs',
                          isPrimarySuperAdmin
                            ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400 ring-2 ring-amber-500/20'
                            : isSuper
                            ? 'bg-purple-500/15 border-purple-500/30 text-purple-600 dark:text-purple-400'
                            : 'bg-primary/10 border-primary/20 text-primary'
                        )}
                      >
                        {isSuper ? (
                          <Crown className="h-4 w-4" />
                        ) : (
                          admin.name.charAt(0).toUpperCase()
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground truncate">
                            {admin.name}
                          </span>
                          {isPrimarySuperAdmin && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 font-bold"
                            >
                              Primary
                            </Badge>
                          )}
                          {isSelf && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20 font-semibold"
                            >
                              You
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {admin.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-3.5">
                    {isSuper ? (
                      <Badge
                        variant="outline"
                        className={cn(
                          'gap-1.5 font-bold text-[11px] px-2.5 py-0.5 shadow-2xs border',
                          isPrimarySuperAdmin
                            ? 'bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-indigo-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30'
                            : 'bg-gradient-to-r from-purple-500/15 to-indigo-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30'
                        )}
                      >
                        <Crown className="h-3 w-3 text-amber-500" />
                        {isPrimarySuperAdmin ? 'Primary Super Admin' : 'Super Admin'}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="gap-1.5 bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20 font-semibold text-[11px] px-2.5 py-0.5"
                      >
                        <ShieldCheck className="h-3 w-3 text-blue-500" />
                        Admin
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="py-3.5">
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10.5px] font-semibold px-2 py-0.5 border',
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
                      )}
                    >
                      {isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-3.5">
                    {isSuper ? (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300">
                        <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                        <span>All Permissions Granted (God Mode)</span>
                      </div>
                    ) : admin.permissions && admin.permissions.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 max-w-md">
                        {admin.permissions.map((permKey) => {
                          const conf = PERMISSION_LABELS[permKey] || {
                            label: permKey,
                            color: 'bg-muted text-muted-foreground border-border',
                          };
                          return (
                            <span
                              key={permKey}
                              className={cn(
                                'inline-flex items-center rounded-md px-2 py-0.5 text-[10.5px] font-semibold border',
                                conf.color
                              )}
                            >
                              {conf.label}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-[11px] text-muted-foreground/70 italic flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        No permissions assigned
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="py-3.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
                      <span>
                        {new Date(admin.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-3.5 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditAdmin(admin)}
                        title="Edit Permissions & Details"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteAdmin(admin)}
                        disabled={isSelf}
                        title={isSelf ? 'Cannot delete your own account' : 'Delete Administrator'}
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {totalAdmins > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-5 py-3 text-xs text-muted-foreground">
          <div>
            Showing <span className="font-semibold text-foreground">{startIdx}</span> to{' '}
            <span className="font-semibold text-foreground">{endIdx}</span> of{' '}
            <span className="font-semibold text-foreground">{totalAdmins}</span> administrators
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="h-8 px-2.5 text-xs gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </Button>

            <span className="text-xs font-semibold px-2 text-foreground">
              Page {page} of {totalPage || 1}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPage}
              className="h-8 px-2.5 text-xs gap-1"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
