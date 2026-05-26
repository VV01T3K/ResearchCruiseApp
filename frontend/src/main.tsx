import './styles/index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { initializeHyperDX } from '@/lib/hyperdx';
import { AppRouter } from '@/router';
import { UserContextProvider } from '@/providers/UserContextProvider';

initializeHyperDX();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <UserContextProvider>
        <AppRouter />
      </UserContextProvider>
    </QueryClientProvider>
  </StrictMode>
);
