'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, LogIn, Mail, Lock } from 'lucide-react';
import { PasswordInput } from './PasswordInput';
import { useLoginMutation, useLazyGetMeQuery } from '@/services/api/authApi';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl =
    searchParams.get('from') || searchParams.get('callbackUrl') || '/';

  const [login, { isLoading }] = useLoginMutation();
  const [triggerGetMe] = useLazyGetMeQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await login(data).unwrap();

      if (response.success) {
        toast.success(response.message || 'Welcome back to MuniaMart!');

        const userRes = await triggerGetMe()
          .unwrap()
          .catch(() => null);

        const userRole = response.data?.user?.role || userRes?.data?.role;
        const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

        let destination =
          callbackUrl && callbackUrl !== '/'
            ? callbackUrl
            : isAdmin
              ? '/admin/dashboard'
              : '/';

        if (!isAdmin && destination.startsWith('/admin')) {
          destination = '/';
        }

        router.push(destination);
        router.refresh();
      } else {
        toast.error(response.message || 'Failed to sign in');
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
        'Invalid email or password. Please check your credentials and try again.';

      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <label
          htmlFor="login-email"
          className="block text-xs font-bold text-foreground"
        >
          Email Address
        </label>
        <div className="relative">
          <input
            id="login-email"
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
          <p
            id="email-error"
            className="text-xs font-semibold text-destructive"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="login-password"
            className="block text-xs font-bold text-foreground"
          >
            Password
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-xs font-semibold text-primary hover:underline"
            tabIndex={0}
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            placeholder="••••••••"
            disabled={isLoading}
            className="pl-10"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password')}
          />
          <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
        {errors.password && (
          <p
            id="password-error"
            className="text-xs font-semibold text-destructive"
          >
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary-hover active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer mt-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </>
        )}
      </button>

      <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
        Don&apos;t have an account yet?{' '}
        <Link
          href="/auth/register"
          className="font-bold text-primary hover:underline"
        >
          Create an Account
        </Link>
      </div>
    </form>
  );
}
