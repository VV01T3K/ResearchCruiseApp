import { getProblemDetail } from '@/api/errors';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { CheckIcon, WarningCircleIcon } from '@phosphor-icons/react';
import React from 'react';
import { ButtonLink } from '@/components/shared/Button';
import { Layout } from '@/components/shared/Layout';
import { Anchor } from '@/components/shared/Link';
import { Loader } from '@/components/shared/layout/Loader';
import { useMutation } from '@tanstack/react-query';
import { confirmEmail } from '@/api/generated/endpoints/auth.gen';
import { Result } from '@/integrations/auth/types';

export const Route = createFileRoute('/(auth)/confirm-email')({
  component: ConfirmEmailPage,
  beforeLoad: allowOnly.unauthenticated(),
  validateSearch: z.object({
    userId: z.guid().optional().catch(undefined),
    code: z.string().optional().catch(undefined),
  }),
});

function ConfirmEmailPage() {
  const { userId, code } = Route.useSearch();
  const [result, setResult] = React.useState<Result | undefined>(undefined);
  const [errorMessage, setErrorMessage] = React.useState('Link potwierdzający jest nieprawidłowy lub wygasł.');
  const { mutate } = useMutation({
    mutationFn: ({ userId, code }: { userId: string; code: string }) => confirmEmail({ userId, code }),
    onSuccess: () => setResult('success'),
    onError: (error) => {
      setErrorMessage(getProblemDetail(error, 'Operacja nie powiodła się.'));
      setResult('error');
    },
  });

  React.useEffect(() => {
    if (userId && code) {
      mutate({ userId, code });
    }
  }, [userId, code, mutate]);

  if (userId && code && !result) {
    return <Loader />;
  }

  const title = result === 'success' ? 'Email został potwierdzony' : 'Błąd podczas potwierdzania emaila';

  return (
    <Layout title={title} variant="narrow">
      <div className="flex flex-col items-center">
        <div className="h-60">
          {result === 'success' ? (
            <CheckIcon className="text-success" />
          ) : (
            <WarningCircleIcon className="text-danger" />
          )}
        </div>
        <div className="text-center text-neutral-600">
          {result === 'success' && (
            <>Aby umożliwić Ci zalogowanie się, Biuro Armatora musi jeszcze zaakceptować Twoje konto</>
          )}
          {result !== 'success' && (
            <>
              {errorMessage} W razie problemów napisz na{' '}
              <Anchor href="mailto:rejsy.help@ug.edu.pl">rejsy.help@ug.edu.pl</Anchor>
            </>
          )}
        </div>
      </div>
      <ButtonLink to="/login" className="mt-6 w-full">
        Wróć do logowania
      </ButtonLink>
    </Layout>
  );
}
