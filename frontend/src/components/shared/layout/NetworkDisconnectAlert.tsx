import { Collapsible } from '@base-ui/react/collapsible';
import React from 'react';
import { onlineManager, useQuery } from '@tanstack/react-query';

import { Alert } from '@/components/shared/Alert';
import config from '@/config';
import { connectionStatus, type HealthResult } from '@/features/connection/status';

async function checkHealth(outage: number) {
  let result: HealthResult;
  try {
    const response = await fetch(`${config.apiUrl}/health`, { cache: 'no-store' });
    result = response.ok ? 'healthy' : 'unhealthy';
  } catch {
    result = 'offline';
  }
  connectionStatus.report(outage, result);
  return result;
}

export function NetworkDisconnectAlert() {
  const { problem, outage } = React.useSyncExternalStore(connectionStatus.subscribe, connectionStatus.get);

  React.useEffect(() => onlineManager.subscribe((online) => !online && connectionStatus.suspect('offline')), []);

  useQuery({
    queryKey: ['health', outage],
    queryFn: () => checkHealth(outage),
    enabled: problem !== null,
    networkMode: 'always',
    retry: false,
    gcTime: 0,
    refetchInterval: 5000,
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
  });

  const isProblem = problem === 'offline' || problem === 'unhealthy';

  return (
    <Collapsible.Root open={isProblem}>
      <Collapsible.Panel className="h-(--collapsible-panel-height) overflow-hidden transition-[height,opacity] duration-200 ease-out data-[ending-style]:h-0 data-[ending-style]:opacity-0 data-[starting-style]:h-0 data-[starting-style]:opacity-0">
        {isProblem && (
          <Alert variant="danger">
            {problem === 'offline'
              ? 'Brak połączenia z serwerem. Upewnij się, że masz dostęp do internetu i spróbuj ponownie.'
              : 'Serwis ma chwilowo problemy techniczne. Twoje połączenie działa poprawnie.'}
          </Alert>
        )}
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
