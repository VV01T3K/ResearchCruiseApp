import ChevronDownIcon from 'bootstrap-icons/icons/chevron-down.svg?react';
import ChevronUpIcon from 'bootstrap-icons/icons/chevron-up.svg?react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { AppButton, AppButtonVariant } from '@/core/components/AppButton';
import { useDropdown } from '@/core/hooks/DropdownHook';
import { useOutsideClickDetection } from '@/core/hooks/OutsideClickDetectionHook';
import { cn } from '@/core/lib/utils';

type Props = {
  children: React.ReactNode;
  modal: (setExpanded: (value: boolean) => void) => React.ReactNode;

  className?: string;
  variant?: AppButtonVariant;
};
export function AppPopover({ children, modal, className, variant = 'plain' }: Props) {
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = React.useState(false);

  useOutsideClickDetection({
    refs: [anchorRef, dropdownRef],
    onOutsideClick: () => setExpanded(false),
  });

  return (
    <>
      <div ref={anchorRef}>
        <AppButton
          variant={variant}
          onClick={() => setExpanded(!expanded)}
          className={cn(
            'cursor-pointer text-sm gap-2',
            'ring-2 ring-transparent focus:ring-blue-500 focus:border-blue-500 focus:rounded-lg focus:shadow focus:outline-none',
            className
          )}
        >
          {children}
          <span>{expanded ? <ChevronUpIcon className="w-6 h-6" /> : <ChevronDownIcon className="w-6 h-6" />}</span>
        </AppButton>
      </div>

      <AnimatePresence>
        {expanded && (
          <Modal anchorRef={anchorRef} dropdownRef={dropdownRef}>
            {modal(setExpanded)}
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

type ModalProps = {
  anchorRef: React.RefObject<HTMLDivElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
  dropdownPosition?: 'left' | 'center' | 'right';
};
function Modal({ anchorRef, dropdownRef, children }: ModalProps) {
  const { top, left, width, direction } = useDropdown({
    openingItemRef: anchorRef,
    dropdownRef,
    dropdownPosition: 'left',
  });

  return (
    <motion.div
      style={{ top: top, left: left, width: width }}
      className={cn(
        'fixed origin-top-right w-(--width) rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden z-50'
      )}
      initial={{ opacity: 0, translateY: direction === 'up' ? '-10%' : '10%' }}
      animate={{ opacity: 1, translateY: '0' }}
      exit={{ opacity: 0, translateY: direction === 'down' ? '-10%' : '10%' }}
      transition={{ ease: 'easeOut', duration: 0.2 }}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      ref={dropdownRef}
      tabIndex={-1}
    >
      {children}
    </motion.div>
  );
}
