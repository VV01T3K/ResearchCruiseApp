import { Header } from '@tanstack/react-table';
import { motion } from 'motion/react';
import React from 'react';

import { AppTableFilterList } from '@/core/components/table/common/AppTableFilterList';
import { AppTableListItem } from '@/core/components/table/common/AppTableListItem';
import { AppTableSortingToggle } from '@/core/components/table/common/AppTableSortingToggle';
import { useDropdown } from '@/core/hooks/DropdownHook';

type Props<TData, TValue> = {
  header: Header<TData, TValue>;
  capabilities: { supportsDropdown: boolean; supportsFilter: boolean; supportsSort: boolean };
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  headerRef: React.RefObject<HTMLDivElement | null>;
  expanded: boolean;
};
export function AppDesktopTableHeaderDropdown<TData, TValue>({
  header,
  capabilities,
  dropdownRef,
  headerRef,
  expanded,
}: Props<TData, TValue>) {
  const { supportsDropdown, supportsFilter, supportsSort } = capabilities;

  const { top, left, direction } = useDropdown({ openingItemRef: headerRef, dropdownRef });

  if (!supportsDropdown) {
    return null;
  }

  return (
    <motion.div
      className={
        'fixed origin-top-right w-56 rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden z-50'
      }
      initial={{ opacity: 0, translateY: direction === 'up' ? '-10%' : '10%' }}
      animate={{ opacity: 1, translateY: '0' }}
      exit={{ opacity: 0, translateY: direction === 'down' ? '-10%' : '10%' }}
      transition={{ ease: 'easeOut', duration: 0.2 }}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      ref={dropdownRef}
      style={{ top: top, left: left }}
    >
      <div className="py-1" role="none">
        {supportsSort && <p>Sortowanie</p>}
        <AppTableListItem onClick={() => header.column.toggleSorting()} isRendered={supportsSort} expanded={expanded}>
          <AppTableSortingToggle header={header} />
        </AppTableListItem>

        {supportsFilter && supportsSort && <hr className="h-px my-0.5 border-0 bg-gray-700" />}

        {supportsFilter && <p>Filtrowanie</p>}
        {supportsFilter && <AppTableFilterList header={header} expanded={expanded} />}
      </div>
    </motion.div>
  );
}
