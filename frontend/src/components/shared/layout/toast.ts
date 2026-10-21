import { Toast } from '@base-ui/react/toast';
import type { ReactNode } from 'react';

export const TOAST_TIMEOUT = 5000; // 5 seconds

export type ToastData = { action?: ReactNode };

export const toastManager = Toast.createToastManager<ToastData>();

export const toast = {
  success: (message: string) => toastManager.add({ description: message, type: 'success', timeout: TOAST_TIMEOUT }),
  error: (message: string, action?: ReactNode) =>
    toastManager.add({ description: message, type: 'error', timeout: TOAST_TIMEOUT, data: { action } }),
  loading: (message: string) => toastManager.add({ description: message, type: 'loading', timeout: 0 }),
  dismiss: (id: string) => toastManager.close(id),
};
