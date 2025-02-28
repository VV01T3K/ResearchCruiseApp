import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/core/lib/guards';
import { FormAPage } from '@/cruise-applications/pages/FormAPage';

export const Route = createFileRoute('/cruises/$cruiseId/formA')({
  component: FormAPage,
  beforeLoad: allowOnly.authenticated,
});
