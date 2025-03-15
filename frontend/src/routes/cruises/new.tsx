import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/core/lib/guards';
import { NewCruisePage } from '@/cruise-schedule/pages/NewCruisePage';

export const Route = createFileRoute('/cruises/new')({
  component: NewCruisePage,
  beforeLoad: allowOnly.authenticated(),
});
