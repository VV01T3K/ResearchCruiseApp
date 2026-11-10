import { ArrowClockwiseIcon, ClockIcon } from '@phosphor-icons/react';
import React from 'react';

import { useSessionRemainingMs } from '@/integrations/auth/useSessionClock';

type Props = {
  refreshTokenExpirationDate: Date;
  onRefresh: () => Promise<void>;
};

function formatTimeRemaining(remainingMs: number): string {
  if (remainingMs <= 0) {
    return 'Sesja wygasła';
  }

  const totalSeconds = Math.floor(remainingMs / 1000);

  if (remainingMs > 1000 * 60 * 60) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `Sesja: ${hours}h ${minutes}m`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `Sesja: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function SessionStatusBadge({ refreshTokenExpirationDate, onRefresh }: Props) {
  const remainingMs = useSessionRemainingMs(refreshTokenExpirationDate, (remaining) =>
    remaining > 1000 * 60 * 60 ? 1000 * 30 : 1000
  );
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  async function handleRefresh() {
    setIsRefreshing(true);
    try {
      await Promise.all([onRefresh(), new Promise((r) => setTimeout(r, 600))]);
    } catch {
      // Refresh failure is handled upstream (e.g. provider sign-out flow).
    } finally {
      setIsRefreshing(false);
    }
  }

  const isWarning = remainingMs <= 1000 * 60 * 5;

  return (
    <div
      title="Pozostały czas sesji"
      className={`flex items-center gap-2 rounded-lg px-3 py-1 text-sm font-medium ${
        isWarning ? 'bg-danger-100 text-danger-700' : 'bg-inverse-foreground/20 text-inverse-foreground'
      }`}
    >
      <ClockIcon className="h-4 w-4" />
      <span className="font-mono">{formatTimeRemaining(remainingMs)}</span>
      <button
        title="Odśwież sesję"
        onClick={() => void handleRefresh()}
        disabled={isRefreshing}
        className="cursor-pointer rounded-sm transition-opacity duration-150 ease-out hover:opacity-70 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-hidden active:opacity-50 disabled:cursor-default disabled:opacity-40"
      >
        <ArrowClockwiseIcon
          className="h-4 w-4"
          style={isRefreshing ? { animation: 'spin 0.5s linear infinite' } : undefined}
        />
      </button>
    </div>
  );
}
