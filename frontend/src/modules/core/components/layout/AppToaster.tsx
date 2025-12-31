import XLgIcon from 'bootstrap-icons/icons/x-lg.svg?react';
import toast, { ToastBar, Toaster } from 'react-hot-toast';

import { AppButton } from '@/core/components/AppButton';

export function AppToaster() {
  return (
    <div data-testid="toast-container">
      <Toaster position="top-right">
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <div className="flex items-center gap-2 p-2" data-testid={`toast-${t.type}`}>
                <span className="scale-125">{icon}</span>
                <span className="text-sm">{message}</span>
                {t.type !== 'loading' && (
                  <AppButton
                    onClick={() => toast.dismiss(t.id)}
                    variant="plain"
                    className="rounded-md p-2 text-gray-500 hover:cursor-pointer hover:bg-black/5 hover:text-gray-700"
                  >
                    <XLgIcon className="h-5 w-5" />
                  </AppButton>
                )}
              </div>
            )}
          </ToastBar>
        )}
      </Toaster>
    </div>
  );
}
