import { ChangePasswordRequest } from '@/api/generated/schemas';
import { formContract } from '@/integrations/tanstack/form/schema';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import React from 'react';
import { z } from 'zod';

import { AppAlert } from '@/components/shared/AppAlert';
import { AppButton } from '@/components/shared/AppButton';
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
  })
  .transform((value): z.input<typeof ChangePasswordRequest> => value)
  .pipe(formContract(ChangePasswordRequest));

export function ChangePasswordForm() {
  const [result, setResult] = React.useState<'success' | 'error'>();
  const { mutateAsync } = useChangeCurrentUserPassword({
    mutation: {
      onSuccess: () => setResult('success'),
      onError: () => setResult('error'),
    },
  });
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

      await mutateAsync({
        data: validationSchema.parse(value),
      });

      formApi.reset();
    },
    onSubmitInvalid: ({ formApi }) => {
      trackFormSubmit('change-password', 'invalid', formApi.state);
    },
  });

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    void form.handleSubmit().catch(() => {});
  }

  return (
    <form className="grid grid-cols-2" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold">Zmiana Hasła</h2>
      <div className="space-y-4">
        <form.AppField
          name="password"
          children={(field) => <field.TextField type="password" label="Aktualne hasło" />}
        />

        <form.AppField
          name="newPassword"
          children={(field) => <field.TextField type="password" label="Nowe hasło" />}
        />

        <form.AppField
          name="repeatedNewPassword"
          children={(field) => <field.TextField type="password" label="Powtórz nowe hasło" />}
        />

        <div className="mt-8">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            key={result}
            children={([canSubmit, isSubmitting]) => (
              <AppButton type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
                Zmień hasło
              </AppButton>
            )}
          />
        </div>

        {result === 'success' && (
          <AppAlert variant="success" onClose={() => setResult(undefined)}>
            Hasło zostało zmienione
          </AppAlert>
        )}

        {result === 'error' && (
          <AppAlert variant="danger" onClose={() => setResult(undefined)}>
            Wystąpił błąd podczas zmiany hasła (sprawdź, czy podałeś poprawne hasło).
          </AppAlert>
        )}
      </div>
    </form>
  );
}
