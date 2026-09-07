'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  ShoppingCart,
  Users,
  CreditCard,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Store,
  Sparkles,
  BarChart3,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser, selectIsSuperAdmin } from '@/features/auth/authSelectors';
import { useLogoutMutation } from '@/services/api/authApi';
import { useRouter } from 'next/navigation';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function AdminSidebar({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const isSuperAdmin = useAppSelector(selectIsSuperAdmin);
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    await logoutMutation();
    router.replace('/auth/login?from=/admin/dashboard');
  };

  const navGroups = [
    {
      title: 'Overview',
      items: [
        {
          name: 'Dashboard',
          href: '/admin/dashboard',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'Store Management',
      items: [
        {
          name: 'Products',
          href: '/admin/products',
          icon: ShoppingBag,
        },
        {
          name: 'Categories',
          href: '/admin/categories',
          icon: Layers,
        },
        {
          name: 'Orders',
          href: '/admin/orders',
          icon: ShoppingCart,
          badge: '14',
        },
        {
          name: 'Customers',
          href: '/admin/customers',
          icon: Users,
        },
      ],
    },
    {
      title: 'Finance & Sales',
      items: [
        {
          name: 'Payments',
          href: '/admin/payments',
          icon: CreditCard,
        },
      ],
    },
    {
      title: 'Administration',
      items: [
        ...(isSuperAdmin
          ? [
              {
                name: 'Admins & Roles',
                href: '/admin/admins',
                icon: ShieldCheck,
                badge: 'Super',
              },
            ]
          : []),
        {
          name: 'Settings',
          href: '/admin/settings',
          icon: Settings,
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between">
      {/* Top Header & Brand */}
      <div>
        <div
          className={cn(
            'flex h-16 items-center justify-between border-b border-border px-4 transition-all',
            isCollapsed ? 'px-3 justify-center' : 'px-5'
          )}
        >
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2.5 overflow-hidden"
            onClick={onCloseMobile}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
              <Sparkles className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm tracking-tight text-foreground">
                    MUNIAMART
                  </span>
                  <span className="rounded bg-primary/15 px-1 py-0.2 text-[10px] font-extrabold text-primary">
                    {isSuperAdmin ? 'SUPER' : 'ADMIN'}
                  </span>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">
                  Control Center
                </span>
              </div>
            )}
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="space-y-6 px-3 py-4 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              {!isCollapsed && (
                <span className="block px-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                  {group.title}
                </span>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onCloseMobile}
                      title={isCollapsed ? item.name : undefined}
                      className={cn(
                        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/20'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        isCollapsed && 'justify-center px-2'
                      )}
                    >
                      <Icon className={cn('h-4 w-4 shrink-0 transition-transform group-hover:scale-110')} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 truncate">{item.name}</span>
                          {item.badge && (
                            <span
                              className={cn(
                                'rounded-full px-1.5 py-0.2 text-[10px] font-bold',
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-primary/10 text-primary'
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Profile & Actions */}
      <div className="border-t border-border p-3 space-y-2">
        {/* Quick View Store Link */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'flex items-center gap-2.5 rounded-xl border border-border/80 bg-background/50 px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors',
            isCollapsed && 'justify-center px-2'
          )}
          title={isCollapsed ? 'View Store' : undefined}
        >
          <Store className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span className="flex-1 truncate">View Live Store</span>}
        </Link>

        {/* User Card */}
        <div
          className={cn(
            'flex items-center gap-2.5 rounded-xl bg-muted/50 p-2 text-foreground',
            isCollapsed && 'justify-center p-1.5'
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground truncate">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          )}

          {!isCollapsed && (
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              title="Sign Out"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col sticky top-0 h-screen z-30 border-r border-border bg-card transition-all duration-300 ease-in-out shrink-0 relative',
          isCollapsed ? 'w-18' : 'w-64'
        )}
      >
        {sidebarContent}

        {/* Floating Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="absolute -right-3 top-20 z-40 hidden md:flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-xs hover:bg-muted hover:text-foreground transition-all cursor-pointer"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-card shadow-2xl transition-transform duration-300 ease-in-out md:hidden',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
}
