import { AnimatePresence } from 'motion/react';
import CalendarEventIcon from 'bootstrap-icons/icons/calendar-event.svg?react';
import XLgIcon from 'bootstrap-icons/icons/x-lg.svg?react';
import React, { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';

import { AppMonthPicker } from '@/components/shared/inputs/dates/AppMonthPicker';
import { useDropdown } from '@/hooks/shared/DropdownHook';
import { useOutsideClickDetection } from '@/hooks/shared/OutsideClickDetectionHook';
import { cn } from '@/lib/utils';

import {
  DropdownModal,
  FieldErrorsBlock,
  FieldErrorTriangle,
  FieldLabel,
  PlainButton,
  getLooseDateFromValue,
  getLooseValueFromDate,
  useNormalizedFieldErrors,
} from './shared';

export function Month({
  label,
  placeholder = 'Wybierz miesiąc',
}: {
  label?: React.ReactNode;
  placeholder?: string;
}) {
  const { field, hasError, normalizedErrors } = useNormalizedFieldErrors<string | undefined>();
  const value = field.state.value;
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(() => getLooseDateFromValue(value));
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
    setSelectedDate(getLooseDateFromValue(value));
  }, [value]);

  useOutsideClickDetection({
    refs: [inputRef, dropdownRef],
    onOutsideClick: () => {
      setExpanded(false);
      field.handleBlur();
    },
  });

  return (
    <>
      <div className="flex flex-col" data-invalid={hasError || undefined}>
        <FieldLabel htmlFor={field.name} label={label} />
        <div ref={inputRef}>
          <input id={field.name} type="hidden" name={field.name} value={value ?? ''} />
          <PlainButton
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className={cn(
              'relative inline-flex w-full items-center justify-between gap-4 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900',
              hasError ? 'border-danger ring-danger text-danger focus:text-gray-900' : ''
            )}
          >
            {selectedDate ? selectedDate.toLocaleDateString('pl-PL', { month: '2-digit', year: 'numeric' }) : placeholder}
            <span className="flex items-center gap-2">
              <FieldErrorTriangle hasError={hasError} />
              <div ref={portalContainerRef}></div>
              {!selectedDate && <CalendarEventIcon className="h-4 w-4" />}
            </span>
          </PlainButton>
          {selectedDate && portalContainer
            ? createPortal(
                <PlainButton
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setSelectedDate(undefined);
                    field.handleChange(undefined);
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
        <FieldErrorsBlock errors={normalizedErrors} />
      </div>
      <AnimatePresence>
        {expanded && (
          <DropdownModal dropdownRef={dropdownRef} inputRef={inputRef} top={top} left={left} direction={direction}>
            <AppMonthPicker
              selectedDate={selectedDate}
              onSelectMonth={(newDate) => {
                setSelectedDate(newDate);
                field.handleChange(getLooseValueFromDate(newDate));
                setExpanded(false);
              }}
            />
          </DropdownModal>
        )}
      </AnimatePresence>
    </>
  );
}
