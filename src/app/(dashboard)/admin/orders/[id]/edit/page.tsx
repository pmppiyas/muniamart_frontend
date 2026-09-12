'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Save,
  Loader2,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  MapPin,
  ShieldCheck,
  User,
  Phone,
  Mail,
  Home,
  FileText,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useGetOrderByIdQuery, useUpdateOrderMutation } from '@/services/api/orderApi';
import { OrderStatus } from '@/types/order';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS: {
  value: OrderStatus;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  activeColor: string;
}[] = [
  {
    value: 'PENDING',
    label: 'Pending',
    desc: 'New order awaiting confirmation',
    icon: Clock,
    color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30',
    activeColor: 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/30 text-amber-700 dark:text-amber-300',
  },
  {
    value: 'CONFIRMED',
    label: 'Confirmed',
    desc: 'Order verified and prepared for packing',
    icon: CheckCircle2,
    color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border-emerald-500/30',
    activeColor: 'bg-emerald-500/20 border-emerald-500 ring-2 ring-emerald-500/30 text-emerald-800 dark:text-emerald-200',
  },
  {
    value: 'PAID',
    label: 'Paid',
    desc: 'Payment received and reconciled',
    icon: CheckCircle2,
    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    activeColor: 'bg-emerald-500/20 border-emerald-500 ring-2 ring-emerald-500/30 text-emerald-700 dark:text-emerald-300',
  },
  {
    value: 'DELIVERY_IN_PROGRESS',
    label: 'Out for Delivery',
    desc: 'Handed to courier for delivery',
    icon: Truck,
    color: 'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20',
    activeColor: 'bg-sky-500/20 border-sky-500 ring-2 ring-sky-500/30 text-sky-700 dark:text-sky-300',
  },
  {
    value: 'DELIVERED',
    label: 'Delivered',
    desc: 'Successfully received by customer',
    icon: CheckCircle2,
    color: 'text-green-700 dark:text-green-300 bg-green-500/15 border-green-500/30',
    activeColor: 'bg-green-500/20 border-green-500 ring-2 ring-green-500/30 text-green-800 dark:text-green-200',
  },
  {
    value: 'CANCELED',
    label: 'Canceled',
    desc: 'Order rejected or returned',
    icon: XCircle,
    color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
    activeColor: 'bg-rose-500/20 border-rose-500 ring-2 ring-rose-500/30 text-rose-700 dark:text-rose-300',
  },
];

