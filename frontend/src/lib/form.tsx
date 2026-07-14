import { createFormHook, createFormHookContexts, useSelector } from '@tanstack/react-form';

import { AppCheckbox } from '@/components/shared/inputs/AppCheckbox';
import { AppDropdownInput } from '@/components/shared/inputs/AppDropdownInput';
import { AppFileInput } from '@/components/shared/inputs/AppFileInput';
import { AppInput } from '@/components/shared/inputs/AppInput';
import { AppNumberInput } from '@/components/shared/inputs/AppNumberInput';
import { AppDatePickerInput } from '@/components/shared/inputs/dates/AppDatePickerInput';
import { AppInputErrorsList } from '@/components/shared/inputs/parts/AppInputErrorsList';
import { getFieldErrors } from '@/lib/form-errors';
import type { FormFileValues } from '@/types/form-file-values';

export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

function useErrors() {
  const field = useFieldContext<unknown>();
  const submissionAttempts = useSelector(field.form.store, (state) => state.submissionAttempts);
  return getFieldErrors(field.state.meta, submissionAttempts);
}

type TextProps = Omit<
  React.ComponentProps<typeof AppInput>,
  'name' | 'value' | 'onBlur' | 'onChange' | 'errors' | 'type'
>;
type WithoutFieldProps<T> = T extends unknown
  ? Omit<T, 'name' | 'value' | 'checked' | 'onBlur' | 'onChange' | 'errors'>
  : never;

function TextField(props: TextProps) {
  const field = useFieldContext<string>();
  return (
    <AppInput
      {...props}
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={field.handleChange}
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

type NumberProps = WithoutFieldProps<React.ComponentProps<typeof AppNumberInput>>;

function NumberField(props: NumberProps) {
  const field = useFieldContext<number>();
  return (
    <AppNumberInput
      {...props}
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
>;

function SelectField(props: SelectProps) {
  const field = useFieldContext<string>();
  return (
    <AppDropdownInput
      {...props}
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={field.handleChange}
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

type DateProps = WithoutFieldProps<React.ComponentProps<typeof AppDatePickerInput>>;

function DateField(props: DateProps) {
  const field = useFieldContext<string | undefined>();
  return (
    <AppDatePickerInput
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
  const field = useFieldContext<FormFileValues | undefined>();
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

function FieldErrors() {
  return <AppInputErrorsList errors={useErrors()} />;
}

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
    NumberField,
    SelectField,
    CheckboxField,
    DateField,
    FileField,
    FieldErrors,
  },
  formComponents: {},
});
