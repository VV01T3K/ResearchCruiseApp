import './index.css';

import RouterWithUserContextProvider from '@core/providers/RouterWithUserContextProvider';
import { UserContextProvider } from '@core/providers/UserContextProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <UserContextProvider>
        <RouterWithUserContextProvider />
      </UserContextProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>
);
