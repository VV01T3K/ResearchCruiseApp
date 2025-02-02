import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/core/lib/guards';
import { AccountSettingsPage } from '@/user/pages/AccountSettingsPage';

export const Route = createFileRoute('/accountsettings')({
  component: AccountSettingsPage,
  beforeLoad: allowOnly.authenticated(),
});
