import { routeTree } from '@/routeTree.gen';
import { createBrowserHistory, createRouter, RouterProvider } from '@tanstack/react-router';

import { Loader } from '@/components/shared/layout/Loader';
import { getGetCurrentUserQueryKey } from '@/api/generated/endpoints/users.gen';
import { accountId, subscribeAuthDetails } from '@/integrations/auth/session';
import { reloadForAccountChange } from '@/integrations/tanstack/query/AuthSession';
import { clearAccountQueries } from '@/integrations/tanstack/query/auth';
import { queryClient } from '@/integrations/tanstack/query/root-provider';
import { safeRedirect } from '@/lib/guards';

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

subscribeAuthDetails((details, previous, event) => {
  if (!details) {
    clearAccountQueries(queryClient);
    void router.invalidate();
  } else if (previous && accountId(previous) !== accountId(details)) {
    queryClient.clear();
    reloadForAccountChange();
  } else if (event === 'remote-login') {
    void queryClient.invalidateQueries({ queryKey: getGetCurrentUserQueryKey() }).then(() => {
      const { pathname, search } = router.state.location;
      if (pathname === '/login') void router.navigate({ href: safeRedirect(search.redirect) ?? '/' });
    });
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
