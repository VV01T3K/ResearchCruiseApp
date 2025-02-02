import { Link, LinkProps } from '@tanstack/react-router';
import { HTMLAttributeAnchorTarget } from 'react';

import { cn } from '@/core/lib/utils';

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
};
export function AppLink({ children, href, className, title, rel, target = '_self', variant = 'default' }: Props) {
  const isInternalLink = (href as string).startsWith('/') || (href as string).startsWith('.');

  if (isInternalLink) {
    return (
      <Link to={href as RouterUrl} target={target} className={cn(variants[variant], className)} title={title} rel={rel}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} target={target} className={cn(variants[variant], className)} title={title} rel={rel}>
      {children}
    </a>
  );
}

const variants = {
  default: 'text-primary hover:underline',
  plain: '',
};
