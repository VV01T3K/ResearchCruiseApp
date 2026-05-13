import { createFileRoute } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { AppLayout } from '@/components/shared/AppLayout';
import { useCruiseApplicationQuery, useEvaluationQuery } from '@/api/hooks/applications/CruiseApplicationsApiHooks';
import { ApplicationDetails } from '@/components/applications/application-details/ApplicationDetails';

export const Route = createFileRoute('/applications/$applicationId/details')({
  component: ApplicationDetailsPage,
  beforeLoad: allowOnly.authenticated(),
});

function ApplicationDetailsPage() {
  const { applicationId } = Route.useParams();

  const applicationQuery = useCruiseApplicationQuery(applicationId);
  const evaluationQuery = useEvaluationQuery(applicationId);

  return (
    <AppLayout title="Szczegóły Zgłoszenia">
      <ApplicationDetails application={applicationQuery.data} evaluation={evaluationQuery.data} />
    </AppLayout>
  );
}
