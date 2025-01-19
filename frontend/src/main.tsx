import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { UserContextProvider } from '@core/providers/UserContextProvider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './index.css';
import RouterWithUserContextProvider from '@core/providers/RouterWithUserContextProvider';

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