export default function AdminOrderEditPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const { data: orderResponse, isLoading, isError } = useGetOrderByIdQuery(orderId, {
    skip: !orderId,
  });

  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const order = orderResponse?.data;

  const [status, setStatus] = React.useState<OrderStatus>('PENDING');
  const [fullName, setFullName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [streetAddress, setStreetAddress] = React.useState('');
  const [apartment, setApartment] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [postalCode, setPostalCode] = React.useState('');
  const [deliveryNotes, setDeliveryNotes] = React.useState('');
  const [deliveryMethod, setDeliveryMethod] = React.useState('standard');
  const [paymentMethod, setPaymentMethod] = React.useState('cod');

  React.useEffect(() => {
    if (order) {
      setStatus(order.status as OrderStatus);
      if (order.address) {
        setFullName(order.address.fullName || '');
        setPhone(order.address.phone || '');
        setEmail(order.address.email || '');
        setStreetAddress(order.address.streetAddress || '');
        setApartment(order.address.apartment || '');
        setCity(order.address.city || '');
        setState(order.address.state || '');
        setPostalCode(order.address.postalCode || '');
        setDeliveryNotes(order.address.deliveryNotes || '');
        setDeliveryMethod(order.address.deliveryMethod || 'standard');
        setPaymentMethod(order.address.paymentMethod || 'cod');
      } else if (order.customer) {
        setFullName(order.customer.name || '');
        setPhone(order.customer.phone || '');
        setEmail(order.customer.email || '');
      }
    }
  }, [order]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateOrder({
        id: orderId,
        status,
        shippingAddress: {
          fullName,
          phone,
          email,
          streetAddress,
          apartment,
          city,
          state,
          postalCode,
          deliveryNotes,
          deliveryMethod,
          paymentMethod,
        },
      }).unwrap();

      toast.success('Order updated successfully!');
      router.push(`/admin/orders/${orderId}`);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update order');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-8 w-48 bg-muted rounded-xl" />
        <div className="h-64 bg-muted/40 rounded-3xl" />
        <div className="h-64 bg-muted/40 rounded-3xl" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-base font-bold text-foreground">Order not found</h2>
        <Button asChild className="mt-4 rounded-xl text-xs font-semibold" size="sm">
          <Link href="/admin/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  const orderNumber = order.id.toUpperCase().startsWith('ORD-')
    ? order.id.toUpperCase()
    : `ORD-${order.id}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
        <div className="flex items-center gap-3">
          <Button
            asChild
            type="button"
            variant="outline"
            size="sm"
            className="h-8.5 rounded-xl px-2.5 text-xs font-semibold shadow-2xs cursor-pointer"
          >
            <Link href={`/admin/orders/${order.id}`}>
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Cancel & Back
            </Link>
          </Button>

          <div className="h-4 w-px bg-border hidden sm:block" />

          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
              Edit {orderNumber}
            </h1>
            <p className="text-[11px] text-muted-foreground">
              Update order fulfillment status, recipient details, and delivery instructions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/orders/${order.id}`)}
            className="h-8.5 rounded-xl px-3 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isUpdating}
            size="sm"
            className="h-8.5 rounded-xl px-4 text-xs font-bold shadow-xs cursor-pointer"
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="mr-1.5 h-3.5 w-3.5" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="border-b border-border/60 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Fulfillment Status
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">
            Current: <strong className="text-foreground">{status}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {STATUS_OPTIONS.map((opt) => {
            const isSelected = status === opt.value;
            const Icon = opt.icon;

            return (
              <div
                key={opt.value}
                onClick={() => setStatus(opt.value)}
                className={cn(
                  'relative rounded-2xl border p-3.5 cursor-pointer transition-all select-none',
                  isSelected
                    ? opt.activeColor
                    : 'border-border/80 bg-card hover:border-foreground/30'
                )}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full text-xs shrink-0',
                        opt.color
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-bold text-xs">{opt.label}</span>
                  </div>

                  {isSelected && (
                    <span className="flex h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground pl-8">
                  {opt.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="border-b border-border/60 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Shipping & Recipient Details
            </h2>
          </div>
          <span className="text-[11px] text-muted-foreground">
            Stored in PostgreSQL addresses table
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-primary" />
              Recipient Full Name
            </label>
            <Input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Shakil Ahmed"
              className="h-9 rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-primary" />
              Contact Phone
            </label>
            <Input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 01700000000"
              className="h-9 rounded-xl text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-semibold text-foreground flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-primary" />
              Recipient Email (Optional)
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. customer@example.com"
              className="h-9 rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-semibold text-foreground flex items-center gap-1.5">
              <Home className="h-3.5 w-3.5 text-primary" />
              Street Address / Road / House
            </label>
            <Input
              type="text"
              required
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="e.g. House 24, Road 7, Block B"
              className="h-9 rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Apartment / Suite (Optional)</label>
            <Input
              type="text"
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
              placeholder="e.g. Flat 4B"
              className="h-9 rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">City / District</label>
            <Input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Dhaka"
              className="h-9 rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">State / Division</label>
            <Input
              type="text"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g. Dhaka Division"
              className="h-9 rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Postal / ZIP Code</label>
            <Input
              type="text"
              required
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="e.g. 1216"
              className="h-9 rounded-xl text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-semibold text-foreground flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-primary" />
              Special Delivery Instructions
            </label>
            <textarea
              rows={3}
              value={deliveryNotes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDeliveryNotes(e.target.value)}
              placeholder="Any special notes for the courier or package handling..."
              className="w-full rounded-xl border border-border/80 bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="border-b border-border/60 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Delivery & Payment Preferences
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Delivery Method</label>
            <select
              value={deliveryMethod}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDeliveryMethod(e.target.value)}
              className="w-full h-9 rounded-xl border border-border/80 bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="standard">Standard Delivery (2-3 Days)</option>
              <option value="express">Express Delivery (Next Day)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPaymentMethod(e.target.value)}
              className="w-full h-9 rounded-xl border border-border/80 bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="cod">Cash on Delivery (COD)</option>
              <option value="bkash">bKash Mobile Payment</option>
              <option value="card">Credit / Debit Card (Stripe)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/admin/orders/${order.id}`)}
          className="h-9 rounded-xl px-4 text-xs font-semibold cursor-pointer"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isUpdating}
          className="h-9 rounded-xl px-5 text-xs font-bold shadow-xs cursor-pointer"
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="mr-1.5 h-3.5 w-3.5" />
              Save Order Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
