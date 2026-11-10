import { XIcon } from '@phosphor-icons/react';

import { cn } from '@/lib/utils';

type Props = React.ComponentPropsWithRef<'button'> & { 'aria-label': string };

export function CloseButton({ className, ...props }: Props) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        'rounded-md p-2 text-muted-foreground transition-colors duration-150 ease-out hover:cursor-pointer hover:bg-neutral-950/5 hover:text-neutral-700 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden active:bg-neutral-950/10',
        className
      )}
    >
      <XIcon className="h-5 w-5" />
    </button>
  );
}
