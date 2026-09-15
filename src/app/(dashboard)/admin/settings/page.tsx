'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AdminGuard } from '@/components/admin/AdminGuard';
import {
  SettingsHeader,
  SettingsTabsNav,
  GeneralSettingsTab,
  PaymentSettingsTab,
  SecuritySettingsTab,
  SystemSettingsTab,
  type SettingsTabType,
} from '@/components/admin/settings';

function AdminSettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as SettingsTabType | null;

  const activeTab: SettingsTabType =
    tabParam && ['general', 'payments', 'security', 'system'].includes(tabParam)
      ? tabParam
      : 'general';

  const handleSelectTab = (tab: SettingsTabType) => {
    router.replace(`/admin/settings?tab=${tab}`, { scroll: false });
  };

  return (
    <div className="space-y-6 pb-12">
      <SettingsHeader />
      <SettingsTabsNav activeTab={activeTab} onSelectTab={handleSelectTab} />

      <div className="pt-1">
        {activeTab === 'general' && <GeneralSettingsTab />}
        {activeTab === 'payments' && <PaymentSettingsTab />}
        {activeTab === 'security' && <SecuritySettingsTab />}
        {activeTab === 'system' && <SystemSettingsTab />}
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <AdminGuard>
      <React.Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        }
      >
        <AdminSettingsContent />
      </React.Suspense>
    </AdminGuard>
  );
}
