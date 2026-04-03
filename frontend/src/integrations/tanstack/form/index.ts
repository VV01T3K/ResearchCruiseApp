import { createFormHook } from '@tanstack/react-form';

import { fieldContext, formContext } from './context';
import * as fieldComponents from './fieldComponents';
import * as formComponents from './formComponents';

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents,
  formComponents,
  fieldContext,
  formContext,
});
