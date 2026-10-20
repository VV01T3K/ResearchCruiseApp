import ChatLeftTextIcon from 'bootstrap-icons/icons/chat-left-text.svg?react';

import { AppModal } from '@/components/shared/AppModal';
import { closeFeedback, openFeedback, useCanSendFeedback, useFeedbackState } from '@/integrations/sentry/feedback';
import { FeedbackForm } from '@/integrations/sentry/FeedbackForm';

export function FeedbackTab() {
  const { open, context } = useFeedbackState();
  if (!useCanSendFeedback()) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => openFeedback({ origin: 'layout' })}
        className="fixed top-1/2 right-0 z-40 flex -translate-y-1/2 rotate-180 items-center gap-1.5 rounded-r-md bg-primary/80 px-1 py-2 text-xs text-white shadow-md [writing-mode:vertical-rl] hover:cursor-pointer hover:bg-primary focus-visible:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        data-testid="feedback-tab"
      >
        <ChatLeftTextIcon className="h-3 w-3 rotate-90" aria-hidden />
        Zgłoś problem
      </button>
      <AppModal title="Zgłoś problem" isOpen={open} onClose={closeFeedback}>
        <FeedbackForm context={context} close={closeFeedback} />
      </AppModal>
    </>
  );
}
