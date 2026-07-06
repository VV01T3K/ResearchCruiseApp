import './instrument';

import './styles/index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { reactErrorHandler } from '@sentry/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { FatalErrorBoundary } from '@/components/shared/FatalErrorBoundary';
import { isSentryEnabled } from '@/lib/sentry';
import { AppRouter } from '@/router';
import { UserContextProvider } from '@/providers/UserContextProvider';

const sentryErrorHandlers = isSentryEnabled()
  ? {
      onUncaughtError: reactErrorHandler((error, errorInfo) => {
        console.error('Uncaught error:', error, errorInfo.componentStack);
      }),
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
