import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/core/lib/guards';
import { CruiseEffectsPage } from '@/cruise-applications/pages/CruiseEffectsPage';

export const Route = createFileRoute('/cruiseeffects')({
  component: CruiseEffectsPage,
  beforeLoad: allowOnly.authenticated(),
});
