'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Search, User } from 'lucide-react';
import { MobileNavItem } from './MobileNavItem';
import { MobileSearch } from './MobileSearch';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/features/auth/authSelectors';

interface MobileNavProps {
  user?: object | null;
}

export function MobileNav({ user = null }: MobileNavProps) {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const reduxUser = useAppSelector(selectCurrentUser);
  const activeUser = user !== undefined && user !== null ? user : reduxUser;

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <MobileSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <nav className="fixed bottom-0 left-0 right-0 z-40 block md:hidden border-t border-border bg-card/95 backdrop-blur-md shadow-lg safe-area-bottom">
        <div className="flex h-16 items-center justify-around px-2">
          <MobileNavItem
            label="Home"
            href="/"
            icon={Home}
            isActive={pathname === '/'}
          />

          <MobileNavItem
            label="Shop"
            href="/products"
            icon={LayoutGrid}
            isActive={pathname.startsWith('/products') || pathname.startsWith('/categories')}
          />

          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-1 flex-col items-center justify-center py-2 text-muted-foreground hover:text-foreground transition-colors select-none cursor-pointer"
          >
            <Search className="h-5 w-5" />
            <span className="mt-1 text-[10px] font-medium text-muted-foreground">Search</span>
          </button>

          <MobileNavItem
            label={activeUser ? 'Account' : 'Profile'}
            href={activeUser ? '/profile' : '/auth/login'}
            icon={User}
            isActive={
              pathname === '/profile' ||
              pathname === '/auth/login' ||
              pathname === '/auth/register'
            }
          />
        </div>
      </nav>
    </>
  );
}
