import { Collapsible } from '@base-ui/react/collapsible';
import { CaretDownIcon } from '@phosphor-icons/react';
import { useId } from 'react';

type Props = {
  title: string;
  children: React.ReactNode;
  expandedByDefault?: true | undefined;
};

export function Accordion({ title, children, expandedByDefault }: Props) {
  const headingId = useId();

  return (
    <Collapsible.Root defaultOpen={!!expandedByDefault} role="group" aria-labelledby={headingId}>
      <h2 id={headingId} className="w-full">
        <Collapsible.Trigger className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-neutral-950/2 px-4 py-4 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-hidden">
          <span className="text-lg font-semibold">{title}</span>
          <span className="transition-transform duration-200 data-[panel-open]:rotate-180">
            <CaretDownIcon className="h-6 w-6" />
          </span>
        </Collapsible.Trigger>
      </h2>
      <Collapsible.Panel
        keepMounted
        className="overflow-hidden px-4 transition-all duration-200 ease-out data-[ending-style]:h-0 data-[ending-style]:opacity-0 data-[starting-style]:h-0 data-[starting-style]:opacity-0"
      >
        {/* A margin, not padding, so a leading child's own top margin merges into this gap. */}
        <div className="mt-4" data-accordion-content>
          {children}
        </div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
