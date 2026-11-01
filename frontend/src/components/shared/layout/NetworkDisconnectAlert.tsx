import { AnimatePresence, motion } from 'motion/react';
import React from 'react';
import { useMutation } from '@tanstack/react-query';

import { Alert } from '@/components/shared/Alert';
import config from '@/config';

export function NetworkDisconnectAlert() {
  const [status, setStatus] = React.useState<'healthy' | 'unhealthy' | 'offline'>('healthy');

  const { mutate } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${config.apiUrl}/health`);
      return response.ok ? ('healthy' as const) : ('unhealthy' as const);
    },
    onSuccess: setStatus,
    onError: () => setStatus('offline'),
    retry: false,
    meta: { skipsErrorReport: true },
  });

  React.useEffect(() => {
    mutate();
    const intervalId = setInterval(() => mutate(), 3000);
    return () => clearInterval(intervalId);
  }, [mutate]);

  return (
    <AnimatePresence>
      {status !== 'healthy' && (
        <motion.div initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }}>
          <Alert variant="danger">
            {status === 'offline'
              ? 'Brak połączenia z serwerem. Upewnij się, że masz dostęp do internetu i spróbuj ponownie.'
              : 'Serwis ma chwilowo problemy techniczne. Twoje połączenie działa poprawnie.'}
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
