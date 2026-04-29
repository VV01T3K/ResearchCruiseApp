import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/lib/guards';
import { CruiseDetailsPage } from '@/routes/cruises/$cruiseId/-details/CruiseDetailsPage';

export const Route = createFileRoute('/cruises/$cruiseId/')({
  component: CruiseDetailsPage,
  beforeLoad: allowOnly.authenticated(),
});
