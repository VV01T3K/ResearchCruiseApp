export type CruiseApplicationSummaryResponse = {
  id: string;
  cruiseManagerId: string;
  deputyManagerId: string;
  number: string;
  points: string;
};

export type CruiseStatus = 'new' | 'confirmed' | 'ended';

type CruisePersonResponse = {
  id: string;
  firstName: string;
  lastName: string;
};

export type CruiseResponse = {
  id: string;
  number: string;
  startDate: string;
  endDate: string;
  mainManager: CruisePersonResponse;
  deputyManager: CruisePersonResponse;
  applications: CruiseApplicationSummaryResponse[];
  status: CruiseStatus;
  title: string | null;
  shipUnavailable: boolean;
};

export type CruiseWriteRequest = {
  startDate: string;
  endDate: string;
  mainManagerId: string;
  deputyManagerId: string;
  cruiseApplicationIds: string[];
  title: string | null;
  shipUnavailable: boolean;
};

export type CruiseFormValues = {
  startDate: string;
  endDate: string;
  managersTeam: {
    mainCruiseManagerId: string;
    mainDeputyManagerId: string;
  };
  cruiseApplicationsIds: string[];
  status?: string;
  title?: string | null;
  shipUnavailable: boolean;
};

export type BlockadePeriodResponse = {
  startDate: string;
  endDate: string;
  title: string;
};
