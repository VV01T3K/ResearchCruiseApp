import { useSelector } from '@tanstack/react-form';
import { useFieldContext } from './context';

import { ComboboxInput } from '@/components/inputs/ComboboxInput';
import { Checkbox } from '@/components/shared/inputs/Checkbox';
import { DropdownInput } from '@/components/shared/inputs/DropdownInput';
import { FileInput } from '@/components/shared/inputs/FileInput';
import { Input } from '@/components/shared/inputs/Input';
import { NumberInput } from '@/components/shared/inputs/NumberInput';
import { DatePickerInput } from '@/components/shared/inputs/dates/DatePickerInput';
import { formatTime, TimePickerInput } from '@/components/shared/inputs/dates/TimePickerInput';
import { MonthPickerInput } from '@/components/shared/inputs/dates/MonthPickerInput';
import { InputErrorsList } from '@/components/shared/inputs/parts/InputErrorsList';
import type { FileValue } from '@/components/shared/inputs/FileInput';
import { YearPickerInput } from '@/components/shared/inputs/dates/YearPickerInput';
import { getErrors } from '@/integrations/tanstack/form/errors';
import { useUnreadableErrors } from '@/integrations/tanstack/form/unreadableValues';

function useErrors() {
  const field = useFieldContext<unknown>();
  const submissionAttempts = useSelector(field.form.store, (state) => state.submissionAttempts);
  const meta = useSelector(field.store, (state) => state.meta);
  return getErrors(meta, submissionAttempts);
}

function useStoredValueErrors(disabled: boolean | undefined) {
  const field = useFieldContext<unknown>();
  const value = useSelector(field.store, (state) => state.value);
  const errors = useErrors();
  return useUnreadableErrors(field.name, value, disabled) ?? errors;
}

type TextProps = Omit<React.ComponentProps<typeof Input>, 'name' | 'value' | 'onBlur' | 'onChange' | 'errors'> & {
  value?: string;
  onChange?: (value: string) => void;
};
type WithoutFieldProps<T> = T extends unknown
  ? Omit<T, 'name' | 'value' | 'checked' | 'onBlur' | 'onChange' | 'errors' | 'nullable'>
  : never;

// Typed values validate on submit, not blur: an error shown on mousedown moves the button being clicked (#667).
function TextField({ value, onChange, ...props }: TextProps) {
  const field = useFieldContext<string>();
  return (
    <Input
      {...props}
      name={field.name}
      value={value ?? field.state.value}
      onChange={onChange ?? field.handleChange}
      errors={useErrors()}
    />
  );
}

type NumberProps = WithoutFieldProps<React.ComponentProps<typeof NumberInput>> & {
  nullable?: boolean;
  value?: number;
  onChange?: (value: number) => void;
};

function NumberField({ nullable, value, onChange, ...props }: NumberProps) {
  const field = useFieldContext<number | null>();
  const errors = useStoredValueErrors(props.disabled);
  return nullable ? (
    <NumberInput
      {...props}
      nullable
      name={field.name}
      value={field.state.value}
      onChange={field.handleChange}
      errors={errors}
    />
  ) : (
    <NumberInput
      {...props}
      name={field.name}
      value={value ?? field.state.value!}
      onChange={onChange ?? field.handleChange}
      errors={errors}
    />
  );
}

type SelectProps = Omit<
  React.ComponentProps<typeof DropdownInput>,
  'name' | 'value' | 'onBlur' | 'onChange' | 'errors'
> & { value?: string; onChange?: (value: string) => void };

function SelectField({ value, onChange, ...props }: SelectProps) {
  const field = useFieldContext<string>();
  const errors = useErrors();
  const storedValueErrors = useStoredValueErrors(props.disabled);
  return (
    <DropdownInput
      {...props}
      name={field.name}
      value={value ?? field.state.value}
      onBlur={field.handleBlur}
      onChange={onChange ?? field.handleChange}
      errors={value === undefined ? errors : storedValueErrors}
    />
  );
}

type ComboboxProps = Omit<
  React.ComponentProps<typeof ComboboxInput>,
  'name' | 'value' | 'onBlur' | 'onChange' | 'errors'
>;

function ComboboxField(props: ComboboxProps) {
  const field = useFieldContext<string>();
  return (
    <ComboboxInput
      {...props}
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={field.handleChange}
      errors={useErrors()}
    />
  );
}

type CheckboxProps = Omit<React.ComponentProps<typeof Checkbox>, 'name' | 'checked' | 'onBlur' | 'errors'> & {
  checked?: boolean;
};

function CheckboxField({ checked, onChange, ...props }: CheckboxProps) {
  const field = useFieldContext<boolean>();
  return (
    <Checkbox
      {...props}
      name={field.name}
      checked={checked ?? field.state.value === true}
      onBlur={field.handleBlur}
      onChange={onChange ?? field.handleChange}
      errors={useStoredValueErrors(props.disabled)}
    />
  );
}

type YearProps = WithoutFieldProps<React.ComponentProps<typeof YearPickerInput>>;

function YearField(props: YearProps) {
  const field = useFieldContext<number | null>();
  return (
    <YearPickerInput
      {...props}
      name={field.name}
      value={typeof field.state.value === 'number' ? field.state.value : undefined}
      onBlur={field.handleBlur}
      onChange={(value) => field.handleChange(value ?? null)}
      errors={useStoredValueErrors(props.disabled)}
    />
  );
}

type DateProps = WithoutFieldProps<React.ComponentProps<typeof DatePickerInput>> & {
  onChange?: (value: string | undefined) => void;
};

function DateField({ onChange, ...props }: DateProps) {
  const field = useFieldContext<string>();
  return (
    <DatePickerInput
      {...props}
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={onChange ?? ((value) => field.handleChange(value ?? ''))}
      errors={useErrors()}
    />
  );
}

type TimeProps = WithoutFieldProps<React.ComponentProps<typeof TimePickerInput>>;

function TimeField(props: TimeProps) {
  const field = useFieldContext<string>();
  const [hours, minutes] = field.state.value.split(':').map(Number);
  return (
    <TimePickerInput
      {...props}
      name={field.name}
      value={field.state.value ? { hours, minutes } : undefined}
      onBlur={field.handleBlur}
      onChange={(time) => field.handleChange(time ? formatTime(time) : '')}
      errors={useErrors()}
    />
  );
}

type MonthProps = WithoutFieldProps<React.ComponentProps<typeof MonthPickerInput>>;

function MonthField(props: MonthProps) {
  const field = useFieldContext<string | undefined>();
  return (
    <MonthPickerInput
      {...props}
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(value) => field.handleChange(value ?? '')}
      errors={useErrors()}
    />
  );
}

type FileProps = WithoutFieldProps<React.ComponentProps<typeof FileInput>>;

function FileField(props: FileProps) {
  const field = useFieldContext<FileValue[] | FileValue | undefined>();
  const { value } = field.state;
  const common = { name: field.name, onBlur: field.handleBlur, onChange: field.handleChange, errors: useErrors() };
  return props.allowMultiple ? (
    <FileInput {...props} {...common} value={Array.isArray(value) ? value : []} />
  ) : (
    <FileInput {...props} {...common} value={Array.isArray(value) ? undefined : value} />
  );
}

function FieldErrors() {
  return <InputErrorsList errors={useErrors()} />;
}

export const fieldComponents = {
  TextField,
  NumberField,
  SelectField,
  ComboboxField,
  CheckboxField,
  DateField,
  TimeField,
  YearField,
  MonthField,
  FileField,
  FieldErrors,
};
