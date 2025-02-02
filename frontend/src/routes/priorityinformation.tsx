import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/core/lib/guards';
import { PriorityInformationPage } from '@/other/pages/PriorityInformationPage';

export const Route = createFileRoute('/priorityinformation')({
  component: PriorityInformationPage,
  beforeLoad: allowOnly.authenticated(),
});
