import { createFileRoute } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { AppLayout } from '@/components/shared/AppLayout';
import {
  useGetApplicationEvaluationSuspense,
  useGetApplicationSuspense,
} from '@/api/generated/endpoints/applications.gen';
import { mapEvaluationResponse } from '@/routes/applications/-types';
import { DetailsView } from './-components/details/DetailsView';

export const Route = createFileRoute('/applications/$applicationId/details')({
  component: DetailsPage,
  beforeLoad: allowOnly.authenticated(),
});

function DetailsPage() {
  const { applicationId } = Route.useParams();

  const applicationQuery = useGetApplicationSuspense(applicationId);
  const evaluationQuery = useGetApplicationEvaluationSuspense(applicationId, {
    query: { select: mapEvaluationResponse },
  });

  return (
    <AppLayout title="Szczegóły Zgłoszenia">
      <DetailsView application={applicationQuery.data} evaluation={evaluationQuery.data} />
    </AppLayout>
  );
}
