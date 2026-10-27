import { type ReactNode, useEffect, useState } from 'react';

import { refreshSession } from '@/integrations/auth/session';
import { SessionExpirationWarning } from '@/components/shared/SessionExpirationWarning';
import { setSentryUser } from '@/integrations/sentry/client';
import { useAuthDetails, useCurrentUser, useSessionActions } from '@/integrations/tanstack/query/auth';

let hideForReload: ((hidden: boolean) => void) | undefined;

export function reloadForAccountChange() {
  if (hideForReload) hideForReload(true);
  else location.reload();
}

export function AuthSession({ children }: { children: ReactNode }) {
  const currentUser = useCurrentUser();
  const { refresh, signOut } = useSessionActions();
  const authDetails = useAuthDetails();
  const [accountChanged, setAccountChanged] = useState(false);

  useEffect(() => {
    hideForReload = setAccountChanged;
    return () => {
      hideForReload = undefined;
    };
  }, []);

  useEffect(() => {
    if (accountChanged) location.reload();
  }, [accountChanged]);

  useEffect(() => {
    const interval = setInterval(
      () => {
        if (authDetails) void refreshSession().catch(() => {});
      },
      1000 * 60 * 30
    );
    return () => clearInterval(interval);
  }, [authDetails]);

  useEffect(() => {
    setSentryUser(currentUser ?? undefined);
  }, [currentUser]);

  useEffect(() => {
    if (!authDetails?.refreshTokenExpirationDate) return;

    const checkExpiration = () => {
      if (Date.now() >= Date.parse(authDetails.refreshTokenExpirationDate)) void signOut({ expired: true });
    };
    checkExpiration();
    const interval = setInterval(checkExpiration, 5000);
    return () => clearInterval(interval);
  }, [authDetails?.refreshTokenExpirationDate, signOut]);

  if (accountChanged) return null;

  return (
    <>
      {children}
      {authDetails?.refreshTokenExpirationDate && (
        <SessionExpirationWarning
          expirationDate={new Date(authDetails.refreshTokenExpirationDate)}
          onRefreshSession={refresh}
          onSignOut={() => signOut()}
        />
      )}
    </>
  );
}
