import React from 'react';

import { AnyReactFormApi } from '@/lib/form';
import type { CruiseResponse } from '@/api/generated/schemas';
import { FormAValues } from '@/routes/applications/$applicationId/-schemas/types/FormAValues';
import { FormAOptions } from '@/routes/applications/$applicationId/-schemas/types/FormAOptions';
import { FormBValues } from '@/routes/applications/$applicationId/-schemas/types/FormBValues';
import { FormBOptions } from '@/routes/applications/$applicationId/-schemas/types/FormBOptions';
import { FormCValues } from '@/routes/applications/$applicationId/-schemas/types/FormCValues';

export type FormCContextType = {
  formAInitValues: FormAOptions;
  formBInitValues: FormBOptions;
  form: AnyReactFormApi<FormCValues>;
  formA: FormAValues;
  formB: FormBValues;
  cruise: CruiseResponse;
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
