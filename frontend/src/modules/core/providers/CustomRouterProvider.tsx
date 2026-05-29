import { RouterProvider } from '@tanstack/react-router';
import React from 'react';

import { AppLoader } from '@/core/components/layout/AppLoader';
import { appBackgroundStyle, appRouter } from '@/core/lib/appRouter';
import { useUserContext } from '@/user/hooks/UserContextHook';

export default function CustomRouterProvider() {
  const userContext = useUserContext();

  React.useEffect(() => {
    appRouter.invalidate();
  }, [userContext]);

  // prevent login page flash on initial load when access token is expired but refresh token is still valid by waiting until we've checked the profile and refresh status before rendering the router
  if (!userContext.isReady) {
    return (
      <>
        <div
          className="fixed -z-50 h-screen w-full bg-cover bg-center bg-no-repeat"
          style={appBackgroundStyle}
        />
        <div className="fixed -z-50 h-screen w-full" style={{ backdropFilter: 'blur(12px)' }} />
        <AppLoader />
      </>
    );
  }

  return <RouterProvider router={appRouter} context={{ userContext }} />;
}
