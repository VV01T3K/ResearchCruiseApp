import React from 'react';

import { AnyReactFormApi } from '@/lib/form';
import { CruiseDto } from '@/features/cruise-applications/models/CruiseDto';
import { FormADto } from '@/features/cruise-applications/models/FormADto';
import { FormAInitValuesDto } from '@/features/cruise-applications/models/FormAInitValuesDto';
import { FormBDto } from '@/features/cruise-applications/models/FormBDto';
import { FormBInitValuesDto } from '@/features/cruise-applications/models/FormBInitValuesDto';

export type FormBContextType = {
  formAInitValues: FormAInitValuesDto;
  formBInitValues: FormBInitValuesDto;
  form: AnyReactFormApi<FormBDto>;
  formA: FormADto;
  cruise: CruiseDto;
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
