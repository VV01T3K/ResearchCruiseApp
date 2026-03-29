import React from 'react';

import { AnyReactFormApi } from '@/lib/form';
import { ApplicationCruiseDto } from '@/api/dto/applications/ApplicationCruiseDto';
import { FormADto } from '@/api/dto/applications/FormADto';
import { FormAInitValuesDto } from '@/api/dto/applications/FormAInitValuesDto';
import { FormBDto } from '@/api/dto/applications/FormBDto';
import { FormBInitValuesDto } from '@/api/dto/applications/FormBInitValuesDto';
import { FormCDto } from '@/api/dto/applications/FormCDto';

export type FormCContextType = {
  formAInitValues: FormAInitValuesDto;
  formBInitValues: FormBInitValuesDto;
  form: AnyReactFormApi<FormCDto>;
  formA: FormADto;
  formB: FormBDto;
  cruise: ApplicationCruiseDto;
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
