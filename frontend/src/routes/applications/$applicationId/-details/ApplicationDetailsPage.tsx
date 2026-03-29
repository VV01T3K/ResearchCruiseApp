import { getRouteApi } from '@tanstack/react-router';

import { AppLayout } from '@/components/AppLayout';
import { ApplicationDetails } from '@/features/cruise-applications/components/application-details/ApplicationDetails';
import { useCruiseApplicationQuery, useEvaluationQuery } from '@/features/cruise-applications/hooks/CruiseApplicationsApiHooks';

export function ApplicationDetailsPage() {
  const { applicationId } = getRouteApi('/applications/$applicationId/details').useParams();

  const applicationQuery = useCruiseApplicationQuery(applicationId);
  const evaluationQuery = useEvaluationQuery(applicationId);

  return (
    <AppLayout title="Szczegóły Zgłoszenia">
      <ApplicationDetails application={applicationQuery.data} evaluation={evaluationQuery.data} />
    </AppLayout>
  );
}
