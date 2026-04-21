import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/lib/guards';
import { Role } from '@/models/shared/Role';
import { NewCruisePage } from '@/routes/-newcruise/NewCruisePage';

export const Route = createFileRoute('/newcruise')({
  component: NewCruisePage,
  beforeLoad: allowOnly.withRoles(Role.Administrator, Role.ShipOwner, Role.CruiseManager),
});
