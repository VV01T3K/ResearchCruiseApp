import type { BlockadeResponse } from '@/api/generated/schemas';
import type { FormAOptions } from '@/routes/applications/$applicationId/-schemas/types/FormAOptions';
import type { FormAValues } from '@/routes/applications/$applicationId/-schemas/types/FormAValues';
import type { ReactFormExtendedApi } from '@tanstack/react-form';

/* Internal bridge for the research-task discriminated-union renderer. */
// oxlint-disable-next-line @typescript-eslint/no-explicit-any
export type FormAFormApi = ReactFormExtendedApi<FormAValues, any, any, any, any, any, any, any, any, any, any, any>;

export type FormAViewModel = {
  initValues: FormAOptions;
  hasFormBeenSubmitted: boolean;
  isReadonly: boolean;
  blockades?: BlockadeResponse[];
};
