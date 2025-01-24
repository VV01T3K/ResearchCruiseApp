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
  variant = 'default',
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
  default: 'bg-[#333] hover:bg-[#222] active:bg-[#333] disabled:bg-[#555]',
  blue: 'bg-blue-700 hover:bg-blue-800 active:bg-blue-700 disabled:bg-blue-500',
  purple:
    'bg-purple-700 hover:bg-purple-800 active:bg-purple-700 disabled:bg-purple-500',
  red: 'bg-red-700 hover:bg-red-800 active:bg-red-700 disabled:bg-red-500',
  orange:
    'bg-orange-700 hover:bg-orange-800 active:bg-orange-700 disabled:bg-orange-500',
  green:
    'bg-green-700 hover:bg-green-800 active:bg-green-700 disabled:bg-green-500',
  defaultOutline:
    'bg-white hover:bg-[#333] active:bg-[#333] disabled:bg-[#333] text-[#333] border border-[#333] transition-all duration-300',
  blueOutline:
    'bg-white hover:bg-blue-700 active:bg-blue-700 disabled:bg-gray-300 text-blue-700 hover:text-white border border-blue-700 transition-all duration-300',
  purpleOutline:
    'bg-white hover:bg-purple-700 active:bg-purple-700 disabled:bg-gray-300 text-purple-700 hover:text-white border border-purple-700 transition-all duration-300',
  redOutline:
    'bg-white hover:bg-red-700 active:bg-red-700 disabled:bg-gray-300 text-red-700 hover:text-white border border-red-700 transition-all duration-300',
  orangeOutline:
    'bg-white hover:bg-orange-700 active:bg-orange-700 disabled:bg-gray-300 text-orange-700 hover:text-white border border-orange-700 transition-all duration-300',
  greenOutline:
    'bg-white hover:bg-green-700 active:bg-green-700 disabled:bg-gray-300 text-green-700 hover:text-white border border-green-700 transition-all duration-300',
};
