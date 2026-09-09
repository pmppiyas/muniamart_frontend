'use client';

import * as React from 'react';
import { useLazyGetMeQuery } from '@/services/api/authApi';

export function AuthInitializer() {
  const [triggerGetMe] = useLazyGetMeQuery();

  React.useEffect(() => {
    triggerGetMe();
  }, [triggerGetMe]);

  return null;
}
