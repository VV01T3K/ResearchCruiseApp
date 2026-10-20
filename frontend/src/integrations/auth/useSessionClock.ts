import React from 'react';

export function subscribeToPageResume(onResume: () => void): () => void {
  const handleResume = () => {
    if (document.visibilityState === 'visible') onResume();
  };
  document.addEventListener('visibilitychange', handleResume);
  window.addEventListener('focus', handleResume);
  return () => {
    document.removeEventListener('visibilitychange', handleResume);
    window.removeEventListener('focus', handleResume);
  };
}

export function useSessionRemainingMs(expirationDate: Date, getTickMs: (remainingMs: number) => number): number {
  const [nowTs, setNowTs] = React.useState(() => Date.now());
  const remainingMs = expirationDate.getTime() - nowTs;
  const tickMs = remainingMs > 0 ? getTickMs(remainingMs) : undefined;

  React.useEffect(() => subscribeToPageResume(() => setNowTs(Date.now())), []);

  React.useEffect(() => {
    if (tickMs === undefined) return;
    const timeoutId = setTimeout(() => setNowTs(Date.now()), tickMs);
    return () => clearTimeout(timeoutId);
  }, [tickMs, nowTs]);

  return remainingMs;
}
