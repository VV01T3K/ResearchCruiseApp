import { createContext, use } from 'react';

import { AnyReactFormApi } from '@/lib/form';
import { CruiseApplicationDto } from '@/api/dto/applications/CruiseApplicationDto';
import { ApplicationCruiseDto } from '@/api/dto/cruises/CruiseDto';
import { CruiseFormDto } from '@/api/dto/cruises/CruiseFormDto';

export type CruiseFromContextType = {
  form: AnyReactFormApi<CruiseFormDto>;
  cruise?: ApplicationCruiseDto;
  cruiseApplications: CruiseApplicationDto[];
  isReadonly: boolean;
  hasFormBeenSubmitted?: boolean;
};

const CruiseFormContext = createContext<CruiseFromContextType | undefined>(undefined);

// oxlint-disable-next-line react-refresh/only-export-components
export function useCruiseForm() {
  return use(CruiseFormContext)!;
}

export function CruiseFormProvider({ value, children }: { value: CruiseFromContextType; children: React.ReactNode }) {
  return <CruiseFormContext value={value}>{children}</CruiseFormContext>;
}
