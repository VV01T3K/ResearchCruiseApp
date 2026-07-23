import { createFileRoute, Navigate } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { Check as CheckLgIcon } from 'lucide-react';
import { X as XLgIcon } from 'lucide-react';
import React from 'react';
import { AppButton } from '@/components/shared/AppButton';
import { AppLayout } from '@/components/shared/AppLayout';
import { AppLink } from '@/components/shared/AppLink';
import { AppLoader } from '@/components/shared/layout/AppLoader';
import { useMutation } from '@tanstack/react-query';
import { confirmEmail } from '@/api/generated/endpoints/auth.gen';
import { Result } from '@/types/user';

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
    onError: () => setResult('error'),
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
    return <AppLoader />;
  }

  const title = result === 'success' ? 'Email został potwierdzony' : 'Błąd podczas potwierdzania emaila';

  return (
    <AppLayout title={title} variant="narrow">
      <div className="flex flex-col items-center">
        <div className="h-60">
          {result === 'success' ? <CheckLgIcon className="text-success" /> : <XLgIcon className="text-danger" />}
        </div>
        <div className="text-center text-gray-600">
          {result === 'success' && (
            <>Aby umożliwić Ci zalogowanie się, Biuro Armatora musi jeszcze zaakceptować Twoje konto</>
          )}
          {result === 'error' && (
            <>
              Wystąpił błąd podczas potwierdzania emaila. Proszę skontaktować się z pomocą{' '}
              <AppLink href="mailto:rejsy.help@ug.edu.pl">rejsy.help@ug.edu.pl</AppLink>
            </>
          )}
        </div>
      </div>
      <AppButton type="link" href="/login" className="mt-6 w-full">
        Wróć do logowania
      </AppButton>
    </AppLayout>
  );
}
