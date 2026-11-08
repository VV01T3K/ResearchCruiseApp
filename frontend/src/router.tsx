import { routeTree } from '@/routeTree.gen';
import { createBrowserHistory, createRouter, RouterProvider } from '@tanstack/react-router';

import { Loader } from '@/components/shared/layout/Loader';
import { accountId, subscribeAuthDetails } from '@/integrations/auth/session';
import { reloadForAccountChange } from '@/integrations/tanstack/query/AuthSession';
import { clearAccountQueries } from '@/integrations/tanstack/query/auth';
import { queryClient } from '@/integrations/tanstack/query/root-provider';

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  history: createBrowserHistory(),
  defaultPendingComponent: Loader,
  defaultPreload: 'intent',
  scrollRestoration: true,
});

subscribeAuthDetails((details, previous) => {
  if (!details) {
    clearAccountQueries(queryClient);
    void router.invalidate();
  } else if (previous && accountId(previous) !== accountId(details)) {
    queryClient.clear();
    reloadForAccountChange();
  }
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function RouterView() {
  return <RouterProvider router={router} />;
}
