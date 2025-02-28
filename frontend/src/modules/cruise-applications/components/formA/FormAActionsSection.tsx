import FloppyFillIcon from 'bootstrap-icons/icons/floppy-fill.svg?react';
import SendFillIcon from 'bootstrap-icons/icons/send-fill.svg?react';
import { useScroll } from 'motion/react';
import React from 'react';

import { AppButton } from '@/core/components/AppButton';
import { cn } from '@/core/lib/utils';

type Props = {
  onSaveDraft?: () => void;
};
export function FormAActionsSection({ onSaveDraft }: Props) {
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
      <AppButton className="gap-4 !justify-center w-36 lg:w-48" variant="primaryOutline" onClick={onSaveDraft}>
        <FloppyFillIcon className="h-4 w-4" />
        Zapisz
      </AppButton>
      <AppButton type="submit" className="gap-4 !justify-center w-36 lg:w-48">
        <SendFillIcon className="h-4 w-4" />
        Wyślij
      </AppButton>
    </div>
  );
}
