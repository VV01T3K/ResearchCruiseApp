import BackgroundImageUrl from '@/assets/background.jpg';
import { RouterProvider } from '@tanstack/react-router';
import React from 'react';

import { AppLoader } from '@/components/shared/layout/AppLoader';
import { useUserContext } from '@/providers/useUserContext';
import { router } from '@/routerInstance';

export function AppRouter() {
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
