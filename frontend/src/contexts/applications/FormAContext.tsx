import { createContext, use } from 'react';

import { AnyReactFormApi } from '@/lib/form';
import { FormAValues } from '@/routes/applications/$applicationId/-schemas/types/FormAValues';
import { FormAOptions } from '@/routes/applications/$applicationId/-schemas/types/FormAOptions';
import type { BlockadeResponse as BlockadePeriod } from '@/api/generated/schemas';

export type FormAContextType = {
  initValues: FormAOptions;
  form: AnyReactFormApi<FormAValues>;
  hasFormBeenSubmitted: boolean;
  isReadonly: boolean;
  blockades?: BlockadePeriod[];
};

const FormAContext = createContext<FormAContextType | undefined>(undefined);

// oxlint-disable-next-line react-refresh/only-export-components
export function useFormA() {
  return use(FormAContext)!;
}

export function FormAProvider({ value, children }: { value: FormAContextType; children: React.ReactNode }) {
  return <FormAContext value={value}>{children}</FormAContext>;
}
