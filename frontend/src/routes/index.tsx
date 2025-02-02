import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/core/lib/guards';
import { DashboardPage } from '@/dashboard/pages/DashboardPage';

export const Route = createFileRoute('/')({
  component: DashboardPage,
  beforeLoad: allowOnly.authenticated(),
});
