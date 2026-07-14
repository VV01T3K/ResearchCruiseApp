import type { CruiseResponse } from '@/api/generated/schemas';
import type { FormAValues } from '@/routes/applications/$applicationId/-schemas/types/FormAValues';
import type { FormAOptions } from '@/routes/applications/$applicationId/-schemas/types/FormAOptions';
import type { FormBOptions } from '@/routes/applications/$applicationId/-schemas/types/FormBOptions';
import type { FormBValues } from '@/routes/applications/$applicationId/-schemas/types/FormBValues';
import type { ReactFormExtendedApi } from '@tanstack/react-form';

/* Internal bridge for table column factories; section components themselves are inferred by withForm. */
// oxlint-disable-next-line @typescript-eslint/no-explicit-any
export type FormBFormApi = ReactFormExtendedApi<FormBValues, any, any, any, any, any, any, any, any, any, any, any>;

export type FormBViewModel = {
  formAInitValues: FormAOptions;
  formBInitValues: FormBOptions;
  formA: FormAValues;
  cruise: CruiseResponse;
  hasFormBeenSubmitted: boolean;
  isReadonly: boolean;
};
