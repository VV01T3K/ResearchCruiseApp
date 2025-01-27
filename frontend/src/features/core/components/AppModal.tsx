import { cn } from '@lib/utils';
import CloseInfo from 'bootstrap-icons/icons/x-lg.svg?react';
import { AnimatePresence, motion } from 'motion/react';

export function AppModal({
  children,
  isOpen,
  onClose,
  title,
  className,
  ...otherProps
}: {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  className?: React.CSSProperties | string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={onClose}
          className={cn('fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md', className)}
          {...otherProps}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg w-full max-w-screen-sm p-4 max-h-[calc(100vh-var(--header-height))] mt-[var(--header-height)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <header className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 hover:cursor-pointer hover:bg-black/5 p-2 rounded-md"
                type="button"
              >
                <CloseInfo className="w-5 h-5" />
              </button>
            </header>
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
