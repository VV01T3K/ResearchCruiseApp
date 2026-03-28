import { Collapsible } from '@base-ui/react/collapsible';
import ChevronDownIcon from 'bootstrap-icons/icons/chevron-down.svg?react';
import { AnimatePresence, motion } from 'motion/react';

import { AppAlert } from '@/core/components/AppAlert';
import { BlockadePeriodDto } from '@/cruise-schedule/models/CruiseDto';

interface Props {
  blockades?: BlockadePeriodDto[];
  year: number;
}

export function FormABlockadeWarning({ year, blockades }: Props) {
  return (
    <AnimatePresence>
      {blockades && blockades.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ ease: 'easeOut' }}
        >
          <AppAlert variant="warning">
            <Collapsible.Root data-testid="form-a-blockade-warning-accordion">
              <Collapsible.Trigger
                className="flex w-full cursor-pointer items-center justify-between py-1 outline-none"
                data-testid="form-a-blockade-warning-toggle"
              >
                <div className="flex flex-col items-start">
                  <span className="font-bold">Blokady statku w roku {year}</span>
                  <span className="text-sm font-normal">Rozwin, aby zobaczyc wszystkie blokady</span>
                </div>
                <span className="ml-4 transition-transform duration-300 data-[panel-open]:rotate-180">
                  <ChevronDownIcon className="h-5 w-5" />
                </span>
              </Collapsible.Trigger>
              <Collapsible.Panel
                className="overflow-hidden transition-all duration-300 ease-out data-[ending-style]:h-0 data-[ending-style]:opacity-0 data-[starting-style]:h-0 data-[starting-style]:opacity-0"
                data-testid="form-a-blockade-warning-content"
              >
                <ul className="mt-2 space-y-1" data-testid="form-a-blockade-warning-list">
                  {blockades.map((blockade: BlockadePeriodDto) => (
                    <li key={`${blockade.startDate}-${blockade.endDate}`} className="text-sm">
                      <span className="font-bold">{blockade.title}</span>:{' '}
                      {new Date(blockade.startDate).toLocaleDateString('pl-PL')} -{' '}
                      {new Date(blockade.endDate).toLocaleDateString('pl-PL')}
                    </li>
                  ))}
                </ul>
              </Collapsible.Panel>
            </Collapsible.Root>
          </AppAlert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
