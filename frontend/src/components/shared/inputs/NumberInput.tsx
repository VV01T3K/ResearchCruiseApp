import { hasErrors, invalidInputClassName } from '@/components/inputs/invalidInput';
import { Field } from '@base-ui/react/field';
import { NumberField } from '@base-ui/react/number-field';
import { MinusIcon, PlusIcon } from '@phosphor-icons/react';

import { InputErrorsList } from '@/components/shared/inputs/parts/InputErrorsList';
import { InputErrorTriangle } from '@/components/shared/inputs/parts/InputErrorTriangle';
import { InputHelper } from '@/components/shared/inputs/parts/InputHelper';
import { InputLabel } from '@/components/shared/inputs/parts/InputLabel';
import { buttonClassName } from '@/components/shared/Button';
import { cn } from '@/lib/utils';

type CommonProps = {
  name: string;

  onBlur?: () => void;
  errors?: string[];
  label?: React.ReactNode;
  showRequiredAsterisk?: boolean;
  className?: string;
  disabled?: boolean;
  helper?: React.ReactNode;
  minimum?: number;
  maximum?: number;
  step?: number;
  'aria-label'?: string;
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

type Props = CommonProps &
  (
    | { nullable?: false; value: number; onChange?: (value: number) => void }
    | { nullable: true; value: number | null; onChange?: (value: number | null) => void }
  );
export function NumberInput(props: Props) {
  const {
    name,
    value,
    onBlur,
    errors,
    label,
    showRequiredAsterisk,
    className,
    disabled,
    helper,
    minimum,
    maximum,
    step = 1,
    type = 'integer',
    precision = 2,
    'aria-label': ariaLabel,
  } = props;
  return (
    <Field.Root invalid={hasErrors(errors)} className={cn(className, 'flex flex-col')}>
      {label && <Field.Label render={<InputLabel value={label} showRequiredAsterisk={showRequiredAsterisk} />} />}
      <NumberField.Root
        value={Number.isFinite(value) ? value : null}
        onValueChange={(newValue) => (props.nullable ? props.onChange?.(newValue) : props.onChange?.(newValue ?? 0))}
        min={minimum}
        max={maximum}
        step={step}
        disabled={disabled}
        locale="en-US"
        format={{ useGrouping: false, maximumFractionDigits: type === 'float' ? precision : 0 }}
      >
        <NumberField.Group className="flex items-center" aria-label={typeof label === 'string' ? label : ariaLabel}>
          {!disabled && <NumberInputButton side="left" invalid={hasErrors(errors)} />}
          <div className="@container relative w-full">
            <NumberField.Input
              name={name}
              onChange={(evt) => {
                const input = evt.currentTarget;
                const caret = input.selectionStart;
                input.value = input.value.replace(',', '.');
                const clamped = clampWhileTyping(input.value, minimum, maximum);
                if (clamped === undefined) input.setSelectionRange(caret, caret);
                else input.value = clamped;
              }}
              onPaste={pasteWithDecimalPoint}
              onBlur={onBlur}
              aria-label={ariaLabel}
              aria-labelledby={undefined}
              aria-roledescription={undefined}
              className={cn(
                'block w-full border border-border bg-surface-muted py-2.5 text-center text-sm text-foreground',
                'transition-[border-color,box-shadow] duration-150 ease-out',
                'focus:ring-primary focus:border-primary focus:shadow-sm focus:outline-hidden forced-colors:focus:-outline-offset-4',
                disabled ? 'rounded-lg bg-neutral-200' : 'hover:border-neutral-400',
                hasErrors(errors) && invalidInputClassName
              )}
            />
            <div className="hidden @min-[8rem]:block">
              <InputErrorTriangle errors={errors} mode={'absolute'} />
            </div>
          </div>
          {!disabled && <NumberInputButton side="right" invalid={hasErrors(errors)} />}
        </NumberField.Group>
      </NumberField.Root>
      <div className={cn('flex flex-col justify-between text-sm', hasErrors(errors) || helper ? 'mt-2' : '')}>
        {helper && <Field.Description render={<InputHelper helper={helper} />} />}
        {hasErrors(errors) && <Field.Error match render={<InputErrorsList errors={errors} />} />}
      </div>
    </Field.Root>
  );
}

// Typing more digits only moves a value further past a bound, so clamp it now instead of on blur.
function clampWhileTyping(text: string, minimum: number | undefined, maximum: number | undefined) {
  if (!/^-?\d*\.?\d*$/.test(text)) return undefined;
  const value = Number(text);
  if (!Number.isFinite(value) || !/\d/.test(text)) return undefined;
  if (maximum !== undefined && value > maximum && value >= 0) return String(maximum);
  if (minimum !== undefined && value < minimum && value < 0) return String(minimum);
  return undefined;
}

// Base UI parses pasted text itself, so a comma would be read as grouping; send it through onChange instead.
function pasteWithDecimalPoint(evt: React.ClipboardEvent<HTMLInputElement>) {
  const pasted = evt.clipboardData.getData('text/plain');
  if (!pasted.includes(',')) return;
  evt.preventDefault();
  const input = evt.currentTarget;
  const start = input.selectionStart ?? input.value.length;
  const next =
    input.value.slice(0, start) + pasted.replaceAll(',', '.') + input.value.slice(input.selectionEnd ?? start);
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, next);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.setSelectionRange(start + pasted.length, start + pasted.length);
}

function NumberInputButton({ side, invalid }: { side: 'left' | 'right'; invalid: boolean }) {
  const StepButton = side === 'left' ? NumberField.Decrement : NumberField.Increment;
  const title = side === 'left' ? 'Zmniejsz' : 'Zwiększ';
  return (
    <StepButton
      className={buttonClassName({
        variant: 'plain',
        size: 'plain',
        className: cn(
          'flex size-10.5 items-center justify-center',
          'text-muted-foreground',
          'focus:ring-primary focus:border-primary focus:shadow-sm focus:outline-hidden forced-colors:focus:-outline-offset-4 not-disabled:active:border-primary not-disabled:active:shadow-sm',
          'focus-visible:ring-inset focus-visible:ring-offset-0',
          'disabled:cursor-default disabled:opacity-50',
          'border-collapse border border-border px-2',
          side === 'left' ? 'rounded-l-lg' : 'rounded-r-lg',
          invalid && 'border-danger not-disabled:active:border-danger',
          'bg-surface-subtle hover:text-foreground'
        ),
      })}
      title={title}
      aria-label={title}
    >
      {side === 'left' ? <MinusIcon /> : <PlusIcon />}
    </StepButton>
  );
}
