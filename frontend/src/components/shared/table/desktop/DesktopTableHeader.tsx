import { Popover } from '@base-ui/react/popover';
import { Header } from '@/integrations/tanstack/table/features';
import React from 'react';

import { TableFilterIcon } from '@/components/shared/table/common/TableFilterIcon';
import { TableSortingIcon } from '@/components/shared/table/common/TableSortingIcon';
import { getCapabilities } from '@/components/shared/table/common/utils';
import { DesktopTableHeaderDropdown } from '@/components/shared/table/desktop/DesktopTableHeaderDropdown';
import { cn } from '@/lib/utils';

type Props<TData extends object, TValue> = {
  header: Header<TData, TValue>;
  children: React.ReactNode;
};
export function DesktopTableHeader<TData extends object, TValue>({ header, children }: Props<TData, TValue>) {
  const [expanded, setExpanded] = React.useState(false);

  const { supportsDropdown, supportsFilter, supportsSort } = getCapabilities(header);

  return (
    <th colSpan={header.colSpan} style={{ width: `${header.getSize()}px` }} className="px-2 py-3">
      <Popover.Root open={expanded} onOpenChange={setExpanded} modal={false}>
        <div className="relative inline-block">
          {supportsDropdown && (
            <Popover.Trigger
              render={
                <button
                  className={cn(
                    'outline-none hover:cursor-pointer disabled:cursor-default',
                    supportsDropdown ? 'cursor-pointer' : '',
                    'flex items-center justify-center gap-1 py-1'
                  )}
                />
              }
            >
              <TableFilterIcon header={header} />
              <span className="px-1">{children}</span>
              <TableSortingIcon header={header} />
            </Popover.Trigger>
          )}

          {!supportsDropdown && <span className="inline-block px-1 py-1 text-gray-800">{children}</span>}

          <Popover.Portal>
            <DesktopTableHeaderDropdown
              header={header}
              capabilities={{ supportsDropdown, supportsFilter, supportsSort }}
              expanded={expanded}
            />
          </Popover.Portal>
        </div>
      </Popover.Root>
    </th>
  );
}
