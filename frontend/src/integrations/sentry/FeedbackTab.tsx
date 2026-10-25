import { Dialog } from '@base-ui/react/dialog';
import { XIcon } from '@phosphor-icons/react';
import { useRef } from 'react';

import { closeFeedback, openFeedback, useCanSendFeedback, useFeedbackState } from '@/integrations/sentry/feedback';
import { FeedbackForm } from '@/integrations/sentry/FeedbackForm';
import SentryIcon from '@/integrations/sentry/sentry.svg?react';

export function FeedbackTab() {
  const { open, context } = useFeedbackState();
  const tabRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  if (!useCanSendFeedback()) return null;

  return (
    <>
      <button
        ref={tabRef}
        type="button"
        aria-label="Zgłoś problem"
        onClick={() => openFeedback({ origin: 'layout' })}
        className="group fixed right-0 bottom-8 z-40 flex items-center rounded-l-md bg-primary/80 py-2.5 pr-2 pl-2.5 text-sm font-medium text-white shadow-md transition-colors hover:cursor-pointer hover:bg-primary focus-visible:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none [html:has([data-actions-section])_&]:bottom-[max(2rem,calc(var(--actions-height)+1rem))]"
        data-testid="feedback-tab"
      >
        <SentryIcon className="h-4 w-4 shrink-0" aria-hidden />
        <span
          aria-hidden
          className={`max-w-0 overflow-hidden whitespace-nowrap transition-[max-width,padding] duration-300 ease-out motion-reduce:transition-none ${open ? '' : 'group-hover:max-w-32 group-hover:pl-2 group-focus-visible:max-w-32 group-focus-visible:pl-2'}`}
        >
          Zgłoś problem
        </span>
      </button>
      <Dialog.Root open={open} onOpenChange={(next) => !next && closeFeedback()} modal={false} disablePointerDismissal>
        <Dialog.Portal keepMounted>
          <Dialog.Popup
            ref={popupRef}
            initialFocus={() => popupRef.current?.querySelector('textarea')}
            finalFocus={tabRef}
            className="fixed right-14 bottom-8 z-50 flex max-h-[calc(100dvh-var(--header-height)-3rem)] w-[calc(100vw-4.5rem)] max-w-sm origin-bottom-right flex-col overflow-hidden rounded-lg bg-white p-4 shadow-xl transition-all duration-200 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 motion-reduce:transition-none [html:has([data-actions-section])_&]:bottom-[max(2rem,calc(var(--actions-height)+1rem))] [html:has([data-actions-section])_&]:max-h-[calc(100dvh-var(--header-height)-max(2rem,calc(var(--actions-height)+1rem))-1rem)]"
          >
            <header className="flex items-center justify-between">
              <Dialog.Title className="text-lg font-bold">Zgłoś problem</Dialog.Title>
              <Dialog.Close
                aria-label="Zamknij"
                className="rounded-md p-1.5 text-gray-500 hover:cursor-pointer hover:bg-black/5 hover:text-gray-700"
              >
                <XIcon className="h-4 w-4" />
              </Dialog.Close>
            </header>
            <Dialog.Description className="mb-4 text-sm text-gray-600">
              Opis, załączniki, adres strony, nagranie sesji i adres e-mail konta trafią do programistów, aby pomóc
              naprawić problem.
            </Dialog.Description>
            <FeedbackForm context={context} close={closeFeedback} />
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
