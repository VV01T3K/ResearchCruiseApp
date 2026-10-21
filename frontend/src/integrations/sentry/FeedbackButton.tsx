import { type FeedbackContext, openFeedback, useCanSendFeedback } from '@/integrations/sentry/feedback';
import { cn } from '@/lib/utils';

export function FeedbackButton({ context, className }: { context: FeedbackContext; className?: string }) {
  if (!useCanSendFeedback()) return null;

  return (
    <button
      type="button"
      onClick={() => openFeedback(context)}
      className={cn('shrink-0 text-sm font-medium underline-offset-2 hover:cursor-pointer hover:underline', className)}
    >
      Zgłoś problem
    </button>
  );
}
