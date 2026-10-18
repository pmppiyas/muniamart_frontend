'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface DropdownContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownContext = React.createContext<DropdownContextType | undefined>(undefined);

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={containerRef} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({
  children,
  asChild,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const context = React.useContext(DropdownContext);
  if (!context) throw new Error('DropdownMenuTrigger must be used within DropdownMenu');

  return (
    <button
      type="button"
      onClick={() => context.setOpen((prev) => !prev)}
      className={cn('inline-flex items-center justify-center cursor-pointer', className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenuContent({
  children,
  align = 'end',
  side = 'auto',
  className,
}: {
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom' | 'auto';
  className?: string;
}) {
  const context = React.useContext(DropdownContext);
  if (!context) throw new Error('DropdownMenuContent must be used within DropdownMenu');

  const contentRef = React.useRef<HTMLDivElement>(null);
  const [openUpwards, setOpenUpwards] = React.useState(side === 'top');

  React.useLayoutEffect(() => {
    if (!context.open || !contentRef.current) return;

    if (side === 'top') {
      setOpenUpwards(true);
      return;
    }
    if (side === 'bottom') {
      setOpenUpwards(false);
      return;
    }

    const rect = contentRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    let parentBottom = viewportHeight;
    let parentElem: HTMLElement | null = contentRef.current.parentElement;
    while (parentElem && parentElem !== document.body) {
      const style = window.getComputedStyle(parentElem);
      if (
        style.overflow === 'auto' ||
        style.overflow === 'hidden' ||
        style.overflowY === 'auto' ||
        style.overflowY === 'hidden'
      ) {
        parentBottom = parentElem.getBoundingClientRect().bottom;
        break;
      }
      parentElem = parentElem.parentElement;
    }

    if (rect.bottom > parentBottom || rect.bottom > viewportHeight - 20) {
      setOpenUpwards(true);
    } else {
      setOpenUpwards(false);
    }
  }, [context.open, side]);

  if (!context.open) return null;

  const alignClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  };

  const positionClasses = openUpwards
    ? 'bottom-full mb-1.5 origin-bottom-right'
    : 'top-full mt-1.5 origin-top-right';

  return (
    <div
      ref={contentRef}
      className={cn(
        'absolute z-50 min-w-[10rem] overflow-hidden rounded-xl border border-border bg-popover/95 p-1 text-popover-foreground shadow-lg backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-100',
        alignClasses[align],
        positionClasses,
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  children,
  className,
  onClick,
  destructive = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { destructive?: boolean }) {
  const context = React.useContext(DropdownContext);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    context?.setOpen(false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium outline-hidden transition-colors',
        destructive
          ? 'text-destructive hover:bg-destructive/10 hover:text-destructive'
          : 'text-foreground hover:bg-muted hover:text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn('-mx-1 my-1 h-px bg-border/60', className)} />;
}

export function DropdownMenuLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground', className)}>
      {children}
    </div>
  );
}
