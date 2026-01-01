import { Toast } from '@base-ui/react/toast';

export const TOAST_TIMEOUT = 5000; // 5 seconds

export const toastManager = Toast.createToastManager();

export const toast = {
    success: (message: string) => toastManager.add({ description: message, type: 'success', timeout: TOAST_TIMEOUT }),
    error: (message: string) => toastManager.add({ description: message, type: 'error', timeout: TOAST_TIMEOUT }),
    loading: (message: string) => toastManager.add({ description: message, type: 'loading', timeout: 0 }),
    dismiss: (id: string) => toastManager.close(id),
};
