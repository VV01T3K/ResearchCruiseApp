import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { initializeFaro } from '@/lib/grafanaFaro';
import { UserContextProvider } from '@/providers/UserContextProvider';
import { AppRouter } from '@/router';
import './styles/index.css';

const queryClient = new QueryClient();

initializeFaro();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <AppRouter />
      </UserContextProvider>
    </QueryClientProvider>
  </StrictMode>
);
