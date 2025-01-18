import { client } from '@core/api';
import { useMutation } from '@tanstack/react-query';
import { AppAlert } from './AppAlert';
import { useEffect, useState } from 'react';

export function AppNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<
    'before_connection' | 'connected' | 'lose_connection'
  >('before_connection');

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
      await statusMutation.mutateAsync();
    }, 1000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (networkStatus != 'lose_connection') {
    return null;
  }

  return (
    <AppAlert variant="error">
      Brak połączenia z serwerem. Upewnij się że masz dostęp do internetu i
      spróbuj ponownie.
    </AppAlert>
  );
}
