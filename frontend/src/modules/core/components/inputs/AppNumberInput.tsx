import DashLgIcon from 'bootstrap-icons/icons/dash-lg.svg?react';
import PlusLgIcon from 'bootstrap-icons/icons/plus-lg.svg?react';
import React from 'react';

import { AppButton } from '@/core/components/AppButton';
import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppInputErrorTriangle } from '@/core/components/inputs/parts/AppInputErrorTriangle';
import { AppInputHelper } from '@/core/components/inputs/parts/AppInputHelper';
import { AppInputLabel } from '@/core/components/inputs/parts/AppInputLabel';
import { useInputCursorPosition } from '@/core/hooks/InputCursorPositionHook';
import { cn, roundNumber } from '@/core/lib/utils';

type Props = {
  name: string;
  value: number;

  onBlur?: () => void;
  onChange?: (value: number) => void;
  errors?: string[];
  label?: React.ReactNode;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  helper?: React.ReactNode;
  minimum?: number;
  maximum?: number;
  step?: number;
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
  errors,
  label,
  required,
  className,
  disabled,
  helper,
  minimum,
  maximum,
  step = 1,
  type = 'integer',
  precision = 2,
}: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [stringValue, setStringValue] = React.useState(value.toString());
  const setCursorPosition = useInputCursorPosition({ inputRef });

  // Update the string value when the value changes
  React.useEffect(() => {
    // We want to round even the integer values to the precision, if such value was provided, but we don't want to add zeros at the end
    const newStringValue = type === 'integer' ? roundNumber(value, precision).toString() : value.toFixed(precision);
    if (newStringValue !== stringValue) {
      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
      setStringValue(newStringValue);
    }
  }, [precision, stringValue, type, value]);

  function handleInputChange(evt: React.ChangeEvent<HTMLInputElement>) {
    const stringInput = evt.target.value.replace(',', '.'); // float input require dot as the decimal separator

    // Calculate the cursor position after removing the zeros at the beginning of the string
    let cursorPosition = evt.target.selectionStart!;
    const zerosAtBeginningRegex = /^0+/;
    const zerosAtBeginningCount = stringInput.match(zerosAtBeginningRegex)?.[0].length;
    cursorPosition -= zerosAtBeginningCount ?? 0;
    setCursorPosition(cursorPosition);

    if (stringInput === '') {
      updateValue(0);
      // Set the cursor after the zero
      setCursorPosition(1);
      return;
    }

    const parsedValue = type === 'integer' ? parseInt(stringInput) : parseFloat(stringInput);

    // If the input contains a number followed by a dot, we don't want to set the value to the parsed number
    const numberWithDotRegex = /^-{0,1}\d*\.$/;
    if (type === 'float' && numberWithDotRegex.test(stringInput)) {
      setStringValue(stringInput);
      return;
    }
    if (isNaN(parsedValue)) {
      return;
    }

    updateValue(parsedValue);
  }

  function updateValue(newValue: number) {
    newValue = roundNumber(newValue, type === 'float' ? precision! : 0);

    if (minimum !== undefined && newValue < minimum) {
      newValue = minimum;
    } else if (maximum !== undefined && newValue > maximum) {
      newValue = maximum;
    }

    onChange?.(newValue);
    onBlur?.();
  }

  return (
    <div className={cn(className, 'flex flex-col')}>
      <AppInputLabel name={name} label={label} />
      <div className="flex items-center">
        {!disabled && (
          <AppNumberInputButton
            onClick={() => updateValue(value - step)}
            side="left"
            disabled={false}
            inputToFocus={inputRef}
          />
        )}
        <div className="relative w-full">
          <input
            name={name}
            value={stringValue}
            onChange={handleInputChange}
            onBlur={onBlur}
            required={required}
            disabled={disabled}
            className={cn(
              'bg-gray-50 border border-gray-300 h-11 text-center text-gray-900 text-sm block w-full py-2.5',
              'transition duration-300 ease-in-out',
              'focus:ring-primary focus:border-primary focus:shadow focus:outline-none transform:scale-105',
              disabled ? 'rounded-lg bg-gray-200' : '',
              errors?.length ? 'border-danger ring-danger text-danger focus:text-gray-900' : ''
            )}
            ref={inputRef}
          />
          <AppInputErrorTriangle errors={errors} mode={'absolute'} />
        </div>
        {!disabled && (
          <AppNumberInputButton
            onClick={() => updateValue(value + step)}
            side="right"
            disabled={false}
            inputToFocus={inputRef}
          />
        )}
      </div>
      <div className="flex flex-col justify-between mt-2 text-sm">
        <AppInputHelper helper={helper} />
        <AppInputErrorsList errors={errors} />
      </div>
    </div>
  );
}

type ButtonProps = {
  side: 'left' | 'right';
  inputToFocus: React.RefObject<HTMLInputElement | null>;
  onClick: (() => void) | undefined;
  disabled: boolean | undefined;
};
function AppNumberInputButton({ side, inputToFocus, onClick, disabled }: ButtonProps) {
  function handleClick() {
    onClick?.();
    inputToFocus.current?.focus();
    inputToFocus.current?.blur();
  }

  return (
    <AppButton
      onClick={() => handleClick()}
      disabled={disabled}
      className={cn(
        'h-11 w-11 flex items-center justify-center',
        'text-gray-500',
        'transition duration-300 ease-in-out',
        'focus:ring-primary focus:border-primary focus:shadow focus:outline-none',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'px-2 border border-collapse border-gray-300',
        side === 'left' ? 'rounded-l' : 'rounded-r',
        disabled ? 'bg-gray-300' : 'bg-gray-100 hover:text-gray-900'
      )}
      variant="plain"
      size="plain"
    >
      {side === 'left' ? <DashLgIcon /> : <PlusLgIcon />}
    </AppButton>
  );
}
