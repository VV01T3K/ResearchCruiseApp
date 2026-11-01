import { getErrorMessage } from '@/api/errors';
import { toast } from '@/components/shared/layout/toast';
import { createFileRoute, Navigate } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { CheckIcon, XIcon } from '@phosphor-icons/react';
import React from 'react';
import { Button } from '@/components/shared/Button';
import { Layout } from '@/components/shared/Layout';
import { Link } from '@/components/shared/Link';
import { Loader } from '@/components/shared/layout/Loader';
import { useMutation } from '@tanstack/react-query';
import { confirmEmail } from '@/api/generated/endpoints/auth.gen';
import { Result } from '@/integrations/auth/types';

export const Route = createFileRoute('/(auth)/confirm-email')({
  component: ConfirmEmailPage,
  beforeLoad: allowOnly.unauthenticated(),
  validateSearch: z.object({
    userId: z.guid().optional(),
    code: z.string().optional(),
  }),
});

function ConfirmEmailPage() {
  const { userId, code } = Route.useSearch();
  const [result, setResult] = React.useState<Result | undefined>(undefined);
  const { mutate } = useMutation({
    mutationFn: ({ userId, code }: { userId: string; code: string }) => confirmEmail({ userId, code }),
    onSuccess: () => setResult('success'),
    onError: (error) => {
      setResult('error');
      toast.error(getErrorMessage(error, 'Operacja nie powiodła się'));
    },
  });

  React.useEffect(() => {
    if (userId && code) {
      mutate({ userId, code });
    }
  }, [userId, code, mutate]);

  if (!userId || !code) {
    return <Navigate to="/" />;
  }

  if (!result) {
    return <Loader />;
  }

  const title = result === 'success' ? 'Email został potwierdzony' : 'Błąd podczas potwierdzania emaila';

  return (
    <Layout title={title} variant="narrow">
      <div className="flex flex-col items-center">
        <div className="h-60">
          {result === 'success' ? <CheckIcon className="text-success" /> : <XIcon className="text-danger" />}
        </div>
        <div className="text-center text-gray-600">
          {result === 'success' && (
            <>Aby umożliwić Ci zalogowanie się, Biuro Armatora musi jeszcze zaakceptować Twoje konto</>
          )}
          {result === 'error' && (
            <>
              Wystąpił błąd podczas potwierdzania emaila. Proszę skontaktować się z pomocą{' '}
              <Link href="mailto:rejsy.help@ug.edu.pl">rejsy.help@ug.edu.pl</Link>
            </>
          )}
        </div>
      </div>
      <Button type="link" href="/login" className="mt-6 w-full">
        Wróć do logowania
      </Button>
    </Layout>
  );
}
