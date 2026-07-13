import React from 'react';

import { AnyReactFormApi } from '@/lib/form';
import { CruiseResponse } from '@/api/cruises/contracts';
import { FormADto } from '@/api/applications/dto/FormADto';
import { FormAInitValuesDto } from '@/api/applications/dto/FormAInitValuesDto';
import { FormBDto } from '@/api/applications/dto/FormBDto';
import { FormBInitValuesDto } from '@/api/applications/dto/FormBInitValuesDto';

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
