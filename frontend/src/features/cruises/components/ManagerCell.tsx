import { useCallback, useMemo, useState } from 'react';
import type { RowData } from '@tanstack/react-table';

import { Avatar } from '@/components/shared/Avatar';
import type { Cell } from '@/integrations/tanstack/table/features';
import { cn } from '@/lib/utils';

// Every manager cell in a column needs the same widest name, so measure it once per row list.
const widestNames = new WeakMap<object, Map<string, number>>();

function widestName(rows: { getValue: (columnId: string) => unknown }[], columnId: string, font: string) {
  const byColumn = widestNames.get(rows) ?? new Map<string, number>();
  widestNames.set(rows, byColumn);
  const key = `${columnId}|${font}`;
  let width = byColumn.get(key);
  if (width === undefined) {
    const canvas = document.createElement('canvas').getContext('2d')!;
    canvas.font = font;
    width = Math.max(...rows.map((row) => canvas.measureText(row.getValue(columnId) as string).width));
    byColumn.set(key, width);
  }
  return width;
}

type Props<T extends RowData> = {
  context: ReturnType<Cell<T>['getContext']>;
  avatarName: string;
};

export function ManagerCell<T extends RowData>({ context, avatarName }: Props<T>) {
  'use no memo';
  const rows = context.table.getRowModel().rows;
  const columnId = context.column.id;
  const name = context.getValue() as string;
  const [width, setWidth] = useState(0);
  const [font, setFont] = useState('');

  const ref = useCallback((element: HTMLDivElement) => {
    const update = () => setWidth(element.clientWidth);
    setFont(getComputedStyle(element).font);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const groupWidth = useMemo(() => {
    if (!font) return Infinity;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return Math.ceil(widestName(rows, columnId, font) + 3 * rem);
  }, [rows, columnId, font]);
  const inline = groupWidth <= width;

  return (
    <div ref={ref}>
      <div
        className={cn('mx-auto flex items-center', inline ? 'gap-2' : 'flex-col gap-1')}
        style={inline ? { width: groupWidth } : undefined}
      >
        <div className="size-10 shrink-0">
          <Avatar fullName={avatarName} variant="small" />
        </div>
        <span className={inline ? 'whitespace-nowrap' : 'line-clamp-2 text-center'} title={inline ? undefined : name}>
          {name}
        </span>
      </div>
    </div>
  );
}
