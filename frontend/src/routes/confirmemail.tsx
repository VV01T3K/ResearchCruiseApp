import { AppPage } from '@core/components';
import { AppButton } from '@core/components/AppButton';
import { AppLink } from '@core/components/AppLink';
import { AppLoader } from '@core/components/AppLoader';
import { allowOnly, client } from '@core/helpers';
import { Result } from '@core/models';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Navigate } from '@tanstack/react-router';
import CheckLgIcon from 'bootstrap-icons/icons/check-lg.svg?react';
import XLgIcon from 'bootstrap-icons/icons/x-lg.svg?react';
import React from 'react';
import { z } from 'zod';

export const Route = createFileRoute('/confirmemail')({
  component: ConfirmEmail,
  beforeLoad: allowOnly.unauthenticated,
  validateSearch: z.object({
    userId: z.string().uuid().optional(),
    code: z.string().optional(),
  }),
});

function ConfirmEmail() {
  const { userId, code } = Route.useSearch();
  const [result, setResult] = React.useState<Result | undefined>(undefined);

  const confirmEmailMutation = useMutation({
    mutationFn: async ({ userId, code }: { userId: string; code: string }) => {
      return await client.get('/account/emailConfirmation', {
        params: {
          userId,
          code,
        },
      });
    },
    onSuccess: () => {
      setResult('success');
    },
    onError: () => {
      setResult('error');
    },
  });

  React.useEffect(() => {
    if (userId && code) {
      confirmEmailMutation.mutate({ userId, code });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, code]);

  if (!userId || !code) {
    return <Navigate to="/" />;
  }

  if (!result) {
    return <AppLoader />;
  }

  const title = result === 'success' ? 'Email został potwierdzony' : 'Błąd podczas potwierdzania emaila';

  return (
    <AppPage title={title} variant="narrow">
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
              <AppLink to="mailto:help@rejsy.ug.edu.pl">help@rejsy.ug.edu.pl</AppLink>
            </>
          )}
        </div>
      </div>
      <AppButton link to="/" className="w-full mt-6">
        Wróć do logowania
      </AppButton>
    </AppPage>
  );
}
