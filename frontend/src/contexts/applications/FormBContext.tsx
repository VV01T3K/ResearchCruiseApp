import React from 'react';

import { AnyReactFormApi } from '@/lib/form';
import type { CruiseResponse } from '@/api/generated/schemas';
import { FormAValues } from '@/routes/applications/$applicationId/-schemas/types/FormAValues';
import { FormAOptions } from '@/routes/applications/$applicationId/-schemas/types/FormAOptions';
import { FormBValues } from '@/routes/applications/$applicationId/-schemas/types/FormBValues';
import { FormBOptions } from '@/routes/applications/$applicationId/-schemas/types/FormBOptions';

export type FormBContextType = {
  formAInitValues: FormAOptions;
  formBInitValues: FormBOptions;
  form: AnyReactFormApi<FormBValues>;
  formA: FormAValues;
  cruise: CruiseResponse;
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
