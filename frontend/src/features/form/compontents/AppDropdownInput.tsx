import { AppButton } from '@core/components';
import { cn } from '@lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import ChevronDownIcon from 'bootstrap-icons/icons/chevron-down.svg?react';
import ChevronUpIcon from 'bootstrap-icons/icons/chevron-up.svg?react';
import React from 'react';
import { useOutsideClickDetection } from '@core/hooks/UseOutsideClickDetection';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  label: string;
  possibleValues: AppDropdownInputOption[];
  includeEmptyValue?: boolean;
  disabled?: boolean;
};

type AppDropdownInputOption = {
  value: string;
  textLabel?: string;
  richLabel?: React.ReactNode | undefined;
};

export function AppDropdownInput({
  possibleValues,
  includeEmptyValue = true,
  disabled,
  error,
  label,
  onChange,
}: Props) {
  const inputRef = React.useRef(null);
  const dropdownRef = React.useRef(null);
  const [expanded, setExpanded] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState<AppDropdownInputOption>(
    includeEmptyValue ? { value: '', textLabel: 'Wybierz...' } : possibleValues[0]
  );
  const allPossibleValues = includeEmptyValue
    ? [
        {
          value: '',
          textLabel: selectedValue.value ? 'Wybierz...' : undefined,
          richLabel: selectedValue.value ? <span className="text-red-500">Usuń aktualny wybór</span> : undefined,
        },
        ...possibleValues,
      ]
    : possibleValues;
  useOutsideClickDetection({
    refs: [inputRef, dropdownRef],
    onOutsideClick: () => setExpanded(false),
  });

  function selectOption(value: AppDropdownInputOption) {
    setSelectedValue(value);
    setExpanded(false);
    onChange(value.value);
  }

  return (
    <div className="flex flex-col">
      {label && <label className={cn('block mb-2 text-sm font-medium text-gray-900')}>{label}</label>}
      <div
        className={cn(
          'relative inline-block',
          'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full',
          'transition duration-300 ease-in-out',
          disabled ? 'bg-gray-200' : '',
          error ? 'border-danger ring-danger text-danger focus:text-gray-900' : ''
        )}
        ref={inputRef}
      >
        <AppButton
          variant="text"
          onClick={() => setExpanded(!expanded)}
          className={cn(
            'cursor-pointer w-full text-sm',
            'ring-2 ring-transparent focus:ring-blue-500 focus:border-blue-500 focus:shadow focus:outline-none'
          )}
          childrenClassName="w-full flex justify-between items-center"
        >
          {selectedValue.textLabel}
          <span className="flex gap-2">
            <span>{expanded ? <ChevronUpIcon className="w-6 h-6" /> : <ChevronDownIcon className="w-6 h-6" />}</span>
          </span>
        </AppButton>

        <AnimatePresence>
          {expanded && (
            <motion.div
              className="absolute left-0 origin-top-right w-full rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden z-50"
              initial={{ opacity: 0, translateY: '-10%' }}
              animate={{ opacity: 1, translateY: '0' }}
              exit={{ opacity: 0, translateY: '-10%' }}
              transition={{ ease: 'easeOut', duration: 0.2 }}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              ref={dropdownRef}
            >
              {allPossibleValues
                .filter((pv) => pv.textLabel)
                .map((pv) => (
                  <AppButton
                    key={pv.value}
                    variant="text"
                    className={cn(
                      'inline-flex gap-4 items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                      'ring-2 ring-transparent focus:ring-blue-500 focus:border-blue-500 focus:shadow focus:outline-none',
                      disabled ? 'opacity-50' : ''
                    )}
                    childrenClassName="w-full"
                    role="menuitem"
                    onClick={() => selectOption(pv)}
                    disabled={disabled}
                  >
                    {pv.richLabel ?? pv.textLabel}
                  </AppButton>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
