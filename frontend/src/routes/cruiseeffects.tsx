import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/lib/guards';
import { CruiseEffectsPage } from '@/routes/-cruiseeffects/CruiseEffectsPage';

export const Route = createFileRoute('/cruiseeffects')({
  component: CruiseEffectsPage,
  beforeLoad: allowOnly.authenticated(),
});
