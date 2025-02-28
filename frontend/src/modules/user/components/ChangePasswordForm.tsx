import { useForm } from '@tanstack/react-form';
import React from 'react';
import { z } from 'zod';

import { AppAlert } from '@/core/components/AppAlert';
import { AppButton } from '@/core/components/AppButton';
import { AppInput } from '@/core/components/inputs/AppInput';
import { getErrors } from '@/core/lib/utils';
import { useChangePasswordMutation } from '@/user/hooks/UserApiHooks';

const validationSchema = z
  .object({
    password: z.string().nonempty('To pole nie może być puste').or(z.literal('')),
    newPassword: z
      .string()
      .min(8, 'Hasło powinno mieć co najmniej 8 znaków')
      .regex(
        /\b(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}\b/,
        'Hasło powinno zawierać jedną dużą literę, jedną małą literę oraz cyfrę'
      )
      .or(z.literal('')),
    repeatedNewPassword: z.string().or(z.literal('')),
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
  const [result, setResult] = React.useState<'success' | 'error'>();
  const { mutateAsync } = useChangePasswordMutation({ setResult });
  const form = useForm({
    defaultValues: {
      password: '',
      newPassword: '',
      repeatedNewPassword: '',
    },
    validators: {
      onChange: validationSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      if (!value.password || !value.newPassword || !value.repeatedNewPassword) {
        throw new Error('Not all fields are filled despite validation');
      }

      await mutateAsync({
        password: value.password,
        newPassword: value.newPassword,
      }).catch(() => {});

      formApi.reset();
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  }

  return (
    <form className="grid grid-cols-2" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold">Zmiana Hasła</h2>
      <div className="space-y-4">
        <form.Field
          name="password"
          children={(field) => (
            <AppInput
              name={field.name}
              value={field.state.value}
              type="password"
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              errors={getErrors(field.state.meta)}
              label="Aktualne hasło"
              required
            />
          )}
        />

        <form.Field
          name="newPassword"
          children={(field) => (
            <AppInput
              name={field.name}
              value={field.state.value}
              type="password"
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              errors={getErrors(field.state.meta)}
              label="Nowe hasło"
              required
            />
          )}
        />

        <form.Field
          name="repeatedNewPassword"
          children={(field) => (
            <AppInput
              name={field.name}
              value={field.state.value}
              type="password"
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              errors={getErrors(field.state.meta)}
              label="Powtórz nowe hasło"
              required
            />
          )}
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
