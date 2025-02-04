import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { AppAlert } from '@/core/components/AppAlert';
import { useNetworkStatusMutation } from '@/core/hooks/NetworkStatusApiHook';

export function AppNetworkDisconnectAlert() {
  const [networkConnectionStatus, setNetworkConnectionStatus] = React.useState<boolean | undefined>(undefined);

  const { mutate, mutateAsync } = useNetworkStatusMutation({ setNetworkConnectionStatus });

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
          <AppAlert variant="danger">
            Brak połączenia z serwerem. Upewnij się, że masz dostęp do internetu i spróbuj ponownie.
          </AppAlert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
