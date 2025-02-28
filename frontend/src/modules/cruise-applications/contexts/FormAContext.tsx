import { ReactFormExtendedApi } from '@tanstack/react-form';
import { createContext, useContext } from 'react';

import { FormADto } from '@/cruise-applications/models/FormADto';
import { FormAInitValuesDto } from '@/cruise-applications/models/FormAInitValuesDto';

export type FormAContextType = {
  initValues: FormAInitValuesDto;
  form: ReactFormExtendedApi<FormADto, undefined>;
  hasFormBeenSubmitted: boolean;
  isReadonly: boolean;
};

const FormAContext = createContext<FormAContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useFormA() {
  return useContext(FormAContext)!;
}

export function FormAProvider({ value, children }: { value: FormAContextType; children: React.ReactNode }) {
  return <FormAContext value={value}>{children}</FormAContext>;
}
