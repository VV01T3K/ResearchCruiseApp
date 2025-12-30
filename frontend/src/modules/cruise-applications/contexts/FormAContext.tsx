import { ReactFormExtendedApi } from '@tanstack/react-form';
import { createContext, use } from 'react';

import { FormADto } from '@/cruise-applications/models/FormADto';
import { FormAInitValuesDto } from '@/cruise-applications/models/FormAInitValuesDto';
import { BlockadePeriodDto } from '@/cruise-schedule/models/CruiseDto';

// Use 'any' for validator type parameters to allow forms with or without validators
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormAContextType = {
  initValues: FormAInitValuesDto;
  form: ReactFormExtendedApi<FormADto, any, any, any, any, any, any, any, any, any, any, any>;
  hasFormBeenSubmitted: boolean;
  isReadonly: boolean;
  blockades?: BlockadePeriodDto[];
};

const FormAContext = createContext<FormAContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useFormA() {
  return use(FormAContext)!;
}

export function FormAProvider({ value, children }: { value: FormAContextType; children: React.ReactNode }) {
  return <FormAContext value={value}>{children}</FormAContext>;
}
