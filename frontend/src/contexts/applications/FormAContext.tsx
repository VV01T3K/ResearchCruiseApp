import { createContext, use } from 'react';

import { AnyReactFormApi } from '@/lib/form';
import { FormADto } from '@/api/dto/applications/FormADto';
import { FormAInitValuesDto } from '@/api/dto/applications/FormAInitValuesDto';
import { BlockadePeriodDto } from '@/api/dto/cruises/CruiseDto';

export type FormAContextType = {
  initValues: FormAInitValuesDto;
  form: AnyReactFormApi<FormADto>;
  hasFormBeenSubmitted: boolean;
  isReadonly: boolean;
  blockades?: BlockadePeriodDto[];
};

const FormAContext = createContext<FormAContextType | undefined>(undefined);

// oxlint-disable-next-line react-refresh/only-export-components
export function useFormA() {
  return use(FormAContext)!;
}

export function FormAProvider({ value, children }: { value: FormAContextType; children: React.ReactNode }) {
  return <FormAContext value={value}>{children}</FormAContext>;
}
