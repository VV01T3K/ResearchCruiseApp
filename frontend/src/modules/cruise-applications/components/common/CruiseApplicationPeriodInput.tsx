import { Ranger, useRanger } from '@tanstack/react-ranger';
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
  required?: boolean;
  disabled?: boolean;
  helper?: React.ReactNode;
};

export function CruiseApplicationPeriodInput({
  name,
  value,
  maxValues,
  onChange,
  onBlur,
  errors,
  label,
  required,
  disabled,
  helper,
}: Props) {
  const rangerRef = React.useRef<HTMLDivElement>(null);

  const [values, setValues] = React.useState(() => {
    if (value?.length === 2) {
      return [parseInt(value[0]), parseInt(value[1])];
    }

    if (maxValues?.length === 2) {
      return [parseInt(maxValues[0]), parseInt(maxValues[1])];
    }

    return [0, 24];
  });

  React.useMemo(() => {
    if (!maxValues) {
      return;
    }

    const intMaxValues = maxValues.map((x) => parseInt(x)).sort((a, b) => a - b);
    const tmpValues = [...values].sort((a, b) => a - b);
    let changed = false;

    if (values[0] < intMaxValues[0]) {
      tmpValues[0] = intMaxValues[0];
      changed = true;
    }
    if (values[1] > intMaxValues[1]) {
      tmpValues[1] = intMaxValues[1];
      changed = true;
    }

    if (tmpValues[0] >= tmpValues[1]) {
      tmpValues[0] = intMaxValues[0];
      tmpValues[1] = intMaxValues[1];
      changed = true;
    }

    if (changed) {
      setValues(tmpValues);
      onChange?.(tmpValues.map((v) => v.toString()) as CruisePeriodType);
    }
  }, [maxValues, onChange, values]);

  const rangerInstance = useRanger<HTMLDivElement>({
    getRangerElement: () => rangerRef.current,
    values,
    min: 0,
    max: 24,
    stepSize: 1,
    onDrag: (instance: Ranger<HTMLDivElement>) => {
      const sortedValues = instance.sortedValues as number[];

      if (sortedValues[0] === sortedValues[1]) {
        return;
      }

      if (values[0] === sortedValues[0] && values[1] === sortedValues[1]) {
        return;
      }

      if (values[0] > sortedValues[1] || values[1] < sortedValues[0]) {
        return;
      }

      if (maxValues && sortedValues[0] < parseInt(maxValues[0])) {
        return;
      }

      if (maxValues && sortedValues[1] > parseInt(maxValues[1])) {
        return;
      }

      setValues(sortedValues);
      onChange?.(sortedValues.map((v) => v.toString()) as CruisePeriodType);
    },
  });

  const stepPositions = Array.from(Array(25).keys()).map((i) => rangerInstance.getPercentageForValue(i));

  function getWidth() {
    return (
      rangerInstance.getPercentageForValue(Math.max(...values)) -
      rangerInstance.getPercentageForValue(Math.min(...values))
    );
  }

  function getLeft() {
    return rangerInstance.getPercentageForValue(Math.min(...values));
  }

  return (
    <div className="flex flex-col">
      <AppInputLabel name={name} value={label} />
      <input type="hidden" name={name} value={values.join(',')} required={required} disabled={disabled} />

      <div
        ref={rangerRef}
        className="relative select-none h-1 bg-black/5 rounded-sm mt-4 mb-20 mx-8 touch-none"
        onBlur={onBlur}
      >
        <span
          className={cn(
            'absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 z-0',
            !disabled ? 'bg-primary-800' : 'bg-gray-400'
          )}
          style={{
            left: `${getLeft() + getWidth() / 2}%`,
            width: `${getWidth()}%`,
          }}
        />
        {rangerInstance
          .handles()
          .map(({ value, onKeyDownHandler, onMouseDownHandler, onTouchStart, isActive }, index) => (
            <button
              // eslint-disable-next-line @eslint-react/no-array-index-key
              key={index}
              type="button"
              onKeyDown={onKeyDownHandler}
              onMouseDown={onMouseDownHandler}
              onTouchStart={(evt) => {
                document.body.style.overflow = 'hidden';
                onTouchStart(evt);
              }}
              onTouchEnd={() => {
                document.body.style.overflow = '';
              }}
              role="slider"
              aria-valuemin={rangerInstance.options.min}
              aria-valuemax={rangerInstance.options.max}
              aria-valuenow={value}
              className={cn(
                `absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 outline-none rounded-full duration-75 z-10`,
                !disabled ? 'cursor-pointer bg-primary-800' : 'bg-gray-400',
                isActive ? 'scale-125' : ''
              )}
              style={{
                left: `${rangerInstance.getPercentageForValue(value)}%`,
              }}
              disabled={disabled}
            />
          ))}
        {stepPositions
          .filter((_, i) => i % 2 == 0)
          .map((position) => (
            <span
              key={`step-${position}`}
              className={cn(
                'absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 w-2.5 h-2.5 outline-none rounded-full bg-white border',
                !disabled ? 'border-primary-800' : 'border-gray-500'
              )}
              style={{ left: `${position}%` }}
            />
          ))}
        {stepPositions
          .filter((_, i) => i % 2 == 0)
          .map((position, i) => (
            <span
              key={`step-${position}-text`}
              className="absolute top-1/2 transform -translate-x-1/2 translate-y-8 rotate-60 z-0 text-sm text-gray-800"
              style={{ left: `${position}%` }}
            >
              {months[i]}
            </span>
          ))}
      </div>

      <p className="text-center">Wybrano okres: {getExplanationForPeriod(values[0], values[1])}</p>
      <div className="flex flex-col justify-between mt-2 text-sm">
        <AppInputHelper helper={helper} />
        <AppInputErrorsList errors={errors} />
      </div>
    </div>
  );
}
