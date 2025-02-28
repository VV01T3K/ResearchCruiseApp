import { AppLink, Props as AppLinkProps } from '@/core/components/AppLink';
import { cn } from '@/core/lib/utils';

type Props = {
  children: React.ReactNode;

  variant?: AppButtonVariant;
  size?: keyof typeof sizes;
  className?: string;
  disabled?: boolean;
  role?: React.HTMLAttributes<HTMLButtonElement>['role'];
} & (
  | { type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type']; onClick?: (evt: React.MouseEvent) => void }
  | ({ type: 'link' } & Omit<AppLinkProps, 'variant'>)
);
export type AppButtonVariant = keyof typeof variants;
export function AppButton(props: Props) {
  const { children, className, disabled, role, variant = 'primary', size = 'md' } = props;

  const button = (
    <button
      type={props.type === 'link' ? 'button' : (props.type ?? 'button')}
      className={cn(
        'text-white outline-none hover:cursor-pointer disabled:cursor-default',
        variants[variant],
        sizes[size],
        props.type === 'link' ? 'w-full h-full' : className,
        variant != 'plain' ? 'flex items-center justify-around ' : ''
      )}
      onClick={props.type === 'link' ? undefined : props.onClick}
      disabled={disabled}
      role={role}
    >
      {children}
    </button>
  );

  if (props.type === 'link') {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { variant: _, ...other } = props;

    return (
      <AppLink variant="plain" className={className} {...other}>
        {button}
      </AppLink>
    );
  }

  return button;
}

const sizes = {
  plain: '',
  xs: 'px-3 py-2 text-xs',
  sm: 'px-3 py-2 text-sm',
  md: 'px-5 py-2.5 text-md',
  lg: 'px-5 py-3 text-lg',
  xl: 'px-6 py-3.5 text-xl',
  square: 'p-2.5',
};

const variants = {
  plain: 'text-default',

  primary: 'rounded-lg bg-primary hover:bg-primary-900 active:bg-primary disabled:bg-primary-500',
  success: 'rounded-lg bg-success hover:bg-success-900 active:bg-success disabled:bg-success-400',
  danger: 'rounded-lg bg-danger hover:bg-danger-700 active:bg-danger disabled:bg-danger-400',
  warning:
    'rounded-lg bg-warning hover:bg-warning-400 active:bg-warning disabled:bg-warning-100 text-black disabled:text-warning-800',
  info: 'rounded-lg bg-info hover:bg-info-400 active:bg-info disabled:bg-info-200',

  primaryOutline:
    'rounded-lg bg-white hover:bg-primary active:bg-primary text-primary hover:text-white border border-primary transition-all duration-300 disabled:border-primary-300 disabled:text-primary-400 disabled:hover:bg-white',
  successOutline:
    'rounded-lg bg-white hover:bg-success active:bg-success text-success hover:text-white border border-success transition-all duration-300 disabled:border-success-300 disabled:text-success-400 disabled:hover:bg-white',
  dangerOutline:
    'rounded-lg bg-white hover:bg-danger active:bg-danger text-danger hover:text-white border border-danger transition-all duration-300 disabled:border-danger-300 disabled:text-danger-400 disabled:hover:bg-white',
  warningOutline:
    'rounded-lg bg-white hover:bg-warning active:bg-warning text-warning-600 hover:text-black border border-warning transition-all duration-300 disabled:border-warning-300 disabled:text-warning-500 disabled:hover:bg-white',
  infoOutline:
    'rounded-lg bg-white hover:bg-info active:bg-info text-info hover:text-white border border-info transition-all duration-300 disabled:border-info-200 disabled:text-info-300 disabled:hover:bg-white',
};
