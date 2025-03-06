import CheckIcon from 'bootstrap-icons/icons/check-square-fill.svg?react';
import TrashFillIcon from 'bootstrap-icons/icons/trash-fill.svg?react';
import { useScroll } from 'motion/react';
import React from 'react';

import { AppButton } from '@/core/components/AppButton';
import { cn } from '@/core/lib/utils';

type Props = {
  onAccept?: () => void;
  onDeny?: () => void;
};
export function FormAForSupervisorActionsSection({ onAccept, onDeny }: Props) {
  const [isSticky, setIsSticky] = React.useState(false);
  const { scrollYProgress } = useScroll();

  scrollYProgress.on('change', (latestValue) => {
    setIsSticky(latestValue < 1);
  });

  return (
    <div
      className={cn(
        'sticky bottom-4 flex gap-4 w-fit mx-auto rounded-2xl py-4 px-6',
        isSticky ? 'backdrop-blur-xs bg-white/30 shadow-2xl' : ''
      )}
    >
      <AppButton className="gap-4 !justify-center w-36 lg:w-48" variant="danger" onClick={onDeny}>
        <TrashFillIcon className="h-4 w-4" />
        Odrzuć
      </AppButton>
      <AppButton className="gap-4 !justify-center w-36 lg:w-48" onClick={onAccept}>
        <CheckIcon className="h-4 w-4" />
        Zaakceptuj
      </AppButton>
    </div>
  );
}
