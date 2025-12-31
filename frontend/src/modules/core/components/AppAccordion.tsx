import { Collapsible } from '@base-ui/react/collapsible';
import ChevronDownIcon from 'bootstrap-icons/icons/chevron-down.svg?react';

type Props = {
  title: string;
  children: React.ReactNode;
  expandedByDefault?: true | undefined;
  'data-testid'?: string;
  'data-testid-toggle'?: string;
  'data-testid-content'?: string;
};

export function AppAccordion({
  title,
  children,
  expandedByDefault = undefined,
  'data-testid': testId,
  'data-testid-toggle': toggleTestId,
  'data-testid-content': contentTestId,
}: Props) {
  return (
    <Collapsible.Root defaultOpen={!!expandedByDefault} data-testid={testId}>
      <h2 className="w-full">
        <Collapsible.Trigger
          className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-black/2 px-4 py-4 outline-none"
          data-testid={toggleTestId}
        >
          <span className="text-lg font-semibold">{title}</span>
          <span className="transition-transform duration-300 data-[panel-open]:rotate-180">
            <ChevronDownIcon className="h-6 w-6" />
          </span>
        </Collapsible.Trigger>
      </h2>
      <Collapsible.Panel
        className="overflow-hidden px-4 transition-all duration-300 ease-out data-[ending-style]:h-0 data-[ending-style]:opacity-0 data-[starting-style]:h-0 data-[starting-style]:opacity-0"
        data-testid={contentTestId}
      >
        {children}
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
