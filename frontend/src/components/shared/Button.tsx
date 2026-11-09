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
  loading?: boolean;
  title?: string;
  role?: React.HTMLAttributes<HTMLButtonElement>['role'];
  name?: string;
  id?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
};
export type ButtonVariant = keyof typeof variants;
export function Button({ variant, size, className, type = 'button', children, loading, disabled, ...props }: Props) {
  return (
    <BaseButton
      type={type}
      className={cn(
        loading && 'relative',
        buttonClassName({ variant, size, className }),
        loading && 'scale-100 [transition:none]'
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <span
            className={cn('opacity-0', variant !== 'plain' && 'flex w-full items-center justify-around gap-[inherit]')}
          >
            {children}
          </span>
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="inline-block aspect-square size-4 shrink-0 animate-spin rounded-full bg-[conic-gradient(transparent_0_25%,currentColor_0)] will-change-transform [mask:radial-gradient(farthest-side,transparent_calc(100%-2px),#000_calc(100%-1.5px))]" />
          </span>
        </>
      ) : (
        children
      )}
    </BaseButton>
  );
}

export function ButtonAnchor({ variant, size, className, ...props }: StyleProps & React.ComponentPropsWithRef<'a'>) {
  return <a {...props} className={cn('h-fit w-fit', buttonClassName({ variant, size, className }))} />;
}

export const ButtonLink = createLink(ButtonAnchor);

export function buttonClassName({ variant = 'primary', size = 'md', className }: StyleProps) {
  return cn(
    'text-inverse-foreground [transition:color_150ms_ease-out,background-color_150ms_ease-out,border-color_150ms_ease-out,box-shadow_150ms_ease-out,scale_200ms_cubic-bezier(0.34,1.56,0.64,1)] focus-visible:outline-hidden hover:cursor-pointer relative not-disabled:active:scale-96 before:absolute before:inset-0 not-disabled:active:before:-inset-1 not-disabled:active:before:scale-[104.17%] not-disabled:active:[transition-duration:150ms,150ms,150ms,150ms,100ms] not-disabled:active:[transition-timing-function:ease-out] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-default',
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

  primary: 'rounded-lg bg-primary hover:bg-primary-900 active:bg-primary-950 disabled:bg-primary-500',
  success: 'rounded-lg bg-success hover:bg-success-900 active:bg-success-950 disabled:bg-success-400',
  danger:
    'rounded-lg bg-danger hover:bg-danger-700 active:bg-danger-800 disabled:hover:bg-surface disabled:bg-surface disabled:text-muted-foreground disabled:inset-ring disabled:inset-ring-border',
  warning:
    'rounded-lg bg-warning hover:bg-warning-400 active:bg-warning-500 text-neutral-950 disabled:hover:bg-surface disabled:bg-surface disabled:text-muted-foreground disabled:inset-ring disabled:inset-ring-border',
  info: 'rounded-lg bg-info hover:bg-info-700 active:bg-info-800 disabled:bg-info-200',

  primaryOutline:
    'rounded-lg bg-surface hover:bg-primary active:bg-primary-900 text-primary hover:text-inverse-foreground border border-primary disabled:border-border disabled:text-neutral-400 disabled:hover:bg-surface',
  successOutline:
    'rounded-lg bg-surface hover:bg-success active:bg-success-900 text-success hover:text-inverse-foreground border border-success disabled:border-success-300 disabled:text-success-400 disabled:hover:bg-surface',
  dangerOutline:
    'rounded-lg bg-surface hover:bg-danger active:bg-danger-700 text-danger hover:text-inverse-foreground border border-danger disabled:border-border disabled:text-muted-foreground disabled:hover:bg-surface',
  warningOutline:
    'rounded-lg bg-surface hover:bg-warning active:bg-warning-400 text-warning-600 hover:text-neutral-950 border border-warning disabled:border-border disabled:text-muted-foreground disabled:hover:bg-surface',
  infoOutline:
    'rounded-lg bg-surface hover:bg-info active:bg-info-700 text-info hover:text-inverse-foreground border border-info disabled:border-info-200 disabled:text-info-300 disabled:hover:bg-surface',
};
