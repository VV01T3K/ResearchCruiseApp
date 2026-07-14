import React from 'react';

import { AnyReactFormApi } from '@/lib/form';
import type { CruiseResponse } from '@/api/generated/schemas';
import { FormADto } from '@/routes/applications/$applicationId/-schemas/types/FormADto';
import { FormAInitValuesDto } from '@/routes/applications/$applicationId/-schemas/types/FormAInitValuesDto';
import { FormBDto } from '@/routes/applications/$applicationId/-schemas/types/FormBDto';
import { FormBInitValuesDto } from '@/routes/applications/$applicationId/-schemas/types/FormBInitValuesDto';
import { FormCDto } from '@/routes/applications/$applicationId/-schemas/types/FormCDto';

export type FormCContextType = {
  formAInitValues: FormAInitValuesDto;
  formBInitValues: FormBInitValuesDto;
  form: AnyReactFormApi<FormCDto>;
  formA: FormADto;
  formB: FormBDto;
  cruise: CruiseResponse;
  hasFormBeenSubmitted: boolean;
  isReadonly: boolean;
};

const FormCContext = React.createContext<FormCContextType | undefined>(undefined);

// oxlint-disable-next-line react-refresh/only-export-components
export function useFormC() {
  return React.use(FormCContext)!;
}

export function FormCProvider({ value, children }: { value: FormCContextType; children: React.ReactNode }) {
  return <FormCContext value={value}>{children}</FormCContext>;
}
