import { client } from '@core/helpers/api';
import { useMutation } from '@tanstack/react-query';
import { AppAlert } from './AppAlert';
import { useEffect, useState } from 'react';
import { cn } from '@lib/utils';

type NetworkConnectionStatus = 'before_connection' | 'connected' | 'lose_connection';

export function AppNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkConnectionStatus>('before_connection');

  const statusMutation = useMutation({
    mutationFn: () => client.get('/health', { headers: { Authorization: '' } }),
    onSuccess: () => {
      setNetworkStatus('connected');
    },
    onError: () => {
      setNetworkStatus('lose_connection');
    },
    retry: false,
  });

  useEffect(() => {
    statusMutation.mutate();
    const intervalId = setInterval(async () => {
      await statusMutation.mutateAsync().catch(() => {});
    }, 1000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn('duration-700', networkStatus !== 'lose_connection' ? '-translate-y-full' : '')}>
      <AppAlert variant="danger">
        Brak połączenia z serwerem. Upewnij się że masz dostęp do internetu i spróbuj ponownie.
      </AppAlert>
    </div>
  );
}
