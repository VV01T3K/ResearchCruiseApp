import { getRouteApi, Navigate } from '@tanstack/react-router';
import CheckLgIcon from 'bootstrap-icons/icons/check-lg.svg?react';
import XLgIcon from 'bootstrap-icons/icons/x-lg.svg?react';
import React from 'react';

import { AppButton } from '@/core/components/AppButton';
import { AppLayout } from '@/core/components/AppLayout';
import { AppLink } from '@/core/components/AppLink';
import { AppLoader } from '@/core/components/AppLoader';
import { useConfirmEmailMutation } from '@/user/hooks/UserApiHooks';
import { Result } from '@/user/models/Results';

export function ConfirmEmailPage() {
  const { userId, code } = getRouteApi('/confirmemail').useSearch();
  const [result, setResult] = React.useState<Result | undefined>(undefined);
  const { mutate } = useConfirmEmailMutation({ setResult });

  React.useEffect(() => {
    if (userId && code) {
      mutate({ userId, code });
    }
  }, [userId, code, mutate]);

  if (!userId || !code) {
    return <Navigate to="/" />;
  }

  if (!result) {
    return <AppLoader />;
  }

  const title = result === 'success' ? 'Email został potwierdzony' : 'Błąd podczas potwierdzania emaila';

  return (
    <AppLayout title={title} variant="narrow">
      <div className="flex flex-col items-center">
        <div className="h-60">
          {result === 'success' ? <CheckLgIcon className="text-success" /> : <XLgIcon className="text-danger" />}
        </div>
        <div className="text-gray-600 text-center">
          {result === 'success' && (
            <>Aby umożliwić Ci zalogowanie się, Biuro Armatora musi jeszcze zaakceptować Twoje konto</>
          )}
          {result === 'error' && (
            <>
              Wystąpił błąd podczas potwierdzania emaila. Proszę skontaktować się z pomocą{' '}
              <AppLink href="mailto:help@rejsy.ug.edu.pl">help@rejsy.ug.edu.pl</AppLink>
            </>
          )}
        </div>
      </div>
      <AppButton href="/" className="w-full mt-6">
        Wróć do logowania
      </AppButton>
    </AppLayout>
  );
}
