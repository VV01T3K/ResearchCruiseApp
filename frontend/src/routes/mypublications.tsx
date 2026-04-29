import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/lib/guards';
import { Role } from '@/models/shared/Role';
import { MyPublicationsPage } from '@/routes/-mypublications/MyPublicationsPage';

export const Route = createFileRoute('/mypublications')({
  component: MyPublicationsPage,
  beforeLoad: allowOnly.withRoles(Role.Administrator, Role.CruiseManager, Role.ShipOwner),
});
