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
            <div>
              <span className="font-bold">Blokady statku w roku {year}:</span>
              <div className="mt-2 space-y-1">
                {blockades.map((blockade: BlockadePeriodDto) => (
                  <div key={`${blockade.startDate}-${blockade.endDate}`} className="text-sm">
                    <span className="font-bold">{blockade.title}</span>:{' '}
                    {new Date(blockade.startDate).toLocaleDateString('pl-PL')} -{' '}
                    {new Date(blockade.endDate).toLocaleDateString('pl-PL')}
                  </div>
                ))}
              </div>
              <div className="mt-2 text-sm">
                W okresach blokady nie można składać zgłoszeń formularza A. Proszę wybrać inne terminy.
              </div>
            </div>
          </AppAlert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
