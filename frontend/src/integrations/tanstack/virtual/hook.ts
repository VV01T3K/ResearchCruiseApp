import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useLayoutEffect, useRef, useState } from 'react';

export function useVirtualTableRows<T extends { id: string }>(rows: T[], enabled: boolean, estimateRowHeight: number) {
  // TanStack Virtual exposes a mutable instance; read it here on every render.
  'use no memo';

  const bodyRef = useRef<HTMLTableSectionElement>(null);
  const [scrollMargin, setScrollMargin] = useState(0);
  const virtualizer = useWindowVirtualizer({
    count: rows.length,
    enabled,
    estimateSize: () => estimateRowHeight,
    getItemKey: (index) => rows[index].id,
    overscan: 5,
    scrollMargin,
  });

  // Headers and responsive controls can move the body relative to the page.
  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!enabled || !body) {
      return;
    }
    const updateScrollMargin = () => setScrollMargin(body.getBoundingClientRect().top + window.scrollY);
    updateScrollMargin();
    const observer = new ResizeObserver(updateScrollMargin);
    observer.observe(body.parentElement ?? body);
    window.addEventListener('resize', updateScrollMargin);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScrollMargin);
    };
  }, [enabled]);

  const items = virtualizer.getVirtualItems();
  const renderedRows = enabled
    ? items.map((item) => ({ row: rows[item.index], index: item.index }))
    : rows.map((row, index) => ({ row, index }));
  const paddingTop = items.length ? Math.max(0, items[0].start - scrollMargin) : 0;
  const paddingBottom = items.length
    ? Math.max(0, virtualizer.getTotalSize() - (items[items.length - 1].end - scrollMargin))
    : 0;

  return {
    bodyRef,
    renderedRows,
    paddingTop,
    paddingBottom,
    measureElement: enabled ? virtualizer.measureElement : undefined,
  };
}
