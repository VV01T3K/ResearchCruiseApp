import ArrowClockwiseIcon from 'bootstrap-icons/icons/arrow-clockwise.svg?react';
import ClockIcon from 'bootstrap-icons/icons/clock.svg?react';
import React from 'react';

type Props = {
  refreshTokenExpirationDate: Date;
  onRefresh: () => Promise<void>;
};

function getRemainingMs(expirationDate: Date): number {
  return expirationDate.getTime() - Date.now();
}

function formatTimeRemaining(remainingMs: number): string {
  if (remainingMs <= 0) {
    return 'Sesja wygasł';
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
  const [nowTs, setNowTs] = React.useState(() => Date.now());
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  React.useEffect(() => {
    const remainingMs = refreshTokenExpirationDate.getTime() - nowTs;
    if (remainingMs <= 0) {
      return;
    }

    const refreshEveryMs = remainingMs > 1000 * 60 * 60 ? 1000 * 30 : 1000;
    const timeoutId = setTimeout(() => setNowTs(Date.now()), refreshEveryMs);

    return () => clearTimeout(timeoutId);
  }, [refreshTokenExpirationDate, nowTs]);

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

  const remainingMs = getRemainingMs(refreshTokenExpirationDate);
  const isWarning = remainingMs <= 1000 * 60 * 5;

  return (
    <div
      title="Pozostały czas sesji"
      data-testid="session-status-badge"
      className={`flex items-center gap-2 rounded-lg px-3 py-1 text-sm font-medium ${
        isWarning ? 'bg-red-100 text-red-700' : 'bg-white/20 text-white'
      }`}
    >
      <ClockIcon className="h-4 w-4" />
      <span data-testid="session-status-value" className="font-mono">
        {formatTimeRemaining(remainingMs)}
      </span>
      <button
        data-testid="session-refresh-btn"
        title="Odśwież sesję"
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="hover:opacity-70 disabled:opacity-40"
      >
        <ArrowClockwiseIcon
          className="h-4 w-4"
          style={isRefreshing ? { animation: 'spin 0.5s linear infinite' } : undefined}
        />
      </button>
    </div>
  );
}
