import type { CreateRequest } from '@/api/gen/model';

export type CruiseFormValues = {
  startDate: string;
  endDate: string;
  managersTeam: {
    mainCruiseManagerId: string;
    mainDeputyManagerId: string;
  };
  cruiseApplicationsIds: string[];
  status?: string;
  title?: string;
  shipUnavailable: boolean;
};

export function toCruiseRequest(cruise: CruiseFormValues): CreateRequest {
  return {
    startDate: cruise.startDate,
    endDate: cruise.endDate,
    mainManagerId: cruise.managersTeam.mainCruiseManagerId,
    deputyManagerId: cruise.managersTeam.mainDeputyManagerId,
    cruiseApplicationIds: cruise.cruiseApplicationsIds ?? [],
    title: cruise.title || null,
    shipUnavailable: cruise.shipUnavailable,
  };
}
