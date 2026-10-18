'use client';

import * as React from 'react';
import Link from 'next/link';
import { User, Package, MapPin, LogIn, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserMenuProps {
  className?: string;
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
    role?: string;
  } | null;
  onLogout?: () => void;
}

export function UserMenu({ className, user = null, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('relative', className)} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group flex h-9 sm:h-10 items-center gap-2 rounded-xl border border-border bg-card px-2.5 sm:px-3 text-foreground shadow-xs transition-all hover:border-primary hover:text-primary active:scale-95 cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-secondary text-secondary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground text-xs font-bold">
          {user?.name ? (
            user.name.charAt(0).toUpperCase()
          ) : (
            <User className="h-3.5 w-3.5" />
          )}
        </div>

        <span className="hidden sm:inline text-xs font-semibold max-w-[85px] truncate">
          {user ? user.name?.split(' ')[0] || 'Account' : 'Sign In'}
        </span>

        <ChevronDown
          className={cn(
            'hidden sm:block h-3 w-3 text-muted-foreground transition-transform duration-200 group-hover:text-primary',
            { 'rotate-180': isOpen }
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-60 rounded-2xl border border-border bg-popover text-popover-foreground p-2 shadow-xl animate-in fade-in-0 zoom-in-95">
          {user ? (
            <div className="border-b border-border px-3 py-2.5">
              <p className="text-sm font-bold text-foreground">{user.name || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          ) : (
            <div className="border-b border-border p-2 text-center">
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition-colors"
              >
                <LogIn className="h-4 w-4" />
                Sign In to Your Account
              </Link>
              <p className="mt-2 text-[11px] text-muted-foreground">
                New customer?{' '}
                <Link
                  href="/auth/register"
                  onClick={() => setIsOpen(false)}
                  className="font-bold text-primary hover:underline"
                >
                  Create account
                </Link>
              </p>
            </div>
          )}

          <div className="py-1">
            {user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
              <Link
                href="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between gap-2.5 rounded-lg bg-primary/10 px-3 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-colors mb-1"
              >
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Admin Dashboard</span>
                </div>
                <span className="rounded bg-primary px-1.5 py-0.2 text-[9px] font-extrabold text-white uppercase">
                  {user.role === 'SUPER_ADMIN' ? 'Super' : 'Admin'}
                </span>
              </Link>
            )}

            <Link
              href="/profile?tab=info"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              My Profile
            </Link>
            <Link
              href="/profile?tab=orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Package className="h-4 w-4 text-muted-foreground" />
              My Orders & Tracking
            </Link>
            <Link
              href="/profile?tab=addresses"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Saved Addresses
            </Link>
          </div>

          {user && (
            <div className="border-t border-border pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (onLogout) onLogout();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
