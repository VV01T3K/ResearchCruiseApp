import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getErrorMessage } from '@/api/errors';
import { toast } from '@/components/shared/layout/toast';
import { FeedbackButton } from '@/integrations/sentry/FeedbackButton';
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
    onError: (error, _variables, _context, mutation) => {
      const eventId = mutation.meta?.skipsErrorReport
        ? undefined
        : captureMutationFailure(error, mutation.options.mutationKey);
      if (!mutation.options.onError && !mutation.meta?.handlesError) {
        const operation = mutation.options.mutationKey?.[0];
        toast.error(
          getErrorMessage(error, 'Operacja nie powiodła się'),
          <FeedbackButton
            context={{ origin: 'toast', operation: typeof operation === 'string' ? operation : undefined, eventId }}
            className="text-primary"
          />
        );
      }
    },
  }),
});

export function TanStackQueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
