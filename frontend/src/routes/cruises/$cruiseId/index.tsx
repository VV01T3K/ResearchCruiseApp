import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/core/lib/guards';
import { CruiseDetailsPage } from '@/cruise-schedule/pages/CruiseDetailsPage';

export const Route = createFileRoute('/cruises/$cruiseId/')({
  component: CruiseDetailsPage,
  beforeLoad: allowOnly.authenticated(),
});
