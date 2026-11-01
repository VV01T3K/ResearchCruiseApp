import { useSelector } from '@tanstack/react-form';
import { useFieldContext } from './context';
import { FloatingLabelInput } from '@/components/shared/inputs/FloatingLabelInput';

import { Checkbox } from '@/components/shared/inputs/Checkbox';
import { DropdownInput } from '@/components/shared/inputs/DropdownInput';
import { FileInput } from '@/components/shared/inputs/FileInput';
import { Input } from '@/components/shared/inputs/Input';
import { NumberInput } from '@/components/shared/inputs/NumberInput';
import { DatePickerInput } from '@/components/shared/inputs/dates/DatePickerInput';
import { MonthPickerInput } from '@/components/shared/inputs/dates/MonthPickerInput';
import { InputErrorsList } from '@/components/shared/inputs/parts/InputErrorsList';
import type { FileValue } from '@/components/shared/inputs/FileInput';
import { getErrors } from '@/integrations/tanstack/form/errors';

function useErrors() {
  const field = useFieldContext<unknown>();
  const submissionAttempts = useSelector(field.form.store, (state) => state.submissionAttempts);
  const meta = useSelector(field.store, (state) => state.meta);
  return getErrors(meta, submissionAttempts);
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
  value?: number;
  onChange?: (value: number) => void;
};

function NumberField({ value, onChange, ...props }: NumberProps) {
  const field = useFieldContext<number>();
  return (
    <NumberInput
      {...props}
      name={field.name}
      value={value ?? field.state.value}
      onChange={onChange ?? field.handleChange}
      errors={useErrors()}
    />
  );
}

function NullableNumberField(
  props: WithoutFieldProps<Extract<React.ComponentProps<typeof NumberInput>, { nullable: true }>>
) {
  const field = useFieldContext<number | null>();
  return (
    <NumberInput
      {...props}
      nullable
      name={field.name}
      value={field.state.value}
      onChange={field.handleChange}
      errors={useErrors()}
    />
  );
}

type SelectProps = Omit<
  React.ComponentProps<typeof DropdownInput>,
  'name' | 'value' | 'onBlur' | 'onChange' | 'errors'
> & { onChange?: (value: string) => void };

function SelectField({ onChange, ...props }: SelectProps) {
  const field = useFieldContext<string>();
  return (
    <DropdownInput
      {...props}
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={onChange ?? field.handleChange}
      errors={useErrors()}
    />
  );
}

function BooleanSelectField(props: Omit<SelectProps, 'onChange'>) {
  const field = useFieldContext<boolean>();
  return (
    <DropdownInput
      {...props}
      name={field.name}
      value={String(field.state.value)}
      onBlur={field.handleBlur}
      onChange={(value) => field.handleChange(value === 'true')}
      errors={useErrors()}
    />
  );
}

type CheckboxProps = Omit<React.ComponentProps<typeof Checkbox>, 'name' | 'checked' | 'onBlur' | 'onChange' | 'errors'>;

function CheckboxField(props: CheckboxProps) {
  const field = useFieldContext<boolean>();
  return (
    <Checkbox
      {...props}
      name={field.name}
      checked={field.state.value}
      onBlur={field.handleBlur}
      onChange={field.handleChange}
      errors={useErrors()}
    />
  );
}

function ArrayCheckboxField({ item, ...props }: CheckboxProps & { item: string }) {
  const field = useFieldContext<string[]>();
  return (
    <Checkbox
      {...props}
      name={field.name}
      checked={field.state.value.includes(item)}
      onBlur={field.handleBlur}
      onChange={(checked) =>
        field.handleChange((values) => (checked ? [...values, item] : values.filter((value) => value !== item)))
      }
      errors={useErrors()}
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

type FileProps = Omit<
  Extract<React.ComponentProps<typeof FileInput>, { allowMultiple?: false }>,
  'name' | 'value' | 'onBlur' | 'onChange' | 'errors'
>;

function FileField(props: FileProps) {
  const field = useFieldContext<FileValue | undefined>();
  return (
    <FileInput
      {...props}
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={field.handleChange}
      errors={useErrors()}
    />
  );
}

type FilesProps = Omit<
  Extract<React.ComponentProps<typeof FileInput>, { allowMultiple: true }>,
  'name' | 'value' | 'onBlur' | 'onChange' | 'errors'
>;

function FilesField(props: FilesProps) {
  const field = useFieldContext<FileValue[]>();
  return (
    <FileInput
      {...props}
      allowMultiple
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={field.handleChange}
      errors={useErrors()}
    />
  );
}

function FloatingTextField(props: WithoutFieldProps<React.ComponentProps<typeof FloatingLabelInput>>) {
  const field = useFieldContext<string>();
  return (
    <FloatingLabelInput
      {...props}
      name={field.name}
      value={field.state.value}
      onChange={field.handleChange}
      errors={useErrors()}
    />
  );
}

function FieldErrors() {
  return <InputErrorsList errors={useErrors()} />;
}

export const fieldComponents = {
  FloatingTextField,
  TextField,
  NumberField,
  NullableNumberField,
  SelectField,
  BooleanSelectField,
  CheckboxField,
  ArrayCheckboxField,
  DateField,
  MonthField,
  FileField,
  FilesField,
  FieldErrors,
};
