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
  onChange?: (value: CruisePeriodType) => void;
  onBlur?: () => void;
  errors?: string[];
  label: React.ReactNode;
  showRequiredAsterisk?: boolean;
  disabled?: boolean;
  helper?: React.ReactNode;
};

/**
 * Check if a value is an empty period (empty string, empty array, null, or undefined).
 */
function isEmptyPeriod(period: unknown): boolean {
  if (period === null || period === undefined || period === '') return true;
  if (Array.isArray(period) && period.length === 0) return true;
  return false;
}

/**
 * Parse a CruisePeriodType value to [start, end] numbers.
 * Always returns [start, end] where start <= end.
 * Handles arrays that might come from backend in any order (since HashSet doesn't preserve order).
 */
function parsePeriod(period: CruisePeriodType | undefined, fallback: [number, number]): [number, number] {
  if (isEmptyPeriod(period)) {
    return fallback;
  }
  if (!Array.isArray(period) || period.length !== 2) {
    return fallback;
  }
  const val1 = parseInt(period[0], 10);
  const val2 = parseInt(period[1], 10);
  if (isNaN(val1) || isNaN(val2)) {
    return fallback;
  }
  // Always sort to ensure [start, end] order since backend HashSet doesn't preserve order
  return val1 <= val2 ? [val1, val2] : [val2, val1];
}

/**
 * Check if a period value is valid (has two valid numbers).
 */
function isValidPeriod(period: CruisePeriodType | undefined): boolean {
  if (isEmptyPeriod(period)) {
    return false;
  }
  if (!Array.isArray(period) || period.length !== 2) {
    return false;
  }
  const val1 = parseInt(period[0], 10);
  const val2 = parseInt(period[1], 10);
  return !isNaN(val1) && !isNaN(val2);
}

/**
 * Clamp values to be within min/max bounds.
 */
function clampToBounds(values: [number, number], min: number, max: number): [number, number] {
  const [start, end] = values;
  const clampedStart = Math.max(min, Math.min(start, max));
  const clampedEnd = Math.max(min, Math.min(end, max));

  // Ensure start <= end and they're not equal (need at least 1 fortnight range)
  if (clampedStart >= clampedEnd) {
    // If clamping made them equal or inverted, use the full allowed range
    return [min, max];
  }

  return [clampedStart, clampedEnd];
}

export function CruiseApplicationPeriodInput({
  name,
  value,
  maxValues,
  onChange,
  onBlur,
  errors,
  label,
  showRequiredAsterisk,
  disabled,
  helper,
}: Props) {
  // Parse maxValues bounds (defaults to full year: 0-24)
  const [minBound, maxBound] = parsePeriod(maxValues, [0, 24]);

  // Track previous bounds to detect changes
  const prevBoundsRef = React.useRef({ minBound, maxBound });

  // Compute slider values from external value prop
  const computedSliderValues = React.useMemo((): [number, number] => {
    if (!isValidPeriod(value)) {
      // If external value is not valid, use full bounds
      return [minBound, maxBound];
    }
    const parsed = parsePeriod(value, [minBound, maxBound]);
    return clampToBounds(parsed, minBound, maxBound);
  }, [value, minBound, maxBound]);

  // Internal state for slider UI - used during drag operations
  const [localValues, setLocalValues] = React.useState<[number, number] | null>(null);

  // The displayed slider values: use local state during interaction, otherwise computed from prop
  const sliderValues = localValues ?? computedSliderValues;

  // When bounds change, we need to clamp and notify parent
  React.useEffect(() => {
    const prevBounds = prevBoundsRef.current;
    if (prevBounds.minBound !== minBound || prevBounds.maxBound !== maxBound) {
      prevBoundsRef.current = { minBound, maxBound };

      // Clamp current values to new bounds
      const currentValues = localValues ?? computedSliderValues;
      const clamped = clampToBounds(currentValues, minBound, maxBound);

      if (clamped[0] !== currentValues[0] || clamped[1] !== currentValues[1]) {
        // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
        setLocalValues(null); // Reset local state
        onChange?.([clamped[0].toString(), clamped[1].toString()] as CruisePeriodType);
      }
    }
  }, [minBound, maxBound, localValues, computedSliderValues, onChange]);

  // Reset local state when external value changes (e.g., form reset)
  React.useEffect(() => {
    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setLocalValues(null);
  }, [value]);

  const handleValueChange = (newValues: number | number[]) => {
    if (!Array.isArray(newValues) || newValues.length !== 2) {
      return;
    }

    // Base UI Slider always provides sorted values for range slider
    const [start, end] = newValues as [number, number];

    // Don't allow zero-width ranges
    if (start === end) {
      return;
    }

    // Clamp to bounds (shouldn't be needed if slider is configured correctly, but safety check)
    const clamped = clampToBounds([start, end], minBound, maxBound);

    setLocalValues(clamped);
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
