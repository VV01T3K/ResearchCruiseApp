import { cn } from '@lib/utils';
import CloseInfo from 'bootstrap-icons/icons/x-lg.svg?react';

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
  if (!isOpen) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md transition-opacity',
        className
      )}
      {...otherProps}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-screen-sm p-4 motion-preset-expand"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <CloseInfo className="w-5 h-5" />
          </button>
        </header>
        <div>{children}</div>
      </div>
    </div>
  );
}
