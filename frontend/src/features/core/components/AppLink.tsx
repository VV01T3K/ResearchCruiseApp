import { cn } from '@lib/utils';
import { Link, LinkProps } from '@tanstack/react-router';

type RouterUrl = LinkProps['to'];

export type UniversalUrl = RouterUrl | (string & {}); // Allow all strings, but prioritize router links

export type AppLinkProps = Omit<LinkProps, 'to'> & {
  to?: UniversalUrl;
  addStyles?: boolean;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export function AppLink({ to, children, addStyles = true, ...props }: AppLinkProps) {
  const isInternal = (to as string).startsWith('/') || (to as string).startsWith('.');

  const className = addStyles ? 'text-primary hover:underline' : '';

  if (isInternal) {
    return (
      <Link to={to as RouterUrl} {...props} className={cn(className, props.className)}>
        {children}
      </Link>
    );
  } else {
    return (
      <a href={to as string} {...props} className={cn(className, props.className)} target="_blank">
        {children}
      </a>
    );
  }
}
