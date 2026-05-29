import { routeTree } from '@/routeTree.gen';
import { createBrowserHistory, createRouter } from '@tanstack/react-router';

import { AppLoader } from '@/components/shared/layout/AppLoader';

export const router = createRouter({
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
