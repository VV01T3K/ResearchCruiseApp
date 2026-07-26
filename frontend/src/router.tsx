import { routeTree } from '@/routeTree.gen';
import { createBrowserHistory, createRouter, RouterProvider } from '@tanstack/react-router';

import { AppLoader } from '@/components/shared/layout/AppLoader';
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

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function AppRouter() {
  return <RouterProvider router={router} />;
}
