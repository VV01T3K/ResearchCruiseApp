import React from 'react';

import { UserContext } from '@/user/contexts/UserContext';

export function useUserContext() {
  return React.useContext(UserContext)!;
}
