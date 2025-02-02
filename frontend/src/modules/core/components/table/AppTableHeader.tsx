import { Header } from '@tanstack/react-table';
import ChevronDownIcon from 'bootstrap-icons/icons/chevron-down.svg?react';
import ChevronExpandIcon from 'bootstrap-icons/icons/chevron-expand.svg?react';
import ChevronUpIcon from 'bootstrap-icons/icons/chevron-up.svg?react';
import FunnelIcon from 'bootstrap-icons/icons/funnel.svg?react';
import FunnelFillIcon from 'bootstrap-icons/icons/funnel-fill.svg?react';
import { AnimatePresence } from 'motion/react';
import React from 'react';

import { AppButton } from '@/core/components/AppButton';
import { AppTableHeaderDropdown } from '@/core/components/table/AppTableHeaderDropdown';
import { useOutsideClickDetection } from '@/core/hooks/OutsideClickDetectionHook';
import { cn } from '@/core/lib/utils';

function getCapabilities<TData, TValue>(header: Header<TData, TValue>) {
  return {
    supportsFilter: header.column.getCanFilter(),
    supportsSort: header.column.getCanSort(),
    supportsDropdown: header.column.getCanFilter() || header.column.getCanSort(),
  };
}

function FilterIcon<TData>({ header }: { header: Header<TData, unknown> }) {
  if (!header.column.getCanFilter()) {
    return null;
  }

  if (header.column.getFilterValue()) {
    return <FunnelFillIcon className="w-4 h-4" />;
  }

  return <FunnelIcon className="w-4 h-4" />;
}

function SortingIcon<TData>({ header }: { header: Header<TData, unknown> }) {
  if (!header.column.getCanSort()) {
    return null;
  }

  if (header.column.getIsSorted() === 'asc') {
    return <ChevronDownIcon className="w-4 h-4" />;
  }

  if (header.column.getIsSorted() === 'desc') {
    return <ChevronUpIcon className="w-4 h-4" />;
  }

  return <ChevronExpandIcon className="w-4 h-4" />;
}

type Props<TData, TValue> = {
  header: Header<TData, TValue>;
  children: React.ReactNode;
};
export function AppTableHeader<TData, TValue>({ header, children }: Props<TData, TValue>) {
  const headerRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = React.useState(false);

  const { supportsDropdown, supportsFilter, supportsSort } = getCapabilities(header);

  useOutsideClickDetection({
    refs: [headerRef, dropdownRef],
    onOutsideClick: () => {
      setExpanded(false);
    },
  });

  function handleHeaderClick() {
    if (!supportsDropdown) {
      return;
    }

    setExpanded(!expanded);
  }

  return (
    <th colSpan={header.colSpan}>
      <div className="relative inline-block" ref={headerRef}>
        {supportsDropdown && (
          <AppButton
            variant="plain"
            onClick={() => handleHeaderClick()}
            className={cn(supportsDropdown ? 'cursor-pointer' : '', 'flex justify-center items-center gap-2')}
          >
            <FilterIcon header={header} />
            <span>{children}</span>
            <SortingIcon header={header} />
          </AppButton>
        )}

        {!supportsDropdown && <span>{children}</span>}

        <AnimatePresence>
          {expanded && (
            <AppTableHeaderDropdown
              header={header}
              dropdownRef={dropdownRef}
              headerRef={headerRef}
              capabilities={{ supportsDropdown, supportsFilter, supportsSort }}
              expanded={expanded}
            />
          )}
        </AnimatePresence>
      </div>
    </th>
  );
}
