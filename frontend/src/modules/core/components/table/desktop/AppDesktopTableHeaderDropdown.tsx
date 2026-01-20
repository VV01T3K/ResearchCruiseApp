import { Popover } from '@base-ui/react/popover';
import { Header } from '@tanstack/react-table';

import { AppTableFilterList } from '@/core/components/table/common/AppTableFilterList';
import { AppTableListItem } from '@/core/components/table/common/AppTableListItem';
import { AppTableSortingToggle } from '@/core/components/table/common/AppTableSortingToggle';
import { cn } from '@/core/lib/utils';

type Props<TData, TValue> = {
  header: Header<TData, TValue>;
  capabilities: { supportsDropdown: boolean; supportsFilter: boolean; supportsSort: boolean };
  expanded: boolean;
};
export function AppDesktopTableHeaderDropdown<TData, TValue>({ header, capabilities, expanded }: Props<TData, TValue>) {
  const { supportsDropdown, supportsFilter, supportsSort } = capabilities;

  if (!supportsDropdown) {
    return null;
  }

  return (
    <Popover.Positioner className="z-50" sideOffset={4}>
      <Popover.Popup
        className={cn(
          'w-56 origin-[var(--transform-origin)] rounded-lg bg-white shadow-xl ring-1 ring-black/10',
          'transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
          'data-[starting-style]:translate-y-1 data-[starting-style]:scale-90 data-[starting-style]:opacity-0',
          'data-[ending-style]:translate-y-1 data-[ending-style]:scale-90 data-[ending-style]:opacity-0'
        )}
      >
        <div className="py-1">
          {supportsSort && <p>Sortowanie</p>}
          <AppTableListItem onClick={() => header.column.toggleSorting()} isRendered={supportsSort} expanded={expanded}>
            <AppTableSortingToggle header={header} />
          </AppTableListItem>

          {supportsFilter && supportsSort && <hr className="my-0.5 h-px border-0 bg-gray-700" />}

          {supportsFilter && <p>Filtrowanie</p>}
          {supportsFilter && <AppTableFilterList header={header} expanded={expanded} />}
        </div>
      </Popover.Popup>
    </Popover.Positioner>
  );
}
