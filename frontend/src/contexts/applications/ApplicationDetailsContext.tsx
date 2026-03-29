import { createContext, use } from 'react';

import { CruiseApplicationDto } from '@/api/dto/applications/CruiseApplicationDto';
import { EvaluationDto } from '@/api/dto/applications/EvaluationDto';

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
