import { createFileRoute } from '@tanstack/react-router';
import { AppLayout } from '@/components/shared/AppLayout';
import { useCruiseApplicationQuery, useEvaluationQuery } from '@/api/hooks/applications/CruiseApplicationsApiHooks';
import { DetailsView } from './-components/details/DetailsView';

export const Route = createFileRoute('/_authed/applications/$applicationId/details')({
  component: DetailsPage,
});

function DetailsPage() {
  const { applicationId } = Route.useParams();

  const applicationQuery = useCruiseApplicationQuery(applicationId);
  const evaluationQuery = useEvaluationQuery(applicationId);

  return (
    <AppLayout title="Szczegóły Zgłoszenia">
      <DetailsView application={applicationQuery.data} evaluation={evaluationQuery.data} />
    </AppLayout>
  );
}
