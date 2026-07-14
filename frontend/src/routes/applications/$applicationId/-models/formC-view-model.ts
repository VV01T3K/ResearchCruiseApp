import type { CruiseResponse } from '@/api/generated/schemas';
import type { FormAsyncValidateOrFn, FormValidateOrFn, ReactFormExtendedApi } from '@tanstack/react-form';
import type { FormAValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import type { FormAOptions } from '@/routes/applications/$applicationId/-schemas/types/FormAOptions';
import type { FormBValues } from '@/routes/applications/$applicationId/-schemas/formB.schema';
import type { FormBOptions } from '@/routes/applications/$applicationId/-schemas/types/FormBOptions';
import type { FormCValues } from '@/routes/applications/$applicationId/-schemas/formC.schema';

export type FormCFormApi = ReactFormExtendedApi<
  FormCValues,
  FormValidateOrFn<FormCValues> | undefined,
  FormValidateOrFn<FormCValues> | undefined,
  FormAsyncValidateOrFn<FormCValues> | undefined,
  FormValidateOrFn<FormCValues> | undefined,
  FormAsyncValidateOrFn<FormCValues> | undefined,
  FormValidateOrFn<FormCValues> | undefined,
  FormAsyncValidateOrFn<FormCValues> | undefined,
  FormValidateOrFn<FormCValues> | undefined,
  FormAsyncValidateOrFn<FormCValues> | undefined,
  FormAsyncValidateOrFn<FormCValues> | undefined,
  unknown
>;

export type FormCViewModel = {
  formAInitValues: FormAOptions;
  formBInitValues: FormBOptions;
  formA: FormAValues;
  formB: FormBValues;
  cruise: CruiseResponse;
  isReadonly: boolean;
};
