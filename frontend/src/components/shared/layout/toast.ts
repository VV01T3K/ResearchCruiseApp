import { Toast } from '@base-ui/react/toast';

export const TOAST_TIMEOUT = 5000; // 5 seconds

export const toastManager = Toast.createToastManager<{ count?: number }>();

const backgroundErrors = new Map<string, { id: string; count: number }>();

export const toast = {
  success: (message: string) => toastManager.add({ description: message, type: 'success', timeout: TOAST_TIMEOUT }),
  error: (message: string) => toastManager.add({ description: message, type: 'error', timeout: TOAST_TIMEOUT }),
  // For background failures: a repeat of a visible toast bumps its count instead of stacking.
  backgroundError: (message: string) => {
    const shown = backgroundErrors.get(message);
    if (shown) {
      shown.count += 1;
      toastManager.update(shown.id, { data: { count: shown.count }, timeout: TOAST_TIMEOUT });
      return shown.id;
    }
    const id = toastManager.add({
      description: message,
      type: 'error',
      timeout: TOAST_TIMEOUT,
      onClose: () => backgroundErrors.delete(message),
    });
    backgroundErrors.set(message, { id, count: 1 });
    return id;
  },
  loading: (message: string) => toastManager.add({ description: message, type: 'loading', timeout: 0 }),
  dismiss: (id: string) => toastManager.close(id),
};
