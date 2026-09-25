import { createFormHook } from '@tanstack/react-form';
import { fieldContext, formContext } from './context';
import { fieldComponents } from './fields';

export const { useAppForm, useTypedAppFormContext, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents,
  formComponents: {},
});
