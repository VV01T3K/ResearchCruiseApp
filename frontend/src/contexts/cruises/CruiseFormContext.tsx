import { createContext, use } from 'react';

import { AnyReactFormApi } from '@/lib/form';
import { CruiseApplicationCandidate } from '@/routes/applications/$applicationId/-schemas/types/CruiseApplicationCandidate';
import type { CruiseResponse } from '@/api/generated/schemas';
import type { CruiseFormValues } from '@/routes/cruises/-schemas/form.schema';

export type CruiseFormContextType = {
  form: AnyReactFormApi<CruiseFormValues>;
  cruise?: CruiseResponse;
  cruiseApplications: CruiseApplicationCandidate[];
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
