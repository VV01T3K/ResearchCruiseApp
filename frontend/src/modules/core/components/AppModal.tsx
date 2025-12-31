import XLgIcon from 'bootstrap-icons/icons/x-lg.svg?react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { AppButton } from '@/core/components/AppButton';
import { useOutsideClickDetection } from '@/core/hooks/OutsideClickDetectionHook';
import { cn } from '@/core/lib/utils';

type Props = {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;

  className?: string;
};
export function AppModal({ title, children, isOpen, onClose, className }: Props) {
  const anchorRef = React.useRef<HTMLDivElement>(null);
  useOutsideClickDetection({
    refs: [anchorRef],
    onOutsideClick: onClose,
  });

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-5 backdrop-blur-md"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            className={cn(
              className,
              'mt-[var(--header-height)] max-h-[calc(100vh-var(--header-height))] w-full max-w-screen-sm overflow-y-auto rounded-lg bg-white p-4 shadow-lg'
            )}
            ref={anchorRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <header className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">{title}</h2>
              <AppButton
                onClick={onClose}
                variant="plain"
                className="rounded-md p-2 text-gray-500 hover:cursor-pointer hover:bg-black/5 hover:text-gray-700"
              >
                <XLgIcon className="h-5 w-5" />
              </AppButton>
            </header>
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
