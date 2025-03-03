import TrashFillIcon from 'bootstrap-icons/icons/trash-fill.svg?react';
import { useScroll } from 'motion/react';
import React from 'react';

import { AppButton } from '@/core/components/AppButton';
import { cn } from '@/core/lib/utils';
import { useApplicationDetails } from '@/cruise-applications/contexts/ApplicationDetailsContext';
import { CruiseApplicationStatus } from '@/cruise-applications/models/CruiseApplicationDto';

type Props = {
  onReject: () => void;
};
export function ApplicationDetailsActionsSection({ onReject }: Props) {
  const [isSticky, setIsSticky] = React.useState(false);
  const { scrollYProgress } = useScroll();
  const [confirmationMode, setConfirmationMode] = React.useState(false);

  const { application } = useApplicationDetails();

  scrollYProgress.on('change', (latestValue) => {
    setIsSticky(latestValue < 1);
  });

  if (application.status !== CruiseApplicationStatus.WaitingForSupervisor) {
    return null;
  }

  return (
    <div
      className={cn(
        'sticky bottom-4 flex gap-4 w-fit mx-auto rounded-2xl py-4 px-6',
        isSticky ? 'backdrop-blur-xs bg-white/30 shadow-2xl' : ''
      )}
    >
      {confirmationMode ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 text-center text-sm font-semibold">
            Po odrzuceniu wymagane będzie ponowne złożenie wniosku
          </div>
          <AppButton
            type="submit"
            className="gap-4 !justify-center w-36 lg:w-48"
            variant="primary"
            onClick={() => setConfirmationMode(false)}
          >
            Anuluj
          </AppButton>
          <AppButton className="gap-4 !justify-center w-36 lg:w-48" variant="danger" onClick={onReject}>
            <TrashFillIcon className="h-4 w-4" />
            Potwierdź odrzucenie
          </AppButton>
        </div>
      ) : (
        <>
          <AppButton
            className="gap-4 !justify-center w-36 lg:w-48"
            variant="danger"
            onClick={() => setConfirmationMode(true)}
          >
            <TrashFillIcon className="h-4 w-4" />
            Odrzuć zgłoszenie
          </AppButton>
        </>
      )}
    </div>
  );
}
