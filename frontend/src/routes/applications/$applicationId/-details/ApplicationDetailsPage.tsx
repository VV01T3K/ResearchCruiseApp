import { getRouteApi } from '@tanstack/react-router';

import { AppLayout } from '@/components/shared/AppLayout';
import { useCruiseApplicationQuery, useEvaluationQuery } from '@/api/hooks/applications/CruiseApplicationsApiHooks';
import { ApplicationDetails } from '@/components/applications/application-details/ApplicationDetails';

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
