import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/lib/guards';
import { HelpPage } from '@/routes/-help/HelpPage';

export const Route = createFileRoute('/help')({
  component: HelpPage,
  beforeLoad: allowOnly.authenticated(),
});
