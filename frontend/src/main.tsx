import './styles/index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { reactErrorHandler } from '@sentry/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { z } from 'zod';

import { FatalErrorBoundary } from '@/components/shared/FatalErrorBoundary';
import config from '@/config';
import { initializeSentry } from '@/lib/sentry';
import { AppRouter, router } from '@/router';
import { UserContextProvider } from '@/providers/UserContextProvider';

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
      <QueryClientProvider client={new QueryClient()}>
        <UserContextProvider>
          <AppRouter />
        </UserContextProvider>
      </QueryClientProvider>
    </FatalErrorBoundary>
  </StrictMode>
);
