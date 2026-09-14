'use client';

import * as React from 'react';
import { Store, CreditCard, ShieldCheck, Server } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SettingsTabType = 'general' | 'payments' | 'security' | 'system';

interface TabItem {
  id: SettingsTabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const SETTINGS_TABS: TabItem[] = [
  {
    id: 'general',
    label: 'Store & General',
    icon: Store,
    description: 'Name, contact info, and store hours',
  },
  {
    id: 'payments',
    label: 'Payment Gateways',
    icon: CreditCard,
    description: 'bKash, Stripe, and Cash on Delivery',
  },
  {
    id: 'security',
    label: 'Security & Access',
    icon: ShieldCheck,
    description: 'Admin credentials and password change',
  },
  {
    id: 'system',
    label: 'System & Cloud',
    icon: Server,
    description: 'Database, Redis, and Cloudinary telemetry',
  },
];

interface SettingsTabsNavProps {
  activeTab: SettingsTabType;
  onSelectTab: (tab: SettingsTabType) => void;
}

export function SettingsTabsNav({
  activeTab,
  onSelectTab,
}: SettingsTabsNavProps) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-border bg-card p-1.5 shadow-xs">
      {SETTINGS_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer',
              isActive
                ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/20'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
