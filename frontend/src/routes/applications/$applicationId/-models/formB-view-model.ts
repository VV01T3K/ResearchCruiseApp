import type { CruiseResponse } from '@/api/generated/schemas';
import type { FormAValues } from '@/routes/applications/$applicationId/-schemas/types/FormAValues';
import type { FormAOptions } from '@/routes/applications/$applicationId/-schemas/types/FormAOptions';
import type { FormBOptions } from '@/routes/applications/$applicationId/-schemas/types/FormBOptions';
import type { FormBValues } from '@/routes/applications/$applicationId/-schemas/types/FormBValues';
import type { AnyReactFormApi } from '@/lib/form';

export type FormBFormApi = AnyReactFormApi<FormBValues>;

export type FormBViewModel = {
  formAInitValues: FormAOptions;
  formBInitValues: FormBOptions;
  formA: FormAValues;
  cruise: CruiseResponse;
  hasFormBeenSubmitted: boolean;
  isReadonly: boolean;
};
