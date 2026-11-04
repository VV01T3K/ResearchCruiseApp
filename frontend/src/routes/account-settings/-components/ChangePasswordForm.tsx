import { getErrorMessage } from '@/api/errors';
import { toast } from '@/components/shared/layout/toast';
import type { ChangePasswordRequest } from '@/api/generated/schemas';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import { navigateToFirstError } from '@/integrations/tanstack/form/errors';
import React from 'react';
import { z } from 'zod';

import { Alert } from '@/components/shared/Alert';
import { Button } from '@/components/shared/Button';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { useChangeCurrentUserPassword } from '@/api/generated/endpoints/users.gen';

const validationSchema = z
  .object({
    password: z.string().nonempty('To pole nie może być puste'),
    newPassword: z
      .string()
      .min(8, 'Hasło powinno mieć co najmniej 8 znaków')
      .regex(
        /\b(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}\b/,
        'Hasło powinno zawierać jedną dużą literę, jedną małą literę oraz cyfrę'
      ),
    repeatedNewPassword: z.string().nonempty('To pole nie może być puste'),
  })
  .superRefine(({ newPassword, repeatedNewPassword }, ctx) => {
    if (newPassword !== repeatedNewPassword) {
      return ctx.addIssue({
        code: 'custom',
        message: 'Hasła nie są takie same',
        path: ['repeatedNewPassword'],
      });
    }
  });

export function ChangePasswordForm() {
  const [result, setResult] = React.useState<'error'>();
  const { mutateAsync } = useChangeCurrentUserPassword({ mutation: { meta: { handlesError: true } } });
  const form = useAppForm({
    defaultValues: {
      password: '',
      newPassword: '',
      repeatedNewPassword: '',
    },
    validationLogic: formValidationLogic,
    validators: {
      onDynamic: validationSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      trackFormSubmit('change-password', 'valid', formApi.state);

      try {
        await mutateAsync({
          data: { password: value.password, newPassword: value.newPassword } satisfies ChangePasswordRequest,
        });
      } catch (error) {
        setResult('error');
        toast.error(getErrorMessage(error, 'Operacja nie powiodła się'));
        return;
      }
      setResult(undefined);
      toast.success('Hasło zostało zmienione. Zaloguj się nowym hasłem.');
      formApi.reset();
    },
    onSubmitInvalid: ({ formApi }) => {
      trackFormSubmit('change-password', 'invalid', formApi.state);
      navigateToFirstError();
    },
  });

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    void form.handleSubmit();
  }

  return (
    <form className="grid grid-cols-2" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold">Zmiana Hasła</h2>
      <div className="space-y-4">
        <form.AppField name="password">
          {(field) => <field.TextField type="password" label="Aktualne hasło" />}
        </form.AppField>

        <form.AppField name="newPassword">
          {(field) => <field.TextField type="password" label="Nowe hasło" />}
        </form.AppField>

        <form.AppField name="repeatedNewPassword">
          {(field) => <field.TextField type="password" label="Powtórz nowe hasło" />}
        </form.AppField>

        <div className="mt-8">
          <form.Subscribe selector={(state) => state.isSubmitting} key={result}>
            {(isSubmitting) => (
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Zmień hasło
              </Button>
            )}
          </form.Subscribe>
        </div>

        {result === 'error' && (
          <Alert variant="danger" onClose={() => setResult(undefined)}>
            Wystąpił błąd podczas zmiany hasła (sprawdź, czy podałeś poprawne hasło).
          </Alert>
        )}
      </div>
    </form>
  );
}
