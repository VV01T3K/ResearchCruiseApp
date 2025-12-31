/* eslint-disable @eslint-react/no-array-index-key */
import ChevronDownIcon from 'bootstrap-icons/icons/chevron-down.svg?react';
import ChevronUpIcon from 'bootstrap-icons/icons/chevron-up.svg?react';
import SearchIcon from 'bootstrap-icons/icons/search.svg?react';
import { AnimatePresence, motion } from 'motion/react';
import { useRef, useState } from 'react';

import { AppButton, AppButtonVariant } from '@/core/components/AppButton';
import { AppInput } from '@/core/components/inputs/AppInput';
import { useDropdown } from '@/core/hooks/DropdownHook';
import { useOutsideClickDetection } from '@/core/hooks/OutsideClickDetectionHook';
import { cn } from '@/core/lib/utils';

type Props = {
  variant: AppButtonVariant;
  options: {
    value: string;
    onClick?: () => void;
    content?: React.ReactNode;
  }[];
  children: React.ReactNode;

  disabled?: boolean;
  'data-testid'?: string;
};
export function CruiseApplicationDropdownElementSelectorButton({
  variant,
  options,
  children,
  disabled,
  'data-testid': testId,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const elementRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const DropdownIcon = expanded ? ChevronUpIcon : ChevronDownIcon;
  const filteredOptions = options.filter((option) => option.value.toLowerCase().includes(searchValue.toLowerCase()));

  useOutsideClickDetection({
    refs: [elementRef, dropdownRef],
    onOutsideClick: () => setExpanded(false),
  });

  return (
    <>
      <div ref={elementRef}>
        <AppButton
          variant={variant}
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-4"
          disabled={disabled}
          data-testid={testId}
        >
          <span>{children}</span>
          <DropdownIcon className="h-5 w-5" />
        </AppButton>
      </div>

      <AnimatePresence>
        {expanded && (
          <Modal dropdownRef={dropdownRef} elementRef={elementRef}>
            <div className="sticky top-0">
              <SearchIcon className="absolute top-2.5 right-5 z-10 h-5 w-5" />
              <AppInput value={searchValue} onChange={setSearchValue} placeholder="Wyszukaj..." autoFocus />
            </div>
            {filteredOptions.length === 0 && <div className="py-4 text-center text-gray-500">Brak wyników</div>}
            {filteredOptions.length > 0 &&
              filteredOptions.map((option, i) => (
                <AppButton
                  key={`${option.value}${i}`}
                  onClick={
                    option.onClick
                      ? () => {
                          option.onClick!();
                          setExpanded(false);
                        }
                      : undefined
                  }
                  variant="plain"
                  className={cn(
                    'w-full rounded-lg px-2 inset-ring-blue-500 focus:inset-ring-2',
                    option.onClick && 'hover:bg-gray-100'
                  )}
                  disabled={!option.onClick}
                >
                  {option.content ?? <span>{option.value}</span>}
                </AppButton>
              ))}
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

type ModalProps = {
  elementRef: React.RefObject<HTMLDivElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;

  children: React.ReactNode;
};
function Modal({ elementRef, dropdownRef, children }: ModalProps) {
  const { top, left, width, direction } = useDropdown({
    openingItemRef: elementRef,
    dropdownRef,
    dropdownPosition: 'center',
    dropdownWidthMultiplier: 1.5,
  });

  return (
    <motion.div
      style={{ top: top, left: left, width }}
      className={cn(
        'fixed z-50 max-h-96 w-(--width) origin-top-right overflow-y-auto rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden'
      )}
      ref={dropdownRef}
      initial={{ opacity: 0, translateY: direction === 'down' ? '-10%' : '10%' }}
      animate={{ opacity: 1, translateY: '0' }}
      exit={{ opacity: 0, translateY: direction === 'down' ? '-10%' : '10%' }}
      transition={{ ease: 'easeOut', duration: 0.2 }}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabIndex={-1}
    >
      {children}
    </motion.div>
  );
}
