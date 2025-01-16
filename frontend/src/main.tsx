import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { UserContextProvider } from '@core/providers/UserContextProvider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './index.css';
import RouterWithUserContextProvider from '@core/providers/RouterWithUserContextProvider';
import AppBackground from '@core/components/AppBackground';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppBackground />
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <RouterWithUserContextProvider />
      </UserContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
