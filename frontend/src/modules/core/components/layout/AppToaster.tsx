import XLgIcon from 'bootstrap-icons/icons/x-lg.svg?react';
import toast, { ToastBar, Toaster } from 'react-hot-toast';

import { AppButton } from '@/core/components/AppButton';

export function AppToaster() {
  return (
    <Toaster position="top-right">
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <div className="flex gap-2 items-center p-2">
              <span className="scale-125">{icon}</span>
              <span className="text-sm">{message}</span>
              {t.type !== 'loading' && (
                <AppButton
                  onClick={() => toast.dismiss(t.id)}
                  variant="plain"
                  className="text-gray-500 hover:text-gray-700 hover:cursor-pointer hover:bg-black/5 p-2 rounded-md"
                >
                  <XLgIcon className="w-5 h-5" />
                </AppButton>
              )}
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}
