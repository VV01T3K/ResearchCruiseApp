import type { CruiseResponse } from '@/api/generated/schemas';
import type { AnyReactFormApi } from '@/lib/form';
import type { FormAValues } from '@/routes/applications/$applicationId/-schemas/types/FormAValues';
import type { FormAOptions } from '@/routes/applications/$applicationId/-schemas/types/FormAOptions';
import type { FormBValues } from '@/routes/applications/$applicationId/-schemas/types/FormBValues';
import type { FormBOptions } from '@/routes/applications/$applicationId/-schemas/types/FormBOptions';
import type { FormCValues } from '@/routes/applications/$applicationId/-schemas/types/FormCValues';

export type FormCFormApi = AnyReactFormApi<FormCValues>;

export type FormCViewModel = {
  formAInitValues: FormAOptions;
  formBInitValues: FormBOptions;
  formA: FormAValues;
  formB: FormBValues;
  cruise: CruiseResponse;
  hasFormBeenSubmitted: boolean;
  isReadonly: boolean;
};
