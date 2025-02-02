import XLgIcon from 'bootstrap-icons/icons/x-lg.svg?react';
import { AnimatePresence, motion } from 'motion/react';

import { AppButton } from '@/core/components/AppButton';
import { cn } from '@/core/lib/utils';

type Props = {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;

  className?: string;
};
export function AppModal({ title, children, isOpen, onClose, className }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={() => onClose()}
          className={cn('fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md', className)}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg w-full max-w-screen-sm p-4 max-h-[calc(100vh-var(--header-height))] mt-[var(--header-height)] overflow-y-auto"
            onClick={(evt) => evt.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <header className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{title}</h2>
              <AppButton
                onClick={onClose}
                variant="plain"
                className="text-gray-500 hover:text-gray-700 hover:cursor-pointer hover:bg-black/5 p-2 rounded-md"
              >
                <XLgIcon className="w-5 h-5" />
              </AppButton>
            </header>
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
