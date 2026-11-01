import { Badge } from '@/components/shared/Badge';
import { getRoleLabel, Role } from '@/integrations/auth/types';

export function RoleBadge({ role }: { role: string }) {
  if (role === Role.Administrator) {
    return <Badge variant="success">{getRoleLabel(role)}</Badge>;
  }

  if (role === Role.ShipOwner) {
    return <Badge variant="primary">{getRoleLabel(role)}</Badge>;
  }

  if (role === Role.CruiseManager) {
    return <Badge variant="warning">{getRoleLabel(role)}</Badge>;
  }

  if (role === Role.ShipCrew) {
    return <Badge variant="info">{getRoleLabel(role)}</Badge>;
  }

  return <Badge variant="warning">{getRoleLabel(role)}</Badge>;
}
