import { Link as RouterLink, LinkProps } from '@tanstack/react-router';
import { HTMLAttributeAnchorTarget } from 'react';

import { cn } from '@/lib/utils';

type RouterUrl = LinkProps['to'];
// Allow all strings, but prioritize router links
type Url = RouterUrl | (string & {});

export type Props = {
  children: React.ReactNode;

  href?: Url;
  target?: HTMLAttributeAnchorTarget;
  variant?: keyof typeof variants;
  className?: string;
  title?: string;
  rel?: string;
  disabled?: boolean;
};
export function Link({ children, href, className, title, rel, variant, target = '_self', disabled = false }: Props) {
  variant = variant ?? (disabled ? 'disabled' : 'default');
  const isInternalLink = (href as string).startsWith('/') || (href as string).startsWith('.');

  if (isInternalLink) {
    return (
      <RouterLink
        to={href as RouterUrl}
        target={target}
        className={cn(variants[variant], className)}
        title={title}
        rel={rel}
        disabled={disabled}
      >
        {children}
      </RouterLink>
    );
  }

  return (
    <a
      href={disabled ? undefined : href}
      target={target}
      className={cn(variants[variant], className)}
      title={title}
      rel={rel}
      aria-disabled={disabled}
    >
      {children}
    </a>
  );
}

const variants = {
  default: 'text-primary hover:underline',
  white: 'text-neutral-200 hover:underline',
  disabled: 'text-neutral-400',
  plain: '',
};
