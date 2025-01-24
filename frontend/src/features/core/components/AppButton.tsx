import { cn } from '@lib/utils';
import { AppLink, AppLinkProps } from './AppLink';
import ExternalIcon from 'bootstrap-icons/icons/box-arrow-up-right.svg?react';

type AppButtonProps = {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  type?: 'submit' | 'button' | 'reset';
  className?: React.CSSProperties | string;
  disabled?: boolean;
  link?: 'internal' | 'external' | boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  AppLinkProps;

export function AppButton({
  children,
  variant = 'primary',
  type = 'button',
  disabled = undefined,
  className,
  link,
  ...otherProps
}: AppButtonProps) {
  const button = (
    <button
      type={type}
      className={cn(
        'px-5 py-2.5 rounded-lg text-white font-medium outline-none hover:cursor-pointer disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
      disabled={disabled}
      {...otherProps}
    >
      <div className={cn('flex items-center justify-center')}>
        {children}
        {link === 'external' && <ExternalIcon className={cn('w-3 h-3 ml-2')} />}
      </div>
    </button>
  );

  if (link) {
    return <AppLink {...otherProps}>{button}</AppLink>;
  }

  return button;
}

const variants = {
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
