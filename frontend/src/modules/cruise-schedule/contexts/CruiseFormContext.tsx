import { ReactFormExtendedApi } from '@tanstack/react-form';
import { createContext, use } from 'react';

import { CruiseApplicationDto } from '@/cruise-applications/models/CruiseApplicationDto';
import { CruiseDto } from '@/cruise-schedule/models/CruiseDto';
import { CruiseFormDto } from '@/cruise-schedule/models/CruiseFormDto';

// Use 'any' for validator type parameters to allow forms with or without validators
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CruiseFromContextType = {
  form: ReactFormExtendedApi<CruiseFormDto, any, any, any, any, any, any, any, any, any, any, any>;
  cruise?: CruiseDto;
  cruiseApplications: CruiseApplicationDto[];
  isReadonly: boolean;
  hasFormBeenSubmitted?: boolean;
};

const CruiseFormContext = createContext<CruiseFromContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useCruiseForm() {
  return use(CruiseFormContext)!;
}

export function CruiseFormProvider({ value, children }: { value: CruiseFromContextType; children: React.ReactNode }) {
  return <CruiseFormContext value={value}>{children}</CruiseFormContext>;
}
