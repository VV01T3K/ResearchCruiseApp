import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/lib/guards';
import { ApplicationsPage } from '@/routes/applications/-index/ApplicationsPage';

export const Route = createFileRoute('/applications/')({
  component: ApplicationsPage,
  beforeLoad: allowOnly.authenticated(),
});
