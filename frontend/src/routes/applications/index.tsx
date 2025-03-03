import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/core/lib/guards';
import { ApplicationsPage } from '@/cruise-applications/pages/ApplicationsPage';

export const Route = createFileRoute('/applications/')({
  component: ApplicationsPage,
  beforeLoad: allowOnly.authenticated(),
});
