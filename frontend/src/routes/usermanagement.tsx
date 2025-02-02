import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/core/lib/guards';
import { Role } from '@/core/models/Role';
import { UserManagementPage } from '@/usermanagement/pages/UserManagementPage';

export const Route = createFileRoute('/usermanagement')({
  component: UserManagementPage,
  beforeLoad: allowOnly.withRoles(Role.Administrator, Role.ShipOwner),
});
