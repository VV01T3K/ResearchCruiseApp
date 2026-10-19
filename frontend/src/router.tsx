import { routeTree } from '@/routeTree.gen';
import { createBrowserHistory, createRouter, RouterProvider } from '@tanstack/react-router';

import { AppLoader } from '@/components/shared/layout/AppLoader';
import { subscribeAuthDetails } from '@/integrations/auth/session';
import { clearAccountQueries } from '@/integrations/tanstack/query/auth';
import { queryClient } from '@/integrations/tanstack/query/root-provider';

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  history: createBrowserHistory(),
  defaultPendingComponent: AppLoader,
  defaultPreload: 'intent',
  scrollRestoration: true,
});

subscribeAuthDetails((details) => {
  if (details) return;
  clearAccountQueries(queryClient);
  void router.invalidate();
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function AppRouter() {
  return <RouterProvider router={router} />;
}
