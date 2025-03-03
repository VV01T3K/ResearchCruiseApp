import { createContext, useContext } from "react";

import { CruiseApplicationDto } from "@/cruise-applications/models/CruiseApplicationDto";
import { EvaluationDto } from "@/cruise-applications/models/EvaluationDto";

export type ApplicationDetailsContextType = {
  application: CruiseApplicationDto;
  evaluation: EvaluationDto;
};

const ApplicationDetailsContext = createContext<ApplicationDetailsContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useApplicationDetails() {
  return useContext(ApplicationDetailsContext)!;
}

export function ApplicationDetailsProvider({ value, children }: { value: ApplicationDetailsContextType; children: React.ReactNode }) {
  return <ApplicationDetailsContext value={value}>{children}</ApplicationDetailsContext>;
}
