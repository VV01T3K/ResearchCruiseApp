import React from 'react';

type Props = {
  children?: React.ReactNode;
};
export function AppActionsSection({ children }: Props) {
  const popoverRef = React.useRef<HTMLDivElement>(null);

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

  if (!children) {
    return null;
  }

  return (
    <>
      <div
        ref={popoverRef}
        popover="manual"
        data-actions-section
        className="fixed inset-auto bottom-4 left-1/2 m-0 flex w-fit max-w-full -translate-x-1/2 gap-4 rounded-2xl bg-white px-6 py-4 shadow-lg ring-1 ring-gray-900/5"
      >
        {children}
      </div>
      <div className="mt-8 h-(--actions-height)" />
    </>
  );
}
