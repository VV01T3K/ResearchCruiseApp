import { Button as BaseButton } from '@base-ui/react/button';
import { createLink } from '@tanstack/react-router';

import { cn } from '@/lib/utils';

type StyleProps = {
  variant?: ButtonVariant;
  size?: keyof typeof sizes;
  className?: string;
};
type Props = StyleProps & {
  children: React.ReactNode;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  onClick?: (evt: React.MouseEvent) => void;
  disabled?: boolean;
  title?: string;
  role?: React.HTMLAttributes<HTMLButtonElement>['role'];
  name?: string;
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
};
export type ButtonVariant = keyof typeof variants;
export function Button({ variant, size, className, type = 'button', children, ...props }: Props) {
  return (
    <BaseButton type={type} className={buttonClassName({ variant, size, className })} {...props}>
      {children}
    </BaseButton>
  );
}

export function ButtonAnchor({ variant, size, className, ...props }: StyleProps & React.ComponentPropsWithRef<'a'>) {
  return <a {...props} className={cn('h-fit w-fit', buttonClassName({ variant, size, className }))} />;
}

export const ButtonLink = createLink(ButtonAnchor);

function buttonClassName({ variant = 'primary', size = 'md', className }: StyleProps) {
  return cn(
    'text-inverse-foreground focus-visible:outline-hidden hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-default',
    variants[variant],
    sizes[size],
    className,
    variant != 'plain' ? 'flex items-center justify-around' : ''
  );
}

const sizes = {
  plain: '',
  xs: 'gap-2 px-3 py-2 text-xs',
  sm: 'gap-2 px-3 py-2 text-sm',
  md: 'gap-4 px-5 py-2.5',
  lg: 'gap-4 px-5 py-3 text-lg',
  xl: 'gap-4 px-6 py-3.5 text-xl',
  square: 'p-2.5',
};

const variants = {
  plain: 'text-inherit',

  primary: 'rounded-lg bg-primary hover:bg-primary-900 active:bg-primary disabled:bg-primary-500',
  success: 'rounded-lg bg-success hover:bg-success-900 active:bg-success disabled:bg-success-400',
  danger: 'rounded-lg bg-danger hover:bg-danger-700 active:bg-danger disabled:bg-danger-400',
  warning:
    'rounded-lg bg-warning hover:bg-warning-400 active:bg-warning disabled:bg-warning-100 text-neutral-950 disabled:text-warning-800 disabled:opacity-50',
  info: 'rounded-lg bg-info hover:bg-info-700 active:bg-info disabled:bg-info-200',

  primaryOutline:
    'rounded-lg bg-surface hover:bg-primary active:bg-primary text-primary hover:text-inverse-foreground border border-primary transition-all duration-300 disabled:border-border disabled:text-neutral-400 disabled:hover:bg-surface',
  successOutline:
    'rounded-lg bg-surface hover:bg-success active:bg-success text-success hover:text-inverse-foreground border border-success transition-all duration-300 disabled:border-success-300 disabled:text-success-400 disabled:hover:bg-surface',
  dangerOutline:
    'rounded-lg bg-surface hover:bg-danger active:bg-danger text-danger hover:text-inverse-foreground border border-danger transition-all duration-300 disabled:border-danger-300 disabled:text-danger-400 disabled:hover:bg-surface',
  warningOutline:
    'rounded-lg bg-surface hover:bg-warning active:bg-warning text-warning-600 hover:text-neutral-950 border border-warning transition-all duration-300 disabled:border-warning-300 disabled:text-warning-500 disabled:hover:bg-surface',
  infoOutline:
    'rounded-lg bg-surface hover:bg-info active:bg-info text-info hover:text-inverse-foreground border border-info transition-all duration-300 disabled:border-info-200 disabled:text-info-300 disabled:hover:bg-surface',
};
