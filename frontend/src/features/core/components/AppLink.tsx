import { cn } from '@lib/utils';
import { Link, LinkProps } from '@tanstack/react-router';

type RouterUrl = LinkProps['to'];

export type UniversalUrl = RouterUrl | (string & {}); // Allow all strings, but prioritize router links

export type AppLinkProps = Omit<LinkProps, 'to'> & {
  to?: UniversalUrl;
  addStyles?: boolean;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * A universal link component that can handle both internal and external links.
 * If the link is internal, it will use the react-router's Link component.
 * If the link is external, it will use the anchor tag with target="_blank".
 * @param to The URL to link to - both internal and external URLs are supported.
 * @param children The content of the link.
 * @param props Additional props to pass to the anchor tag - `@tanstack/react-router/LinkProps` and `React.AnchorHTMLAttributes<HTMLAnchorElement>`.
 */
export function AppLink({
  to,
  children,
  addStyles = true,
  ...props
}: AppLinkProps) {
  const isInternal =
    (to as string).startsWith('/') || (to as string).startsWith('.');

  const className = addStyles ? 'text-blue-500 hover:underline' : '';

  if (isInternal) {
    return (
      <Link
        to={to as RouterUrl}
        {...props}
        className={cn(className, props.className)}
      >
        {children}
      </Link>
    );
  } else {
    return (
      <a
        href={to as string}
        {...props}
        className={cn(className, props.className)}
        target="_blank"
      >
        {children}
      </a>
    );
  }
}
