'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import {
  selectCurrentUser,
  selectIsSuperAdmin,
  selectHasPermission,
} from '@/features/auth/authSelectors';
import { Button } from '@/components/ui/button';

interface AdminPermissionGuardProps {
  children: React.ReactNode;
  requiredPermission?: string;
  superAdminOnly?: boolean;
  moduleName?: string;
}

export function AdminPermissionGuard({
  children,
  requiredPermission,
  superAdminOnly = false,
  moduleName = 'this section',
}: AdminPermissionGuardProps) {
  const user = useAppSelector(selectCurrentUser);
  const isSuperAdmin = useAppSelector(selectIsSuperAdmin);
  const hasPermission = useAppSelector(
    requiredPermission ? selectHasPermission(requiredPermission) : () => true
  );

  if (superAdminOnly && !isSuperAdmin) {
    return (
      <div className="min-h-[60vh] w-full flex items-center justify-center p-4">
        <div className="mx-auto max-w-md w-full rounded-2xl border border-destructive/20 bg-card p-6 sm:p-8 text-center shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <h2 className="text-xl font-bold text-foreground">
            Super Admin Access Required
          </h2>

          <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            The section you are trying to access is strictly restricted to{' '}
            <span className="font-semibold text-foreground">Super Administrators</span>.
            You are signed in as an administrative account without superuser privileges.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2.5">
            <Button asChild size="sm" className="rounded-xl text-xs font-bold shadow-xs">
              <Link href="/admin/dashboard">
                <LayoutDashboard className="h-4 w-4 mr-1.5" />
                Return to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (requiredPermission && !isSuperAdmin && !hasPermission) {
    return (
      <div className="min-h-[60vh] w-full flex items-center justify-center p-4">
        <div className="mx-auto max-w-md w-full rounded-2xl border border-amber-500/20 bg-card p-6 sm:p-8 text-center shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-4">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <h2 className="text-xl font-bold text-foreground">
            Permission Required
          </h2>

          <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            You do not have permission to manage{' '}
            <span className="font-semibold text-foreground">{moduleName}</span>.
            Your administrator account requires the{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground">
              {requiredPermission}
            </code>{' '}
            permission.
          </p>

          <p className="mt-2 text-xs text-muted-foreground">
            Please contact your system Super Admin to grant you access.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2.5">
            <Button asChild size="sm" className="rounded-xl text-xs font-bold shadow-xs">
              <Link href="/admin/dashboard">
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Return to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
