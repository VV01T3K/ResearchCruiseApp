import { createContext, use } from 'react';

import { AnyReactFormApi } from '@/lib/form';
import { CruiseApplicationDto } from '@/routes/applications/$applicationId/-schemas/types/CruiseApplicationDto';
import type { CruiseResponse } from '@/api/gen/model';
import type { CruiseFormValues } from '@/routes/cruises/-types';

export type CruiseFormContextType = {
  form: AnyReactFormApi<CruiseFormValues>;
  cruise?: CruiseResponse;
  cruiseApplications: CruiseApplicationDto[];
  isReadonly: boolean;
  hasFormBeenSubmitted?: boolean;
};

const CruiseFormContext = createContext<CruiseFormContextType | undefined>(undefined);

// oxlint-disable-next-line react-refresh/only-export-components
export function useCruiseForm() {
  return use(CruiseFormContext)!;
}

export function CruiseFormProvider({ value, children }: { value: CruiseFormContextType; children: React.ReactNode }) {
  return <CruiseFormContext value={value}>{children}</CruiseFormContext>;
}
