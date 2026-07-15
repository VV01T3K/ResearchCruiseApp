import type { CruiseResponse } from '@/api/generated/schemas';
import { useTypedAppFormContext } from '@/lib/form';
import type { FormAValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import type { FormAOptions } from '@/routes/applications/$applicationId/-schemas/types/FormAOptions';
import type { FormBValues } from '@/routes/applications/$applicationId/-schemas/formB.schema';
import type { FormBOptions } from '@/routes/applications/$applicationId/-schemas/types/FormBOptions';
import { formCDefaultValues } from '@/routes/applications/$applicationId/-schemas/formC.schema';

export function useFormCContext() {
  return useTypedAppFormContext({ defaultValues: formCDefaultValues });
}

export type FormCFormApi = ReturnType<typeof useFormCContext>;

export type FormCViewModel = {
  formAInitValues: FormAOptions;
  formBInitValues: FormBOptions;
  formA: FormAValues;
  formB: FormBValues;
  cruise: CruiseResponse;
  isReadonly: boolean;
};
