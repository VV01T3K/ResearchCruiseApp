import { Popover } from '@base-ui/react/popover';
import React from 'react';

import { PickerPopup, pickerTriggerClassName } from '@/components/inputs/dates/PickerPopup';
import { hasErrors } from '@/components/inputs/invalidInput';
import { useInputAria } from '@/components/inputs/useInputAria';
import { AppButton } from '@/components/shared/AppButton';
import { AppInputErrorsList } from '@/components/shared/inputs/parts/AppInputErrorsList';
import { AppInputErrorTriangle } from '@/components/shared/inputs/parts/AppInputErrorTriangle';
import { AppInputHelper } from '@/components/shared/inputs/parts/AppInputHelper';
import { AppInputLabel } from '@/components/shared/inputs/parts/AppInputLabel';
import { cn } from '@/lib/utils';

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
  disabled,
  helper,
  placeholder,
  minimalTime,
  maximalTime,
  minuteStep = 1,
}: Props) {
  const aria = useInputAria(errors, helper);
  const [time, setTime] = React.useState<Time | undefined>(value);
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    // oxlint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setTime(value);
  }, [value]);

  if (60 % minuteStep !== 0) {
    throw new Error('minuteStep must be a divisor of 60');
  }

  function formatTime(time: Time) {
    return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`;
  }

  function handleOpenChange(open: boolean) {
    setExpanded(open);
    if (!open) onBlur?.();
  }

  return (
    <Popover.Root open={expanded} onOpenChange={handleOpenChange} modal={false}>
      <div className="flex flex-col">
        <AppInputLabel name={aria.id} value={label} />
        <div>
          <input type="hidden" name={name} value={time ? formatTime(time) : ''} disabled={disabled} />
          <Popover.Trigger
            disabled={disabled}
            {...aria.inputProps}
            className={pickerTriggerClassName({ disabled, errors, className: 'px-5 text-center' })}
          >
            <span className="w-full">{time ? formatTime(time) : placeholder}</span>
            <AppInputErrorTriangle errors={errors} />
          </Popover.Trigger>
        </div>
        <div className={cn('flex flex-col justify-between text-sm', hasErrors(errors) || helper ? 'mt-2' : '')}>
          <AppInputHelper id={aria.helperId} helper={helper} />
          <AppInputErrorsList id={aria.errorId} errors={errors} />
        </div>
      </div>
      <PickerPopup aria-label="Wybierz godzinę">
        <div className="flex flex-col gap-2 p-2">
          <div className="flex gap-2 pb-2">
            <div className="mx-2 flex h-40 flex-col overflow-y-auto rounded-4xl bg-gray-100 pt-1 pb-1">
              {Array.from({ length: 24 }).map((_, i) => {
                const isAllowed = i >= (minimalTime?.hours ?? 0) && i <= (maximalTime?.hours ?? 23);
                if (!isAllowed) {
                  return null;
                }
                return (
                  <AppButton
                    // oxlint-disable-next-line @eslint-react/no-array-index-key
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
            <div className="mx-2 flex h-40 flex-col overflow-y-auto rounded-4xl bg-gray-100 pt-1 pb-1">
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
                    // oxlint-disable-next-line @eslint-react/no-array-index-key
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
          <AppButton onClick={() => handleOpenChange(false)} className="w-full" size="sm">
            Zatwierdź
          </AppButton>
        </div>
      </PickerPopup>
    </Popover.Root>
  );
}
