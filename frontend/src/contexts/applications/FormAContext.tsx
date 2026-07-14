import { createContext, use } from 'react';

import { AnyReactFormApi } from '@/lib/form';
import { FormADto } from '@/routes/applications/$applicationId/-schemas/types/FormADto';
import { FormAInitValuesDto } from '@/routes/applications/$applicationId/-schemas/types/FormAInitValuesDto';
import type { BlockadeResponse as BlockadePeriodDto } from '@/api/gen/model';

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
