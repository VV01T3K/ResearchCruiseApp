import React from 'react';

import { AppContext } from '@/core/contexts/AppContext';

export function useAppContext() {
  return React.use(AppContext)!;
}
