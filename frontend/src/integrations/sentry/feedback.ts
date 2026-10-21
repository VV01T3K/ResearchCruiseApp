import * as Sentry from '@sentry/react';
import { useSyncExternalStore } from 'react';

import type { FeedbackAttachment } from '@/integrations/sentry/attachments';
import { useCurrentUser } from '@/integrations/tanstack/query/auth';

export type FeedbackContext = { origin: 'layout' | 'help' | 'form' };

const CONFIRMATION_TIMEOUT = 30_000;

type FeedbackState = { open: boolean; context: FeedbackContext };

let state: FeedbackState = { open: false, context: { origin: 'layout' } };
const listeners = new Set<() => void>();

export function useCanSendFeedback(): boolean {
  return useCurrentUser() !== null && Sentry.getClient() !== undefined;
}

function setState(next: FeedbackState): void {
  state = next;
  listeners.forEach((listener) => listener());
}

export function openFeedback(context: FeedbackContext): void {
  setState({ open: true, context });
}

export function closeFeedback(): void {
  if (state.open) setState({ ...state, open: false });
}

export function useFeedbackState(): FeedbackState {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state
  );
}

export function sendFeedback(
  context: FeedbackContext,
  { attachments, ...feedback }: { message: string; email?: string; attachments: FeedbackAttachment[] }
): Promise<void> {
  const client = Sentry.getClient();
  if (!client) return Promise.reject(new Error('Sentry is not initialized'));

  const eventId = Sentry.captureFeedback(
    {
      ...feedback,
      url: window.location.href,
      source: 'api',
      tags: { 'feedback.origin': context.origin },
    },
    {
      includeReplay: true,
      attachments: attachments.map(({ filename, contentType, data }) => ({ filename, contentType, data })),
    }
  );
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      unsubscribe();
      reject(new Error('Feedback delivery was not confirmed'));
    }, CONFIRMATION_TIMEOUT);
    const unsubscribe = client.on('afterSendEvent', (event, response) => {
      if (event.event_id !== eventId) return;
      clearTimeout(timeout);
      unsubscribe();
      const status = response.statusCode ?? 0;
      if (status >= 200 && status < 300) resolve();
      else reject(new Error(`Feedback delivery failed with status ${status}`));
    });
  });
}
