'use client';

import * as React from 'react';
import { Settings, Sparkles } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Badge } from '@/components/ui/badge';

export function SettingsHeader() {
  return (
    <AdminPageHeader
      title={
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Settings className="h-4.5 w-4.5" />
          </div>
          <span>Platform Settings</span>
        </div>
      }
      badge={
        <Badge variant="outline" className="gap-1.5 border-primary/20 bg-primary/5 text-primary text-xs font-semibold py-0.5">
          <Sparkles className="h-3 w-3" />
          MuniaMart v1.0
        </Badge>
      }
      description="Manage store preferences, active payment gateways, account security, and system infrastructure."
    />
  );
}
