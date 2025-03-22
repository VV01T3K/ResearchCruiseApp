import CalendarEventIcon from 'bootstrap-icons/icons/calendar-event.svg?react';
import XLgIcon from 'bootstrap-icons/icons/x-lg.svg?react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';
import { createPortal } from 'react-dom';

import { AppButton } from '@/core/components/AppButton';
import { AppMonthPicker } from '@/core/components/inputs/dates/AppMonthPicker';
import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppInputErrorTriangle } from '@/core/components/inputs/parts/AppInputErrorTriangle';
import { AppInputHelper } from '@/core/components/inputs/parts/AppInputHelper';
import { AppInputLabel } from '@/core/components/inputs/parts/AppInputLabel';
import { useDropdown } from '@/core/hooks/DropdownHook';
import { useOutsideClickDetection } from '@/core/hooks/OutsideClickDetectionHook';
import { cn } from '@/core/lib/utils';

type Props = {
  name: string;
  value: string | undefined;

  onChange?: (value: string | undefined) => void;
  onBlur?: () => void;
  errors?: string[];
  label?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  helper?: React.ReactNode;
  placeholder?: string;
};
export function AppMonthPickerInput({
  name,
  value,
  onChange,
  onBlur,
  errors,
  label,
  required,
  disabled,
  helper,
  placeholder = 'Wybierz miesiąc',
}: Props) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(() => getDateFromValue(value));
  const [expanded, setExpanded] = React.useState(false);

  const inputRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const removeSelectedDatePortalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setSelectedDate(getDateFromValue(value));
  }, [value]);

  useOutsideClickDetection({
    refs: [inputRef, dropdownRef],
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

  function handleSelectMonth(newDate: Date) {
    setSelectedDate(newDate);
    onChange?.(getValueFromDate(newDate));
    setExpanded(false);
  }

  function handleResetSelection(evt: React.MouseEvent) {
    setSelectedDate(undefined);
    onChange?.(undefined);
    setExpanded(false);
    evt.stopPropagation();
    evt.preventDefault();
  }

  return (
    <>
      <div className="flex flex-col">
        <AppInputLabel name={name} value={label} />
        <div className={cn()} ref={inputRef}>
          <input type="hidden" name={name} value={value} required={required} disabled={disabled} />
          <AppButton
            variant="plain"
            onClick={handleInputClick}
            className={cn(
              'relative inline-flex gap-4 p-2.5 justify-between items-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full',
              disabled ? 'bg-gray-200 hover:cursor-default' : '',
              errors ? 'border-danger ring-danger text-danger focus:text-gray-900' : ''
            )}
          >
            {selectedDate
              ? selectedDate.toLocaleDateString('pl-PL', { month: '2-digit', year: 'numeric' })
              : placeholder}
            <span className="flex gap-2 items-center">
              <AppInputErrorTriangle errors={errors} />
              <div ref={removeSelectedDatePortalRef}></div>
              {!selectedDate && <CalendarEventIcon className="h-4 w-4" />}
            </span>
          </AppButton>
          {selectedDate &&
            removeSelectedDatePortalRef.current &&
            !disabled &&
            createPortal(
              <AppButton variant="plain" onClick={handleResetSelection} className="inline-block p-0 hover:text-red-500">
                <XLgIcon className="h-4 w-4" />
              </AppButton>,
              removeSelectedDatePortalRef.current!
            )}
        </div>
        <div className={cn('flex flex-col justify-between text-sm', errors || helper ? 'mt-2 ' : '')}>
          <AppInputHelper helper={helper} />
          <AppInputErrorsList errors={errors} />
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <Modal dropdownRef={dropdownRef} inputRef={inputRef}>
            <AppMonthPicker selectedDate={selectedDate} onSelectMonth={handleSelectMonth} />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

function getDateFromValue(value: string | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }

  return new Date(value);
}

function getValueFromDate(date: Date | undefined): string | undefined {
  if (!date) {
    return undefined;
  }

  return date.toISOString();
}

type ModalProps = {
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLDivElement | null>;

  children: React.ReactNode;
  className?: string;
};
function Modal({ dropdownRef, inputRef, children, className }: ModalProps) {
  const { top, left, direction } = useDropdown({
    openingItemRef: inputRef,
    dropdownRef,
    dropdownPosition: 'center',
  });

  return (
    <motion.div
      style={{ top: top, left: left }}
      className={cn(
        'fixed origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden z-50',
        className
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
