import { createRootRouteWithContext } from '@tanstack/react-router';

import { AppErrorHandler } from '@/core/components/layout/AppErrorHandler';
import { AppPageNotFoundHandler } from '@/core/components/layout/AppPageNotFoundHandler';
import { RootLayout } from '@/core/pages/RootLayout';
import { UserContextType } from '@/user/contexts/UserContext';

type RouterContext = {
  userContext?: UserContextType;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: AppPageNotFoundHandler,
  errorComponent: AppErrorHandler,
});
