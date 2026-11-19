import { Collapsible } from '@base-ui/react/collapsible';
import React from 'react';
import { onlineManager, useQuery, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@/api/errors';
import { Alert } from '@/components/shared/Alert';
import config from '@/config';
import { classifyError, rootCause } from '@/integrations/sentry/mutations';

function isOutage(error: unknown): boolean {
  const cause = rootCause(error);
  return classifyError(cause) === 'network' || (cause instanceof ApiError && [502, 503, 504].includes(cause.status));
}

async function checkHealth() {
  try {
    const response = await fetch(`${config.apiUrl}/health`, { cache: 'no-store' });
    return response.ok ? ('healthy' as const) : ('unhealthy' as const);
  } catch {
    return 'offline' as const;
  }
}

export function NetworkDisconnectAlert() {
  const queryClient = useQueryClient();
  const isOnline = React.useSyncExternalStore(onlineManager.subscribe.bind(onlineManager), () =>
    onlineManager.isOnline()
  );
  const [suspectedAt, setSuspectedAt] = React.useState<number | null>(null);

  React.useEffect(() => {
    const suspect = () => setSuspectedAt((at) => at ?? Date.now());
    const onEvent = (event: { type: string; action?: { type: string; error?: unknown; data?: unknown } }) => {
      if (event.type !== 'updated') return;
      if (event.action?.type === 'failed' && isOutage(event.action.error)) suspect();
      if (event.action?.type === 'success' && event.action.data !== 'unhealthy' && event.action.data !== 'offline') {
        setSuspectedAt(null);
      }
    };
    const unsubscribeQueries = queryClient.getQueryCache().subscribe(onEvent);
    const unsubscribeMutations = queryClient.getMutationCache().subscribe(onEvent);
    const unsubscribeOnline = onlineManager.subscribe((online) => !online && suspect());
    return () => {
      unsubscribeQueries();
      unsubscribeMutations();
      unsubscribeOnline();
    };
  }, [queryClient]);

  const health = useQuery({
    queryKey: ['health'],
    queryFn: checkHealth,
    enabled: suspectedAt !== null,
    networkMode: 'always',
    staleTime: 0,
    retry: false,
    refetchInterval: (query) => (query.state.data === 'healthy' ? false : 5000),
    refetchOnWindowFocus: 'always',
  });

  const checked = suspectedAt !== null && health.dataUpdatedAt > suspectedAt ? health.data : undefined;
  const status = isOnline ? checked : 'offline';
  const isProblem = status === 'offline' || status === 'unhealthy';

  return (
    <Collapsible.Root open={isProblem}>
      <Collapsible.Panel className="h-(--collapsible-panel-height) overflow-hidden transition-[height,opacity] duration-200 ease-out data-[ending-style]:h-0 data-[ending-style]:opacity-0 data-[starting-style]:h-0 data-[starting-style]:opacity-0">
        {isProblem && (
          <Alert variant="danger">
            {status === 'offline'
              ? 'Brak połączenia z serwerem. Upewnij się, że masz dostęp do internetu i spróbuj ponownie.'
              : 'Serwis ma chwilowo problemy techniczne. Twoje połączenie działa poprawnie.'}
          </Alert>
        )}
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
