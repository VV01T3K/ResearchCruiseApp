import BackgroundImageUrl from '@assets/background.jpg';
import { routeTree } from '@routeTree';
import { createBrowserHistory, createRouter } from '@tanstack/react-router';

import { AppLoader } from '@/core/components/layout/AppLoader';

export const appRouter = createRouter({
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
    router: typeof appRouter;
  }
}

export const appBackgroundStyle = {
  backgroundImage: `url('${BackgroundImageUrl}')`,
} as const;
