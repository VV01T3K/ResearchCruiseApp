import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/core/lib/guards';
import { Role } from '@/core/models/Role';
import { FormAPage } from '@/formA/pages/FormAPage';

export const Route = createFileRoute('/newcruise')({
  component: FormAPage,
  beforeLoad: allowOnly.withRoles(Role.Administrator, Role.ShipOwner, Role.CruiseManager),
});
