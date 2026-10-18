'use client';

import * as React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function ScrollHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch {
      window.scrollTo(0, 0);
    }

    const frameId = requestAnimationFrame(() => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      } catch {
        window.scrollTo(0, 0);
      }
    });

    return () => cancelAnimationFrame(frameId);
  }, [pathname, searchParams]);

  return null;
}

export function ScrollToTop() {
  return (
    <React.Suspense fallback={null}>
      <ScrollHandler />
    </React.Suspense>
  );
}
