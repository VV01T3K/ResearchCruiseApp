import { Slider } from '@base-ui/react/slider';
import React from 'react';

import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppInputHelper } from '@/core/components/inputs/parts/AppInputHelper';
import { AppInputLabel } from '@/core/components/inputs/parts/AppInputLabel';
import { months } from '@/core/lib/calendarUtils';
import { cn } from '@/core/lib/utils';
import { getExplanationForPeriod } from '@/cruise-applications/components/common/cruisePeriodExplanation';
import { CruisePeriodType } from '@/cruise-applications/models/FormADto';

type Props = {
  name: string;
  value: CruisePeriodType | undefined;

  maxValues?: CruisePeriodType;
  minPeriodValue?: number;
  onChange?: (value: CruisePeriodType) => void;
  onBlur?: () => void;
  errors?: string[];
  label: React.ReactNode;
  showRequiredAsterisk?: boolean;
  disabled?: boolean;
  helper?: React.ReactNode;
};

function parsePeriod(period: CruisePeriodType | undefined, fallback: [number, number]): [number, number] {
  if (!Array.isArray(period) || period.length !== 2) return fallback;
  const val1 = parseInt(period[0], 10);
  const val2 = parseInt(period[1], 10);
  if (isNaN(val1) || isNaN(val2)) return fallback;
  return val1 <= val2 ? [val1, val2] : [val2, val1];
}

function clampToBounds(values: [number, number], min: number, max: number): [number, number] {
  const clampedStart = Math.max(min, Math.min(values[0], max));
  const clampedEnd = Math.max(min, Math.min(values[1], max));
  return clampedStart >= clampedEnd ? [clampedStart, Math.min(clampedStart + 1, max)] : [clampedStart, clampedEnd];
}

function isValidPeriod(period: unknown): period is CruisePeriodType {
  return Array.isArray(period) && period.length === 2 && period[0] !== '' && period[1] !== '';
}

export function CruiseApplicationPeriodInput({
  name,
  value,
  maxValues,
  minPeriodValue = 0,
  onChange,
  onBlur,
  errors,
  label,
  showRequiredAsterisk,
  disabled,
  helper,
}: Props) {
  const [minBound, maxBound] = parsePeriod(maxValues, [minPeriodValue, 24]);

  const sliderValues = React.useMemo((): [number, number] => {
    const parsed = parsePeriod(value, [minBound, maxBound]);
    return clampToBounds(parsed, minBound, maxBound);
  }, [value, minBound, maxBound]);

  // When bounds change, synchronize clamped values with form state
  React.useEffect(() => {
    const clamped = sliderValues;
    const valueChanged =
      !isValidPeriod(value) || clamped[0].toString() !== value[0] || clamped[1].toString() !== value[1];
    if (valueChanged) {
      onChange?.([clamped[0].toString(), clamped[1].toString()] as CruisePeriodType);
    }
  }, [minBound, maxBound, sliderValues, onChange, value]);

  const handleValueChange = (newValues: number | number[]) => {
    if (!Array.isArray(newValues) || newValues.length !== 2) return;
    const clamped = clampToBounds(newValues as [number, number], minBound, maxBound);
    if (clamped[0] === clamped[1]) return;
    onChange?.([clamped[0].toString(), clamped[1].toString()] as CruisePeriodType);
  };
  const stepPositions = Array.from(Array(25).keys()).map((i) => (i / 24) * 100);
  return (
    <div className="flex flex-col">
      <AppInputLabel name={name} value={label} showRequiredAsterisk={showRequiredAsterisk} />
      <input type="hidden" name={name} value={sliderValues.join(',')} disabled={disabled} />

      <Slider.Root
        value={sliderValues}
        onValueChange={handleValueChange}
        onBlur={onBlur}
        min={0}
        max={24}
        step={1}
        disabled={disabled}
        className="relative mx-8 mt-4 mb-20 touch-none select-none"
      >
        <Slider.Control className="relative flex w-full items-center">
          <Slider.Track className="relative h-1 w-full rounded-sm bg-black/5">
            <Slider.Indicator className={cn('absolute h-1 rounded-sm', !disabled ? 'bg-primary-800' : 'bg-gray-400')} />
            {stepPositions
              .filter((_, i) => i % 2 === 0)
              .map((position) => (
                <span
                  key={`step-${position}`}
                  className={cn(
                    'absolute top-1/2 z-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 transform rounded-full border bg-white outline-none',
                    !disabled ? 'border-primary-800' : 'border-gray-500'
                  )}
                  style={{ left: `${position}%` }}
                />
              ))}
            {stepPositions
              .filter((_, i) => i % 2 === 0)
              .map((position, idx) => (
                <span
                  key={`step-${position}-text`}
                  className="absolute top-1/2 z-0 -translate-x-1/2 translate-y-8 rotate-60 transform text-sm text-gray-800"
                  style={{ left: `${position}%` }}
                >
                  {months[idx]}
                </span>
              ))}
          </Slider.Track>
          <Slider.Thumb
            index={0}
            className={cn(
              'absolute top-1/2 z-10 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 transform rounded-full duration-75 outline-none',
              !disabled ? 'bg-primary-800 cursor-pointer' : 'bg-gray-400',
              'data-[dragging]:scale-125'
            )}
          />
          <Slider.Thumb
            index={1}
            className={cn(
              'absolute top-1/2 z-10 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 transform rounded-full duration-75 outline-none',
              !disabled ? 'bg-primary-800 cursor-pointer' : 'bg-gray-400',
              'data-[dragging]:scale-125'
            )}
          />
        </Slider.Control>
      </Slider.Root>

      <p className="text-center">Wybrano okres: {getExplanationForPeriod(sliderValues[0], sliderValues[1])}</p>
      <div className="mt-2 flex flex-col justify-between text-sm">
        <AppInputHelper helper={helper} />
        <AppInputErrorsList errors={errors} />
      </div>
    </div>
  );
}
