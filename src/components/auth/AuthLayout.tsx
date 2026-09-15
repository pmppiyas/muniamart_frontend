'use client';

import * as React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/layout/header/Logo';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  className,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-160px)] w-full items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className={cn('w-full max-w-md space-y-6', className)}>
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm transition-all">
          <div className="flex flex-col items-center text-center space-y-2 mb-6">
            <div className="scale-95 sm:scale-100">
              <Logo />
            </div>
            <div className="space-y-1 pt-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div>{children}</div>
        </div>

        <p className="text-center text-[11px] text-muted-foreground px-4">
          By continuing, you agree to MuniaMart&apos;s{' '}
          <Link
            href="/terms"
            className="underline underline-offset-2 hover:text-primary"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
