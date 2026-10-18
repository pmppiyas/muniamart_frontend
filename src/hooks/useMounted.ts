'use client';

import * as React from 'react';

const emptySubscribe = () => () => {};

/**
 * Idiomatic React 18/19 hook to check if component has hydrated on the client
 * using useSyncExternalStore. Avoids cascading renders and hydration mismatches.
 */
export function useMounted(): boolean {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
