import DashLgIcon from 'bootstrap-icons/icons/dash-lg.svg?react';
import PlusLgIcon from 'bootstrap-icons/icons/plus-lg.svg?react';
import React from 'react';

import { useInputCursorPosition } from '@/hooks/shared/InputCursorPositionHook';
import { cn, roundNumber } from '@/lib/utils';

import { FieldErrorsBlock, FieldErrorTriangle, FieldLabel, PlainButton, useNormalizedFieldErrors } from './shared';

type NumberFieldProps = {
  label?: React.ReactNode;
  minimum?: number;
  maximum?: number;
  step?: number;
  type?: 'integer' | 'float';
  precision?: number;
};

export function NumberField({
  label,
  minimum,
  maximum,
  step = 1,
  type = 'integer',
  precision = 2,
}: NumberFieldProps) {
  const { field, hasError, normalizedErrors } = useNormalizedFieldErrors<number | string>();
  const numericValue =
    typeof field.state.value === 'number'
      ? field.state.value
      : type === 'float'
        ? parseFloat(field.state.value || '0')
        : parseInt(field.state.value || '0');
  const safeValue = globalThis.Number.isNaN(numericValue) ? 0 : numericValue;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [stringValue, setStringValue] = React.useState(safeValue.toString());
  const setCursorPosition = useInputCursorPosition({ inputRef });

  React.useEffect(() => {
    const roundedValue = roundNumber(safeValue, type === 'float' ? precision : 0);
    const nextStringValue = roundedValue.toString();
    if (nextStringValue !== stringValue) {
      setStringValue(nextStringValue);
    }
  }, [precision, safeValue, stringValue, type]);

  function commitValue(newValue: number) {
    let nextValue = roundNumber(newValue, type === 'float' ? precision : 0);
    if (minimum !== undefined && nextValue < minimum) nextValue = minimum;
    else if (maximum !== undefined && nextValue > maximum) nextValue = maximum;

    if (typeof field.state.value === 'number') field.handleChange(nextValue);
    else field.handleChange(nextValue.toString());
    field.handleBlur();
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const stringInput = event.target.value.replace(',', '.');
    let cursorPosition = event.target.selectionStart ?? stringInput.length;
    const zerosAtBeginningCount = stringInput.match(/^0+/)?.[0].length ?? 0;
    cursorPosition -= zerosAtBeginningCount;
    setCursorPosition(cursorPosition);

    if (stringInput === '') {
      commitValue(0);
      setCursorPosition(1);
      return;
    }

    const parsedValue = type === 'integer' ? parseInt(stringInput) : parseFloat(stringInput);
    if (type === 'float' && /^-{0,1}\d*\.$/.test(stringInput)) {
      setStringValue(stringInput);
      return;
    }
    if (globalThis.Number.isNaN(parsedValue)) return;
    commitValue(parsedValue);
  }

  function NumberControlButton({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
    return (
      <PlainButton
        type="button"
        onClick={() => {
          onClick();
          inputRef.current?.focus();
          inputRef.current?.blur();
        }}
        className={cn(
          'flex h-11 w-11 items-center justify-center border-collapse border border-gray-300 px-2 text-gray-500',
          'transition duration-300 ease-in-out',
          'focus:ring-primary focus:border-primary focus:shadow focus:outline-none',
          side === 'left' ? 'rounded-l bg-gray-100 hover:text-gray-900' : 'rounded-r bg-gray-100 hover:text-gray-900'
        )}
      >
        {side === 'left' ? <DashLgIcon /> : <PlusLgIcon />}
      </PlainButton>
    );
  }

  return (
    <div className="flex flex-col" data-invalid={hasError || undefined}>
      <FieldLabel htmlFor={field.name} label={label} />
      <div className="flex items-center">
        <NumberControlButton side="left" onClick={() => commitValue(safeValue - step)} />
        <div className="relative w-full">
          <input
            ref={inputRef}
            id={field.name}
            name={field.name}
            value={stringValue}
            onChange={handleInputChange}
            onBlur={field.handleBlur}
            className={cn(
              'block h-11 w-full border border-gray-300 bg-gray-50 py-2.5 text-center text-sm text-gray-900',
              'transition duration-300 ease-in-out',
              'focus:ring-primary focus:border-primary transform:scale-105 focus:shadow focus:outline-none',
              hasError ? 'border-danger ring-danger text-danger focus:text-gray-900' : ''
            )}
          />
          <FieldErrorTriangle hasError={hasError} mode="absolute" />
        </div>
        <NumberControlButton side="right" onClick={() => commitValue(safeValue + step)} />
      </div>
      <FieldErrorsBlock errors={normalizedErrors} />
    </div>
  );
}

export function IntegerField(props: Omit<NumberFieldProps, 'type' | 'precision'>) {
  return <NumberField {...props} type="integer" />;
}

export function FloatField(props: Omit<NumberFieldProps, 'type'> & { precision?: number }) {
  return <NumberField {...props} type="float" />;
}
