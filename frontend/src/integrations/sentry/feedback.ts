import * as Sentry from '@sentry/react';

import { toast } from '@/components/shared/layout/toast';

export type FeedbackContext = { origin: 'layout' | 'help' };

type FeedbackWidget = ReturnType<typeof import('./feedback-widget').addFeedbackWidget>;

let contactEmail: string | undefined;
let widget: Promise<FeedbackWidget> | undefined;
let openContext: FeedbackContext | undefined;

export function isFeedbackAvailable(): boolean {
  return Sentry.getClient() !== undefined;
}

export function setFeedbackEmail(email: string | undefined): void {
  contactEmail = email;
}

function loadWidget(): Promise<FeedbackWidget> {
  widget ??= import('./feedback-widget').then(({ addFeedbackWidget }) => {
    Sentry.getClient()?.on('beforeSendFeedback', (event) => {
      if (openContext) event.tags = { ...event.tags, 'feedback.origin': openContext.origin };
    });
    return addFeedbackWidget();
  });
  widget.catch(() => (widget = undefined));
  return widget;
}

export async function openFeedback(context: FeedbackContext): Promise<void> {
  if (openContext || !isFeedbackAvailable()) return;
  openContext = context;
  let form: Awaited<ReturnType<FeedbackWidget['createForm']>> | undefined;
  let host: HTMLElement | undefined;
  const close = () => {
    form?.removeFromDom();
    host?.hidePopover();
    openContext = undefined;
  };
  try {
    const feedback = await loadWidget();
    // The form reads its default email from the scope user when created; a forked scope keeps it off other events.
    const { created } = Sentry.withScope((scope) => {
      if (contactEmail) scope.setUser({ email: contactEmail });
      return {
        created: feedback.createForm({
          useSentryUser: { email: 'email', name: 'username' },
          onFormClose: close,
          onFormSubmitted: close,
        }),
      };
    });
    form = await created;
    form.appendToDom();
    host = topLayerHost(form.el);
    form.open();
  } catch {
    close();
    toast.error('Nie udało się otworzyć formularza zgłoszenia. Napisz na rejsy.help@ug.edu.pl.');
  }
}

// The form action bar is a top-layer popover, which would otherwise cover the form.
function topLayerHost(el: unknown): HTMLElement | undefined {
  const root = el instanceof Node ? el.getRootNode() : undefined;
  if (!(root instanceof ShadowRoot) || !(root.host instanceof HTMLElement)) return undefined;
  const host = root.host;
  host.popover = 'manual';
  Object.assign(host.style, { border: '0', padding: '0', background: 'transparent', overflow: 'visible' });
  host.showPopover();
  return host;
}
