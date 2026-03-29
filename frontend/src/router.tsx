import { createBrowserHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import React from 'react';

import { AppLoader } from '@/components/shared/layout/AppLoader';
import { useUserContext } from '@/providers/useUserContext';
import { routeTree } from './routeTree.gen';
import { RouterBootFallback } from './routes/-root/RouterBootFallback';

const router = createRouter({
  routeTree,
  context: {
    userContext: undefined,
  },
  history: createBrowserHistory(),
  defaultPendingComponent: AppLoader,
  defaultPreload: 'intent',
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function AppRouter() {
  const userContext = useUserContext();

  React.useEffect(() => {
    router.invalidate();
  }, [userContext]);

  if (!userContext.isReady) {
    return <RouterBootFallback />;
  }

  return <RouterProvider router={router} context={{ userContext }} />;
}
