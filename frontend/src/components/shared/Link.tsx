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
  default: 'text-primary hover:underline',
  white: 'text-neutral-200 hover:underline',
  disabled: 'text-neutral-400',
  plain: '',
};
