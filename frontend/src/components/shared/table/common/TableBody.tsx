import { ReactNode } from 'react';

import { Row, Table } from '@/components/shared/table/common/tableFeatures';
import { useVirtualTableRows } from '@/integrations/tanstack/virtual/hook';

type Props<T extends object> = {
  table: Table<T>;
  columnCount: number;
  headerRowCount?: number;
  virtualized?: boolean;
  estimateRowHeight: number;
  renderCells: (row: Row<T>) => ReactNode;
  children: ReactNode;
};

export function TableBody<T extends object>({
  table,
  columnCount,
  headerRowCount = 0,
  virtualized = false,
  estimateRowHeight,
  renderCells,
  children,
}: Props<T>) {
  const { bodyRef, renderedRows, paddingTop, paddingBottom, measureElement } = useVirtualTableRows(
    table.getRowModel().rows,
    virtualized,
    estimateRowHeight
  );

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
          ref={measureElement}
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
