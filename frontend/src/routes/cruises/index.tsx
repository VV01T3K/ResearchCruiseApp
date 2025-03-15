import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/core/lib/guards';
import { CruisesPage } from '@/cruise-schedule/pages/CruisesPage';

export const Route = createFileRoute('/cruises/')({
  component: CruisesPage,
  beforeLoad: allowOnly.authenticated(),
});
