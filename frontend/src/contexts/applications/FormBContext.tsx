import React from 'react';

import { AnyReactFormApi } from '@/lib/form';
import { ApplicationCruiseDto } from '@/api/dto/applications/ApplicationCruiseDto';
import { FormADto } from '@/api/dto/applications/FormADto';
import { FormAInitValuesDto } from '@/api/dto/applications/FormAInitValuesDto';
import { FormBDto } from '@/api/dto/applications/FormBDto';
import { FormBInitValuesDto } from '@/api/dto/applications/FormBInitValuesDto';

export type FormBContextType = {
  formAInitValues: FormAInitValuesDto;
  formBInitValues: FormBInitValuesDto;
  form: AnyReactFormApi<FormBDto>;
  formA: FormADto;
  cruise: ApplicationCruiseDto;
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
