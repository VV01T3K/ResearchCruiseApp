import { Role } from '@/core/models/Role';

export function getModifiableRoles(userRole?: Role) {
  if (!userRole) {
    return [];
  }

  if (userRole === Role.Administrator) {
    return [Role.Administrator, Role.ShipOwner, Role.CruiseManager, Role.Guest];
  }

  if (userRole === Role.ShipOwner) {
    return [Role.ShipOwner, Role.CruiseManager, Role.Guest];
  }

  throw new Error('Invalid user role');
}
