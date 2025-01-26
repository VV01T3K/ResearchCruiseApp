import { cn } from '@lib/utils';
import { AppLink, AppLinkProps } from './AppLink';

type Icon = React.FC<React.SVGProps<SVGSVGElement>>;

type AppButtonProps = {
  children?: React.ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  rounded?: keyof typeof roundedTypes;
  type?: 'submit' | 'button' | 'reset';
  className?: React.CSSProperties | string;
  childrenClassName?: React.CSSProperties | string;
  disabled?: boolean;
  link?: boolean;
  leftIcon?: Icon;
  rightIcon?: Icon;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  AppLinkProps;

export function AppButton({
  children,
  variant = 'primary',
  size = 'md',
  rounded = 'default',
  type = 'button',
  disabled = undefined,
  className,
  childrenClassName,
  link,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  ...otherProps
}: AppButtonProps) {
  const button = (
    <button
      type={type}
      className={cn(
        'text-white font-medium outline-none hover:cursor-pointer disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        roundedTypes[rounded],
        className
      )}
      disabled={disabled}
      {...otherProps}
    >
      <div className={cn('flex items-center justify-center gap-2', childrenClassName)}>
        {LeftIcon && <LeftIcon className={iconSizes[size]} />}
        {children}
        {RightIcon && <RightIcon className={iconSizes[size]} />}
      </div>
    </button>
  );

  if (link) {
    return <AppLink {...otherProps}>{button}</AppLink>;
  }

  return button;
}

const sizes = {
  xs: 'px-3 py-2 text-xs',
  sm: 'px-3 py-2 text-sm',
  md: 'px-5 py-2.5 text-md',
  lg: 'px-5 py-3 text-lg',
  xl: 'px-6 py-3.5 text-xl',
};

const iconSizes = {
  xs: 'h-3 w-3',
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
  xl: 'h-6 w-6',
};

const roundedTypes = {
  none: 'rounded-none',
  default: 'rounded-lg',
  pill: 'rounded-full',
};

const variants = {
  text: 'text-default',

  primary: 'bg-primary hover:bg-primary-900 active:bg-primary disabled:bg-primary-500',
  success: 'bg-success hover:bg-success-900 active:bg-success disabled:bg-success-400',
  danger: 'bg-danger hover:bg-danger-700 active:bg-danger disabled:bg-danger-400',
  warning:
    'bg-warning hover:bg-warning-400 active:bg-warning disabled:bg-warning-100 text-black disabled:text-warning-800',
  info: 'bg-info hover:bg-info-400 active:bg-info disabled:bg-info-200',

  primaryOutline:
    'bg-white hover:bg-primary active:bg-primary text-primary hover:text-white border border-primary transition-all duration-300 disabled:border-primary-300 disabled:text-primary-400 disabled:hover:bg-white',
  successOutline:
    'bg-white hover:bg-success active:bg-success text-success hover:text-white border border-success transition-all duration-300 disabled:border-success-300 disabled:text-success-400 disabled:hover:bg-white',
  dangerOutline:
    'bg-white hover:bg-danger active:bg-danger text-danger hover:text-white border border-danger transition-all duration-300 disabled:border-danger-300 disabled:text-danger-400 disabled:hover:bg-white',
  warningOutline:
    'bg-white hover:bg-warning active:bg-warning text-warning hover:text-white border border-warning transition-all duration-300 disabled:border-warning-300 disabled:text-warning-400 disabled:hover:bg-white',
  infoOutline:
    'bg-white hover:bg-info active:bg-info text-info hover:text-white border border-info transition-all duration-300 disabled:border-info-200 disabled:text-info-300 disabled:hover:bg-white',
};
