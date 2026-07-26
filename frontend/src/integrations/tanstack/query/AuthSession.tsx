import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';

import { refreshSession, subscribeAuthDetails } from '@/api/client/auth-session';
import { getGetCurrentUserQueryKey } from '@/api/generated/endpoints/users.gen';
import { SessionExpirationWarning } from '@/components/shared/SessionExpirationWarning';
import { setSentryUser } from '@/integrations/sentry/client';
import { useAuthDetails, useCurrentUser, useSessionActions } from '@/integrations/tanstack/query/auth';

export function AuthSession() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();
  const { refresh, signOut } = useSessionActions();
  const authDetails = useAuthDetails();

  useEffect(
    () =>
      subscribeAuthDetails((details) => {
        if (!details) {
          queryClient.setQueryData(getGetCurrentUserQueryKey(), null);
          void router.invalidate();
        }
      }),
    [queryClient, router]
  );

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
      if (new Date() >= authDetails.refreshTokenExpirationDate) void signOut();
    };
    checkExpiration();
    const interval = setInterval(checkExpiration, 5000);
    return () => clearInterval(interval);
  }, [authDetails?.refreshTokenExpirationDate, signOut]);

  if (!authDetails?.refreshTokenExpirationDate) return null;

  return (
    <SessionExpirationWarning
      expirationDate={authDetails.refreshTokenExpirationDate}
      onRefreshSession={refresh}
      onSignOut={signOut}
    />
  );
}
