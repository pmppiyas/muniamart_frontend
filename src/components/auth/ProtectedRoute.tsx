'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated, selectAuthStatus } from '@/features/auth/authSelectors';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const status = useAppSelector(selectAuthStatus);

  React.useEffect(() => {
    if (status !== 'loading' && status !== 'idle' && !isAuthenticated) {
      router.push(`/auth/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, status, pathname, router]);

  if (status === 'loading' || status === 'idle') {
    return (
      fallback || (
        <div className="flex min-h-[50vh] w-full items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-xs font-semibold text-muted-foreground">
              Verifying your session...
            </p>
          </div>
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
