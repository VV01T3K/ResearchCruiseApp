import { createFileRoute } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { AppLayout } from '@/components/shared/AppLayout';
import {
  useGetApplicationEvaluationSuspense,
  useGetApplicationSuspense,
} from '@/api/generated/endpoints/applications.gen';
import type { ApplicationResponse, EvaluationResponse } from '@/routes/applications/-types';
import { DetailsView } from './-components/details/DetailsView';

export const Route = createFileRoute('/applications/$applicationId/details')({
  component: DetailsPage,
  beforeLoad: allowOnly.authenticated(),
});

function DetailsPage() {
  const { applicationId } = Route.useParams();

  const applicationQuery = useGetApplicationSuspense(applicationId, {
    query: { select: (application) => application as ApplicationResponse },
  });
  const evaluationQuery = useGetApplicationEvaluationSuspense(applicationId, {
    query: { select: (evaluation) => evaluation as EvaluationResponse },
  });

  return (
    <AppLayout title="Szczegóły Zgłoszenia">
      <DetailsView application={applicationQuery.data} evaluation={evaluationQuery.data} />
    </AppLayout>
  );
}
