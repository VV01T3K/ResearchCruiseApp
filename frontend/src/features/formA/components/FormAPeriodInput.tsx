import { cn } from '@lib/utils';
import { Ranger, useRanger } from '@tanstack/react-ranger';
import React from 'react';

type Props = {
  value: number[];
  maxValues?: number[];
  onChange: (value: number[]) => void;
  onBlur: () => void;
  error: string;
  label: string;
};

export function FormAPeriodInput({ value, label, onChange, onBlur, error, maxValues }: Props) {
  const rangerRef = React.useRef<HTMLDivElement>(null);
  const [values, setValues] = React.useState<ReadonlyArray<number>>(() => {
    if (value.length === 2) {
      return value;
    }

    if (maxValues?.length === 2) {
      return maxValues;
    }

    return [0, 23];
  });

  React.useMemo(() => {
    if (!maxValues) {
      return;
    }

    const intMaxValues = maxValues.sort((a, b) => a - b);
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

    if (changed) {
      setValues(tmpValues);
    }
  }, [maxValues, values]);

  const rangerInstance = useRanger<HTMLDivElement>({
    getRangerElement: () => rangerRef.current,
    values,
    min: 0,
    max: 23,
    stepSize: 1,
    onDrag: (instance: Ranger<HTMLDivElement>) => {
      const values = instance.sortedValues as number[];
      if (values[0] === values[1]) {
        return;
      }
      if (maxValues) {
        if (values[0] < maxValues[0]) {
          values[0] = maxValues[0];
        }
        if (values[1] > maxValues[1]) {
          values[1] = maxValues[1];
        }
      }
      setValues(values);
      onChange(values);
    },
  });

  const stepPositions = Array.from(Array(24).keys()).map((i) => rangerInstance.getPercentageForValue(i));

  function getPointAtTime(position: number) {
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

  function getExplanationForPeriod(start: number, end: number) {
    if (start === 0 && end === 23) {
      return 'Cały rok';
    }

    return `od początku ${getPointAtTime(start)} do końca ${getPointAtTime(end)}`;
  }

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
      {label && <label className={cn('block mb-2 text-sm font-medium text-gray-900')}>{label}</label>}
      <div ref={rangerRef} className="relative select-none h-1 bg-black/5 rounded-sm mt-4 mb-20 mx-8" onBlur={onBlur}>
        <span
          className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 z-0 bg-primary-800"
          style={{
            left: `${getLeft() + getWidth() / 2}%`,
            width: `${getWidth()}%`,
          }}
        />
        {rangerInstance.handles().map(({ value, onKeyDownHandler, onMouseDownHandler, onTouchStart, isActive }) => (
          <button
            key={value}
            type="button"
            onKeyDown={onKeyDownHandler}
            onMouseDown={onMouseDownHandler}
            onTouchStart={onTouchStart}
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
      <div className="flex flex-row justify-between mt-2 text-sm">
        {error && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
}

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
