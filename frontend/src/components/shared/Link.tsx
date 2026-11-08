import { Link as RouterLink, LinkProps } from '@tanstack/react-router';
import { HTMLAttributeAnchorTarget } from 'react';

import { cn } from '@/lib/utils';

type RouterUrl = LinkProps['to'];
// Allow all strings, but prioritize router links
type Url = RouterUrl | (string & {});

export type Props = {
  children: React.ReactNode;

  href?: Url;
  search?: LinkProps['search'];
  target?: HTMLAttributeAnchorTarget;
  variant?: keyof typeof variants;
  className?: string;
  title?: string;
  rel?: string;
  disabled?: boolean;
  tabIndex?: number;
  'aria-hidden'?: boolean;
};
export function Link({
  children,
  href,
  search,
  className,
  title,
  rel,
  variant,
  target = '_self',
  disabled = false,
  tabIndex,
  'aria-hidden': ariaHidden,
}: Props) {
  variant = variant ?? (disabled ? 'disabled' : 'default');
  const isInternalLink = (href as string).startsWith('/') || (href as string).startsWith('.');

  if (isInternalLink) {
    return (
      <RouterLink
        to={href as RouterUrl}
        search={search}
        target={target}
        className={cn(variants[variant], className)}
        title={title}
        rel={rel}
        disabled={disabled}
        tabIndex={tabIndex}
        aria-hidden={ariaHidden}
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
      tabIndex={tabIndex}
      aria-hidden={ariaHidden}
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
