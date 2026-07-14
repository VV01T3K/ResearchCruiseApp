import type { CruiseResponse } from '@/api/generated/schemas';
import type { FormAValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import type { FormAOptions } from '@/routes/applications/$applicationId/-schemas/types/FormAOptions';
import type { FormBOptions } from '@/routes/applications/$applicationId/-schemas/types/FormBOptions';
import type { FormBValues } from '@/routes/applications/$applicationId/-schemas/formB.schema';
import type { FormAsyncValidateOrFn, FormValidateOrFn, ReactFormExtendedApi } from '@tanstack/react-form';

export type FormBFormApi = ReactFormExtendedApi<
  FormBValues,
  FormValidateOrFn<FormBValues> | undefined,
  FormValidateOrFn<FormBValues> | undefined,
  FormAsyncValidateOrFn<FormBValues> | undefined,
  FormValidateOrFn<FormBValues> | undefined,
  FormAsyncValidateOrFn<FormBValues> | undefined,
  FormValidateOrFn<FormBValues> | undefined,
  FormAsyncValidateOrFn<FormBValues> | undefined,
  FormValidateOrFn<FormBValues> | undefined,
  FormAsyncValidateOrFn<FormBValues> | undefined,
  FormAsyncValidateOrFn<FormBValues> | undefined,
  unknown
>;

export type FormBViewModel = {
  formAInitValues: FormAOptions;
  formBInitValues: FormBOptions;
  formA: FormAValues;
  cruise: CruiseResponse;
  isReadonly: boolean;
};
