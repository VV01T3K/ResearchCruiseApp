import { createFormHook, createFormHookContexts, useSelector } from '@tanstack/react-form';

import { AppCheckbox } from '@/components/shared/inputs/AppCheckbox';
import { AppDropdownInput } from '@/components/shared/inputs/AppDropdownInput';
import { AppFileInput } from '@/components/shared/inputs/AppFileInput';
import { AppInput } from '@/components/shared/inputs/AppInput';
import { AppNumberInput } from '@/components/shared/inputs/AppNumberInput';
import { AppDatePickerInput } from '@/components/shared/inputs/dates/AppDatePickerInput';
import { AppMonthPickerInput } from '@/components/shared/inputs/dates/AppMonthPickerInput';
import { AppInputErrorsList } from '@/components/shared/inputs/parts/AppInputErrorsList';
import type { FileValue } from '@/components/shared/inputs/AppFileInput';
import { extractErrorMessage } from '@/integrations/tanstack/form/errors';

export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

function useErrors() {
  const field = useFieldContext<unknown>();
  const submissionAttempts = useSelector(field.form.store, (state) => state.submissionAttempts);
  const meta = useSelector(field.store, (state) => state.meta);
  const errors = meta.errors;
  if ((!meta.isTouched && submissionAttempts === 0) || errors.length === 0) return undefined;
  return errors.map(extractErrorMessage);
}

type TextProps = Omit<React.ComponentProps<typeof AppInput>, 'name' | 'value' | 'onBlur' | 'onChange' | 'errors'> & {
  value?: string;
  onChange?: (value: string) => void;
};
type WithoutFieldProps<T> = T extends unknown
  ? Omit<T, 'name' | 'value' | 'checked' | 'onBlur' | 'onChange' | 'errors' | 'nullable'>
  : never;

function TextField({ value, onChange, ...props }: TextProps) {
  const field = useFieldContext<string>();
  return (
    <AppInput
      {...props}
      name={field.name}
      value={value ?? field.state.value}
      onBlur={field.handleBlur}
      onChange={onChange ?? field.handleChange}
      errors={useErrors()}
    />
  );
}

function TextareaField(props: TextProps) {
  const field = useFieldContext<string>();
  return (
    <AppInput
      {...props}
      type="textarea"
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={field.handleChange}
      errors={useErrors()}
    />
  );
}

type NumberProps = WithoutFieldProps<React.ComponentProps<typeof AppNumberInput>> & {
  value?: number;
  onChange?: (value: number) => void;
};

function NumberField({ value, onChange, ...props }: NumberProps) {
  const field = useFieldContext<number>();
  return (
    <AppNumberInput
      {...props}
      name={field.name}
      value={value ?? field.state.value}
      onBlur={field.handleBlur}
      onChange={onChange ?? field.handleChange}
      errors={useErrors()}
    />
  );
}

function NullableNumberField({ value: _value, onChange: _onChange, ...props }: NumberProps) {
  const field = useFieldContext<number | null>();
  return (
    <AppNumberInput
      {...props}
      nullable
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={field.handleChange}
      errors={useErrors()}
    />
  );
}

type SelectProps = Omit<
  React.ComponentProps<typeof AppDropdownInput>,
  'name' | 'value' | 'onBlur' | 'onChange' | 'errors'
> & { onChange?: (value: string) => void };

function SelectField({ onChange, ...props }: SelectProps) {
  const field = useFieldContext<string>();
  return (
    <AppDropdownInput
      {...props}
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={onChange ?? field.handleChange}
      errors={useErrors()}
    />
  );
}

function BooleanSelectField({ onChange: _onChange, ...props }: SelectProps) {
  const field = useFieldContext<boolean>();
  return (
    <AppDropdownInput
      {...props}
      name={field.name}
      value={String(field.state.value)}
      onBlur={field.handleBlur}
      onChange={(value) => field.handleChange(value === 'true')}
      errors={useErrors()}
    />
  );
}

type CheckboxProps = Omit<
  React.ComponentProps<typeof AppCheckbox>,
  'name' | 'checked' | 'onBlur' | 'onChange' | 'errors'
>;

function CheckboxField(props: CheckboxProps) {
  const field = useFieldContext<boolean>();
  return (
    <AppCheckbox
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
    <AppCheckbox
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

type DateProps = WithoutFieldProps<React.ComponentProps<typeof AppDatePickerInput>> & {
  onChange?: (value: string | undefined) => void;
};

function DateField({ onChange, ...props }: DateProps) {
  const field = useFieldContext<string | undefined>();
  return (
    <AppDatePickerInput
      {...props}
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={onChange ?? field.handleChange}
      errors={useErrors()}
    />
  );
}

type MonthProps = WithoutFieldProps<React.ComponentProps<typeof AppMonthPickerInput>>;

function MonthField(props: MonthProps) {
  const field = useFieldContext<string | undefined>();
  return (
    <AppMonthPickerInput
      {...props}
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={field.handleChange}
      errors={useErrors()}
    />
  );
}

type FileProps = Omit<
  Extract<React.ComponentProps<typeof AppFileInput>, { allowMultiple?: false }>,
  'name' | 'value' | 'onBlur' | 'onChange' | 'errors'
>;

function FileField(props: FileProps) {
  const field = useFieldContext<FileValue | undefined>();
  return (
    <AppFileInput
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
  Extract<React.ComponentProps<typeof AppFileInput>, { allowMultiple: true }>,
  'name' | 'value' | 'onBlur' | 'onChange' | 'errors'
>;

function FilesField(props: FilesProps) {
  const field = useFieldContext<FileValue[]>();
  return (
    <AppFileInput
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

function FieldErrors() {
  return <AppInputErrorsList errors={useErrors()} />;
}

const fieldComponents = {
  TextField,
  TextareaField,
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

export const { useAppForm, useTypedAppFormContext } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents,
  formComponents: {},
});
