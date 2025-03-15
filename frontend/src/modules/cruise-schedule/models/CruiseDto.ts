export type CruiseApplicationShortInfoDto = {
  id: string;
  cruiseManagerId: string;
  deputyManagerId: string;
  number: string;
  points: string;
};

export type CruiseStatus = 'Nowy' | 'Potwierdzony' | 'Zakończony';

export type CruiseDto = {
  id: string;
  number: string;
  startDate: string;
  endDate: string;
  mainCruiseManagerId: string;
  mainCruiseManagerFirstName: string;
  mainCruiseManagerLastName: string;
  mainDeputyManagerId: string;
  cruiseApplicationsShortInfo: CruiseApplicationShortInfoDto[];
  status: CruiseStatus;
};
