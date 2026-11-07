import { Button as BaseButton } from '@base-ui/react/button';

import { Link, Props as LinkProps } from '@/components/shared/Link';
import { cn } from '@/lib/utils';

type ButtonAttributes = {
  role?: React.HTMLAttributes<HTMLButtonElement>['role'];
  name?: string;
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
};
type Props = {
  children: React.ReactNode;

  variant?: ButtonVariant;
  size?: keyof typeof sizes;
  className?: string;
  disabled?: boolean;
  title?: string;
} & (
  | ({
      type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
      onClick?: (evt: React.MouseEvent) => void;
    } & ButtonAttributes)
  | ({ type: 'link' } & Omit<LinkProps, 'variant'> & Partial<Record<keyof ButtonAttributes, never>>)
);
export type ButtonVariant = keyof typeof variants;
export function Button(props: Props) {
  const {
    children,
    className,
    disabled,
    role,
    name,
    id,
    title,
    'aria-describedby': ariaDescribedBy,
    variant = 'primary',
    size = 'md',
    'aria-invalid': ariaInvalid,
  } = props;

  const classes = cn(
    'text-inverse-foreground focus-visible:outline-hidden hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-default',
    variants[variant],
    sizes[size],
    className,
    variant != 'plain' ? 'flex items-center justify-around' : ''
  );

  if (props.type === 'link' && !disabled) {
    const { variant: _, ...other } = props;

    return (
      <Link {...other} variant="plain" className={cn('h-fit w-fit', classes)}>
        {children}
      </Link>
    );
  }

  return (
    <BaseButton
      type={props.type === 'link' ? 'button' : (props.type ?? 'button')}
      className={classes}
      onClick={props.type === 'link' ? undefined : props.onClick}
      disabled={disabled}
      role={role}
      name={name}
      id={id}
      title={title}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
    >
      {children}
    </BaseButton>
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
