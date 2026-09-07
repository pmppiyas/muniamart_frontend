'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  Store,
  ChevronDown,
  LogOut,
  User,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser, selectIsSuperAdmin } from '@/features/auth/authSelectors';
import { useLogoutMutation } from '@/services/api/authApi';
import { cn } from '@/lib/utils';

interface AdminHeaderProps {
  onOpenMobile: () => void;
  isCollapsed: boolean;
}

export function AdminHeader({ onOpenMobile, isCollapsed }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const isSuperAdmin = useAppSelector(selectIsSuperAdmin);
  const [logoutMutation] = useLogoutMutation();

  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);
  const notifRef = React.useRef<HTMLDivElement>(null);

  // Close menus on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutMutation();
    router.replace('/auth/login?from=/admin/dashboard');
  };

  // Generate breadcrumb items from pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbName =
    pathSegments[pathSegments.length - 1]
      ? pathSegments[pathSegments.length - 1].charAt(0).toUpperCase() +
        pathSegments[pathSegments.length - 1].slice(1)
      : 'Dashboard';

  return (
    <header
      className={cn(
        'sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-md transition-all duration-300 sm:px-6'
      )}
    >
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onOpenMobile}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-foreground shadow-2xs hover:bg-muted md:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Breadcrumb Trail */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <Link
            href="/admin/dashboard"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <span className="text-muted-foreground/50">/</span>
          <span className="font-bold text-foreground">{breadcrumbName}</span>
        </div>
      </div>

      {/* Center: Search Bar (Desktop) */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search orders, products, customers..."
            className="h-9 w-full rounded-xl border border-border/80 bg-background/60 pl-9 pr-14 text-xs text-foreground placeholder:text-muted-foreground shadow-2xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none rounded border border-border bg-muted/60 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions, Store Link, Notifications, Theme, Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* View Store button */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-2xs hover:bg-muted hover:text-primary transition-colors"
          title="Open live e-commerce store in new tab"
        >
          <Store className="h-3.5 w-3.5" />
          <span>Live Store</span>
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground shadow-2xs hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-full z-50 mt-1.5 w-80 rounded-2xl border border-border bg-popover text-popover-foreground p-3 shadow-xl animate-in fade-in-0 zoom-in-95">
              <div className="flex items-center justify-between border-b border-border pb-2 mb-2">
                <span className="text-xs font-bold text-foreground">Admin Notifications</span>
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                  3 New
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-muted transition-colors">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">New bKash Order #ORD-1092</p>
                    <p className="text-[11px] text-muted-foreground">৳ 4,850 • 2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-muted transition-colors">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-600">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">New customer registered</p>
                    <p className="text-[11px] text-muted-foreground">Ariful Islam • 15 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Profile Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl border border-border bg-background p-1.5 sm:px-2.5 sm:py-1.5 text-foreground shadow-2xs hover:bg-muted transition-colors cursor-pointer"
            aria-expanded={isUserMenuOpen}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground shadow-2xs">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="text-xs font-bold text-foreground truncate max-w-[100px]">
                {user?.name || 'Admin'}
              </span>
              <span className="text-[10px] font-medium text-primary">
                {isSuperAdmin ? 'Super Admin' : 'Admin'}
              </span>
            </div>
            <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-muted-foreground" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 top-full z-50 mt-1.5 w-56 rounded-2xl border border-border bg-popover text-popover-foreground p-2 shadow-xl animate-in fade-in-0 zoom-in-95">
              <div className="border-b border-border px-3 py-2">
                <p className="text-xs font-bold text-foreground truncate">{user?.name || 'Admin'}</p>
                <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                <span className="inline-block mt-1 rounded bg-primary/10 px-1.5 py-0.2 text-[9px] font-extrabold text-primary">
                  {user?.role || 'ADMIN'}
                </span>
              </div>

              <div className="py-1 space-y-0.5">
                <Link
                  href="/admin/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                  Security & Settings
                </Link>

                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Store className="h-3.5 w-3.5 text-muted-foreground" />
                  View Storefront
                </Link>
              </div>

              <div className="border-t border-border pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
