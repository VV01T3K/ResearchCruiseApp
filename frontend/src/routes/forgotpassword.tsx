import { createFileRoute } from '@tanstack/react-router';

import { useForm } from '@tanstack/react-form';
import React from 'react';
import { z } from 'zod';

import { AppButton } from '@/components/AppButton';
import { AppLayout } from '@/components/AppLayout';
import { AppLink } from '@/components/AppLink';
import { AppFloatingLabelInput } from '@/components/inputs/AppFloatingLabelInput';
import { useForgotPasswordMutation } from '@/features/user/hooks/UserApiHooks';
import { Result } from '@/features/user/models/Results';
import { allowOnly } from '@/lib/guards';
import { getErrors } from '@/lib/utils';

export const Route = createFileRoute('/forgotpassword')({
  component: ForgotPasswordPage,
  beforeLoad: allowOnly.unauthenticated(),
});

const validationSchema = z.object({
  email: z.email('Niepoprawny adres e-mail').or(z.literal('')),
});

function ForgotPasswordPage() {
  const [result, setResult] = React.useState<Result | undefined>(undefined);
  const [email, setEmail] = React.useState<string | undefined>(undefined);
  const { mutateAsync } = useForgotPasswordMutation({ setResult });
  const form = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onChange: validationSchema,
    },
    onSubmit: async ({ value }) => {
      if (!value.email) {
        throw new Error('Not all fields are filled despite validation');
      }

      setResult(undefined);
      await mutateAsync(value.email, {
        onSuccess: async () => {
          setEmail(value.email);
        },
      }).catch(() => {});
    },
  });

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  }

  if (result === 'success') {
    return (
      <AppLayout title="Przywracanie hasła" variant="narrow">
        <p className="text-lg">
          Link do resetowania hasła został wysłany na adres: <span className="font-bold text-primary">{email}</span>
          <AppButton type="link" href="/login" className="mt-8 w-full">
            Wróć do logowania
          </AppButton>
        </p>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Przywracanie hasła" variant="narrow">
      <form className="px-4" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <form.Field
            name="email"
            children={(field) => (
              <AppFloatingLabelInput
                name={field.name}
                value={field.state.value}
                type="email"
                onBlur={field.handleBlur}
                onChange={field.handleChange}
                errors={getErrors(field.state.meta)}
                label="E-mail"
              />
            )}
          />
        </div>

        <div className="mt-8">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <AppButton type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
                Przypomnij hasło
              </AppButton>
            )}
          />
        </div>

        <div className="!mt-8 flex flex-wrap items-center justify-end">
          <AppLink href="/login">Powrót do logowania</AppLink>
        </div>
      </form>
    </AppLayout>
  );
}
