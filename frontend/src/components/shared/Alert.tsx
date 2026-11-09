import { CheckIcon, InfoIcon, WarningCircleIcon, WarningIcon, XIcon } from '@phosphor-icons/react';

import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;

  onClose?: () => void;
  variant?: keyof typeof variants;
  iconAlign?: 'center' | 'start';
};

export function Alert({ children, onClose, variant = 'primary', iconAlign = 'center' }: Props) {
  const Icon = variants[variant].icon;

  return (
    <div className={cn('flex items-center rounded-lg p-4', variants[variant].containerClassName)} role="alert">
      <Icon
        weight={variants[variant].weight}
        className={cn('mr-4 h-6 w-6', iconAlign === 'start' && 'shrink-0 self-start')}
      />
      <span className="sr-only">{variants[variant].screenReaderMessage}</span>
      {children}
      {onClose && (
        <button
          type="button"
          className={cn(
            '-mx-1.5 -my-1.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg hover:cursor-pointer focus:ring-2',
            variants[variant].closeButtonClassName
          )}
          aria-label="Zamknij"
          onClick={onClose}
        >
          <XIcon className="scale-55" />
        </button>
      )}
    </div>
  );
}

const variants = {
  primary: {
    weight: 'fill',
    screenReaderMessage: 'Powiadomienie',
    icon: InfoIcon,
    containerClassName: 'text-primary-dark bg-primary-light',
    closeButtonClassName: 'bg-primary-light text-primary focus:ring-primary p-1.5 hover:bg-primary-200',
  },
  success: {
    weight: 'regular',
    screenReaderMessage: 'Sukces',
    icon: CheckIcon,
    containerClassName: 'text-success-dark bg-success-light',
    closeButtonClassName: 'bg-success-light text-success focus:ring-success-300 p-1.5 hover:bg-success-200',
  },
  danger: {
    weight: 'regular',
    screenReaderMessage: 'Błąd',
    icon: WarningCircleIcon,
    containerClassName: 'text-danger-dark bg-danger-light',
    closeButtonClassName: 'bg-danger-light text-danger focus:ring-danger-400 p-1.5 hover:bg-danger-200',
  },
  warning: {
    weight: 'regular',
    screenReaderMessage: 'Ostrzeżenie',
    icon: WarningIcon,
    containerClassName: 'text-warning-dark bg-warning-light',
    closeButtonClassName: 'bg-warning-light text-warning-dark focus:ring-warning-300 p-1.5 hover:bg-warning-100',
  },
  info: {
    weight: 'fill',
    screenReaderMessage: 'Informacja',
    icon: InfoIcon,
    containerClassName: 'text-info-dark bg-info-light',
    closeButtonClassName: 'bg-info-light text-info focus:ring-info-300 p-1.5 hover:bg-info-100',
  },
} as const;
