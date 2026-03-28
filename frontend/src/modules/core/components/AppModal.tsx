import { Dialog } from '@base-ui/react/dialog';
import XLgIcon from 'bootstrap-icons/icons/x-lg.svg?react';
import React from 'react';

import { cn } from '@/core/lib/utils';

type Props = {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;

  className?: string;
  dismissible?: boolean;
};
export function AppModal({ title, children, isOpen, onClose, className, dismissible = true }: Props) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && dismissible && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 backdrop-blur-md transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup
          className={cn(
            'fixed top-1/2 left-1/2 z-50 max-h-[calc(100vh-var(--header-height))] w-full max-w-screen-sm -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-white p-4 shadow-lg',
            'transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
            'data-[starting-style]:scale-90 data-[starting-style]:opacity-0',
            'data-[ending-style]:scale-90 data-[ending-style]:opacity-0',
            className
          )}
        >
          <header className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-xl font-bold">{title}</Dialog.Title>
            {dismissible && (
              <Dialog.Close
                render={
                  <button className="rounded-md p-2 text-gray-500 hover:cursor-pointer hover:bg-black/5 hover:text-gray-700" />
                }
              >
                <XLgIcon className="h-5 w-5" />
              </Dialog.Close>
            )}
          </header>
          <div>{children}</div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
