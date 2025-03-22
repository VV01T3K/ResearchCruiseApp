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
};
export function CruiseApplicationDropdownElementSelectorButton({ variant, options, children, disabled }: Props) {
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
        >
          <span>{children}</span>
          <DropdownIcon className="w-5 h-5" />
        </AppButton>
      </div>

      <AnimatePresence>
        {expanded && (
          <Modal dropdownRef={dropdownRef} elementRef={elementRef}>
            {filteredOptions.length === 0 && <div className="text-center text-gray-500 py-4">Brak wyników</div>}
            {filteredOptions.length > 0 && (
              <>
                <div className="sticky top-0">
                  <SearchIcon className="w-5 h-5 absolute z-10 right-5 top-2.5" />
                  <AppInput value={searchValue} onChange={setSearchValue} placeholder="Wyszukaj..." autoFocus />
                </div>
                {filteredOptions.map((option) => (
                  <AppButton
                    key={option.value}
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
                      'w-full rounded-lg focus:inset-ring-2 inset-ring-blue-500 px-2',
                      option.onClick && 'hover:bg-gray-100'
                    )}
                    disabled={!option.onClick}
                  >
                    {option.content ?? <span>{option.value}</span>}
                  </AppButton>
                ))}
              </>
            )}
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
        'fixed origin-top-right w-(--width) rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden z-50 max-h-96 overflow-y-auto'
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
