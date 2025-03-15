import ChevronDownIcon from 'bootstrap-icons/icons/chevron-down.svg?react';
import ChevronUpIcon from 'bootstrap-icons/icons/chevron-up.svg?react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { AppButton } from '@/core/components/AppButton';
import { AppMonthPicker } from '@/core/components/inputs/dates/AppMonthPicker';
import { useDropdown } from '@/core/hooks/DropdownHook';
import { useOutsideClickDetection } from '@/core/hooks/OutsideClickDetectionHook';
import { cn } from '@/core/lib/utils';

type Props = {
  value: { month: number; year: number };
  onChange: ({ month, year }: { month: number; year: number }) => void;

  renderDate?: ({ month, year }: { month: number; year: number }) => React.ReactNode;
};
export function AppMonthPickerPopover({ value, onChange, renderDate }: Props) {
  const [expanded, setExpanded] = React.useState(false);

  const inputRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useOutsideClickDetection({
    refs: [inputRef, dropdownRef],
    onOutsideClick: () => {
      setExpanded(false);
    },
  });

  function handleInputClick() {
    setExpanded(!expanded);
  }

  function handleSelectMonth(newDate: Date) {
    onChange({ month: newDate.getMonth(), year: newDate.getFullYear() });
    setExpanded(false);
  }

  return (
    <>
      <div className={cn()} ref={inputRef}>
        <AppButton
          variant="plain"
          onClick={handleInputClick}
          className={cn('relative inline-flex gap-4 justify-between items-center text-sm rounded-lg w-full')}
        >
          {renderDate
            ? renderDate(value)
            : new Date(value.year, value.month).toLocaleDateString('pl-PL', { month: '2-digit', year: 'numeric' })}
          <span className="flex gap-2">
            <span>{expanded ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}</span>
          </span>
        </AppButton>
      </div>
      <AnimatePresence>
        {expanded && (
          <Modal dropdownRef={dropdownRef} inputRef={inputRef}>
            <AppMonthPicker selectedDate={new Date(value.year, value.month)} onSelectMonth={handleSelectMonth} />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
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
