import React from 'react';
import TrashIcon from 'bootstrap-icons/icons/trash.svg?react';
import { flexRender, Header } from '@tanstack/react-table';
import { cn } from '@lib/utils';
import { AppTableHeaderDropdownStatus } from '../types';
import { useOutsideClickDetection } from '../hooks/UseOutsideClickDetection';
import { AppButton } from '@core/components/AppButton';
import { SortingToggle } from './SortingToggle';
import { FilterIcon } from './FilterIcon';
import { SortingIcon } from './SortingIcon';
import { AnimatePresence, motion } from 'motion/react';

type AppTableHeaderProps<TData> = {
  header: Header<TData, unknown>;
  status: AppTableHeaderDropdownStatus;
  setStatus: (status: AppTableHeaderDropdownStatus) => void;
};

export function AppTableHeader<TData>({ header, status, setStatus }: AppTableHeaderProps<TData>) {
  const headerRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const supportsFilter = header.column.getCanFilter();
  const supportsSort = header.column.getCanSort();
  const supportsDropdown = supportsFilter || supportsSort;

  useOutsideClickDetection({
    refs: [headerRef],
    onOutsideClick: () => setStatus('closed'),
    ignoreClickWhen: () => status !== 'open',
  });

  function toggleFilter(filter: unknown) {
    const currentFilter = (header.column.getFilterValue() as unknown[] | undefined) ?? [];

    if (currentFilter.includes(filter)) {
      header.column.setFilterValue(currentFilter.filter((f) => f !== filter));
      return;
    }

    header.column.setFilterValue([...currentFilter, filter]);
  }

  function clearFilters() {
    header.column.setFilterValue([]);
  }

  function isFilterChecked(filter: unknown) {
    return ((header.column.getFilterValue() as unknown[] | undefined) ?? []).includes(filter);
  }

  function handleHeaderClick(evt: React.MouseEvent) {
    if (!supportsDropdown) {
      return;
    }

    evt.stopPropagation();
    evt.preventDefault();

    setStatus(status === 'open' ? 'closed' : 'open');
  }

  function DropdownMenuElement({
    children,
    onClick,
    isRendered,
    disabled = false,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    isRendered?: boolean;
    disabled?: boolean;
  }) {
    if (!isRendered) {
      return null;
    }

    return (
      <AppButton
        variant="text"
        className={cn(
          'inline-flex gap-4 items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900',
          disabled ? 'opacity-50' : ''
        )}
        role="menuitem"
        tabIndex={-1}
        onClick={() => onClick?.()}
        disabled={disabled || status !== 'open'}
      >
        {children}
      </AppButton>
    );
  }

  function DropdownMenu() {
    if (!supportsDropdown) {
      return null;
    }

    return (
      <motion.div
        className={cn(
          'absolute right-0 origin-top-right w-56 rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden'
        )}
        key={`header.id-dropdown`}
        initial={{ opacity: 0, translateY: '-10%' }}
        animate={{ opacity: 1, translateY: '0' }}
        exit={{ opacity: 0, translateY: '-10%' }}
        transition={{ ease: 'easeOut', duration: 0.2 }}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex={-1}
        ref={dropdownRef}
      >
        <div className="py-1" role="none">
          <DropdownMenuElement onClick={() => header.column.toggleSorting()} isRendered={supportsSort}>
            <SortingToggle header={header} />
          </DropdownMenuElement>

          {supportsFilter && supportsSort && <hr className="h-px my-0.5 border-0 bg-gray-700" />}

          {Array.from(header.column.getFacetedUniqueValues().entries()).map((value) => (
            <DropdownMenuElement key={value[0]} onClick={() => toggleFilter(value[0])} isRendered={supportsFilter}>
              <input type="checkbox" checked={isFilterChecked(value[0])} className="cursor-pointer" readOnly />
              {value[0]}
            </DropdownMenuElement>
          ))}

          <DropdownMenuElement
            onClick={() => clearFilters()}
            isRendered={supportsFilter}
            disabled={!header.column.getFilterValue()}
          >
            <TrashIcon className="w-4 h-4" />
            Wyczyść filtry
          </DropdownMenuElement>
        </div>
      </motion.div>
    );
  }

  return (
    <th key={header.id} colSpan={header.colSpan}>
      <div className="relative inline-block" ref={headerRef}>
        <AppButton variant="text" onClick={handleHeaderClick} className={cn(supportsDropdown ? 'cursor-pointer' : '')}>
          <FilterIcon header={header} />
          <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
          <SortingIcon header={header} />
        </AppButton>

        <AnimatePresence>{status === 'open' && <DropdownMenu />}</AnimatePresence>
      </div>
    </th>
  );
}
