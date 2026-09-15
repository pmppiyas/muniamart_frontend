'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TopNavbar } from './TopNavbar';
import { CategoryNavbar } from './CategoryNavbar';
import { Logo } from './Logo';
import { SearchBar } from './SearchBar';
import { OfferButton } from './OfferButton';
import { CartButton } from './CartButton';
import { UserMenu } from './UserMenu';
import { MobileMenu } from './MobileMenu';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { CurrencySwitcher } from '@/components/common/CurrencySwitcher';
import { useMounted } from '@/hooks/useMounted';
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
  const mounted = useMounted();
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
    <header className="sticky top-0 z-40 w-full bg-background shadow-xs">
      <TopNavbar />

      <div className="border-b border-border md:border-b-0 bg-background">
        <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between gap-2 sm:gap-3 px-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-4">
            <Logo showTagline />
          </div>

          <div className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8">
            <SearchBar />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <OfferButton />

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
