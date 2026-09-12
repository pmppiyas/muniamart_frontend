'use client';

import * as React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Eye,
  Copy,
  Check,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  XCircle,
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
import { PaymentItem } from '@/types/payment';
import { useCurrency } from '@/hooks/useCurrency';
import { cn } from '@/lib/utils';
import { PaymentsTableSkeleton } from './PaymentsTableSkeleton';
import { PaymentsEmptyState } from './PaymentsEmptyState';

interface PaymentsTableProps {
  payments: PaymentItem[];
  isLoading: boolean;
  page: number;
  totalPage: number;
  totalPayments: number;
  limit: number;
  onPageChange: (page: number) => void;
  onViewPayment: (payment: PaymentItem) => void;
  isFiltering: boolean;
  onClearFilters: () => void;
}

const PROVIDER_CONFIG: Record<
  string,
  { label: string; bg: string; color: string; border: string }
> = {
  STRIPE: {
    label: 'Stripe',
    bg: 'bg-indigo-500/10',
    color: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-500/20',
  },
  BKASH: {
    label: 'bKash',
    bg: 'bg-pink-500/10',
    color: 'text-pink-600 dark:text-pink-400',
    border: 'border-pink-500/20',
  },
};

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; color: string; border: string; icon: typeof CheckCircle2 }
> = {
  SUCCESS: {
    label: 'Success',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/20',
    icon: CheckCircle2,
  },
  PENDING: {
    label: 'Pending',
    bg: 'bg-amber-500/10',
    color: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/20',
    icon: Clock,
  },
  FAILED: {
    label: 'Failed',
    bg: 'bg-rose-500/10',
    color: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-500/20',
    icon: XCircle,
  },
};

export function PaymentsTable({
  payments,
  isLoading,
  page,
  totalPage,
  totalPayments,
  limit,
  onPageChange,
  onViewPayment,
  isFiltering,
  onClearFilters,
}: PaymentsTableProps) {
  const { formatPrice } = useCurrency();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.success('Transaction ID copied');
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <PaymentsTableSkeleton />
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <PaymentsEmptyState
          isFiltering={isFiltering}
          onClearFilters={onClearFilters}
        />
      </div>
    );
  }

  const startRecord = (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, totalPayments);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-[180px] text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Transaction ID
              </TableHead>
              <TableHead className="w-[140px] text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Order Reference
              </TableHead>
              <TableHead className="w-[240px] text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Customer Details
              </TableHead>
              <TableHead className="w-[110px] text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Gateway
              </TableHead>
              <TableHead className="w-[120px] text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Amount
              </TableHead>
              <TableHead className="w-[110px] text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="w-[140px] text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Date & Time
              </TableHead>
              <TableHead className="w-[70px] text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border/60">
            {payments.map((p) => {
              const providerCfg = PROVIDER_CONFIG[p.provider] || {
                label: p.provider,
                bg: 'bg-muted',
                color: 'text-foreground',
                border: 'border-border',
              };

              const statusCfg = STATUS_CONFIG[p.status] || STATUS_CONFIG.PENDING;
              const StatusIcon = statusCfg.icon;

              const customer = p.order?.customer;
              const address = p.order?.address;
              const amount = p.order?.totalAmount
                ? Number(p.order.totalAmount)
                : 0;

              return (
                <TableRow
                  key={p.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  {/* Transaction ID with Copy */}
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-foreground truncate max-w-[120px] sm:max-w-[140px]">
                        {p.transactionId}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(p.transactionId)}
                        title="Copy Transaction ID"
                        className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                      >
                        {copiedId === p.transactionId ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </TableCell>

                  {/* Order Reference */}
                  <TableCell className="py-3">
                    <Link
                      href={`/admin/orders/${p.orderId}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 font-mono text-xs font-bold text-primary hover:underline"
                    >
                      ORD-{p.orderId.slice(0, 8).toUpperCase()}
                      <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                    </Link>
                  </TableCell>

                  {/* Customer Info */}
                  <TableCell className="py-3">
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-xs font-bold text-foreground truncate">
                        {customer?.name || address?.fullName || 'Guest Customer'}
                      </p>
                      {(customer?.email || address?.email) && (
                        <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                          <Mail className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                          <span>{customer?.email || address?.email}</span>
                        </p>
                      )}
                      {(customer?.phone || address?.phone) && (
                        <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                          <Phone className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                          <span>{customer?.phone || address?.phone}</span>
                        </p>
                      )}
                    </div>
                  </TableCell>

                  {/* Gateway Provider */}
                  <TableCell className="py-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full',
                        providerCfg.bg,
                        providerCfg.color,
                        providerCfg.border
                      )}
                    >
                      {providerCfg.label}
                    </Badge>
                  </TableCell>

                  {/* Amount */}
                  <TableCell className="py-3 text-xs font-bold text-foreground">
                    {formatPrice(amount)}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1',
                        statusCfg.bg,
                        statusCfg.color,
                        statusCfg.border
                      )}
                    >
                      <StatusIcon className="h-2.5 w-2.5" />
                      {statusCfg.label}
                    </Badge>
                  </TableCell>

                  {/* Date & Time */}
                  <TableCell className="py-3 text-xs text-muted-foreground">
                    {new Date(p.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </TableCell>

                  {/* Action */}
                  <TableCell className="py-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewPayment(p)}
                      title="View Details"
                      className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border bg-muted/20">
        <span className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{startRecord}</span> to{' '}
          <span className="font-semibold text-foreground">{endRecord}</span> of{' '}
          <span className="font-semibold text-foreground">{totalPayments}</span> payments
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
