import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getErrorMessage } from '@/api/errors';
import { toast } from '@/components/shared/layout/toast';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => toast.error(getErrorMessage(error, 'Nie udało się wczytać danych')),
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (!mutation.options.onError && !mutation.meta?.handlesError) {
        toast.error(getErrorMessage(error, 'Operacja nie powiodła się'));
      }
    },
  }),
});

export function TanStackQueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
