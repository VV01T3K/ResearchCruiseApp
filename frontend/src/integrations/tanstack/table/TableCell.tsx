import type { RowData } from '@tanstack/react-table';
import type { Cell } from './features';

/**
 * flexRender mounts each inline `cell` function as its own component type. Column definitions are
 * rebuilt on every render, so every cell, and any form field inside it, would remount and lose its
 * state. Calling the renderer from this stable component keeps the rendered content mounted.
 */
export function TableCell<T extends RowData>({ cell }: { cell: Cell<T> }) {
  const render = cell.column.columnDef.cell;
  return typeof render === 'function' ? render(cell.getContext()) : (render ?? null);
}
