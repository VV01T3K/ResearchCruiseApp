import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/lib/guards';
import { ApplicationDetailsPage } from '@/routes/applications/$applicationId/-details/ApplicationDetailsPage';

export const Route = createFileRoute('/applications/$applicationId/details')({
  component: ApplicationDetailsPage,
  beforeLoad: allowOnly.authenticated(),
});
