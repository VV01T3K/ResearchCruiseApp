import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/lib/guards';
import { AccountSettingsPage } from '@/routes/-accountsettings/AccountSettingsPage';

export const Route = createFileRoute('/accountsettings')({
  component: AccountSettingsPage,
  beforeLoad: allowOnly.authenticated(),
});
