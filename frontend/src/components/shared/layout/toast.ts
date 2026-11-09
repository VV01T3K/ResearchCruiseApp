import { Toast } from '@base-ui/react/toast';

export const TOAST_TIMEOUT = 5000; // 5 seconds

export const toastManager = Toast.createToastManager();

const shownErrors = new Map<string, number>();

export const toast = {
  success: (message: string) => toastManager.add({ description: message, type: 'success', timeout: TOAST_TIMEOUT }),
  error: (message: string) => toastManager.add({ description: message, type: 'error', timeout: TOAST_TIMEOUT }),
  // For background failures: the same message repeated while its toast is still visible doesn't stack.
  backgroundError: (message: string) => {
    const now = Date.now();
    if (now - (shownErrors.get(message) ?? 0) < TOAST_TIMEOUT) return undefined;
    shownErrors.set(message, now);
    return toastManager.add({ description: message, type: 'error', timeout: TOAST_TIMEOUT });
  },
  loading: (message: string) => toastManager.add({ description: message, type: 'loading', timeout: 0 }),
  dismiss: (id: string) => toastManager.close(id),
};
