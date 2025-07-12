import { AppBadge } from '@/core/components/AppBadge';
import { getRoleLabel, Role } from '@/core/models/Role';

export function RoleBadge({ role }: { role: Role }) {
  if (role === Role.Administrator) {
    return <AppBadge variant="success">{getRoleLabel(role)}</AppBadge>;
  }

  if (role === Role.ShipOwner) {
    return <AppBadge variant="primary">{getRoleLabel(role)}</AppBadge>;
  }

  if (role === Role.CruiseManager) {
    return <AppBadge variant="warning">{getRoleLabel(role)}</AppBadge>;
  }

  if (role === Role.ShipCrew) {
    return <AppBadge variant="info">{getRoleLabel(role)}</AppBadge>;
  }

  return <AppBadge variant="warning">{getRoleLabel(role)}</AppBadge>;
}
