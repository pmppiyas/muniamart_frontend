'use client';

import * as React from 'react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background text-foreground flex">
        {/* Responsive Admin Sidebar */}
        <AdminSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        {/* Main Content Area */}
        <div
          className={cn(
            'flex flex-1 flex-col min-w-0 transition-all duration-300 ease-in-out',
            isCollapsed ? 'md:pl-18' : 'md:pl-64'
          )}
        >
          {/* Admin Header */}
          <AdminHeader
            onOpenMobile={() => setIsMobileOpen(true)}
            isCollapsed={isCollapsed}
          />

          {/* Dynamic Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
