import { Header } from '@tanstack/react-table';
import { AnimatePresence } from 'motion/react';
import React from 'react';

import { AppButton } from '@/core/components/AppButton';
import { AppTableFilterIcon } from '@/core/components/table/common/AppTableFilterIcon';
import { AppTableSortingIcon } from '@/core/components/table/common/AppTableSortingIcons';
import { getCapabilities } from '@/core/components/table/common/utils';
import { AppDesktopTableHeaderDropdown } from '@/core/components/table/desktop/AppDesktopTableHeaderDropdown';
import { useOutsideClickDetection } from '@/core/hooks/OutsideClickDetectionHook';
import { cn } from '@/core/lib/utils';

type Props<TData, TValue> = {
  header: Header<TData, TValue>;
  children: React.ReactNode;
};
export function AppDesktopTableHeader<TData, TValue>({ header, children }: Props<TData, TValue>) {
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
    <th colSpan={header.colSpan} style={{ width: `${header.getSize()}px` }}>
      <div className="relative inline-block" ref={headerRef}>
        {supportsDropdown && (
          <AppButton
            variant="plain"
            onClick={() => handleHeaderClick()}
            className={cn(supportsDropdown ? 'cursor-pointer' : '', 'flex justify-center items-center gap-2')}
          >
            <AppTableFilterIcon header={header} />
            <span>{children}</span>
            <AppTableSortingIcon header={header} />
          </AppButton>
        )}

        {!supportsDropdown && <span>{children}</span>}

        <AnimatePresence>
          {expanded && (
            <AppDesktopTableHeaderDropdown
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
