import { Outlet, ScrollRestoration } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import AppBackground from '@/core/components/layout/AppBackground';
import { AppNavbar } from '@/core/components/layout/AppNavbar';
import { AppNetworkDisconnectAlert } from '@/core/components/layout/AppNetworkDisconnectAlert';

export function RootLayout() {
  return (
    <>
      <div className="sticky top-0 z-100">
        <div className="relative z-100">
          <AppNavbar />
        </div>
        <div className="absolute z-90 w-full">
          <AppNetworkDisconnectAlert />
        </div>
      </div>
      <AppBackground />
      <main className="flex-1">
        <Outlet />
      </main>
      <ScrollRestoration />
      <TanStackRouterDevtools />
    </>
  );
}
