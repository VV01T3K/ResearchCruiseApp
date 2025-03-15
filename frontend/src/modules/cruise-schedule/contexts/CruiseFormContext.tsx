import { ReactFormExtendedApi } from '@tanstack/react-form';
import { createContext, useContext } from 'react';

import { CruiseApplicationDto } from '@/cruise-applications/models/CruiseApplicationDto';
import { CruiseDto } from '@/cruise-schedule/models/CruiseDto';
import { CruiseFormDto } from '@/cruise-schedule/models/CruiseFormDto';

export type CruiseFromContextType = {
  form: ReactFormExtendedApi<CruiseFormDto, undefined>;
  cruise?: CruiseDto;
  cruiseApplications: CruiseApplicationDto[];
  isReadonly: boolean;
  hasFormBeenSubmitted?: boolean;
};

const CruiseFormContext = createContext<CruiseFromContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useCruiseForm() {
  return useContext(CruiseFormContext)!;
}

export function CruiseFormProvider({ value, children }: { value: CruiseFromContextType; children: React.ReactNode }) {
  return <CruiseFormContext value={value}>{children}</CruiseFormContext>;
}
