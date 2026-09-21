import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { ReactNode, useLayoutEffect, useRef, useState } from 'react';

import { Row, Table } from '@/components/shared/table/common/tableFeatures';

type Props<T extends object> = {
  table: Table<T>;
  columnCount: number;
  headerRowCount?: number;
  virtualized?: boolean;
  estimateRowHeight: number;
  renderCells: (row: Row<T>) => ReactNode;
  children: ReactNode;
};

export function AppTableBody<T extends object>({
  table,
  columnCount,
  headerRowCount = 0,
  virtualized = false,
  estimateRowHeight,
  renderCells,
  children,
}: Props<T>) {
  // TanStack Virtual exposes a mutable instance; its reads must run on every render.
  'use no memo';

  const rows = table.getRowModel().rows;
  const bodyRef = useRef<HTMLTableSectionElement>(null);
  const [scrollMargin, setScrollMargin] = useState(0);
  const virtualizer = useWindowVirtualizer({
    count: rows.length,
    enabled: virtualized,
    estimateSize: () => estimateRowHeight,
    getItemKey: (index) => rows[index].id,
    overscan: 5,
    scrollMargin,
  });

  // Headers and responsive controls can move the body relative to the page.
  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!virtualized || !body) {
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
  }, [virtualized]);

  const items = virtualizer.getVirtualItems();
  const renderedRows = virtualized
    ? items.map((item) => ({ row: rows[item.index], index: item.index }))
    : rows.map((row, index) => ({ row, index }));
  const paddingTop = items.length ? Math.max(0, items[0].start - scrollMargin) : 0;
  const paddingBottom = items.length
    ? Math.max(0, virtualizer.getTotalSize() - (items[items.length - 1].end - scrollMargin))
    : 0;

  return (
    <tbody ref={bodyRef}>
      {virtualized && paddingTop > 0 && (
        <tr aria-hidden="true">
          <td colSpan={columnCount} style={{ height: paddingTop, padding: 0 }} />
        </tr>
      )}
      {renderedRows.map(({ row, index }) => (
        <tr
          key={row.id}
          ref={virtualized ? virtualizer.measureElement : undefined}
          data-index={index}
          aria-rowindex={virtualized ? headerRowCount + index + 1 : undefined}
          className={`text-gray-800 ${index % 2 === 0 ? 'bg-gray-100' : ''}`}
        >
          {renderCells(row)}
        </tr>
      ))}
      {virtualized && paddingBottom > 0 && (
        <tr aria-hidden="true">
          <td colSpan={columnCount} style={{ height: paddingBottom, padding: 0 }} />
        </tr>
      )}
      {children}
    </tbody>
  );
}
