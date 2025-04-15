import { getRouteApi } from '@tanstack/react-router';

import { AppLayout } from '@/core/components/AppLayout';
import { useCruiseApplicationQuery, useEvaluationQuery } from '@/cruise-applications/hooks/CruiseApplicationsApiHooks';

import { ApplicationDetails } from '../components/application-details/ApplicationDetails';

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
