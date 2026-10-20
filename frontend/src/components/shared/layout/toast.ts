import { Toast } from '@base-ui/react/toast';

import type { FeedbackContext } from '@/integrations/sentry/feedback';

export const TOAST_TIMEOUT = 5000; // 5 seconds

export type ToastData = { report?: Omit<FeedbackContext, 'origin'> };

export const toastManager = Toast.createToastManager<ToastData>();

export const toast = {
  success: (message: string) => toastManager.add({ description: message, type: 'success', timeout: TOAST_TIMEOUT }),
  error: (message: string, report: ToastData['report'] | false = {}) =>
    toastManager.add({
      description: message,
      type: 'error',
      timeout: TOAST_TIMEOUT,
      data: report ? { report } : {},
    }),
  loading: (message: string) => toastManager.add({ description: message, type: 'loading', timeout: 0 }),
  dismiss: (id: string) => toastManager.close(id),
};
