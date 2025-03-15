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
        'sticky bottom-4 flex gap-4 w-fit mx-auto rounded-2xl py-4 px-6 max-w-full',
        isSticky ? 'backdrop-blur-xs bg-white/30 shadow-2xl' : ''
      )}
    >
      {children}
    </div>
  );
}
