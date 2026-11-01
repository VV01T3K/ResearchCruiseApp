import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { Alert } from '@/components/shared/Alert';
import config from '@/config';

const FIRST_CHECK_DELAY = 3_000;
const LONGEST_CHECK_DELAY = 30_000;

export function NetworkDisconnectAlert() {
  const [status, setStatus] = React.useState<'healthy' | 'offline' | 'unhealthy'>('healthy');

  React.useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let delay = FIRST_CHECK_DELAY;
    let latestCheck = 0;

    async function check() {
      clearTimeout(timeoutId);
      const thisCheck = ++latestCheck;
      const next = await fetch(`${config.apiUrl}/health`).then(
        (response) => (response.ok ? 'healthy' : 'unhealthy'),
        () => 'offline' as const
      );
      if (thisCheck !== latestCheck) return;
      setStatus(next);
      timeoutId = setTimeout(() => void check(), delay);
      delay = next === 'healthy' ? FIRST_CHECK_DELAY : Math.min(delay * 2, LONGEST_CHECK_DELAY);
    }
    const handleOnline = () => {
      delay = FIRST_CHECK_DELAY;
      void check();
    };
    const handleOffline = () => setStatus('offline');

    void check();
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      latestCheck = -1;
      clearTimeout(timeoutId);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {status === 'offline' && (
          <motion.div initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }}>
            <Alert variant="danger">
              Brak połączenia z serwerem. Upewnij się, że masz dostęp do internetu i spróbuj ponownie.
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
      {status === 'unhealthy' && (
        <div className="fixed bottom-8 left-4 max-w-sm text-sm shadow-md">
          <Alert variant="warning">Serwis ma chwilowo problemy techniczne. Twoje połączenie działa poprawnie.</Alert>
        </div>
      )}
    </>
  );
}
