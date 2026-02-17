import BackgroundImageUrl from '@assets/background.jpg';
import { routeTree } from '@routeTree';
import { createBrowserHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import React from 'react';

import { AppLoader } from '@/core/components/layout/AppLoader';
import { useUserContext } from '@/user/hooks/UserContextHook';

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

export default function CustomRouterProvider() {
  const userContext = useUserContext();

  React.useEffect(() => {
    router.invalidate();
  }, [userContext]);

  // prevent login page flash on initial load when access token is expired but refresh token is still valid by waiting until we've checked the profile and refresh status before rendering the router
  if (!userContext.isReady) {
    return (
      <>
        <div
          className="fixed -z-50 h-screen w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${BackgroundImageUrl}')` }}
        />
        <div className="fixed -z-50 h-screen w-full" style={{ backdropFilter: 'blur(12px)' }} />
        <AppLoader />
      </>
    );
  }

  return <RouterProvider router={router} context={{ userContext }} />;
}
