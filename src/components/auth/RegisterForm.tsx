'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, UserPlus, User, Mail, Phone, Lock } from 'lucide-react';
import { PasswordInput } from './PasswordInput';
import { useRegisterMutation } from '@/services/api/authApi';
import { toast } from 'sonner';

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Full name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(60, 'Name cannot exceed 60 characters')
      .trim(),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address')
      .trim()
      .toLowerCase(),
    phone: z
      .string()
      .trim()
      .optional()
      .refine(
        (val) => !val || /^[0-9+-\s()]{7,20}$/.test(val),
        'Please enter a valid phone number'
      ),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password cannot exceed 100 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [registerCustomer, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone ? data.phone : undefined,
      };

      const response = await registerCustomer(payload).unwrap();

      if (response.success) {
        toast.success(
          'Account created successfully! Please sign in with your credentials.'
        );
        router.push('/auth/login');
      } else {
        toast.error(response.message || 'Failed to create account');
      }
    } catch (err: unknown) {
      const error = err as {
        data?: { message?: string };
        error?: string;
        message?: string;
      };

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        'Unable to create account. An account with this email may already exist.';

      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <label
          htmlFor="reg-name"
          className="block text-xs font-bold text-foreground"
        >
          Full Name
        </label>
        <div className="relative">
          <input
            id="reg-name"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            disabled={isLoading}
            className="flex h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3.5 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            {...register('name')}
          />
          <User className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
        {errors.name && (
          <p id="name-error" className="text-xs font-semibold text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="reg-email"
          className="block text-xs font-bold text-foreground"
        >
          Email Address
        </label>
        <div className="relative">
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={isLoading}
            className="flex h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3.5 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
          <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
        {errors.email && (
          <p id="email-error" className="text-xs font-semibold text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="reg-phone"
            className="block text-xs font-bold text-foreground"
          >
            Phone Number
          </label>
          <span className="text-[11px] text-muted-foreground">Optional</span>
        </div>
        <div className="relative">
          <input
            id="reg-phone"
            type="tel"
            autoComplete="tel"
            placeholder="+880 1700 000000"
            disabled={isLoading}
            className="flex h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3.5 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            {...register('phone')}
          />
          <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
        {errors.phone && (
          <p id="phone-error" className="text-xs font-semibold text-destructive">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="reg-password"
          className="block text-xs font-bold text-foreground"
        >
          Password
        </label>
        <div className="relative">
          <PasswordInput
            id="reg-password"
            autoComplete="new-password"
            placeholder="At least 6 characters"
            disabled={isLoading}
            className="pl-10"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password')}
          />
          <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
        {errors.password && (
          <p id="password-error" className="text-xs font-semibold text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="reg-confirm-password"
          className="block text-xs font-bold text-foreground"
        >
          Confirm Password
        </label>
        <div className="relative">
          <PasswordInput
            id="reg-confirm-password"
            autoComplete="new-password"
            placeholder="Repeat password"
            disabled={isLoading}
            className="pl-10"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
            {...register('confirmPassword')}
          />
          <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
        {errors.confirmPassword && (
          <p
            id="confirm-password-error"
            className="text-xs font-semibold text-destructive"
          >
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary-hover active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer mt-3"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Creating Account...</span>
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4" />
            <span>Create MuniaMart Account</span>
          </>
        )}
      </button>

      <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
        Already have an account?{' '}
        <Link
          href="/auth/login"
          className="font-bold text-primary hover:underline"
        >
          Sign In
        </Link>
      </div>
    </form>
  );
}
