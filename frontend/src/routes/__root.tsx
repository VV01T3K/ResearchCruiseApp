import { ApiError, getProblemDetail } from '@/api/errors';
import {
  createRootRouteWithContext,
  ErrorComponentProps,
  Outlet,
  useRouter,
  useRouterState,
} from '@tanstack/react-router';
import { useQueryClient, type QueryClient } from '@tanstack/react-query';
import { SmileyMehIcon, SmileyMeltingIcon } from '@phosphor-icons/react';

import config from '@/config';
import { motion } from 'motion/react';
import { lazy, Suspense } from 'react';
import { Button } from '@/components/shared/Button';
import { Layout } from '@/components/shared/Layout';
import { Link } from '@/components/shared/Link';
import Background from '@/components/shared/layout/Background';
import { Navbar } from '@/components/shared/layout/Navbar';
import { NetworkDisconnectAlert } from '@/components/shared/layout/NetworkDisconnectAlert';
import { Toaster } from '@/components/shared/layout/Toaster';
import { FeedbackTab } from '@/integrations/sentry/FeedbackTab';
import { classifyError, rootCause } from '@/integrations/sentry/mutations';
import { TanStackQueryDevtools } from '@/integrations/tanstack/query/devtools';
import { AuthSession } from '@/integrations/tanstack/query/AuthSession';

type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
  errorComponent: RouteError,
});

const TanStackRouterDevtools = config.dev
  ? lazy(() => import('@tanstack/react-router-devtools').then((module) => ({ default: module.TanStackRouterDevtools })))
  : () => null;

function RootLayout() {
  const routerState = useRouterState();

  return (
    <AuthSession>
      <Toaster />
      <div className="sticky top-0 z-100">
        <div className="relative z-100">
          <Navbar />
        </div>
        <div className="absolute z-90 w-full">
          <NetworkDisconnectAlert />
        </div>
      </div>
      <Background />
      <FeedbackTab />
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
        <Suspense>
          <TanStackRouterDevtools />
          <TanStackQueryDevtools />
        </Suspense>
      </div>
    </AuthSession>
  );
}

function RouteError({ error }: ErrorComponentProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const noAccess = classifyError(error) === 'no-access';
  const description = getProblemDetail(error, 'Nie udało się wczytać strony.');
  const cause = rootCause(error);

  async function retry() {
    await queryClient.resetQueries({ predicate: (query) => query.state.status === 'error' });
    await router.invalidate();
  }

  return (
    <>
      <Toaster />
      <div className="sticky top-0 z-100">
        <div className="relative z-100">
          <Navbar />
        </div>
        <div className="absolute z-90 w-full">
          <NetworkDisconnectAlert />
        </div>
      </div>
      <Background />
      <FeedbackTab />
      {noAccess ? (
        <Layout title={'Nie znaleziono lub brak dostępu'} variant="narrow">
          <div className="space-y-8">
            <div className="h-60">
              <SmileyMehIcon />
            </div>
            <div className="text-center">Ta strona nie istnieje albo nie masz do niej dostępu.</div>
            <Button type="link" href="/" className="w-full">
              Przejdź do strony głównej
            </Button>
          </div>
        </Layout>
      ) : (
        <Layout title={'Wystąpił nieoczekiwany błąd'} variant="narrow">
          <div className="space-y-8">
            <div className="h-60">
              <SmileyMeltingIcon />
            </div>
            <div className="flex items-center justify-center gap-2 text-lg">
              <div>Opis błędu: </div>
              <div className="font-semibold">{description}</div>
            </div>
            {cause instanceof ApiError && !description.includes('Kod błędu') && (
              <div className="text-center">
                Kod błędu: <span className="font-semibold">HTTP {cause.status}</span>
              </div>
            )}
            <div className="text-center">
              Prosimy o maila na adres <Link href="mailto:rejsy.help@ug.edu.pl">rejsy.help@ug.edu.pl</Link>.
            </div>
            <div className="flex gap-4">
              <Button variant="primaryOutline" className="w-full" onClick={() => void retry()}>
                Spróbuj ponownie
              </Button>
              <Button type="link" href="/" className="w-full">
                Przejdź do strony głównej
              </Button>
            </div>
          </div>
        </Layout>
      )}
    </>
  );
}

function NotFoundPage() {
  const router = useRouter();
  return (
    <Layout title={'Strona nie znaleziona'} variant="narrow">
      <div className="space-y-8">
        <div className="h-60">
          <SmileyMehIcon />
        </div>
        <div className="text-center">
          Strona o adresie <span className="font-semibold">{router.state.location.pathname}</span> nie została
          znaleziona.
        </div>
        <Button type="link" href="/" className="w-full">
          Przejdź do strony głównej
        </Button>
      </div>
    </Layout>
  );
}
