import { AppButton } from '@/components/shared/AppButton';
import { cn } from '@/lib/utils';

type Props = {
  isRendered: boolean;
  disabled?: boolean;
  expanded: boolean;
  onClick?: () => void;
  /** Makes the item a menu checkbox; it must not also contain a checkbox control. */
  checked?: boolean;
  children: React.ReactNode;
};
export function AppTableListItem({ isRendered, disabled, expanded, onClick, checked, children }: Props) {
  if (!isRendered) {
    return null;
  }

  return (
    <AppButton
      variant="plain"
      className={cn(
        'inline-flex min-w-full items-center gap-4 whitespace-nowrap px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900',
        disabled ? 'opacity-50' : ''
      )}
      role={checked === undefined ? 'menuitem' : 'menuitemcheckbox'}
      aria-checked={checked}
      onClick={() => onClick?.()}
      disabled={disabled || !expanded}
    >
      {children}
    </AppButton>
  );
}
