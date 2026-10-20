import { type FeedbackContext, isFeedbackAvailable, openFeedback } from '@/integrations/sentry/feedback';
import { cn } from '@/lib/utils';

export function FeedbackButton({ context, className }: { context: FeedbackContext; className?: string }) {
  if (!isFeedbackAvailable()) return null;

  return (
    <button
      type="button"
      onClick={() => void openFeedback(context)}
      className={cn('shrink-0 text-sm font-medium underline-offset-2 hover:cursor-pointer hover:underline', className)}
    >
      Zgłoś problem
    </button>
  );
}
