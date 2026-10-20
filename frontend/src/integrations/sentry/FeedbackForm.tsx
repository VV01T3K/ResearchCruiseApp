import { z } from 'zod';

import { AppButton } from '@/components/shared/AppButton';
import { toast } from '@/components/shared/layout/toast';
import { type FeedbackContext, sendFeedback } from '@/integrations/sentry/feedback';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import { useCurrentUser } from '@/integrations/tanstack/query/auth';

const validationSchema = z.object({
  email: z.email('Niepoprawny adres e-mail'),
  message: z.string().trim().nonempty('Opis problemu nie może być pusty'),
});

type Props = {
  context: FeedbackContext;
  close: () => void;
};
export function FeedbackForm({ context, close }: Props) {
  const form = useAppForm({
    defaultValues: { email: useCurrentUser()?.email ?? '', message: '' },
    validationLogic: formValidationLogic,
    validators: { onDynamic: validationSchema },
    onSubmit: async ({ value }) => {
      try {
        await sendFeedback(context, value);
        close();
        toast.success('Dziękujemy za zgłoszenie!');
      } catch {
        toast.error('Nie udało się wysłać zgłoszenia. Spróbuj ponownie lub napisz na rejsy.help@ug.edu.pl.');
      }
    },
  });

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    void form.handleSubmit();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <form.AppField
          name="message"
          children={(field) => (
            <field.TextField
              type="textarea"
              label="Opis problemu"
              placeholder="Co się stało? Czego się spodziewano?"
              className="h-40"
              showRequiredAsterisk
            />
          )}
        />
        <form.AppField
          name="email"
          children={(field) => <field.TextField type="email" label="Adres e-mail do kontaktu" showRequiredAsterisk />}
        />
      </div>
      <form.Subscribe
        selector={(state) => state.isSubmitting}
        children={(isSubmitting) => (
          <AppButton type="submit" className="mt-8 w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Wysyłanie...' : 'Wyślij zgłoszenie'}
          </AppButton>
        )}
      />
    </form>
  );
}
