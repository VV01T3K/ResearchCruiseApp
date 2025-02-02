export type FormAPerson = { id: string; email: string; firstName: string; lastName: string };
export type FormAResearchArea = { id: string; name: string };
export type FormAHistoricalResearchTask = {
  type: string;
  title: string;
  magazine: string;
  author: string;
  institution: string;
  date: string;
  startDate: string;
  endDate: string;
  financingAmount: string;
  financingApproved: string;
  description: string;
  securedAmount: string;
  ministrialPoints: string;
};
export type FormAHistoricalContract = {
  category: string;
  institutionName: string;
  institutionUnit: string;
  institutionLocalization: string;
  description: string;
  scan: FormAFile;
};
export type FormAFile = {
  name: string;
  content: string;
};
export type FormAUGUnit = {
  id: string;
  name: string;
};
export type FormASpubTask = {
  name: string;
  yearFrom: string;
  yearTo: string;
};
export type FormAPublicationDto = {
  id: string;
  category: string;
  doi: string;
  authors: string;
  title: string;
  magazine: string;
  year: string;
  ministrialPoints: string;
};
export type FormAInitialState = {
  cruiseManagers: FormAPerson[];
  deputyManagers: FormAPerson[];
  years: string[];
  shipUsages: string[];
  researchAreas: FormAResearchArea[];
  cruiseGoals: string[];
  historicalResearchTasks: FormAHistoricalResearchTask[];
  historicalContracts: FormAHistoricalContract[];
  unitGroups: FormAUGUnit[];
  historicalGuestInstructions: string[];
  historicalSpubTasks: FormASpubTask[];
  historicalPublications: FormAPublicationDto[];
};
export type FormADto = {
  id?: string;
  cruiseManagerId: string;
  deputyManagerId?: string;
  year: string;
};
