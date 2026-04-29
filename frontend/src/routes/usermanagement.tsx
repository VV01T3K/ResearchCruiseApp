import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/lib/guards';
import { Role } from '@/models/shared/Role';
import { UserManagementPage } from '@/routes/-usermanagement/UserManagementPage';

export const Route = createFileRoute('/usermanagement')({
  component: UserManagementPage,
  beforeLoad: allowOnly.withRoles(Role.Administrator, Role.ShipOwner),
});
