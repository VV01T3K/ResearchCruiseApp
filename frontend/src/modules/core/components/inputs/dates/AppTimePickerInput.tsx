import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { AppButton } from '@/core/components/AppButton';
import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppInputHelper } from '@/core/components/inputs/parts/AppInputHelper';
import { AppInputLabel } from '@/core/components/inputs/parts/AppInputLabel';
import { useDropdown } from '@/core/hooks/DropdownHook';
import { useOutsideClickDetection } from '@/core/hooks/OutsideClickDetectionHook';
import { cn } from '@/core/lib/utils';

type Time = {
  hours: number;
  minutes: number;
};

function timeToMinutes(time: Time) {
  return time.hours * 60 + time.minutes;
}

type Props = {
  name: string;
  value: Time | undefined;

  onChange: (value: Time | undefined) => void;
  onBlur?: () => void;
  errors?: string[];
  label?: string;
  required?: boolean;
  disabled?: boolean;
  helper?: React.ReactNode;
  placeholder?: string;
  minimalTime?: Time;
  maximalTime?: Time;
  minuteStep?: number;
};
export function AppDatePickerTimeInput({
  name,
  value,
  onChange,
  onBlur,
  errors,
  label,
  required,
  disabled,
  helper,
  placeholder,
  minimalTime,
  maximalTime,
  minuteStep = 1,
}: Props) {
  const [time, setTime] = React.useState<Time | undefined>(value);
  const [expanded, setExpanded] = React.useState(false);

  const inputRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setTime(value);
  }, [value]);

  useOutsideClickDetection({
    refs: [inputRef, dropdownRef],
    onOutsideClick: () => {
      setExpanded(false);
      onBlur?.();
    },
  });

  if (60 % minuteStep !== 0) {
    throw new Error('minuteStep must be a divisor of 60');
  }

  function formatTime(time: Time) {
    return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`;
  }

  function handleInputClick() {
    if (disabled) {
      return;
    }
    setExpanded(!expanded);
  }

  return (
    <>
      <div className="flex flex-col">
        <AppInputLabel name={name} value={label} />
        <div ref={inputRef}>
          <input
            type="hidden"
            name={name}
            value={time ? formatTime(time) : undefined}
            required={required}
            disabled={disabled}
          />
          <AppButton
            variant="plain"
            onClick={handleInputClick}
            className={cn(
              'relative inline-flex gap-4 justify-between items-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full',
              disabled ? 'bg-gray-200' : '',
              errors ? 'border-danger ring-danger text-danger focus:text-gray-900' : ''
            )}
          >
            <span className="w-full">{time ? formatTime(time) : placeholder}</span>
          </AppButton>
        </div>
        <div className={cn('flex flex-col justify-between text-sm', errors || helper ? 'mt-2 ' : '')}>
          <AppInputHelper helper={helper} />
          <AppInputErrorsList errors={errors} />
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <Modal dropdownRef={dropdownRef} inputRef={inputRef}>
            <div className="flex flex-col gap-2 p-2">
              <div className="flex gap-2 pb-2">
                <div className="h-40 overflow-y-auto flex flex-col rounded-4xl mx-2 bg-gray-100 pt-1 pb-1">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const isAllowed = i >= (minimalTime?.hours ?? 0) && i <= (maximalTime?.hours ?? 23);
                    if (!isAllowed) {
                      return null;
                    }
                    return (
                      <AppButton
                        // eslint-disable-next-line @eslint-react/no-array-index-key
                        key={i}
                        variant="plain"
                        onClick={() => {
                          onChange({
                            hours: i,
                            minutes: i === minimalTime?.hours ? (minimalTime?.minutes ?? 0) : 0,
                          });
                        }}
                        className={cn(
                          i === time?.hours ? 'bg-blue-500 text-white' : 'hover:bg-gray-200',
                          'rounded-4xl transition'
                        )}
                      >
                        {i.toString().padStart(2, '0')}
                      </AppButton>
                    );
                  })}
                </div>
                <div className="h-40 overflow-y-auto flex flex-col rounded-4xl mx-2 bg-gray-100 pt-1 pb-1">
                  {Array.from({ length: 60 / minuteStep }).map((_, i) => {
                    const minutes = i * minuteStep;
                    const totalMinutes = timeToMinutes({ hours: (time?.hours || minimalTime?.hours) ?? 0, minutes });
                    const isAllowed =
                      totalMinutes >= timeToMinutes(minimalTime ?? { hours: 0, minutes: 0 }) &&
                      totalMinutes <= timeToMinutes(maximalTime ?? { hours: 23, minutes: 59 });
                    if (!isAllowed) {
                      return null;
                    }

                    return (
                      <AppButton
                        // eslint-disable-next-line @eslint-react/no-array-index-key
                        key={i}
                        variant="plain"
                        onClick={() => {
                          onChange({ hours: time?.hours || 0, minutes });
                        }}
                        className={cn(
                          minutes === time?.minutes ? 'bg-blue-500 text-white' : 'hover:bg-gray-200',
                          'rounded-4xl transition'
                        )}
                      >
                        {minutes.toString().padStart(2, '0')}
                      </AppButton>
                    );
                  })}
                </div>
              </div>
              <AppButton
                onClick={() => {
                  setExpanded(false);
                  onBlur?.();
                }}
                className="w-full"
                size="sm"
              >
                Zatwierdź
              </AppButton>
            </div>
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
