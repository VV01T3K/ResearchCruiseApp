import { getErrorMessage, getProblemDetail } from '@/api/errors';
import { toast } from '@/components/shared/layout/toast';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { CheckIcon, XIcon } from '@phosphor-icons/react';
import React from 'react';
import { Button } from '@/components/shared/Button';
import { Layout } from '@/components/shared/Layout';
import { Link } from '@/components/shared/Link';
import { Loader } from '@/components/shared/layout/Loader';
import { useMutation } from '@tanstack/react-query';
import { confirmEmail, useResendConfirmationEmail } from '@/api/generated/endpoints/auth.gen';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import { navigateToFirstError } from '@/integrations/tanstack/form/errors';
import { trackFormSubmit } from '@/integrations/sentry/client';

export const Route = createFileRoute('/(auth)/confirm-email')({
  component: ConfirmEmailPage,
  beforeLoad: allowOnly.unauthenticated(),
  validateSearch: z.object({
    userId: z.guid().optional().catch(undefined),
    code: z.string().optional().catch(undefined),
  }),
});

const invalidLink = 'Link potwierdzający jest nieprawidłowy lub wygasł. Poproś o nowy link.';

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
        <div className="h-60">
          {isSuccess ? <CheckIcon className="text-success" /> : <XIcon className="text-danger" />}
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
      {!isSuccess && <ResendConfirmationForm />}
      <Button type="link" href="/login" variant={isSuccess ? 'primary' : 'primaryOutline'} className="mt-6 w-full">
        Wróć do logowania
      </Button>
    </Layout>
  );
}

function ResendConfirmationForm() {
  const { mutateAsync, isSuccess } = useResendConfirmationEmail({ mutation: { meta: { handlesError: true } } });
  const form = useAppForm({
    defaultValues: { email: '' },
    validationLogic: formValidationLogic,
    validators: { onDynamic: z.object({ email: z.email('Niepoprawny adres e-mail') }) },
    onSubmit: async ({ value, formApi }) => {
      trackFormSubmit('resend-confirmation', 'valid', formApi.state);
      try {
        await mutateAsync({ data: { email: value.email } });
      } catch (error) {
        toast.error(getErrorMessage(error, 'Nie udało się wysłać wiadomości'));
      }
    },
    onSubmitInvalid: ({ formApi }) => {
      trackFormSubmit('resend-confirmation', 'invalid', formApi.state);
      navigateToFirstError();
    },
  });

  if (isSuccess) {
    return <p className="mt-6 text-center text-gray-600">Jeśli konto istnieje, wysłaliśmy na nie nowy link.</p>;
  }

  return (
    <form
      noValidate
      className="mt-6 px-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <form.AppField name="email">{(field) => <field.FloatingTextField type="email" label="E-mail" />}</form.AppField>
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
            Wyślij nowy link
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
