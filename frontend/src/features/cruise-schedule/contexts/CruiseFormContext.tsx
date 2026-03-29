import { createContext, use } from 'react';

import { AnyReactFormApi } from '@/lib/form';
import { CruiseApplicationDto } from '@/features/cruise-applications/models/CruiseApplicationDto';
import { CruiseDto } from '@/features/cruise-schedule/models/CruiseDto';
import { CruiseFormDto } from '@/features/cruise-schedule/models/CruiseFormDto';

export type CruiseFromContextType = {
  form: AnyReactFormApi<CruiseFormDto>;
  cruise?: CruiseDto;
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
