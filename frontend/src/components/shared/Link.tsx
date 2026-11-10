import { createLink } from '@tanstack/react-router';

import { cn } from '@/lib/utils';

type AnchorProps = React.ComponentPropsWithRef<'a'> & {
  variant?: keyof typeof variants;
  disabled?: boolean;
};
export function Anchor({ variant, disabled, className, ...props }: AnchorProps) {
  return <a {...props} className={cn(variants[variant ?? (disabled ? 'disabled' : 'default')], className)} />;
}

export const Link = createLink(Anchor);

const variants = {
  default:
    'rounded-sm text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden transition-colors duration-150 ease-out hover:text-primary-900 hover:underline active:text-primary-950',
  white:
    'rounded-sm text-neutral-200 hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden focus-visible:ring-offset-2',
  disabled: 'text-neutral-400',
  plain: '',
  card: 'group block h-full rounded-xl outline-none',
};
