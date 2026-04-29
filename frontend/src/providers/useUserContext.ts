import React from 'react';

import { UserContext } from '@/providers/UserContext';

export function useUserContext() {
  return React.use(UserContext)!;
}
