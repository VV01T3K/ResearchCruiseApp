import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/core/lib/guards';
import { HelpPage } from '@/other/pages/HelpPage';

export const Route = createFileRoute('/help')({
  component: HelpPage,
  beforeLoad: allowOnly.authenticated(),
});
