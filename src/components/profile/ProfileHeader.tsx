'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Package,
  ShoppingCart,
  CheckCircle2,
} from 'lucide-react';
import { CustomerUser } from '@/features/auth/authTypes';
import { useAppSelector } from '@/store/hooks';
import { selectCartTotalQuantity } from '@/features/cart/cartSelectors';

interface ProfileHeaderProps {
  user: CustomerUser;
  totalOrders?: number;
}

export function ProfileHeader({ user, totalOrders = 0 }: ProfileHeaderProps) {
  const cartCount = useAppSelector(selectCartTotalQuantity);

  const formattedDate = React.useMemo(() => {
    if (!user.createdAt) return 'Recently';
    try {
      return new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Recently';
    }
  }, [user.createdAt]);

  const initials = React.useMemo(() => {
    if (!user.name) return 'U';
    return user.name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }, [user.name]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-xs">
      {/* Decorative gradient blur in corner */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Avatar & Personal info */}
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-blue-400 text-primary-foreground shadow-md shadow-primary/20 overflow-hidden font-black text-xl sm:text-2xl">
            {user.photoUrl ? (
              <Image
                src={user.photoUrl}
                alt={user.name || 'User avatar'}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                {user.name || 'Customer'}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-3 w-3" />
                <span>{user.status || 'ACTIVE'}</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-primary/70" />
                <span>{user.email}</span>
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              </span>

              {user.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-primary/70" />
                  <span>{user.phone}</span>
                </span>
              )}

              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary/70" />
                <span>Member since {formattedDate}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Stat Chips */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-muted/40 p-3 sm:px-4 text-center min-w-[80px]">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Package className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Orders</span>
            </div>
            <span className="text-lg sm:text-xl font-black text-foreground mt-0.5">
              {totalOrders}
            </span>
          </div>

          <Link
            href="/cart"
            className="flex flex-col items-center justify-center rounded-2xl border border-border bg-muted/40 p-3 sm:px-4 text-center hover:border-primary/40 hover:bg-muted/70 transition-colors min-w-[80px]"
          >
            <div className="flex items-center gap-1 text-muted-foreground">
              <ShoppingCart className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Cart</span>
            </div>
            <span className="text-lg sm:text-xl font-black text-foreground mt-0.5">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
