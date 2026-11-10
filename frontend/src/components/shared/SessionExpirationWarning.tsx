import React from 'react';

import { Alert } from '@/components/shared/Alert';
import { Button } from '@/components/shared/Button';
import { Modal } from '@/components/shared/Modal';
import { useSessionRemainingMs } from '@/integrations/auth/useSessionClock';

type Props = {
  expirationDate: Date;
  onRefreshSession: () => Promise<void>;
  onSignOut: () => Promise<void>;
};

const WARNING_THRESHOLD_MS = 5 * 60 * 1000;

function formatTimeRemaining(remainingMs: number): string {
  if (remainingMs <= 0) {
    return '0:00';
  }

  const totalSeconds = Math.floor(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function SessionExpirationWarning({ expirationDate, onRefreshSession, onSignOut }: Props) {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const remainingMs = useSessionRemainingMs(expirationDate, () => 1000);
  const shouldWarn = remainingMs > 0 && remainingMs <= WARNING_THRESHOLD_MS;
  const isOpen = shouldWarn;

  async function handleRefreshSession() {
    setIsRefreshing(true);
    try {
      await onRefreshSession();
    } catch {
      // Refresh failure is handled upstream
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleSignOut() {
    await onSignOut();
  }

  return (
    <Modal title="Sesja wygasa" isOpen={isOpen} onClose={() => {}} dismissible={false}>
      <div className="flex flex-col gap-4">
        <Alert variant="warning" iconAlign="start" role="none">
          <div>
            <p className="font-medium">
              Twoja sesja wygaśnie za <span className="font-mono font-bold">{formatTimeRemaining(remainingMs)}</span>.
            </p>
            <p className="mt-1 text-sm">
              Odśwież sesję, aby kontynuować pracę. W przeciwnym razie niezapisane dane w formularzu mogą zostać
              utracone.
            </p>
          </div>
        </Alert>

        <div className="flex justify-end gap-2">
          <Button variant="dangerOutline" size="sm" onClick={() => void handleSignOut()}>
            Wyloguj
          </Button>
          <Button variant="primary" size="sm" onClick={() => void handleRefreshSession()} disabled={isRefreshing}>
            {isRefreshing ? 'Odświeżanie...' : 'Odśwież sesję'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
