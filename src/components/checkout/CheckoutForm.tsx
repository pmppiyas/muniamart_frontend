'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';
import {
  checkoutFormSchema,
  CheckoutFormData,
  DeliveryMethod,
  PaymentMethod,
} from '@/features/checkout/checkoutTypes';
import { DeliveryOptions } from './DeliveryOptions';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { CustomerUser } from '@/features/auth/authTypes';

interface CheckoutFormProps {
  user: CustomerUser | null;
  isAuthenticated: boolean;
  standardFee: number;
  expressFee: number;
  deliveryMethod: DeliveryMethod;
  onDeliveryMethodChange: (method: DeliveryMethod) => void;
  onSubmit: (data: CheckoutFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function CheckoutForm({
  user,
  isAuthenticated,
  standardFee,
  expressFee,
  deliveryMethod,
  onDeliveryMethodChange,
  onSubmit,
  isSubmitting,
}: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      streetAddress: '',
      apartment: '',
      city: '',
      state: 'Dhaka',
      postalCode: '',
      deliveryNotes: '',
      deliveryMethod: 'standard',
      paymentMethod: 'cod',
    },
  });

  const selectedPaymentMethod = watch('paymentMethod');

  React.useEffect(() => {
    setValue('deliveryMethod', deliveryMethod);
  }, [deliveryMethod, setValue]);

  React.useEffect(() => {
    if (user) {
      if (user.name) setValue('fullName', user.name);
      if (user.email) setValue('email', user.email);
      if (user.phone) setValue('phone', user.phone);
    }
  }, [user, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              1
            </span>
            <h2 className="text-base font-bold text-foreground">Contact Information</h2>
          </div>

          {!isAuthenticated ? (
            <div className="text-xs text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-bold text-primary hover:underline">
                Log In
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <UserCheck className="h-3.5 w-3.5" />
              <span>Signed in as {user?.name}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-foreground mb-1">
              Full Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              placeholder="John Doe"
              {...register('fullName')}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.fullName && (
              <p className="mt-1 text-[11px] text-destructive">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Email Address <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.email && (
              <p className="mt-1 text-[11px] text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Phone Number <span className="text-destructive">*</span>
            </label>
            <input
              type="tel"
              placeholder="+880 1XXXXXXXXX"
              {...register('phone')}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.phone && (
              <p className="mt-1 text-[11px] text-destructive">{errors.phone.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            2
          </span>
          <h2 className="text-base font-bold text-foreground">Delivery Address</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-foreground mb-1">
              Street Address, House No. <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. House 42, Road 11, Block D, Banani"
              {...register('streetAddress')}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.streetAddress && (
              <p className="mt-1 text-[11px] text-destructive">{errors.streetAddress.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Apartment, Suite, Unit (Optional)
            </label>
            <input
              type="text"
              placeholder="Apt 4B"
              {...register('apartment')}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              City / District <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Dhaka, Chittagong, Sylhet"
              {...register('city')}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.city && (
              <p className="mt-1 text-[11px] text-destructive">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Division / State <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              placeholder="Dhaka Division"
              {...register('state')}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.state && (
              <p className="mt-1 text-[11px] text-destructive">{errors.state.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Postal / ZIP Code <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              placeholder="1213"
              {...register('postalCode')}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.postalCode && (
              <p className="mt-1 text-[11px] text-destructive">{errors.postalCode.message}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-foreground mb-1">
              Special Delivery Instructions (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Notes about your order, e.g. special notes for delivery courier"
              {...register('deliveryNotes')}
              className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <DeliveryOptions
          selectedMethod={deliveryMethod}
          onSelect={onDeliveryMethodChange}
          standardFee={standardFee}
          expressFee={expressFee}
        />
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <PaymentMethodSelector
          selectedMethod={selectedPaymentMethod}
          onSelect={(method) => setValue('paymentMethod', method)}
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-8 text-base font-bold text-primary-foreground shadow-lg hover:bg-primary-hover active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              <span>Processing Order...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <span>Place Order</span>
              <ArrowRight className="h-5 w-5 ml-1" />
            </div>
          )}
        </button>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          By clicking Place Order, you agree to MUNIAMART&apos;s{' '}
          <Link href="/terms" className="underline hover:text-foreground">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
