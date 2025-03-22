import { ReactFormExtendedApi } from '@tanstack/react-form';
import React from 'react';

import { CruiseDto } from '@/cruise-applications/models/CruiseDto';
import { FormADto } from '@/cruise-applications/models/FormADto';
import { FormAInitValuesDto } from '@/cruise-applications/models/FormAInitValuesDto';
import { FormBDto } from '@/cruise-applications/models/FormBDto';
import { FormBInitValuesDto } from '@/cruise-applications/models/FormBInitValuesDto';

export type FormBContextType = {
  formAInitValues: FormAInitValuesDto;
  formBInitValues: FormBInitValuesDto;
  form: ReactFormExtendedApi<FormBDto, undefined>;
  formA: FormADto;
  cruise: CruiseDto;
  hasFormBeenSubmitted: boolean;
  isReadonly: boolean;
};

const FormBContext = React.createContext<FormBContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useFormB() {
  return React.useContext(FormBContext)!;
}

export function FormBProvider({ value, children }: { value: FormBContextType; children: React.ReactNode }) {
  return <FormBContext value={value}>{children}</FormBContext>;
}
