import { useScroll } from 'motion/react';
import React from 'react';

import { cn } from '@/core/lib/utils';

type Props = {
  children?: React.ReactNode;
};
export function AppActionsSection({ children }: Props) {
  const [isSticky, setIsSticky] = React.useState(false);
  const { scrollYProgress } = useScroll();

  scrollYProgress.on('change', (latestValue) => {
    setIsSticky(latestValue < 1);
  });

  if (!children) {
    return null;
  }

  return (
    <div
      className={cn(
        'sticky bottom-4 mx-auto flex w-fit max-w-full gap-4 rounded-2xl px-6 py-4',
        isSticky ? 'bg-white/30 shadow-2xl backdrop-blur-xs' : ''
      )}
    >
      {children}
    </div>
  );
}
