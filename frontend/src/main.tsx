import './styles/index.css';

import { reactErrorHandler } from '@sentry/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { z } from 'zod';

import { FatalErrorBoundary } from '@/components/shared/FatalErrorBoundary';
import config from '@/config';
import { initializeSentry } from '@/integrations/sentry/client';
import { TanStackQueryProvider } from '@/integrations/tanstack/query/root-provider';
import { UserContextProvider } from '@/providers/UserContextProvider';
import { AppRouter, router } from '@/router';

z.config(z.locales.pl());
initializeSentry(router);

const sentryErrorHandlers = config.sentryDsn
  ? {
      onUncaughtError: reactErrorHandler(),
      onCaughtError: reactErrorHandler(),
      onRecoverableError: reactErrorHandler(),
    }
  : undefined;

createRoot(document.getElementById('root')!, sentryErrorHandlers).render(
  <StrictMode>
    <FatalErrorBoundary>
      <TanStackQueryProvider>
        <UserContextProvider>
          <AppRouter />
        </UserContextProvider>
      </TanStackQueryProvider>
    </FatalErrorBoundary>
  </StrictMode>
);
