export type CruiseManagersTeamDto = {
  mainCruiseManagerId: string;
  mainDeputyManagerId: string;
};

export type CruiseFormDto = {
  startDate: string;
  endDate: string;
  managersTeam: CruiseManagersTeamDto;
  cruiseApplicationsIds: string[];
};
