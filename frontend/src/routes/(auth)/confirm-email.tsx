import { getProblemDetail } from '@/api/errors';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { CheckIcon, WarningCircleIcon } from '@phosphor-icons/react';
import React from 'react';
import { Button } from '@/components/shared/Button';
import { Layout } from '@/components/shared/Layout';
import { Link } from '@/components/shared/Link';
import { Loader } from '@/components/shared/layout/Loader';
import { useMutation } from '@tanstack/react-query';
import { confirmEmail } from '@/api/generated/endpoints/auth.gen';

export const Route = createFileRoute('/(auth)/confirm-email')({
  component: ConfirmEmailPage,
  beforeLoad: allowOnly.unauthenticated(),
  validateSearch: z.object({
    userId: z.guid().optional().catch(undefined),
    code: z.string().optional().catch(undefined),
  }),
});

const invalidLink = 'Link potwierdzający jest nieprawidłowy lub wygasł.';

function ConfirmEmailPage() {
  const { userId, code } = Route.useSearch();
  const { mutate, isSuccess, error } = useMutation({
    mutationFn: ({ userId, code }: { userId: string; code: string }) => confirmEmail({ userId, code }),
    meta: { handlesError: true },
  });
  const hasLink = !!userId && !!code;

  React.useEffect(() => {
    if (userId && code) {
      mutate({ userId, code });
    }
  }, [userId, code, mutate]);

  if (hasLink && !isSuccess && !error) {
    return <Loader />;
  }

  const title = isSuccess ? 'Email został potwierdzony' : 'Błąd podczas potwierdzania emaila';

  return (
    <Layout title={title} variant="narrow">
      <div className="flex flex-col items-center">
        <div className="mb-4 h-28">
          {isSuccess ? <CheckIcon className="text-success" /> : <WarningCircleIcon className="text-danger" />}
        </div>
        <div className="text-center text-gray-600">
          {isSuccess ? (
            <>Aby umożliwić Ci zalogowanie się, Biuro Armatora musi jeszcze zaakceptować Twoje konto</>
          ) : (
            <>
              {getProblemDetail(error, invalidLink)} W razie problemów napisz na{' '}
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
