import { CheckIcon, InfoIcon, WarningCircleIcon, WarningIcon } from '@phosphor-icons/react';

import { CloseButton } from '@/components/buttons/CloseButton';
import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;

  onClose?: () => void;
  variant?: keyof typeof variants;
  iconAlign?: 'center' | 'start';
  role?: React.AriaRole;
};

export function Alert({ children, onClose, variant = 'primary', iconAlign = 'center', role = 'alert' }: Props) {
  const Icon = variants[variant].icon;

  return (
    <div className={cn('flex items-center rounded-lg p-4', variants[variant].containerClassName)} role={role}>
      <Icon
        weight={variants[variant].weight}
        className={cn('mr-4 h-6 w-6', iconAlign === 'start' && 'shrink-0 self-start')}
      />
      <span className="sr-only">{variants[variant].screenReaderMessage}</span>
      {children}
      {onClose && <CloseButton aria-label="Zamknij" onClick={onClose} className="-my-2 ms-auto -me-2" />}
    </div>
  );
}

const variants = {
  primary: {
    weight: 'fill',
    screenReaderMessage: 'Powiadomienie',
    icon: InfoIcon,
    containerClassName: 'text-primary-dark bg-primary-light',
  },
  success: {
    weight: 'regular',
    screenReaderMessage: 'Sukces',
    icon: CheckIcon,
    containerClassName: 'text-success-dark bg-success-light',
  },
  danger: {
    weight: 'regular',
    screenReaderMessage: 'Błąd',
    icon: WarningCircleIcon,
    containerClassName: 'text-danger-dark bg-danger-light',
  },
  warning: {
    weight: 'regular',
    screenReaderMessage: 'Ostrzeżenie',
    icon: WarningIcon,
    containerClassName: 'text-warning-dark bg-warning-light',
  },
  info: {
    weight: 'fill',
    screenReaderMessage: 'Informacja',
    icon: InfoIcon,
    containerClassName: 'text-info-dark bg-info-light',
  },
} as const;
