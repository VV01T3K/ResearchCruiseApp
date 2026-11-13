import { getProblemDetail } from '@/api/errors';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import React from 'react';
import { Anchor } from '@/components/shared/Link';
import { Loader } from '@/components/shared/layout/Loader';
import { useMutation } from '@tanstack/react-query';
import { confirmEmail } from '@/api/generated/endpoints/auth.gen';
import { Result } from '@/integrations/auth/types';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { ResultPanel } from '@/features/auth/components/ResultPanel';

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

  return (
    <AuthCard title="Potwierdzenie adresu e-mail">
      {result === 'success' ? (
        <ResultPanel variant="success" title="Email został potwierdzony" loginLink>
          Aby umożliwić Ci zalogowanie się, Biuro Armatora musi jeszcze zaakceptować Twoje konto
        </ResultPanel>
      ) : (
        <ResultPanel variant="danger" title="Błąd podczas potwierdzania emaila" loginLink>
          {errorMessage} W razie problemów napisz na{' '}
          <Anchor href="mailto:rejsy.help@ug.edu.pl">rejsy.help@ug.edu.pl</Anchor>
        </ResultPanel>
      )}
    </AuthCard>
  );
}
