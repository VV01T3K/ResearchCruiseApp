import { ReactFormExtendedApi } from '@tanstack/react-form';
import React from 'react';

import { CruiseDto } from '@/cruise-applications/models/CruiseDto';
import { FormADto } from '@/cruise-applications/models/FormADto';
import { FormAInitValuesDto } from '@/cruise-applications/models/FormAInitValuesDto';
import { FormBDto } from '@/cruise-applications/models/FormBDto';
import { FormBInitValuesDto } from '@/cruise-applications/models/FormBInitValuesDto';
import { FormCDto } from '@/cruise-applications/models/FormCDto';

export type FormCContextType = {
  formAInitValues: FormAInitValuesDto;
  formBInitValues: FormBInitValuesDto;
  form: ReactFormExtendedApi<FormCDto, undefined>;
  formA: FormADto;
  formB: FormBDto;
  cruise: CruiseDto;
  hasFormBeenSubmitted: boolean;
  isReadonly: boolean;
};

const FormCContext = React.createContext<FormCContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useFormC() {
  return React.useContext(FormCContext)!;
}

export function FormCProvider({ value, children }: { value: FormCContextType; children: React.ReactNode }) {
  return <FormCContext value={value}>{children}</FormCContext>;
}
