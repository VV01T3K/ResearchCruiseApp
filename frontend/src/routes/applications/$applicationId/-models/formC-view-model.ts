import type { CruiseResponse } from '@/api/generated/schemas';
import type { AppFormApi } from '@/lib/form';
import type { FormAValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import type { FormAOptions } from '@/routes/applications/$applicationId/-schemas/types/FormAOptions';
import type { FormBValues } from '@/routes/applications/$applicationId/-schemas/formB.schema';
import type { FormBOptions } from '@/routes/applications/$applicationId/-schemas/types/FormBOptions';
import type { FormCValues } from '@/routes/applications/$applicationId/-schemas/formC.schema';

export type FormCFormApi = AppFormApi<FormCValues>;

export type FormCViewModel = {
  formAInitValues: FormAOptions;
  formBInitValues: FormBOptions;
  formA: FormAValues;
  formB: FormBValues;
  cruise: CruiseResponse;
  isReadonly: boolean;
};
