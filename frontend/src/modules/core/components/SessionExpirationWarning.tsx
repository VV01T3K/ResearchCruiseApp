import ExclamationTriangleFillIcon from 'bootstrap-icons/icons/exclamation-triangle-fill.svg?react';
import React from 'react';

import { AppButton } from '@/core/components/AppButton';
import { AppModal } from '@/core/components/AppModal';

type Props = {
  expirationDate: Date;
  onRefreshSession: () => Promise<void>;
  onSignOut: () => Promise<void>;
};

const WARNING_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

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
  const [nowTs, setNowTs] = React.useState(() => Date.now());

  // Tick every second when tracking remaining time
  React.useEffect(() => {
    const remainingMs = expirationDate.getTime() - nowTs;
    if (remainingMs <= 0) {
      return;
    }

    const timeoutId = setTimeout(() => setNowTs(Date.now()), 1000);
    return () => clearTimeout(timeoutId);
  }, [expirationDate, nowTs]);

  const remainingMs = expirationDate.getTime() - nowTs;
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
    <AppModal title="Sesja wygasa" isOpen={isOpen} onClose={() => {}} dismissible={false}>
      <div className="flex flex-col gap-4">
        <div className="bg-warning-50 flex items-start gap-3 rounded-lg p-4">
          <ExclamationTriangleFillIcon className="text-warning-600 mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-warning-800 font-medium">
              Twoja sesja wygaśnie za <span className="font-mono font-bold">{formatTimeRemaining(remainingMs)}</span>.
            </p>
            <p className="text-warning-700 mt-1 text-sm">
              Odśwież sesję, aby kontynuować pracę. W przeciwnym razie niezapisane dane w formularzu mogą zostać
              utracone.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <AppButton variant="dangerOutline" size="sm" onClick={handleSignOut}>
            Wyloguj
          </AppButton>
          <AppButton variant="primary" size="sm" onClick={handleRefreshSession} disabled={isRefreshing}>
            {isRefreshing ? 'Odświeżanie...' : 'Odśwież sesję'}
          </AppButton>
        </div>
      </div>
    </AppModal>
  );
}
