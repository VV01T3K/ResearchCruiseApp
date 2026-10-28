import { useRef, useState } from 'react';
import { z } from 'zod';

import { AppButton } from '@/components/shared/AppButton';
import { toast } from '@/components/shared/layout/toast';
import { type FeedbackAttachment, MAX_ATTACHMENTS, readAttachments } from '@/integrations/sentry/attachments';
import { type FeedbackContext, sendFeedback } from '@/integrations/sentry/feedback';
import { FeedbackAttachments } from '@/integrations/sentry/FeedbackAttachments';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import { useCurrentUser } from '@/integrations/tanstack/query/auth';

const validationSchema = z.object({
  message: z.string().trim().nonempty('Opis problemu nie może być pusty'),
  attachments: z.array(z.custom<FeedbackAttachment>()),
});

type Props = {
  context: FeedbackContext;
  close: () => void;
};
export function FeedbackForm({ context, close }: Props) {
  const email = useCurrentUser()?.email;
  const [attachmentErrors, setAttachmentErrors] = useState<string[]>([]);
  const [pendingReads, setPendingReads] = useState(0);
  const draft = useRef(0);
  const form = useAppForm({
    defaultValues: { message: '', attachments: [] as FeedbackAttachment[] },
    validationLogic: formValidationLogic,
    validators: { onDynamic: validationSchema },
    onSubmit: async ({ value }) => {
      try {
        await sendFeedback(context, { message: value.message, email, attachments: value.attachments });
        close();
        draft.current++;
        form.reset();
        setAttachmentErrors([]);
        toast.success('Dziękujemy za zgłoszenie!');
      } catch {
        toast.error('Nie udało się wysłać zgłoszenia. Spróbuj ponownie lub napisz na rejsy.help@ug.edu.pl.');
      }
    },
  });

  async function addAttachments(files: File[]) {
    if (files.length === 0) return;
    const readDraft = draft.current;
    setPendingReads((count) => count + 1);
    const { attachments, errors } = await readAttachments(files, form.getFieldValue('attachments').length).finally(() =>
      setPendingReads((count) => count - 1)
    );
    if (draft.current !== readDraft) return;
    setAttachmentErrors(errors);
    form.setFieldValue('attachments', (current) => [...current, ...attachments].slice(0, MAX_ATTACHMENTS));
  }

  function handlePaste(e: React.ClipboardEvent<HTMLFormElement>) {
    const files = Array.from(e.clipboardData.files);
    if (files.length === 0) return;
    e.preventDefault();
    void addAttachments(files);
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    void form.handleSubmit();
  }

  return (
    <form onSubmit={handleSubmit} onPaste={handlePaste} className="flex min-h-0 flex-1 flex-col">
      <div className="-mx-1 min-h-0 space-y-4 overflow-y-auto px-1 pb-1">
        <form.AppField name="message">
          {(field) => (
            <field.TextField
              type="textarea"
              label="Opis problemu"
              placeholder="Co się stało? Czego się spodziewano?"
              className="h-28"
              showRequiredAsterisk
            />
          )}
        </form.AppField>
        <form.Subscribe selector={(state) => state.values.attachments}>
          {(attachments) => (
            <FeedbackAttachments
              attachments={attachments}
              errors={attachmentErrors}
              onAdd={(files) => void addAttachments(files)}
              onRemove={(id) => {
                setAttachmentErrors([]);
                form.setFieldValue('attachments', (current) => current.filter((attachment) => attachment.id !== id));
              }}
            />
          )}
        </form.Subscribe>
      </div>
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <AppButton type="submit" className="mt-3 w-full shrink-0" disabled={isSubmitting || pendingReads > 0}>
            {isSubmitting ? 'Wysyłanie...' : 'Wyślij zgłoszenie'}
          </AppButton>
        )}
      </form.Subscribe>
    </form>
  );
}
