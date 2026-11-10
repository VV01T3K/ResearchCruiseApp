import { Dialog } from '@base-ui/react/dialog';
import React from 'react';

import { CloseButton } from '@/components/shared/Button';
import { cn } from '@/lib/utils';

type Props = {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;

  className?: string;
  dismissible?: boolean;
};

let openModals = 0;

export function Modal({ title, children, isOpen, onClose, className, dismissible = true }: Props) {
  React.useEffect(() => {
    const root = document.getElementById('root');
    if (!isOpen || !root) {
      return;
    }
    openModals++;
    root.inert = true;
    return () => {
      openModals--;
      root.inert = openModals > 0;
    };
  }, [isOpen]);

  return (
    <Dialog.Root open={isOpen} disablePointerDismissal onOpenChange={(open) => !open && dismissible && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 backdrop-blur-md transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup
          className={cn(
            'fixed top-[calc(50%+var(--header-height)/2)] left-1/2 z-50 max-h-[calc(100dvh-var(--header-height)-2rem)] w-[calc(100%-2rem)] max-w-screen-sm -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-surface p-4 shadow-lg',
            'transition-[opacity,scale] duration-200 ease-popup',
            'data-[starting-style]:scale-98 data-[starting-style]:opacity-0',
            'data-[ending-style]:scale-98 data-[ending-style]:opacity-0',
            className
          )}
        >
          <header className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-xl font-semibold">{title}</Dialog.Title>
            {dismissible && <Dialog.Close render={<CloseButton aria-label="Zamknij" />} />}
          </header>
          <div>{children}</div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
