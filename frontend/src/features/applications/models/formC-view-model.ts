import type { ApplicationCruiseResponse } from '@/api/generated/schemas';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormAValues } from '@/features/applications/schemas/formA.schema';
import type { FormAOptions } from '@/api/generated/schemas';
import type { FormBValues } from '@/features/applications/schemas/formB.schema';
import type { FormBOptions } from '@/api/generated/schemas';
import { formCDefaultValues } from '@/features/applications/schemas/formC.schema';

export function useFormCContext() {
  return useTypedAppFormContext({ defaultValues: formCDefaultValues });
}

export type FormCFormApi = ReturnType<typeof useFormCContext>;

export type FormCViewModel = {
  formAInitValues: FormAOptions;
  formBInitValues: FormBOptions;
  formA: FormAValues;
  formB: FormBValues;
  cruise: ApplicationCruiseResponse;
  isReadonly: boolean;
};
