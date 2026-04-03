import { AnimatePresence } from 'motion/react';
import CalendarEventIcon from 'bootstrap-icons/icons/calendar-event.svg?react';
import ChevronLeftIcon from 'bootstrap-icons/icons/chevron-left.svg?react';
import ChevronRightIcon from 'bootstrap-icons/icons/chevron-right.svg?react';
import XLgIcon from 'bootstrap-icons/icons/x-lg.svg?react';
import React, { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';

import { useFieldContext } from '@/integrations/tanstack/form/context';
import { useDropdown } from '@/hooks/shared/DropdownHook';
import { useOutsideClickDetection } from '@/hooks/shared/OutsideClickDetectionHook';
import { cn } from '@/lib/utils';

import { DropdownModal, FieldErrorTriangle, FieldLabel, PlainButton } from './shared';
import { FieldErrors } from '../newFieldComponets/shared';

export function YearField({ label, placeholder = 'Wybierz rok' }: { label?: React.ReactNode; placeholder?: string }) {
  const field = useFieldContext<number | string | undefined>();
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
  const currentValue =
    typeof field.state.value === 'number'
      ? field.state.value
      : field.state.value
        ? parseInt(field.state.value)
        : undefined;
  const [selectedYear, setSelectedYear] = React.useState<number | undefined>(currentValue);
  const [visibleDecade, setVisibleDecade] = React.useState(() => {
    const now = new globalThis.Date().getFullYear();
    const from = Math.floor(now / 10) * 10;
    return { from, to: from + 11 };
  });
  const [expanded, setExpanded] = React.useState(false);
  const inputRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);
  const portalContainerRef = useCallback((node: HTMLDivElement | null) => setPortalContainer(node), []);
  const { top, left, direction } = useDropdown({
    openingItemRef: inputRef,
    dropdownRef,
    dropdownPosition: 'center',
  });

  React.useEffect(() => {
    setSelectedYear(currentValue);
  }, [currentValue]);

  useOutsideClickDetection({
    refs: [inputRef, dropdownRef],
    onOutsideClick: () => {
      setExpanded(false);
      field.handleBlur();
    },
  });

  function handleSelectYear(newYear: number) {
    setSelectedYear(newYear);
    if (typeof field.state.value === 'number') field.handleChange(newYear);
    else field.handleChange(newYear.toString());
    field.handleBlur();
    setExpanded(false);
  }

  return (
    <>
      <div className="flex flex-col" data-invalid={hasError || undefined}>
        <FieldLabel htmlFor={field.name} label={label} />
        <div ref={inputRef}>
          <input id={field.name} type="hidden" name={field.name} value={selectedYear ?? ''} />
          <PlainButton
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className={cn(
              'relative inline-flex w-full items-center justify-between gap-4 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900',
              hasError ? 'border-danger ring-danger text-danger focus:text-gray-900' : ''
            )}
          >
            {selectedYear ?? placeholder}
            <span className="flex items-center gap-2">
              <FieldErrorTriangle hasError={hasError} />
              <div ref={portalContainerRef}></div>
              {!selectedYear && <CalendarEventIcon className="h-4 w-4" />}
            </span>
          </PlainButton>
          {selectedYear && portalContainer
            ? createPortal(
                <PlainButton
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setSelectedYear(undefined);
                    field.handleChange(typeof field.state.value === 'number' ? (undefined as never) : undefined);
                    field.handleBlur();
                    setExpanded(false);
                  }}
                  className="inline-block p-0 hover:text-red-500"
                >
                  <XLgIcon className="h-4 w-4" />
                </PlainButton>,
                portalContainer
              )
            : null}
        </div>
        <FieldErrors meta={field.state.meta} />
      </div>
      <AnimatePresence>
        {expanded && (
          <DropdownModal dropdownRef={dropdownRef} inputRef={inputRef} top={top} left={left} direction={direction}>
            <div className="grid grid-cols-5 items-center px-2 py-2">
              <PlainButton
                type="button"
                onClick={() => setVisibleDecade((prev) => ({ from: prev.from - 11, to: prev.to - 11 }))}
                className="grid w-full place-items-center rounded-lg hover:bg-gray-100"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </PlainButton>
              <span className="col-span-3 inline-flex items-center justify-center gap-2 font-bold">{`${visibleDecade.from}-${visibleDecade.to}`}</span>
              <PlainButton
                type="button"
                onClick={() => setVisibleDecade((prev) => ({ from: prev.from + 11, to: prev.to + 11 }))}
                className="grid w-full place-items-center rounded-lg hover:bg-gray-100"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </PlainButton>
            </div>
            <div className="grid grid-cols-3 gap-4 px-4 py-2">
              {Array.from(
                { length: visibleDecade.to - visibleDecade.from + 1 },
                (_, index) => visibleDecade.from + index
              ).map((year) => (
                <PlainButton
                  key={year}
                  type="button"
                  onClick={() => handleSelectYear(year)}
                  className={cn(
                    'grid place-items-center rounded-lg hover:bg-gray-100',
                    year === selectedYear ? 'text-primary-500 font-bold' : ''
                  )}
                >
                  {year}
                </PlainButton>
              ))}
            </div>
          </DropdownModal>
        )}
      </AnimatePresence>
    </>
  );
}
