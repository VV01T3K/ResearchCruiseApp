import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/core/lib/guards';
import { Role } from '@/core/models/Role';
import { NewCruisePage } from '@/cruise-applications/pages/NewCruisePage';

export const Route = createFileRoute('/newcruise')({
  component: NewCruisePage,
  beforeLoad: allowOnly.withRoles(Role.Administrator, Role.ShipOwner, Role.CruiseManager),
});
