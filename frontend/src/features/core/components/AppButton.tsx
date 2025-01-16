import { cn } from '@lib/utils';

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
};

export function AppButton({
  children,
  variant = 'default',
  type = 'button',
  disabled = false,
  className,
}: {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  type?: 'submit' | 'button' | 'reset';
  className?: React.CSSProperties | string;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      className={cn(
        'px-5 py-2.5 rounded-lg text-white font-medium outline-none disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
