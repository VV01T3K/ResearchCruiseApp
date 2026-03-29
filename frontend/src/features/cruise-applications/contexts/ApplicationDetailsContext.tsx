import { createContext, use } from 'react';

import { CruiseApplicationDto } from '@/features/cruise-applications/models/CruiseApplicationDto';
import { EvaluationDto } from '@/features/cruise-applications/models/EvaluationDto';

export type ApplicationDetailsContextType = {
  application: CruiseApplicationDto;
  evaluation: EvaluationDto;
};

const ApplicationDetailsContext = createContext<ApplicationDetailsContextType | undefined>(undefined);

// oxlint-disable-next-line react-refresh/only-export-components
export function useApplicationDetails() {
  return use(ApplicationDetailsContext)!;
}

export function ApplicationDetailsProvider({
  value,
  children,
}: {
  value: ApplicationDetailsContextType;
  children: React.ReactNode;
}) {
  return <ApplicationDetailsContext value={value}>{children}</ApplicationDetailsContext>;
}
