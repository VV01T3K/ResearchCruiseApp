import ClockIcon from 'bootstrap-icons/icons/clock.svg?react';
import React from 'react';

type Props = {
  expirationDate: Date;
};

function getRemainingMs(expirationDate: Date): number {
  return expirationDate.getTime() - Date.now();
}

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

export function SessionStatusBadge({ expirationDate }: Props) {
  const [nowTs, setNowTs] = React.useState(() => Date.now());

  React.useEffect(() => {
    const remainingMs = expirationDate.getTime() - nowTs;
    if (remainingMs <= 0) {
      return;
    }

    const refreshEveryMs = remainingMs > 1000 * 60 * 60 ? 1000 * 30 : 1000;
    const timeoutId = setTimeout(() => setNowTs(Date.now()), refreshEveryMs);

    return () => clearTimeout(timeoutId);
  }, [expirationDate, nowTs]);

  const remainingMs = getRemainingMs(expirationDate);
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
    </div>
  );
}
