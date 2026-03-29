import React from 'react';

import { AnyReactFormApi } from '@/lib/form';
import { CruiseDto } from '@/features/cruise-applications/models/CruiseDto';
import { FormADto } from '@/features/cruise-applications/models/FormADto';
import { FormAInitValuesDto } from '@/features/cruise-applications/models/FormAInitValuesDto';
import { FormBDto } from '@/features/cruise-applications/models/FormBDto';
import { FormBInitValuesDto } from '@/features/cruise-applications/models/FormBInitValuesDto';
import { FormCDto } from '@/features/cruise-applications/models/FormCDto';

export type FormCContextType = {
  formAInitValues: FormAInitValuesDto;
  formBInitValues: FormBInitValuesDto;
  form: AnyReactFormApi<FormCDto>;
  formA: FormADto;
  formB: FormBDto;
  cruise: CruiseDto;
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
