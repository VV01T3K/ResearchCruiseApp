import { AppButton } from '@core/components/AppButton';
import { cn } from '@lib/utils';
import { AnimatePresence } from 'motion/react';
import React from 'react';

import { useOutsideClickDetection } from '../../core/hooks/UseOutsideClickDetection';
import { AppTableHeaderDropdownStatus, AppTableHeaderProps } from '../types';
import { DropdownMenu } from './DropdownMenu';
import { FilterIcon } from './FilterIcon';
import { SortingIcon } from './SortingIcon';

export function AppTableHeader<TData, TValue>({ header, children }: AppTableHeaderProps<TData, TValue>) {
  const headerRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [status, setStatus] = React.useState<AppTableHeaderDropdownStatus>('closed');

  const supportsFilter = header.column.getCanFilter();
  const supportsSort = header.column.getCanSort();
  const supportsDropdown = supportsFilter || supportsSort;

  useOutsideClickDetection({
    refs: [headerRef, dropdownRef],
    onOutsideClick: () => setStatus('closed'),
    ignoreClickWhen: () => status !== 'open',
  });

  function handleHeaderClick() {
    if (!supportsDropdown) {
      return;
    }

    setStatus(status === 'open' ? 'closed' : 'open');
  }

  return (
    <th colSpan={header.colSpan}>
      <div className="relative inline-block" ref={headerRef}>
        {supportsDropdown && (
          <AppButton
            variant="text"
            onClick={() => handleHeaderClick()}
            className={cn(supportsDropdown ? 'cursor-pointer' : '')}
          >
            <FilterIcon header={header} />
            <span>{children}</span>
            <SortingIcon header={header} />
          </AppButton>
        )}

        {!supportsDropdown && <span>{children}</span>}

        <AnimatePresence>
          {status === 'open' && (
            <DropdownMenu
              header={header}
              dropdownRef={dropdownRef}
              headerRef={headerRef}
              supportsDropdown={supportsDropdown}
              supportsFilter={supportsFilter}
              supportsSort={supportsSort}
              status={status}
            />
          )}
        </AnimatePresence>
      </div>
    </th>
  );
}
