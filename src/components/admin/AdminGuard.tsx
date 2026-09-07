'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, LogOut, Loader2 } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthStatus,
  selectIsAdmin,
} from '@/features/auth/authSelectors';
import { useGetMeQuery, useLogoutMutation } from '@/services/api/authApi';
import { Button } from '@/components/ui/button';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { isLoading: isGetMeLoading } = useGetMeQuery();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authStatus = useAppSelector(selectAuthStatus);
  const isAdmin = useAppSelector(selectIsAdmin);

  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  const isLoading = !hasMounted || isGetMeLoading || authStatus === 'loading';

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login?from=/admin/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Verifying administrative access...
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State (Waiting for redirect)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground mt-2">Redirecting to login...</p>
      </div>
    );
  }

  // 3. Unauthorized / Forbidden State (Authenticated as Customer, not ADMIN or SUPER_ADMIN)
  if (!isAdmin) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
        <div className="mx-auto max-w-md w-full rounded-2xl border border-border bg-card p-6 sm:p-8 text-center shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <h2 className="text-xl font-bold text-foreground">
            Access Restricted
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            You are signed in as <span className="font-semibold text-foreground">{user?.email}</span> (
            <span className="font-mono text-xs uppercase text-amber-600 dark:text-amber-400">
              {user?.role || 'Customer'}
            </span>
            ). Administrative privileges (<span className="font-semibold">ADMIN</span> or{' '}
            <span className="font-semibold">SUPER_ADMIN</span>) are required to access the dashboard.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Button asChild variant="outline" className="w-full sm:w-auto text-xs">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Return to Store
              </Link>
            </Button>

            <Button
              variant="destructive"
              disabled={isLoggingOut}
              onClick={async () => {
                await logoutMutation();
                router.replace('/auth/login?from=/admin/dashboard');
              }}
              className="w-full sm:w-auto text-xs"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              Switch Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized State (ADMIN or SUPER_ADMIN)
  return <>{children}</>;
}
