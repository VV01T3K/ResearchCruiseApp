import { AppButton } from '@/core/components/AppButton';
import { cn } from '@/core/lib/utils';

type Props = {
  isRendered: boolean;
  disabled?: boolean;
  expanded: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};
export function AppTableHeaderDropdownItem({ isRendered, disabled, expanded, onClick, children }: Props) {
  if (!isRendered) {
    return null;
  }

  return (
    <AppButton
      variant="plain"
      className={cn(
        'inline-flex gap-4 items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900',
        disabled ? 'opacity-50' : ''
      )}
      role="menuitem"
      onClick={() => onClick?.()}
      disabled={disabled || !expanded}
    >
      {children}
    </AppButton>
  );
}
