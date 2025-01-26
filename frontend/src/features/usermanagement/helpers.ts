import { Role } from '@core/models';

export function getRoleName(role: Role) {
  if (role === Role.Administrator) {
    return 'Administrator';
  }

  if (role === Role.ShipOwner) {
    return 'Armator';
  }

  if (role === Role.CruiseManager) {
    return 'Kierownik';
  }

  return 'Gość';
}

export function getAllowedRoles(userRole?: Role) {
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

export type UserDto = {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};
