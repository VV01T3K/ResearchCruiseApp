import { Popover } from '@base-ui/react/popover';
import { Header } from '@tanstack/react-table';
import React from 'react';

import { AppTableFilterIcon } from '@/core/components/table/common/AppTableFilterIcon';
import { AppTableSortingIcon } from '@/core/components/table/common/AppTableSortingIcons';
import { getCapabilities } from '@/core/components/table/common/utils';
import { AppDesktopTableHeaderDropdown } from '@/core/components/table/desktop/AppDesktopTableHeaderDropdown';
import { cn } from '@/core/lib/utils';

type Props<TData, TValue> = {
  header: Header<TData, TValue>;
  children: React.ReactNode;
};
export function AppDesktopTableHeader<TData, TValue>({ header, children }: Props<TData, TValue>) {
  const [expanded, setExpanded] = React.useState(false);

  const { supportsDropdown, supportsFilter, supportsSort } = getCapabilities(header);

  return (
    <th colSpan={header.colSpan} style={{ width: `${header.getSize()}px` }} className="px-3 py-3">
      <Popover.Root open={expanded} onOpenChange={setExpanded} modal={false}>
        <div className="relative inline-block">
          {supportsDropdown && (
            <Popover.Trigger
              render={
                <button
                  className={cn(
                    'text-default outline-none hover:cursor-pointer disabled:cursor-default',
                    supportsDropdown ? 'cursor-pointer' : '',
                    'flex items-center justify-center gap-2 py-1'
                  )}
                />
              }
            >
              <AppTableFilterIcon header={header} />
              <span className="px-1">{children}</span>
              <AppTableSortingIcon header={header} />
            </Popover.Trigger>
          )}

          {!supportsDropdown && <span className="inline-block px-1 py-1 text-gray-800">{children}</span>}

          <Popover.Portal>
            <AppDesktopTableHeaderDropdown
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
