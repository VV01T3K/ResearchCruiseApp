import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getErrorMessage } from '@/api/errors';
import { toast } from '@/components/shared/layout/toast';
import { captureMutationFailure } from '@/integrations/sentry/mutations';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    // Failed first loads are shown by the page that needs the data; a failed background refresh
    // leaves stale data on screen, so it gets a notification.
    onError: (error, query) => {
      if (query.state.data !== undefined) toast.error(getErrorMessage(error, 'Nie udało się odświeżyć danych'));
    },
  }),
  mutationCache: new MutationCache({
    // Returned so that a mutation stays pending until the active queries have refetched.
    onSuccess: (_data, _variables, _context, mutation) =>
      mutation.meta?.invalidates === false ? undefined : queryClient.invalidateQueries(),
    onError: (error, _variables, _context, mutation) => {
      if (!mutation.meta?.skipsErrorReport) captureMutationFailure(error, mutation.options.mutationKey);
      if (!mutation.options.onError && !mutation.meta?.handlesError) {
        toast.error(getErrorMessage(error, 'Operacja nie powiodła się'));
      }
    },
  }),
});

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: { handlesError?: boolean; skipsErrorReport?: boolean; invalidates?: boolean };
  }
}

export function TanStackQueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
