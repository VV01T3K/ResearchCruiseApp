import {
  createRootRouteWithContext,
  ErrorComponentProps,
  Outlet,
  useRouter,
  useRouterState,
} from '@tanstack/react-router';
import EmojiNeutralIcon from 'bootstrap-icons/icons/emoji-neutral.svg?react';
import EmojiSmileUpsideDownIcon from 'bootstrap-icons/icons/emoji-smile-upside-down.svg?react';

import { UserContextType } from '@/providers/UserContext';
import config from '@/config';
import { motion } from 'motion/react';
import { lazy, Suspense } from 'react';
import { AppButton } from '@/components/shared/AppButton';
import { AppLayout } from '@/components/shared/AppLayout';
import { AppLink } from '@/components/shared/AppLink';
import AppBackground from '@/components/shared/layout/AppBackground';
import { AppNavbar } from '@/components/shared/layout/AppNavbar';
import { AppNetworkDisconnectAlert } from '@/components/shared/layout/AppNetworkDisconnectAlert';
import { AppToaster } from '@/components/shared/layout/AppToaster';

type RouterContext = {
  userContext?: UserContextType;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: AppPageNotFoundHandler,
  errorComponent: AppErrorHandler,
});

const TanStackRouterDevtools = config.dev
  ? lazy(() => import('@tanstack/react-router-devtools').then((m) => ({ default: m.TanStackRouterDevtools })))
  : () => null;
const ReactQueryDevtools = config.dev
  ? lazy(() => import('@tanstack/react-query-devtools').then((m) => ({ default: m.ReactQueryDevtools })))
  : () => null;

function RootLayout() {
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
      <main className="flex-1" id="modal-root" data-testid="main-content">
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
        <Suspense>
          <TanStackRouterDevtools />
          <ReactQueryDevtools />
        </Suspense>
      </div>
    </>
  );
}

function AppErrorHandler({ error }: ErrorComponentProps) {
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
      <AppLayout title={'Wystąpił nieoczekiwany błąd'} variant="narrow">
        <div className="space-y-8">
          <div className="h-60">
            <EmojiSmileUpsideDownIcon />
          </div>
          <div className="flex items-center justify-center gap-2 text-lg">
            <div>Opis błędu: </div>
            <div className="font-semibold">{error.message}</div>
          </div>
          <div className="text-center">
            Prosimy o maila na adres <AppLink href="mailto:rejsy.help@ug.edu.pl">rejsy.help@ug.edu.pl</AppLink>.
          </div>
          <AppButton type="link" href="/" className="w-full">
            Przejdź do strony głównej
          </AppButton>
        </div>
      </AppLayout>
    </>
  );
}

function AppPageNotFoundHandler() {
  const router = useRouter();
  return (
    <AppLayout title={'Strona nie znaleziona'} variant="narrow">
      <div className="space-y-8">
        <div className="h-60">
          <EmojiNeutralIcon />
        </div>
        <div className="text-center">
          Strona o adresie <span className="font-semibold">{router.state.location.pathname}</span> nie została
          znaleziona.
        </div>
        <AppButton type="link" href="/" className="w-full">
          Przejdź do strony głównej
        </AppButton>
      </div>
    </AppLayout>
  );
}
