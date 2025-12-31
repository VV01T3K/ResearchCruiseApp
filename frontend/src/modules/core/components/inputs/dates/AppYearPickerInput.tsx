'use client';

import CalendarEventIcon from 'bootstrap-icons/icons/calendar-event.svg?react';
import ChevronLeftIcon from 'bootstrap-icons/icons/chevron-left.svg?react';
import ChevronRightIcon from 'bootstrap-icons/icons/chevron-right.svg?react';
import XLgIcon from 'bootstrap-icons/icons/x-lg.svg?react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';

import { AppButton } from '@/core/components/AppButton';
import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppInputErrorTriangle } from '@/core/components/inputs/parts/AppInputErrorTriangle';
import { AppInputHelper } from '@/core/components/inputs/parts/AppInputHelper';
import { AppInputLabel } from '@/core/components/inputs/parts/AppInputLabel';
import { useDropdown } from '@/core/hooks/DropdownHook';
import { useOutsideClickDetection } from '@/core/hooks/OutsideClickDetectionHook';
import { cn } from '@/core/lib/utils';

type Props = {
  name: string;
  value: number | undefined;

  onChange?: (value: number | undefined) => void;
  onBlur?: () => void;
  errors?: string[];
  label?: React.ReactNode;
  showRequiredAsterisk?: boolean;
  disabled?: boolean;
  helper?: React.ReactNode;
  placeholder?: string;
  'data-testid'?: string;
  'data-testid-button'?: string;
  'data-testid-errors'?: string;
};
export function AppYearPickerInput({
  name,
  value,
  onChange,
  onBlur,
  errors,
  label,
  showRequiredAsterisk,
  disabled,
  helper,
  placeholder = 'Wybierz rok',
  'data-testid': testId,
  'data-testid-button': buttonTestId,
  'data-testid-errors': errorsTestId,
}: Props) {
  const [selectedYear, setSelectedYear] = React.useState<number | undefined>(value);
  const [visibleDecade, setVisibleDecade] = React.useState<{ from: number; to: number }>(() => {
    const now = new Date().getFullYear();
    const from = Math.floor(now / 10) * 10;
    const to = from + 11;
    return { from, to };
  });
  const [expanded, setExpanded] = React.useState(false);

  const elementRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);
  const portalContainerRef = useCallback((node: HTMLDivElement | null) => setPortalContainer(node), []);

  React.useEffect(() => {
    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setSelectedYear(value);
  }, [value]);

  useOutsideClickDetection({
    refs: [elementRef, dropdownRef],
    onOutsideClick: () => {
      setExpanded(false);
      onBlur?.();
    },
  });

  function handleInputClick() {
    if (disabled) {
      return;
    }

    setExpanded(!expanded);
  }

  function handleResetSelection(evt: React.MouseEvent) {
    setSelectedYear(undefined);
    onChange?.(undefined);
    onBlur?.();
    setExpanded(false);
    evt.preventDefault();
    evt.stopPropagation();
  }

  function handleSelectYear(newYear: number): void {
    setSelectedYear(newYear);
    onChange?.(newYear);
    onBlur?.();
    setExpanded(false);
  }

  return (
    <>
      <div className="flex flex-col" data-testid={testId}>
        <AppInputLabel name={name} value={label} showRequiredAsterisk={showRequiredAsterisk} />
        <div className={cn()} ref={elementRef}>
          <input type="hidden" name={name} value={value} disabled={disabled} />
          <AppButton
            variant="plain"
            onClick={() => handleInputClick()}
            className={cn(
              'relative inline-flex w-full items-center justify-between gap-4 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900',
              disabled ? 'bg-gray-200 hover:cursor-default' : '',
              errors ? 'border-danger ring-danger text-danger focus:text-gray-900' : ''
            )}
            data-testid={buttonTestId}
          >
            {selectedYear ?? placeholder}
            <span className="flex items-center gap-2">
              <AppInputErrorTriangle errors={errors} />
              <div ref={portalContainerRef}></div>
              {!selectedYear && <CalendarEventIcon className="h-4 w-4" />}
            </span>
          </AppButton>
          <RemoveSelectedYearPortal
            selectedYear={selectedYear}
            disabled={disabled}
            portalContainer={portalContainer}
            onResetSelection={handleResetSelection}
          />
        </div>
        <div className={cn('flex flex-row justify-between text-sm', errors || helper ? 'mt-2' : '')}>
          <AppInputHelper helper={helper} />
          <AppInputErrorsList errors={errors} data-testid={errorsTestId} />
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <Modal dropdownRef={dropdownRef} elementRef={elementRef}>
            <div className="grid grid-cols-5 items-center px-2 py-2">
              <AppButton
                variant="plain"
                onClick={() => setVisibleDecade((prev) => ({ from: prev.from - 11, to: prev.to - 11 }))}
                className="grid w-full place-items-center rounded-lg hover:bg-gray-100"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </AppButton>
              <span className="col-span-3 inline-flex items-center justify-center gap-2 font-bold">{`${visibleDecade.from}-${visibleDecade.to}`}</span>
              <AppButton
                variant="plain"
                onClick={() => setVisibleDecade((prev) => ({ from: prev.from + 11, to: prev.to + 11 }))}
                className="grid w-full place-items-center rounded-lg hover:bg-gray-100"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </AppButton>
            </div>
            <div className="grid grid-cols-3 gap-4 px-4 py-2">
              {Array.from({ length: visibleDecade.to - visibleDecade.from + 1 })
                .map((_, index) => visibleDecade.from + index)
                .map((year) => (
                  <AppButton
                    key={year}
                    variant="plain"
                    onClick={() => handleSelectYear(year)}
                    className={cn(
                      'grid place-items-center rounded-lg hover:bg-gray-100',
                      year === selectedYear ? 'text-primary-500 font-bold' : ''
                    )}
                  >
                    {year}
                  </AppButton>
                ))}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

type ModalProps = {
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  elementRef: React.RefObject<HTMLDivElement | null>;

  children: React.ReactNode;
};
function Modal({ dropdownRef, elementRef, children }: ModalProps) {
  const { top, left, direction } = useDropdown({
    openingItemRef: elementRef,
    dropdownRef,
    dropdownPosition: 'center',
  });

  return (
    <motion.div
      style={{ top: top, left: left }}
      className={cn(
        'fixed z-50 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden'
      )}
      initial={{ opacity: 0, translateY: '-10%' }}
      animate={{ opacity: 1, translateY: '0' }}
      exit={{ opacity: 0, translateY: direction === 'up' ? '10%' : '-10%' }}
      transition={{ ease: 'easeOut', duration: 0.2 }}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      ref={dropdownRef}
    >
      {children}
    </motion.div>
  );
}

function RemoveSelectedYearPortal({
  selectedYear,
  disabled,
  portalContainer,
  onResetSelection,
}: {
  selectedYear: number | undefined;
  disabled?: boolean;
  portalContainer: HTMLDivElement | null;
  onResetSelection: (evt: React.MouseEvent) => void;
}) {
  if (!selectedYear || !portalContainer || disabled) {
    return null;
  }

  return createPortal(
    <AppButton variant="plain" onClick={(evt) => onResetSelection(evt)} className="inline-block p-0 hover:text-red-500">
      <XLgIcon className="h-4 w-4" />
    </AppButton>,
    portalContainer
  );
}
