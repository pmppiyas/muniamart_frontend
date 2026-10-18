'use client';

import * as React from 'react';
import {
  ShieldCheck,
  Crown,
  UserCheck,
  UserX,
  RefreshCw,
  Download,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatsGroup, AdminStatItem } from '@/components/admin/AdminStatsGroup';
import { AdminMetrics } from '@/types/admin';
import { cn } from '@/lib/utils';

interface AdminsHeaderProps {
  totalCount: number;
  metrics?: AdminMetrics;
  isFetching: boolean;
  onRefresh: () => void;
  onExport: () => void;
  onAddAdmin: () => void;
}

export function AdminsHeader({
  totalCount,
  metrics,
  isFetching,
  onRefresh,
  onExport,
  onAddAdmin,
}: AdminsHeaderProps) {
  const stats: AdminStatItem[] = [
    {
      title: 'Total Administrators',
      value: metrics?.totalAdmins ?? totalCount,
      icon: ShieldCheck,
      color: 'purple',
      badge: 'System',
    },
    {
      title: 'Super Administrators',
      value: metrics?.superAdmins ?? 0,
      icon: Crown,
      color: 'emerald',
      badge: 'Full Access',
    },
    {
      title: 'Active Accounts',
      value: metrics?.activeAdmins ?? 0,
      icon: UserCheck,
      color: 'blue',
      badge: 'Authorized',
    },
    {
      title: 'Inactive Accounts',
      value: metrics?.inactiveAdmins ?? 0,
      icon: UserX,
      color: 'amber',
      badge: 'Disabled',
    },
  ];

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Admins & Roles"
        description="Manage administrative users, assign granular module permissions, and control access levels."
        breadcrumbs={[{ label: 'Admins & Roles' }]}
        badge={
          <Badge
            variant="outline"
            className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 text-xs px-2.5 py-0.5 font-bold"
          >
            {totalCount} Total
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isFetching}
              className="h-9 gap-2 text-xs"
            >
              <RefreshCw
                className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')}
              />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="h-9 gap-2 text-xs"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
            <Button
              size="sm"
              onClick={onAddAdmin}
              className="h-9 gap-2 text-xs font-bold shadow-xs bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Admin
            </Button>
          </div>
        }
      />

      <AdminStatsGroup stats={stats} />
    </div>
  );
}
