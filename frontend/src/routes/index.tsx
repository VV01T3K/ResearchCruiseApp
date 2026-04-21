import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/lib/guards';
import { DashboardPage } from '@/routes/-index/DashboardPage';

export const Route = createFileRoute('/')({
  component: DashboardPage,
  beforeLoad: allowOnly.authenticated(),
});
