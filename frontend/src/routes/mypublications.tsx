import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/core/lib/guards';
import { Role } from '@/core/models/Role';
import { MyPublicationsPage } from '@/mypublications/pages/MyPublicationsPage';

export const Route = createFileRoute('/mypublications')({
  component: MyPublicationsPage,
  beforeLoad: allowOnly.withRoles(Role.Administrator, Role.CruiseManager, Role.ShipOwner),
});
