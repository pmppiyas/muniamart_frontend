'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Home,
  ChevronRight,
  User,
  Package,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileInfoTab } from '@/components/profile/ProfileInfoTab';
import { ProfileOrdersTab } from '@/components/profile/ProfileOrdersTab';
import { ProfileAddressesTab } from '@/components/profile/ProfileAddressesTab';
import { ProfileSecurityTab } from '@/components/profile/ProfileSecurityTab';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/features/auth/authSelectors';
import { useGetProfileQuery } from '@/services/api/customerApi';
import { useGetMyOrdersQuery } from '@/services/api/orderApi';
import { cn } from '@/lib/utils';

type ProfileTab = 'info' | 'orders' | 'addresses' | 'security';

interface TabItem {
  id: ProfileTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const TABS: TabItem[] = [
  {
    id: 'info',
    label: 'Personal Info',
    icon: User,
    description: 'Name, email, and avatar',
  },
  {
    id: 'orders',
    label: 'Order History',
    icon: Package,
    description: 'Track and view past purchases',
  },
  {
    id: 'addresses',
    label: 'Saved Addresses',
    icon: MapPin,
    description: 'Default shipping destinations',
  },
  {
    id: 'security',
    label: 'Security & Login',
    icon: ShieldCheck,
    description: 'Password and device sessions',
  },
];

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as ProfileTab | null;

  const activeTab: ProfileTab =
    tabParam && ['info', 'orders', 'addresses', 'security'].includes(tabParam)
      ? tabParam
      : 'info';

  const handleTabChange = (tabId: ProfileTab) => {
    router.replace(`/profile?tab=${tabId}`, { scroll: false });
  };

  const reduxUser = useAppSelector(selectCurrentUser);
  const { data: profileRes } = useGetProfileQuery();
  const { data: ordersRes } = useGetMyOrdersQuery();

  const activeUser = profileRes?.data || reduxUser;
  const totalOrders = ordersRes?.data?.length ?? activeUser?._count?.orders ?? 0;

  if (!activeUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
          <span className="font-bold text-foreground">My Account</span>
          <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
          <span className="capitalize text-primary font-medium">
            {TABS.find((t) => t.id === activeTab)?.label}
          </span>
        </nav>

        <ProfileHeader user={activeUser} totalOrders={totalOrders} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <aside className="lg:col-span-4 rounded-3xl border border-border bg-card p-3 sm:p-4 shadow-xs">
            <div className="px-3 py-2 border-b border-border/70 mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Account Settings
              </h2>
            </div>

            <nav className="hidden lg:flex flex-col space-y-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={cn(
                      'flex items-center justify-between rounded-2xl px-4 py-3.5 text-left transition-all cursor-pointer select-none',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/30 font-bold'
                        : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-xl transition-colors',
                          isActive
                            ? 'bg-primary-foreground/20 text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-tight">{tab.label}</p>
                        <p
                          className={cn(
                            'text-[10px] mt-0.5 leading-tight',
                            isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                          )}
                        >
                          {tab.description}
                        </p>
                      </div>
                    </div>

                    {tab.id === 'orders' && totalOrders > 0 && (
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[10px] font-extrabold',
                          isActive
                            ? 'bg-primary-foreground text-primary'
                            : 'bg-primary/10 text-primary'
                        )}
                      >
                        {totalOrders}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="flex lg:hidden overflow-x-auto gap-2 py-1 scrollbar-none">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={cn(
                      'flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'border border-border bg-muted/40 text-foreground/80 hover:bg-muted'
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="lg:col-span-8 space-y-6">
            {activeTab === 'info' && (
              <ProfileInfoTab
                key={`${activeUser.id}-${activeUser.name || ''}-${activeUser.phone || ''}-${activeUser.photoUrl || ''}`}
                user={activeUser}
              />
            )}
            {activeTab === 'orders' && <ProfileOrdersTab />}
            {activeTab === 'addresses' && <ProfileAddressesTab />}
            {activeTab === 'security' && <ProfileSecurityTab user={activeUser} />}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <React.Suspense fallback={<div className="min-h-screen bg-background" />}>
        <ProfileContent />
      </React.Suspense>
    </ProtectedRoute>
  );
}
