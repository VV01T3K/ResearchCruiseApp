import { AppButton } from '@/components/shared/AppButton';
import { cn } from '@/lib/utils';

type Props = {
  isRendered: boolean;
  disabled?: boolean;
  expanded: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};
export function AppTableListItem({ isRendered, disabled, expanded, onClick, children }: Props) {
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
      role="menuitem"
      onClick={() => onClick?.()}
      disabled={disabled || !expanded}
    >
      {children}
    </AppButton>
  );
}
