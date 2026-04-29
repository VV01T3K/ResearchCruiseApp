import { createRootRouteWithContext } from '@tanstack/react-router';

import { AppErrorHandler } from '@/routes/-root/AppErrorHandler';
import { AppPageNotFoundHandler } from '@/routes/-root/AppPageNotFoundHandler';
import { RootLayout } from '@/routes/-root/RootLayout';
import { UserContextType } from '@/providers/UserContext';

type RouterContext = {
  userContext?: UserContextType;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: AppPageNotFoundHandler,
  errorComponent: AppErrorHandler,
});
