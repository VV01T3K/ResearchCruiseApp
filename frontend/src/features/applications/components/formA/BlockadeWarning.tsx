import { Collapsible } from '@base-ui/react/collapsible';
import { CaretDownIcon } from '@phosphor-icons/react';

import { Alert } from '@/components/shared/Alert';
import { formatDate } from '@/lib/dateUtils';
import type { BlockadeResponse as BlockadePeriod } from '@/api/generated/schemas';

interface Props {
  blockades?: BlockadePeriod[];
  year: number;
}

export function BlockadeWarning({ year, blockades }: Props) {
  return (
    <Collapsible.Root open={!!blockades && blockades.length > 0}>
      <Collapsible.Panel className="h-(--collapsible-panel-height) overflow-hidden transition-[height,opacity] duration-200 ease-out data-[ending-style]:h-0 data-[ending-style]:opacity-0 data-[starting-style]:h-0 data-[starting-style]:opacity-0 [&_[role=alert]>svg]:mt-2.5">
        <Alert variant="warning" iconAlign="start">
          <Collapsible.Root>
            <Collapsible.Trigger className="group -m-2 flex w-[calc(100%+1rem)] cursor-pointer items-center justify-between rounded-lg p-2 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-hidden">
              <div className="flex flex-col items-start">
                <span className="font-bold">Blokady statku w roku {year}</span>
                <span className="text-sm font-normal">Rozwiń, aby zobaczyć wszystkie blokady</span>
              </div>
              <span className="ml-4 transition-transform duration-150 ease-out group-aria-expanded:rotate-180">
                <CaretDownIcon className="h-5 w-5" />
              </span>
            </Collapsible.Trigger>
            <Collapsible.Panel className="overflow-hidden transition-all duration-200 ease-out data-[ending-style]:h-0 data-[ending-style]:opacity-0 data-[starting-style]:h-0 data-[starting-style]:opacity-0">
              <ul className="mt-3 space-y-1">
                {blockades?.map((blockade: BlockadePeriod) => (
                  <li key={`${blockade.startDate}-${blockade.endDate}`} className="text-sm">
                    <span className="font-bold">{blockade.title}</span>: {formatDate(blockade.startDate, 'date')} -{' '}
                    {formatDate(blockade.endDate, 'date')}
                  </li>
                ))}
              </ul>
            </Collapsible.Panel>
          </Collapsible.Root>
        </Alert>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
