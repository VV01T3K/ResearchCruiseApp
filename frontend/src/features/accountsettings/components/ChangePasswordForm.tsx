import { client } from '@core/helpers/api';
import { AppAlert } from '@core/components/AppAlert';
import { AppButton } from '@core/components/AppButton';
import { AppLabelInput } from '@core/components/AppLabelInput';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { z } from 'zod';

type ChangePasswordDto = {
  password: string;
  newPassword: string;
};
type PasswordChangeResult = 'success' | 'error';

const validationSchema = z
  .object({
    password: z.string().nonempty('To pole nie może być puste').or(z.literal('')),
    newPassword: z
      .string()
      .min(8, 'Hasło powinno mieć conajmniej 8 znaków')
      .regex(
        /\b(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}\b/,
        'Co najmniej 8 znaków w tym przynajmniej jedna duża litera, mała litera oraz cyfra'
      )
      .or(z.literal('')),
    repeatedNewPassword: z
      .string()
      .min(8, 'Hasło powinno mieć conajmniej 8 znaków')
      .regex(
        /\b(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}\b/,
        'Co najmniej 8 znaków w tym przynajmniej jedna duża litera, mała litera oraz cyfra'
      )
      .or(z.literal('')),
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
  const [changePasswordResult, setChangePasswordResult] = useState<PasswordChangeResult>();
  const changePasswordForm = useForm({
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

      await changePasswordMutation
        .mutateAsync({
          password: value.password,
          newPassword: value.newPassword,
        })
        .catch(() => {});

      formApi.reset();
    },
  });
  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordDto) => {
      return client.patch('/account/password', data);
    },
    onSuccess: () => {
      setChangePasswordResult('success');
    },
    onError: () => {
      setChangePasswordResult('error');
    },
  });

  return (
    <form
      className="grid grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        changePasswordForm.handleSubmit();
      }}
    >
      <h2 className="text-xl font-semibold">Zmiana Hasła</h2>

      <div className="space-y-4">
        <changePasswordForm.Field
          name="password"
          children={(field) => (
            <AppLabelInput
              name={field.name}
              value={field.state.value}
              type="password"
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={field.state.meta.errors.join(', ')}
              label="Aktualne hasło"
              required
            />
          )}
        />

        <changePasswordForm.Field
          name="newPassword"
          children={(field) => (
            <AppLabelInput
              name={field.name}
              value={field.state.value}
              type="password"
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={field.state.meta.errors.join(', ')}
              label="Nowe hasło"
              required
            />
          )}
        />

        <changePasswordForm.Field
          name="repeatedNewPassword"
          children={(field) => (
            <AppLabelInput
              name={field.name}
              value={field.state.value}
              type="password"
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={field.state.meta.errors.join(', ')}
              label="Powtórz nowe hasło"
              required
            />
          )}
        />

        <div className="mt-8">
          <changePasswordForm.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            key={changePasswordResult}
            children={([canSubmit, isSubmitting]) => (
              <AppButton type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
                Zmień hasło
              </AppButton>
            )}
          />
        </div>

        {changePasswordResult === 'success' && (
          <AppAlert variant="success" onClose={() => setChangePasswordResult(undefined)}>
            Hasło zostało zmienione
          </AppAlert>
        )}

        {changePasswordResult === 'error' && (
          <AppAlert variant="error" onClose={() => setChangePasswordResult(undefined)}>
            Wystąpił błąd podczas zmiany hasła (sprawdź, czy podałeś poprawne hasło).
          </AppAlert>
        )}
      </div>
    </form>
  );
}
