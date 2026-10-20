import { useScroll } from 'motion/react';
import React from 'react';

import { cn } from '@/lib/utils';

type Props = {
  children?: React.ReactNode;
};
export function AppActionsSection({ children }: Props) {
  const [isSticky, setIsSticky] = React.useState(false);
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  React.useEffect(() => {
    const popover = popoverRef.current;
    if (!popover) {
      return;
    }
    popover.showPopover();
    const observer = new ResizeObserver(() => {
      document.documentElement.style.setProperty('--actions-height', `${popover.offsetHeight + 16}px`);
    });
    observer.observe(popover);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--actions-height');
    };
  }, []);

  scrollYProgress.on('change', (latestValue) => {
    setIsSticky(latestValue < 1);
  });

  if (!children) {
    return null;
  }

  return (
    <>
      <div
        ref={popoverRef}
        popover="manual"
        data-actions-section
        className={cn(
          'fixed inset-auto bottom-4 left-1/2 m-0 flex w-fit max-w-full -translate-x-1/2 gap-4 rounded-2xl px-6 py-4',
          isSticky ? 'bg-white/30 shadow-2xl backdrop-blur-xs' : ''
        )}
      >
        {children}
      </div>
      <div className="mt-8 h-(--actions-height)" />
    </>
  );
}
