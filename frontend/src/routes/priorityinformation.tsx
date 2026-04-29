import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/lib/guards';
import { PriorityInformationPage } from '@/routes/-priorityinformation/PriorityInformationPage';

export const Route = createFileRoute('/priorityinformation')({
  component: PriorityInformationPage,
  beforeLoad: allowOnly.authenticated(),
});
