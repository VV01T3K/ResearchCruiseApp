import { type FeedbackContext, openFeedback, useCanSendFeedback } from '@/integrations/sentry/feedback';
import { cn } from '@/lib/utils';

export function FeedbackButton({ context, className }: { context: FeedbackContext; className?: string }) {
  if (!useCanSendFeedback()) return null;

  return (
    <button
      type="button"
      onClick={() => openFeedback(context)}
      className={cn(
        'shrink-0 rounded-sm text-sm font-medium underline-offset-2 hover:cursor-pointer hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden',
        className
      )}
    >
      Zgłoś problem
    </button>
  );
}
