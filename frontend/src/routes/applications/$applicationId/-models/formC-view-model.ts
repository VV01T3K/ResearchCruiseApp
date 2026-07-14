import type { CruiseResponse } from '@/api/generated/schemas';
import type { ReactFormExtendedApi } from '@tanstack/react-form';
import type { FormAValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import type { FormAOptions } from '@/routes/applications/$applicationId/-schemas/types/FormAOptions';
import type { FormBValues } from '@/routes/applications/$applicationId/-schemas/formB.schema';
import type { FormBOptions } from '@/routes/applications/$applicationId/-schemas/types/FormBOptions';
import type { FormCValues } from '@/routes/applications/$applicationId/-schemas/formC.schema';

/* Internal bridge for table column factories; section components themselves are inferred by withForm. */
// oxlint-disable-next-line @typescript-eslint/no-explicit-any
export type FormCFormApi = ReactFormExtendedApi<FormCValues, any, any, any, any, any, any, any, any, any, any, any>;

export type FormCViewModel = {
  formAInitValues: FormAOptions;
  formBInitValues: FormBOptions;
  formA: FormAValues;
  formB: FormBValues;
  cruise: CruiseResponse;
  hasFormBeenSubmitted: boolean;
  isReadonly: boolean;
};
