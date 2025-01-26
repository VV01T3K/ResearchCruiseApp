import XIcon from 'bootstrap-icons/icons/x.svg?react';
import InfoCircleFillIcon from 'bootstrap-icons/icons/info-circle-fill.svg?react';
import CheckIcon from 'bootstrap-icons/icons/check.svg?react';
import ExclamationCircleIcon from 'bootstrap-icons/icons/exclamation-circle.svg?react';
import ExclamationTraingleIcon from 'bootstrap-icons/icons/exclamation-triangle.svg?react';
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
    <div className={cn('flex items-center p-4 rounded-lg', variants[variant].containerClassName)} role="alert">
      <Icon className="h-6 w-6 mr-2" />
      <span className="sr-only">{variants[variant].screenReaderMessage}</span>
      {children}
      {onClose && (
        <button
          type="button"
          className={cn(
            'ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2  inline-flex items-center justify-center h-8 w-8 hover:cursor-pointer',
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
  primary: {
    screenReaderMessage: 'Notification',
    icon: InfoCircleFillIcon,
    containerClassName: 'text-primary-dark bg-primary-light',
    closeButtonClassName: 'bg-primary-light text-primary focus:ring-primary-400 p-1.5 hover:bg-primary-200',
  },
  success: {
    screenReaderMessage: 'Success',
    icon: CheckIcon,
    containerClassName: 'text-success-dark bg-success-light',
    closeButtonClassName: 'bg-success-light text-success focus:ring-success-300 p-1.5 hover:bg-success-200',
  },
  danger: {
    screenReaderMessage: 'Error',
    icon: ExclamationCircleIcon,
    containerClassName: 'text-danger-dark bg-danger-light',
    closeButtonClassName: 'bg-danger-light text-danger focus:ring-danger-400 p-1.5 hover:bg-danger-200',
  },
  warning: {
    screenReaderMessage: 'Warning',
    icon: ExclamationTraingleIcon,
    containerClassName: 'text-warning-dark bg-warning-light',
    closeButtonClassName: 'bg-warning-light text-warning-dark focus:ring-warning-300 p-1.5 hover:bg-warning-100',
  },
  info: {
    screenReaderMessage: 'Info',
    icon: InfoCircleFillIcon,
    containerClassName: 'text-info-dark bg-info-light',
    closeButtonClassName: 'bg-info-light text-info focus:ring-info-300 p-1.5 hover:bg-info-100',
  },
};
