import { ReactNode } from 'react';

import { Cell, Table } from '@/integrations/tanstack/table/features';
import { useVirtualTableRows } from '@/integrations/tanstack/virtual/hook';

type Props<T extends object> = {
  table: Table<T>;
  columnCount: number;
  headerRowCount?: number;
  virtualized?: boolean;
  estimateRowHeight: number;
  renderCells: (cells: Cell<T>[]) => ReactNode;
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
        <TableRow
          key={row.id}
          cells={row.getVisibleCells()}
          index={virtualized ? index : undefined}
          headerRowCount={headerRowCount}
          measureElement={measureElement}
          renderCells={renderCells}
        />
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

type RowProps<T extends object> = {
  cells: Cell<T>[];
  index: number | undefined;
  headerRowCount: number;
  measureElement: ((element: HTMLTableRowElement | null) => void) | undefined;
  renderCells: (cells: Cell<T>[]) => ReactNode;
};

function TableRow<T extends object>({ cells, index, headerRowCount, measureElement, renderCells }: RowProps<T>) {
  return (
    <tr
      ref={measureElement}
      data-index={index}
      aria-rowindex={index === undefined ? undefined : headerRowCount + index + 1}
      className={`text-neutral-800 ${index === undefined ? 'odd:bg-surface-subtle' : index % 2 === 0 ? 'bg-surface-subtle' : ''}`}
    >
      {renderCells(cells)}
    </tr>
  );
}
