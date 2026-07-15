import type { CruiseResponse } from '@/api/generated/schemas';
import type { CruiseFormValues } from '@/routes/cruises/-schemas/form.schema';

export function mapRescheduledCruiseToForm(cruise: CruiseResponse, nextStart: Date, nextEnd: Date): CruiseFormValues {
  return {
    startDate: nextStart.toISOString(),
    endDate: nextEnd.toISOString(),
    managersTeam: {
      mainCruiseManagerId: cruise.mainManager.id,
      mainDeputyManagerId: cruise.deputyManager.id,
    },
    cruiseApplicationsIds: cruise.applications.map((application) => application.id),
    title: cruise.title || '',
    shipUnavailable: cruise.shipUnavailable,
  };
}
