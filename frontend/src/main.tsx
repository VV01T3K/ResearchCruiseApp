import './instrument';

import './styles/index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { reactErrorHandler } from '@sentry/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AppRouter } from '@/router';
import { UserContextProvider } from '@/providers/UserContextProvider';

createRoot(document.getElementById('root')!, {
  onUncaughtError: reactErrorHandler((error, errorInfo) => {
    console.error('Uncaught error:', error, errorInfo.componentStack);
  }),
  onCaughtError: reactErrorHandler(),
  onRecoverableError: reactErrorHandler(),
}).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={new QueryClient()}>
        <UserContextProvider>
          <AppRouter />
        </UserContextProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
