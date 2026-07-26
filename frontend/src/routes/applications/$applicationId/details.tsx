import { createFileRoute } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { AppLayout } from '@/components/shared/AppLayout';
import {
  getGetApplicationEvaluationSuspenseQueryOptions,
  getGetApplicationSuspenseQueryOptions,
} from '@/api/generated/endpoints/applications.gen';
import { DetailsView } from './-components/details/DetailsView';

export const Route = createFileRoute('/applications/$applicationId/details')({
  component: DetailsPage,
  beforeLoad: allowOnly.authenticated(),
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(getGetApplicationSuspenseQueryOptions(params.applicationId)),
      context.queryClient.ensureQueryData(getGetApplicationEvaluationSuspenseQueryOptions(params.applicationId)),
    ]),
});

function DetailsPage() {
  return (
    <AppLayout title="Szczegóły Zgłoszenia">
      <DetailsView />
    </AppLayout>
  );
}
