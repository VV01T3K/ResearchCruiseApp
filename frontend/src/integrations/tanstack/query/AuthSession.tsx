import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { type ReactNode, useEffect, useState } from 'react';

import { accountId, refreshSession, subscribeAuthDetails } from '@/integrations/auth/session';
import { SessionExpirationWarning } from '@/components/shared/SessionExpirationWarning';
import { setSentryUser } from '@/integrations/sentry/client';
import {
  clearAccountQueries,
  useAuthDetails,
  useCurrentUser,
  useSessionActions,
} from '@/integrations/tanstack/query/auth';

export function AuthSession({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();
  const { refresh, signOut } = useSessionActions();
  const authDetails = useAuthDetails();
  const [accountChanged, setAccountChanged] = useState(false);

  useEffect(
    () =>
      subscribeAuthDetails((details, previous) => {
        if (!details) {
          clearAccountQueries(queryClient);
          void router.invalidate();
        } else if (previous && accountId(previous) !== accountId(details)) {
          queryClient.clear();
          setAccountChanged(true);
        }
      }),
    [queryClient, router]
  );

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
      if (Date.now() >= Date.parse(authDetails.refreshTokenExpirationDate)) void signOut();
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
          onSignOut={signOut}
        />
      )}
    </>
  );
}
