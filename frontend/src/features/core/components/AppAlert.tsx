import XIcon from 'bootstrap-icons/icons/x.svg?react';
import InfoCircleFillIcon from 'bootstrap-icons/icons/info-circle-fill.svg?react';
import CheckIcon from 'bootstrap-icons/icons/check.svg?react';
import ExclamationCircleIcon from 'bootstrap-icons/icons/exclamation-circle.svg?react';
import { cn } from '@lib/utils';

const variants = {
  info: [
    'Info',
    InfoCircleFillIcon,
    'text-blue-800 bg-blue-50',
    'bg-blue-50 text-blue-500 focus:ring-blue-400 p-1.5 hover:bg-blue-200',
  ],
  error: [
    'Error',
    ExclamationCircleIcon,
    'text-red-800 bg-red-50',
    'bg-red-50 text-red-500 focus:ring-red-400 p-1.5 hover:bg-red-200',
  ],
  success: [
    'Success',
    CheckIcon,
    'text-green-800 bg-green-50',
    'bg-green-50 text-green-500 focus:ring-green-400 p-1.5 hover:bg-green-200',
  ],
};

export function AppAlert({
  variant,
  children,
  onClose,
}: {
  variant: keyof typeof variants;
  children: React.ReactNode;
  onClose?: () => void;
}) {
  const Icon = variants[variant][1];
  return (
    <div
      className={cn(
        'flex items-center p-4 mb-4 rounded-lg',
        variants[variant][2]
      )}
      role="alert"
    >
      <Icon className="h-6 w-6 mr-2" />
      <span className="sr-only">variants[variant][0]</span>
      {children}
      {onClose && (
        <button
          type="button"
          className={cn(
            'ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2  inline-flex items-center justify-center h-8 w-8',
            variants[variant][3]
          )}
          aria-label="Close"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <XIcon />
        </button>
      )}
    </div>
  );
}
