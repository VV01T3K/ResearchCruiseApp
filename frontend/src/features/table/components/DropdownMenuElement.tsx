import { AppButton } from '@core/components/AppButton';
import { cn } from '@lib/utils';

import { AppTableHeaderDropdownStatus } from '../types';

export function DropdownMenuElement({
  children,
  onClick,
  isRendered,
  disabled = false,
  status,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  isRendered?: boolean;
  disabled?: boolean;
  status: AppTableHeaderDropdownStatus;
}) {
  if (!isRendered) {
    return null;
  }

  return (
    <AppButton
      variant="text"
      className={cn(
        'inline-flex gap-4 items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900',
        disabled ? 'opacity-50' : ''
      )}
      role="menuitem"
      tabIndex={-1}
      onClick={() => onClick?.()}
      disabled={disabled || status !== 'open'}
    >
      {children}
    </AppButton>
  );
}
