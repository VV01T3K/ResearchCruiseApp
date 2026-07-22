import type { CruiseResponse } from '@/api/generated/schemas';
import type { FormAValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import type { FormAOptions } from '@/api/client/applications/types/FormAOptions';
import type { FormBOptions } from '@/api/client/applications/types/FormBOptions';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import { formBDefaultValues } from '@/routes/applications/$applicationId/-schemas/formB.schema';

export function useFormBContext() {
  return useTypedAppFormContext({ defaultValues: formBDefaultValues });
}

export type FormBFormApi = ReturnType<typeof useFormBContext>;

export type FormBViewModel = {
  formAInitValues: FormAOptions;
  formBInitValues: FormBOptions;
  formA: FormAValues;
  cruise: CruiseResponse;
  isReadonly: boolean;
};
