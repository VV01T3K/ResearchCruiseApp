import { createContext, use } from 'react';

import { AnyReactFormApi } from '@/lib/form';
import { CruiseApplicationDto } from '@/api/dto/applications/CruiseApplicationDto';
import { CruiseDto } from '@/api/dto/cruises/CruiseDto';
import { CruiseFormDto } from '@/api/dto/cruises/CruiseFormDto';

export type CruiseFormContextType = {
  form: AnyReactFormApi<CruiseFormDto>;
  cruise?: CruiseDto;
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
