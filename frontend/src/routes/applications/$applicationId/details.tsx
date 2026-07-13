import { createFileRoute } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { AppLayout } from '@/components/shared/AppLayout';
import { useApplicationEvaluationQuery, useApplicationQuery } from '@/api/applications/ApplicationCatalogApiHooks';
import { DetailsView } from './-components/details/DetailsView';

export const Route = createFileRoute('/applications/$applicationId/details')({
  component: DetailsPage,
  beforeLoad: allowOnly.authenticated(),
});

function DetailsPage() {
  const { applicationId } = Route.useParams();

  const applicationQuery = useApplicationQuery(applicationId);
  const evaluationQuery = useApplicationEvaluationQuery(applicationId);

  return (
    <AppLayout title="Szczegóły Zgłoszenia">
      <DetailsView application={applicationQuery.data} evaluation={evaluationQuery.data} />
    </AppLayout>
  );
}
