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
      <div className="min-h-screen bg-background text-foreground flex justify-center w-full">
        {/* max-w-7xl Centered Dashboard Container */}
        <div className="mx-auto max-w-7xl w-full flex min-h-screen border-x border-border/40">
          {/* Responsive Admin Sidebar */}
          <AdminSidebar
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
            isMobileOpen={isMobileOpen}
            onCloseMobile={() => setIsMobileOpen(false)}
          />

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col min-w-0 transition-all duration-300 ease-in-out">
            {/* Admin Header */}
            <AdminHeader
              onOpenMobile={() => setIsMobileOpen(true)}
              isCollapsed={isCollapsed}
            />

            {/* Dynamic Page Content */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
