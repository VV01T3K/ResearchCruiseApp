import { createContext, use } from 'react';

import { ApplicationResponse, EvaluationResponse } from '@/api-v2/applications/contracts';

export type ApplicationDetailsContextType = {
  application: ApplicationResponse;
  evaluation: EvaluationResponse;
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
