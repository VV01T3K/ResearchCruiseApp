import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/lib/guards';
import { CruisesPage } from '@/routes/cruises/-index/CruisesPage';

export const Route = createFileRoute('/cruises/')({
  component: CruisesPage,
  beforeLoad: allowOnly.authenticated(),
});
