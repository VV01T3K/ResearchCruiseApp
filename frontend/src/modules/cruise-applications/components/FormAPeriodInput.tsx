import { Ranger, useRanger } from '@tanstack/react-ranger';
import React from 'react';

import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppInputHelper } from '@/core/components/inputs/parts/AppInputHelper';
import { AppInputLabel } from '@/core/components/inputs/parts/AppInputLabel';
import { cn } from '@/core/lib/utils';
import { CruisePeriodType } from '@/cruise-applications/models/FormADto';

const months = [
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień',
];

function getPointAtTime(position: number): string {
  const pointAtTimeMonths = [
    'stycznia',
    'lutego',
    'marca',
    'kwietnia',
    'maja',
    'czerwca',
    'lipca',
    'sierpnia',
    'września',
    'października',
    'listopada',
    'grudnia',
  ];

  const week = position % 2 == 0 ? '1. połowy' : '2. połowy';
  const month = pointAtTimeMonths[Math.floor(position / 2)];
  return `${week} ${month}`;
}

function getExplanationForPeriod(start: number, end: number): string {
  if (start === 0 && end === 24) {
    return 'Cały rok';
  }

  return `od początku ${getPointAtTime(start)} do końca ${getPointAtTime(end - 1)}`;
}

type Props = {
  name: string;
  value: CruisePeriodType;

  maxValues?: CruisePeriodType;
  onChange?: (value: CruisePeriodType) => void;
  onBlur?: () => void;
  errors?: string[];
  label: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  helper?: React.ReactNode;
};

export function FormAPeriodInput({
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
    if (value.length === 2) {
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
    }
  }, [maxValues, values]);

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
      if (onChange) {
        onChange(sortedValues.map((v) => v.toString()) as CruisePeriodType);
      }
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
      <AppInputLabel name={name} label={label} />
      <input type="hidden" name={name} value={values.join(',')} required={required} disabled={disabled} />

      <div
        ref={rangerRef}
        className="relative select-none h-1 bg-black/5 rounded-sm mt-4 mb-20 mx-8 touch-none"
        onBlur={onBlur}
      >
        <span
          className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 z-0 bg-primary-800"
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
                `absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 outline-none rounded-full bg-primary-800 duration-75 cursor-pointer z-10`,
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
              className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 w-2.5 h-2.5 outline-none rounded-full bg-white border border-primary-800"
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
