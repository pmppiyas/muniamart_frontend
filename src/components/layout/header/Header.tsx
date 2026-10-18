'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { TopNavbar } from './TopNavbar';
import { CategoryNavbar } from './CategoryNavbar';
import { Logo } from './Logo';
import { SearchBar } from './SearchBar';
import { CartButton } from './CartButton';
import { UserMenu } from './UserMenu';
import { MobileMenu } from './MobileMenu';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/features/auth/authSelectors';
import { useLogoutMutation } from '@/services/api/authApi';
import { toast } from 'sonner';

interface HeaderProps {
  cartCount?: number;
  cartTotal?: number;
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  } | null;
  onLogout?: () => void;
}

export function Header({
  cartCount,
  cartTotal,
  user = null,
  onLogout,
}: HeaderProps) {
  const pathname = usePathname();
  const reduxUser = useAppSelector(selectCurrentUser);
  const [logoutMutation] = useLogoutMutation();

  const activeUser = user !== undefined && user !== null ? user : reduxUser;

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
      return;
    }
    try {
      await logoutMutation().unwrap();
      toast.success('Signed out successfully');
    } catch {
      toast.success('Signed out successfully');
    }
  };

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md shadow-xs">
      <TopNavbar />

      <div className="border-b border-border/60 md:border-b-0 bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-3 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Logo />
          </div>

          <div className="hidden md:flex flex-1 max-w-lg mx-4 lg:mx-8">
            <SearchBar />
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            <CartButton count={cartCount} total={cartTotal} />

            <div className="hidden md:block">
              <UserMenu user={activeUser} onLogout={handleLogout} />
            </div>

            <MobileMenu className="md:hidden" />
          </div>
        </div>
      </div>

      <CategoryNavbar />
    </header>
  );
}
