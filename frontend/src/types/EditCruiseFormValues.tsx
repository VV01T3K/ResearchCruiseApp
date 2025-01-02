import {CruiseManagersTeam} from 'CruiseManagersTeam';

export type EditCruiseFormValues = {
  startDate: string;
  endDate: string;
  managersTeam: CruiseManagersTeam;
  cruiseApplicationsIds: string[];
};
