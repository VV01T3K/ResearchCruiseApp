import React from 'react';

import { AnyReactFormApi } from '@/lib/form';
import type { CruiseResponse } from '@/api/gen/model';
import { FormADto } from '@/routes/applications/$applicationId/-schemas/types/FormADto';
import { FormAInitValuesDto } from '@/routes/applications/$applicationId/-schemas/types/FormAInitValuesDto';
import { FormBDto } from '@/routes/applications/$applicationId/-schemas/types/FormBDto';
import { FormBInitValuesDto } from '@/routes/applications/$applicationId/-schemas/types/FormBInitValuesDto';

export type FormBContextType = {
  formAInitValues: FormAInitValuesDto;
  formBInitValues: FormBInitValuesDto;
  form: AnyReactFormApi<FormBDto>;
  formA: FormADto;
  cruise: CruiseResponse;
  hasFormBeenSubmitted: boolean;
  isReadonly: boolean;
};

const FormBContext = React.createContext<FormBContextType | undefined>(undefined);

// oxlint-disable-next-line react-refresh/only-export-components
export function useFormB() {
  return React.use(FormBContext)!;
}

export function FormBProvider({ value, children }: { value: FormBContextType; children: React.ReactNode }) {
  return <FormBContext value={value}>{children}</FormBContext>;
}
