import { AnimatePresence, motion } from 'motion/react';
import React from 'react';
import { useMutation } from '@tanstack/react-query';

import { AppAlert } from '@/components/shared/AppAlert';
import config from '@/config';

export function AppNetworkDisconnectAlert() {
  const [networkConnectionStatus, setNetworkConnectionStatus] = React.useState<boolean | undefined>(undefined);

  const { mutate, mutateAsync } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${config.apiUrl}/health`);
      if (!response.ok) throw new Error(`Network status request failed with status ${response.status}`);
    },
    onSuccess: () => setNetworkConnectionStatus(true),
    onError: () => setNetworkConnectionStatus(false),
    retry: false,
  });

  React.useEffect(() => {
    mutate();
    const intervalId = setInterval(async () => {
      await mutateAsync().catch(() => {});
    }, 3000);
    return () => clearInterval(intervalId);
  }, [mutate, mutateAsync]);

  return (
    <AnimatePresence>
      {networkConnectionStatus === false && (
        <motion.div initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }}>
          <AppAlert variant="danger" data-testid="server-connection-error">
            Brak połączenia z serwerem. Upewnij się, że masz dostęp do internetu i spróbuj ponownie.
          </AppAlert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
