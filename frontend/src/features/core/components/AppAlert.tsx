import XIcon from 'bootstrap-icons/icons/x.svg?react';
import InfoCircleFillIcon from 'bootstrap-icons/icons/info-circle-fill.svg?react';
import CheckIcon from 'bootstrap-icons/icons/check.svg?react';
import ExclamationCircleIcon from 'bootstrap-icons/icons/exclamation-circle.svg?react';
import { cn } from '@lib/utils';
import React from 'react';

type AppAlertProps = {
  variant: keyof typeof variants;
  children: React.ReactNode;
  onClose?: () => void;
};

export function AppAlert({ variant, children, onClose }: AppAlertProps) {
  const Icon = variants[variant].icon;

  return (
    <div
      className={cn(
        'flex items-center p-4 rounded-lg',
        variants[variant].containerClassName
      )}
      role="alert"
    >
      <Icon className="h-6 w-6 mr-2" />
      <span className="sr-only">{variants[variant].screenReaderMessage}</span>
      {children}
      {onClose && (
        <button
          type="button"
          className={cn(
            'ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2  inline-flex items-center justify-center h-8 w-8',
            variants[variant].closeButtonClassName
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

type AppAlertVariant = {
  screenReaderMessage: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  containerClassName: string;
  closeButtonClassName: string;
};

const variants: Record<string, AppAlertVariant> = {
  info: {
    screenReaderMessage: 'Info',
    icon: InfoCircleFillIcon,
    containerClassName: 'text-blue-800 bg-blue-50',
    closeButtonClassName:
      'bg-blue-50 text-blue-500 focus:ring-blue-400 p-1.5 hover:bg-blue-200',
  },
  error: {
    screenReaderMessage: 'Error',
    icon: ExclamationCircleIcon,
    containerClassName: 'text-red-800 bg-red-50',
    closeButtonClassName:
      'bg-red-50 text-red-500 focus:ring-red-400 p-1.5 hover:bg-red-200',
  },
  success: {
    screenReaderMessage: 'Success',
    icon: CheckIcon,
    containerClassName: 'text-green-800 bg-green-50',
    closeButtonClassName:
      'bg-green-50 text-green-500 focus:ring-green-400 p-1.5 hover:bg-green-200',
  },
};
