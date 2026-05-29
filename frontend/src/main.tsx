import './styles/index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AppRouter } from '@/router';
import { UserContextProvider } from '@/providers/UserContextProvider';

createRoot(document.getElementById('root')!).render(
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
