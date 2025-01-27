import { AppBadge } from '@core/components/AppBadge';
import { Role } from '@core/models';

import { getRoleName } from '../helpers';

export function RoleBadge({ role }: { role: Role }) {
  if (role === Role.Administrator) {
    return <AppBadge variant="success">{getRoleName(role)}</AppBadge>;
  }

  if (role === Role.ShipOwner) {
    return <AppBadge variant="primary">{getRoleName(role)}</AppBadge>;
  }

  if (role === Role.CruiseManager) {
    return <AppBadge variant="info">{getRoleName(role)}</AppBadge>;
  }

  return <AppBadge variant="warning">{getRoleName(role)}</AppBadge>;
}
