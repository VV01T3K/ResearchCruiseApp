import config from '@config';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, ScrollRestoration, useRouterState } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { motion } from 'motion/react';

import AppBackground from '@/core/components/layout/AppBackground';
import { AppNavbar } from '@/core/components/layout/AppNavbar';
import { AppNetworkDisconnectAlert } from '@/core/components/layout/AppNetworkDisconnectAlert';
import { AppToaster } from '@/core/components/layout/AppToaster';

export function RootLayout() {
  const routerState = useRouterState();

  return (
    <>
      <AppToaster />
      <div className="sticky top-0 z-100">
        <div className="relative z-100">
          <AppNavbar />
        </div>
        <div className="absolute z-90 w-full">
          <AppNetworkDisconnectAlert />
        </div>
      </div>
      <AppBackground />
      <main className="flex-1" id="modal-root">
        <motion.div
          key={routerState.location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>
      <div id="fab-root">
        {config.dev && <TanStackRouterDevtools />}
        {config.dev && <ReactQueryDevtools />}
      </div>
      <ScrollRestoration />
    </>
  );
}
