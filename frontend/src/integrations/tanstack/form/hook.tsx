import { createFormHook } from '@tanstack/react-form';
import { fieldContext, formContext } from './context';
import { fieldComponents } from './fields';
import { FormErrors } from './FormErrors';

export const { useAppForm, useTypedAppFormContext } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents,
  formComponents: { FormErrors },
});
