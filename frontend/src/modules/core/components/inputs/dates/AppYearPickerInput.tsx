'use client';

import CalendarEventIcon from 'bootstrap-icons/icons/calendar-event.svg?react';
import ChevronLeftIcon from 'bootstrap-icons/icons/chevron-left.svg?react';
import ChevronRightIcon from 'bootstrap-icons/icons/chevron-right.svg?react';
import XLgIcon from 'bootstrap-icons/icons/x-lg.svg?react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';
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
  required?: boolean;
  disabled?: boolean;
  helper?: React.ReactNode;
  placeholder?: string;
};
export function AppYearPickerInput({
  name,
  value,
  onChange,
  onBlur,
  errors,
  label,
  required,
  disabled,
  helper,
  placeholder = 'Wybierz rok',
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
  const removeSelectedYearPortalRef = React.useRef<HTMLDivElement>(null);

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
      <div className="flex flex-col">
        <AppInputLabel name={name} label={label} />
        <div className={cn()} ref={elementRef}>
          <input type="hidden" name={name} value={value} required={required} disabled={disabled} />
          <AppButton
            variant="plain"
            onClick={() => handleInputClick()}
            className={cn(
              'relative inline-flex gap-4 justify-between items-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full',
              disabled ? 'bg-gray-200' : '',
              errors ? 'border-danger ring-danger text-danger focus:text-gray-900' : ''
            )}
          >
            {selectedYear ?? placeholder}
            <span className="flex gap-2 items-center">
              <AppInputErrorTriangle errors={errors} />
              <div ref={removeSelectedYearPortalRef}></div>
              {!selectedYear && <CalendarEventIcon className="h-4 w-4" />}
            </span>
          </AppButton>
          {!!selectedYear &&
            removeSelectedYearPortalRef.current &&
            createPortal(
              <AppButton
                variant="plain"
                onClick={(evt) => handleResetSelection(evt)}
                className="inline-block p-0 hover:text-red-500"
              >
                <XLgIcon className="h-4 w-4" />
              </AppButton>,
              removeSelectedYearPortalRef.current!
            )}
        </div>
        <div className={cn('flex flex-row justify-between text-sm', errors || helper ? 'mt-2' : '')}>
          <AppInputHelper helper={helper} />
          <AppInputErrorsList errors={errors} />
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <Modal dropdownRef={dropdownRef} elementRef={elementRef}>
            <div className="grid grid-cols-5 items-center px-2 py-2">
              <AppButton
                variant="plain"
                onClick={() => setVisibleDecade((prev) => ({ from: prev.from - 11, to: prev.to - 11 }))}
                className="w-full rounded-lg grid place-items-center hover:bg-gray-100"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </AppButton>
              <span className="font-bold col-span-3 inline-flex gap-2 justify-center items-center">{`${visibleDecade.from}-${visibleDecade.to}`}</span>
              <AppButton
                variant="plain"
                onClick={() => setVisibleDecade((prev) => ({ from: prev.from + 11, to: prev.to + 11 }))}
                className="w-full rounded-lg grid place-items-center hover:bg-gray-100"
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
                      'rounded-lg grid place-items-center hover:bg-gray-100',
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
        'fixed origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden z-50'
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
