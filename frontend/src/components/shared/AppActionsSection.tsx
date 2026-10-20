import { useScroll } from 'motion/react';
import React from 'react';

import { cn } from '@/lib/utils';

type Props = {
  children?: React.ReactNode;
};
export function AppActionsSection({ children }: Props) {
  const [isSticky, setIsSticky] = React.useState(false);
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const spacerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  React.useEffect(() => {
    const popover = popoverRef.current;
    const spacer = spacerRef.current;
    if (!popover || !spacer) {
      return;
    }
    popover.showPopover();
    const observer = new ResizeObserver(() => {
      const height = popover.offsetHeight + 16;
      const belowSpacer =
        document.documentElement.scrollHeight - spacer.getBoundingClientRect().bottom - window.scrollY;
      document.documentElement.style.setProperty('--actions-height', `${height}px`);
      spacer.style.height = `${Math.max(0, height - belowSpacer)}px`;
    });
    observer.observe(popover);
    observer.observe(spacer.parentElement ?? document.body);
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
      <div ref={spacerRef} className="flow-root h-(--actions-height)" />
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
    </>
  );
}
