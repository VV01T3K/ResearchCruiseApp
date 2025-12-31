import { NumberField } from '@base-ui/react/number-field';
import DashLgIcon from 'bootstrap-icons/icons/dash-lg.svg?react';
import PlusLgIcon from 'bootstrap-icons/icons/plus-lg.svg?react';
import { useRef } from 'react';

import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppInputErrorTriangle } from '@/core/components/inputs/parts/AppInputErrorTriangle';
import { AppInputHelper } from '@/core/components/inputs/parts/AppInputHelper';
import { AppInputLabel } from '@/core/components/inputs/parts/AppInputLabel';
import { cn } from '@/core/lib/utils';

type Props = {
  name: string;
  value: number;

  onBlur?: () => void;
  onChange?: (value: number) => void;
  onRawChange?: (value: string) => void;
  errors?: string[];
  label?: React.ReactNode;
  showRequiredAsterisk?: boolean;
  className?: string;
  disabled?: boolean;
  helper?: React.ReactNode;
  minimum?: number;
  maximum?: number;
  step?: number;
  /** Whether to clamp the input value to min/max immediately as the user types. Defaults to true. Set to false to allow typing beyond limits. */
  clampOnInput?: boolean;
  'data-testid'?: string;
  'data-testid-input'?: string;
  'data-testid-errors'?: string;
} & (
  | {
      type?: 'integer';
      precision?: never;
    }
  | {
      type: 'float';
      precision?: number;
    }
);
export function AppNumberInput({
  name,
  value,
  onBlur,
  onChange,
  onRawChange,
  errors,
  label,
  showRequiredAsterisk,
  className,
  disabled,
  helper,
  minimum,
  maximum,
  step = 1,
  clampOnInput = true,
  type = 'integer',
  precision = 2,
  'data-testid': testId,
  'data-testid-input': inputTestId,
  'data-testid-errors': errorsTestId,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRawChange = (rawValue: string) => {
    onRawChange?.(rawValue);
    if (clampOnInput && inputRef.current) {
      const numValue = parseFloat(rawValue);
      if (!isNaN(numValue)) {
        if (maximum !== undefined && numValue > maximum) {
          inputRef.current.value = maximum.toString();
        } else if (minimum !== undefined && numValue < minimum) {
          inputRef.current.value = minimum.toString();
        }
      }
    }
  };
  return (
    <NumberField.Root
      name={name}
      value={value}
      onValueChange={(value) => onChange?.(value ?? 0)}
      min={minimum}
      max={maximum}
      step={step}
      format={{
        maximumFractionDigits: type === 'float' ? precision : 0,
        minimumFractionDigits: 0,
      }}
      disabled={disabled}
      className={cn(className, 'flex flex-col')}
      data-testid={testId}
    >
      <AppInputLabel name={name} value={label} showRequiredAsterisk={showRequiredAsterisk} />
      <NumberField.Group className="flex items-center">
        {!disabled && (
          <NumberField.Decrement
            className={cn(
              'flex h-11 w-11 items-center justify-center',
              'text-gray-500',
              'transition duration-300 ease-in-out',
              'focus:ring-primary focus:border-primary focus:shadow focus:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'border-collapse rounded-l border border-gray-300 px-2',
              'bg-gray-100 hover:bg-gray-200 hover:text-gray-900'
            )}
          >
            <DashLgIcon />
          </NumberField.Decrement>
        )}
        <div className="relative w-full">
          <NumberField.Input
            ref={inputRef}
            onBlur={onBlur}
            onChange={(e) => handleRawChange(e.target.value)}
            className={cn(
              'block h-11 w-full border border-gray-300 bg-gray-50 py-2.5 text-center text-sm text-gray-900',
              'transition duration-300 ease-in-out',
              'focus:ring-primary focus:border-primary transform:scale-105 focus:shadow focus:outline-none',
              disabled ? 'rounded-lg bg-gray-200' : '',
              errors?.length ? 'border-danger ring-danger text-danger focus:text-gray-900' : ''
            )}
            data-testid={inputTestId}
          />
          <AppInputErrorTriangle errors={errors} mode={'absolute'} />
        </div>
        {!disabled && (
          <NumberField.Increment
            className={cn(
              'flex h-11 w-11 items-center justify-center',
              'text-gray-500',
              'transition duration-300 ease-in-out',
              'focus:ring-primary focus:border-primary focus:shadow focus:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'border-collapse rounded-r border border-gray-300 px-2',
              'bg-gray-100 hover:bg-gray-200 hover:text-gray-900'
            )}
          >
            <PlusLgIcon />
          </NumberField.Increment>
        )}
      </NumberField.Group>
      <div className="mt-2 flex flex-col justify-between text-sm">
        <AppInputHelper helper={helper} />
        <AppInputErrorsList errors={errors} data-testid={errorsTestId} />
      </div>
    </NumberField.Root>
  );
}
