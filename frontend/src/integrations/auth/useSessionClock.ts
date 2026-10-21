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
  const expiresAt = expirationDate.getTime();
  const [nowTs, setNowTs] = React.useState(() => Date.now());
  const remainingMs = expiresAt - nowTs;
  const tickMs = remainingMs > 0 ? getTickMs(remainingMs) : undefined;

  // oxlint-disable-next-line react/set-state-in-effect
  React.useLayoutEffect(() => setNowTs(Date.now()), [expiresAt]);

  React.useEffect(() => subscribeToPageResume(() => setNowTs(Date.now())), []);

  React.useEffect(() => {
    if (tickMs === undefined) return;
    const timeoutId = setTimeout(() => setNowTs(Date.now()), tickMs);
    return () => clearTimeout(timeoutId);
  }, [tickMs, nowTs]);

  return remainingMs;
}
