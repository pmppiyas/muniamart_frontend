'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  Plus,
  Download,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  Eye,
  Sparkles,
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser, selectIsSuperAdmin } from '@/features/auth/authSelectors';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatsGroup, AdminStatItem } from '@/components/admin/AdminStatsGroup';
import { useCurrency } from '@/hooks/useCurrency';
import { cn } from '@/lib/utils';

export default function AdminDashboardPage() {
  const user = useAppSelector(selectCurrentUser);
  const isSuperAdmin = useAppSelector(selectIsSuperAdmin);
  const { formatPrice } = useCurrency();

  const [dateRange, setDateRange] = React.useState('Last 30 Days');

  const stats: AdminStatItem[] = [
    {
      title: 'Total Revenue',
      value: formatPrice(1842900),
      change: '+18.4%',
      isPositive: true,
      subtext: 'vs previous month',
      icon: DollarSign,
      color: 'emerald',
    },
    {
      title: 'Total Orders',
      value: '1,248',
      change: '+12.6%',
      isPositive: true,
      subtext: 'vs previous month',
      icon: ShoppingCart,
      color: 'blue',
    },
    {
      title: 'Active Customers',
      value: '846',
      change: '+8.2%',
      isPositive: true,
      subtext: '48 registered this week',
      icon: Users,
      color: 'purple',
    },
    {
      title: 'Active Inventory',
      value: '186 Items',
      change: '-2.4%',
      isPositive: false,
      subtext: '6 items low in stock',
      icon: Package,
      color: 'amber',
    },
  ];

  const recentOrders = [
    {
      id: 'ORD-9824',
      customer: {
        name: 'Tanvir Hossain',
        email: 'tanvir@gmail.com',
      },
      items: 3,
      amount: 48500,
      paymentMethod: 'bKash',
      status: 'PAID',
      date: '10 mins ago',
    },
    {
      id: 'ORD-9823',
      customer: {
        name: 'Farzana Akter',
        email: 'farzana.a@outlook.com',
      },
      items: 1,
      amount: 124000,
      paymentMethod: 'Stripe',
      status: 'CONFIRMED',
      date: '35 mins ago',
    },
    {
      id: 'ORD-9822',
      customer: {
        name: 'Mahmudul Hasan',
        email: 'm.hasan@yahoo.com',
      },
      items: 2,
      amount: 18500,
      paymentMethod: 'bKash',
      status: 'DELIVERED',
      date: '2 hours ago',
    },
    {
      id: 'ORD-9821',
      customer: {
        name: 'Nusrat Jahan',
        email: 'nusrat.jahan@gmail.com',
      },
      items: 4,
      amount: 32000,
      paymentMethod: 'Stripe',
      status: 'PENDING',
      date: '4 hours ago',
    },
    {
      id: 'ORD-9820',
      customer: {
        name: 'Kazi Shakil',
        email: 'shakil.kazi@gmail.com',
      },
      items: 1,
      amount: 8900,
      paymentMethod: 'bKash',
      status: 'PAID',
      date: '6 hours ago',
    },
  ];

  const weeklySales = [
    { day: 'Mon', amount: 145000, height: '48%' },
    { day: 'Tue', amount: 198000, height: '62%' },
    { day: 'Wed', amount: 162000, height: '54%' },
    { day: 'Thu', amount: 245000, height: '80%' },
    { day: 'Fri', amount: 310000, height: '98%' },
    { day: 'Sat', amount: 275000, height: '88%' },
    { day: 'Sun', amount: 215000, height: '70%' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            Paid
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            Confirmed
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
            <CheckCircle2 className="h-3 w-3" />
            Delivered
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* 1. Reusable Page Header & Actions */}
      <AdminPageHeader
        title="Dashboard Overview"
        badge={
          <Badge variant="default" className="text-[11px] font-extrabold uppercase tracking-wide">
            {isSuperAdmin ? 'SUPER ADMIN' : 'ADMIN'}
          </Badge>
        }
        description={
          <>
            Welcome back, <span className="font-semibold text-foreground">{user?.name || 'Admin'}</span>. Here is your store’s real-time performance.
          </>
        }
        actions={
          <>
            {/* Date Range Selector */}
            <div className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground shadow-2xs">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{dateRange}</span>
            </div>

            <Button variant="outline" size="sm" className="rounded-xl text-xs font-semibold shadow-2xs">
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export Report
            </Button>

            <Button asChild size="sm" className="rounded-xl text-xs font-bold shadow-sm">
              <Link href="/admin/products">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Product
              </Link>
            </Button>
          </>
        }
      />

      {/* 2. Key Metrics KPI Cards */}
      <AdminStatsGroup stats={stats} />

      {/* 3. Analytics & Sales Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Revenue Bar Chart */}
        <div className="lg:col-span-8 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-foreground">Revenue Analytics</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Weekly gross revenue performance across all payment channels
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground">This Week</span>
              <p className="text-lg font-black text-foreground">{formatPrice(1550000)}</p>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-48 sm:h-56 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2">
            {weeklySales.map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full flex justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded shadow-2xs -translate-y-1">
                    {formatPrice(item.amount)}
                  </span>
                </div>
                <div className="w-full max-w-[48px] bg-muted/40 rounded-xl overflow-hidden h-36 flex items-end">
                  <div
                    style={{ height: item.height }}
                    className="w-full bg-primary group-hover:bg-primary-hover rounded-xl transition-all duration-300"
                  />
                </div>
                <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Channels & Gateways */}
        <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">Payment Gateways</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live transaction distribution
            </p>

            <div className="mt-6 space-y-4">
              {/* bKash */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-pink-500" />
                    <span>bKash Mobile Payment</span>
                  </div>
                  <span className="font-bold text-foreground">62%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-pink-500 rounded-full" style={{ width: '62%' }} />
                </div>
                <p className="text-[11px] text-muted-foreground">782 completed transactions</p>
              </div>

              {/* Stripe */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                    <span>Stripe (Cards & Global)</span>
                  </div>
                  <span className="font-bold text-foreground">29%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '29%' }} />
                </div>
                <p className="text-[11px] text-muted-foreground">364 completed transactions</p>
              </div>

              {/* COD */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span>Cash on Delivery</span>
                  </div>
                  <span className="font-bold text-foreground">9%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '9%' }} />
                </div>
                <p className="text-[11px] text-muted-foreground">102 completed orders</p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-muted/40 p-3 flex items-center justify-between border border-border/50">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-bold text-foreground">Gateways Status</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              100% Operational
            </span>
          </div>
        </div>
      </div>

      {/* 4. Recent Orders Table */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 border-b border-border gap-3">
          <div>
            <h3 className="text-base font-bold text-foreground">Recent Orders</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live customer purchases awaiting fulfillment
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-xl text-xs font-semibold self-start sm:self-auto">
            <Link href="/admin/orders">
              View All Orders
              <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/30 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                    {order.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-foreground">{order.customer.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate max-w-[150px]">
                      {order.customer.email}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-foreground">
                    {order.items} {order.items === 1 ? 'item' : 'items'}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-foreground">
                    {formatPrice(order.amount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-foreground">
                      <CreditCard className="h-3 w-3 text-muted-foreground" />
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(order.status)}</td>
                  <td className="py-3.5 px-4 text-muted-foreground">{order.date}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      title="View order details"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
