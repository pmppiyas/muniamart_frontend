'use client';

import * as React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
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
import { selectWishlistTotalCount } from '@/features/wishlist/wishlistSelectors';
import { selectCurrentUser } from '@/features/auth/authSelectors';
import { useLogoutMutation } from '@/services/api/authApi';
import { toast } from 'sonner';

interface HeaderProps {
  cartCount?: number;
  cartTotal?: number;
  wishlistCount?: number;
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
  wishlistCount,
  user = null,
  onLogout,
}: HeaderProps) {
  const mounted = useMounted();
  const reduxWishlistCount = useAppSelector(selectWishlistTotalCount);
  const displayWishlistCount = !mounted
    ? 0
    : wishlistCount !== undefined
      ? wishlistCount
      : reduxWishlistCount;

  const reduxUser = useAppSelector(selectCurrentUser);
  const activeUser = user !== undefined && user !== null ? user : reduxUser;

  const [logoutMutation] = useLogoutMutation();

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

  return (
    <header className="sticky top-0 z-40 w-full bg-background shadow-xs">
      {/* Top utility announcement bar */}
      <TopNavbar />

      {/* Main Header bar */}
      <div className="border-b border-border md:border-b-0 bg-background">
        <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between gap-2 sm:gap-3 px-3 sm:px-6 lg:px-8">
          {/* Logo (Left) */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Logo showTagline />
          </div>

          {/* Search Bar (Center) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8">
            <SearchBar />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <OfferButton />

            {/* Light / Dark Mode Switcher */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* Wishlist Button */}
            <Link
              href="/wishlist"
              className="group relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-xs transition-all hover:border-primary hover:text-primary active:scale-95 cursor-pointer"
              aria-label={`Wishlist with ${displayWishlistCount} items`}
            >
              <Heart className="h-4 w-4 transition-transform group-hover:scale-110" />
              {displayWishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground shadow-xs">
                  {displayWishlistCount > 99 ? '99+' : displayWishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <CartButton count={cartCount} total={cartTotal} />

            {/* User Profile / Auth Menu */}
            <div className="hidden md:block">
              <UserMenu user={activeUser} onLogout={handleLogout} />
            </div>

            {/* 3-Dot Mobile Menu Trigger (Far Right on mobile) */}
            <MobileMenu className="md:hidden" />
          </div>
        </div>
      </div>

      {/* Categories & Secondary Nav bar */}
      <CategoryNavbar />
    </header>
  );
}
