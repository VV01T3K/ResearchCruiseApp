import { MutationCache, type Query, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getErrorMessage } from '@/api/errors';
import { toast } from '@/components/shared/layout/toast';
import { captureMutationFailure, captureQueryFailure, isRetryableFailure } from '@/integrations/sentry/mutations';

// A group waits for its slowest query; results that finished earlier must still count as fresh at mount.
export const groupedQueryStaleTime = 10_000;

export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: isRetryableFailure } },
  queryCache: new QueryCache({
    // Failed first loads are shown by the page that needs the data; a failed background refresh
    // leaves stale data on screen, so it gets a notification.
    onError: (error, query) => {
      captureQueryFailure(error, query.queryKey);
      if (query.state.data !== undefined)
        toast.backgroundError(getErrorMessage(error, 'Nie udało się odświeżyć danych'));
    },
  }),
  mutationCache: new MutationCache({
    // Returned so that a mutation stays pending until the queries a page suspends on have refetched;
    // optional queries (plain useQuery) refresh in the background.
    onSuccess: (_data, _variables, _context, mutation) => {
      mutation.meta?.onAccepted?.();
      if (mutation.meta?.invalidates === false) return;
      const isRequired = (query: Query) => query.observers.some((observer) => observer.options.suspense);
      void queryClient.invalidateQueries({ predicate: (query) => !isRequired(query) });
      return queryClient.invalidateQueries({ predicate: isRequired });
    },
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
    mutationMeta: {
      handlesError?: boolean;
      skipsErrorReport?: boolean;
      invalidates?: boolean;
      /** Runs when the server has accepted the mutation, before the refetch. */
      onAccepted?: () => void;
    };
  }
}

export function TanStackQueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
