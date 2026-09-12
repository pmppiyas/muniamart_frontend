'use client';

import * as React from 'react';
import {
  Eye,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  DollarSign,
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
import { CustomerListItem } from '@/types/customer';
import { useCurrency } from '@/hooks/useCurrency';
import { cn } from '@/lib/utils';
import { CustomersTableSkeleton } from './CustomersTableSkeleton';
import { CustomersEmptyState } from './CustomersEmptyState';

interface CustomersTableProps {
  customers: CustomerListItem[];
  isLoading: boolean;
  page: number;
  totalPage: number;
  totalCustomers: number;
  limit: number;
  onPageChange: (page: number) => void;
  onViewCustomer: (customer: CustomerListItem) => void;
  onChangeStatus: (customer: CustomerListItem) => void;
  isFiltering: boolean;
  onClearFilters: () => void;
}

const STATUS_BADGES: Record<
  string,
  { label: string; bg: string; color: string; border: string }
> = {
  ACTIVE: {
    label: 'Active',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/20',
  },
  INACTIVE: {
    label: 'Inactive',
    bg: 'bg-amber-500/10',
    color: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/20',
  },
  BLOCKED: {
    label: 'Blocked',
    bg: 'bg-rose-500/10',
    color: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-500/20',
  },
};

export function CustomersTable({
  customers,
  isLoading,
  page,
  totalPage,
  totalCustomers,
  limit,
  onPageChange,
  onViewCustomer,
  onChangeStatus,
  isFiltering,
  onClearFilters,
}: CustomersTableProps) {
  const { formatPrice } = useCurrency();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <CustomersTableSkeleton />
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <CustomersEmptyState
          isFiltering={isFiltering}
          onClearFilters={onClearFilters}
        />
      </div>
    );
  }

  const startRecord = (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, totalCustomers);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-[280px] text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Customer Details
              </TableHead>
              <TableHead className="w-[110px] text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="w-[100px] text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">
                Total Orders
              </TableHead>
              <TableHead className="min-w-50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Status-Wise Orders
              </TableHead>
              <TableHead className="w-30 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Total Spent
              </TableHead>
              <TableHead className="w-27.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Joined
              </TableHead>
              <TableHead className="w-25 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border/60">
            {customers.map((c) => {
              const statusCfg = STATUS_BADGES[c.status] || STATUS_BADGES.ACTIVE;
              const { statusWiseOrderCount: s } = c;

              return (
                <TableRow
                  key={c.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  <TableCell className="py-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs border border-primary/20 overflow-hidden mt-0.5">
                        {c.photoUrl ? (
                          <img
                            src={c.photoUrl}
                            alt={c.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          c.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <p className="text-xs font-bold text-foreground truncate">
                          {c.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                          <Mail className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                          <span>{c.email}</span>
                        </p>
                        {c.phone ? (
                          <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                            <Phone className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                            <span>{c.phone}</span>
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                        statusCfg.bg,
                        statusCfg.color,
                        statusCfg.border
                      )}
                    >
                      {statusCfg.label}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-3 text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                      {c.orderCount}
                    </span>
                  </TableCell>

                  <TableCell className="py-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {s.PENDING > 0 && (
                        <span
                          title={`${s.PENDING} Pending Order(s)`}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                        >
                          <Clock className="h-2.5 w-2.5" />
                          {s.PENDING} Pend
                        </span>
                      )}

                      {s.PAID > 0 && (
                        <span
                          title={`${s.PAID} Paid Order(s)`}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                        >
                          <DollarSign className="h-2.5 w-2.5" />
                          {s.PAID} Paid
                        </span>
                      )}

                      {s.CONFIRMED > 0 && (
                        <span
                          title={`${s.CONFIRMED} Confirmed Order(s)`}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20"
                        >
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          {s.CONFIRMED} Conf
                        </span>
                      )}

                      {s.DELIVERY_IN_PROGRESS > 0 && (
                        <span
                          title={`${s.DELIVERY_IN_PROGRESS} In Delivery`}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20"
                        >
                          <Truck className="h-2.5 w-2.5" />
                          {s.DELIVERY_IN_PROGRESS} In Prog
                        </span>
                      )}

                      {s.DELIVERED > 0 && (
                        <span
                          title={`${s.DELIVERED} Delivered`}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-emerald-600/10 text-emerald-800 dark:text-emerald-300 border border-emerald-600/20"
                        >
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          {s.DELIVERED} Deliv
                        </span>
                      )}

                      {s.CANCELED > 0 && (
                        <span
                          title={`${s.CANCELED} Canceled Order(s)`}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20"
                        >
                          <XCircle className="h-2.5 w-2.5" />
                          {s.CANCELED} Canc
                        </span>
                      )}

                      {c.orderCount === 0 && (
                        <span className="text-[11px] text-muted-foreground/60 italic">
                          No orders
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="py-3 text-xs font-semibold text-foreground">
                    {formatPrice(c.totalSpent)}
                  </TableCell>

                  <TableCell className="py-3 text-xs text-muted-foreground">
                    {new Date(c.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>

                  <TableCell className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewCustomer(c)}
                        title="View details"
                        className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onChangeStatus(c)}
                        title="Change status"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border bg-muted/20">
        <span className="text-xs text-muted-foreground">
          Showing{' '}
          <span className="font-semibold text-foreground">{startRecord}</span>{' '}
          to <span className="font-semibold text-foreground">{endRecord}</span>{' '}
          of{' '}
          <span className="font-semibold text-foreground">
            {totalCustomers}
          </span>{' '}
          customers
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="px-3 text-xs font-medium text-foreground">
            Page {page} of {totalPage || 1}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPage, page + 1))}
            disabled={page >= totalPage}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
