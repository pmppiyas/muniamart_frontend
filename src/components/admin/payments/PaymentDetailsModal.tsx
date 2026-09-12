'use client';

import * as React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  CreditCard,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  DollarSign,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Clock,
  XCircle,
  FileCode,
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PaymentItem } from '@/types/payment';
import { useCurrency } from '@/hooks/useCurrency';
import { cn } from '@/lib/utils';

interface PaymentDetailsModalProps {
  payment: PaymentItem | null;
  isOpen: boolean;
  onClose: () => void;
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

export function PaymentDetailsModal({
  payment,
  isOpen,
  onClose,
}: PaymentDetailsModalProps) {
  const { formatPrice } = useCurrency();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !payment) return null;

  const providerCfg = PROVIDER_CONFIG[payment.provider] || {
    label: payment.provider,
    bg: 'bg-muted',
    color: 'text-foreground',
    border: 'border-border',
  };

  const statusCfg = STATUS_CONFIG[payment.status] || STATUS_CONFIG.PENDING;
  const StatusIcon = statusCfg.icon;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Transaction ID copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const orderAmount = payment.order?.totalAmount
    ? Number(payment.order.totalAmount)
    : 0;

  const customer = payment.order?.customer;
  const address = payment.order?.address;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Transaction Details"
      description={`Transaction reference ${payment.transactionId}`}
      maxWidth="2xl"
      footer={
        <Button variant="default" size="sm" onClick={onClose} className="text-xs">
          Close
        </Button>
      }
    >
      <div className="space-y-5">
        {/* Top Summary Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-muted/40 border border-border">
          <div className="space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Transaction ID
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-foreground break-all">
                {payment.transactionId}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(payment.transactionId)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                title="Copy Transaction ID"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                'text-xs font-semibold px-2.5 py-0.5 rounded-full',
                providerCfg.bg,
                providerCfg.color,
                providerCfg.border
              )}
            >
              {providerCfg.label}
            </Badge>

            <Badge
              variant="outline"
              className={cn(
                'text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1',
                statusCfg.bg,
                statusCfg.color,
                statusCfg.border
              )}
            >
              <StatusIcon className="h-3 w-3" />
              {statusCfg.label}
            </Badge>
          </div>
        </div>

        {/* Transaction & Order Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Amount and Gateway */}
          <div className="p-3.5 rounded-xl border border-border bg-card space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Payment Amount
            </h4>
            <div className="text-2xl font-bold text-foreground">
              {formatPrice(orderAmount)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(payment.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Associated Order */}
          <div className="p-3.5 rounded-xl border border-border bg-card space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Associated Order
              </h4>
              <Link
                href={`/admin/orders/${payment.orderId}`}
                target="_blank"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                View Order
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
            <div className="font-mono text-sm font-bold text-foreground">
              ORD-{payment.orderId.toUpperCase().slice(0, 10)}
            </div>
            <p className="text-xs text-muted-foreground">
              Status: <span className="font-semibold uppercase">{payment.order?.status || 'N/A'}</span>
            </p>
          </div>
        </div>

        {/* Customer & Delivery Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Customer Profile */}
          <div className="p-3.5 rounded-xl border border-border bg-card space-y-1.5 text-xs">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Customer Information
            </h4>
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-primary" />
              {customer?.name || address?.fullName || 'Guest Customer'}
            </div>
            {(customer?.email || address?.email) && (
              <p className="text-muted-foreground flex items-center gap-1.5 pl-5">
                <Mail className="h-3.5 w-3.5" />
                {customer?.email || address?.email}
              </p>
            )}
            {(customer?.phone || address?.phone) && (
              <p className="text-muted-foreground flex items-center gap-1.5 pl-5">
                <Phone className="h-3.5 w-3.5" />
                {customer?.phone || address?.phone}
              </p>
            )}
          </div>

          {/* Shipping Address */}
          <div className="p-3.5 rounded-xl border border-border bg-card space-y-1.5 text-xs">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Billing / Shipping Destination
            </h4>
            {address ? (
              <>
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {address.fullName}
                </div>
                <p className="text-muted-foreground pl-5 leading-relaxed">
                  {address.streetAddress}
                  <br />
                  {address.city}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground/70 italic">
                No billing address recorded for this payment.
              </p>
            )}
          </div>
        </div>

        {/* Raw Gateway Response (Collapsible / JSON View) */}
        {payment.rawResponse && (
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FileCode className="h-3.5 w-3.5 text-primary" />
              Gateway Response Payload
            </h4>
            <pre className="p-3 rounded-lg bg-muted text-[11px] font-mono text-muted-foreground overflow-x-auto max-h-40 scrollbar-thin">
              {JSON.stringify(payment.rawResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </Modal>
  );
}
