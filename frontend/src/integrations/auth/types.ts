// Keep in sync with SeedAdministrationData.RoleNames in the backend - there is no API
// endpoint for roles, so this list is not derived from the backend automatically.
export enum Role {
  Administrator = 'Administrator',
  ShipOwner = 'Shipowner',
  CruiseManager = 'CruiseManager',
  Guest = 'Guest',
  ShipCrew = 'ShipCrew',
}

export type Result = 'success' | 'error';
export type SignInResult = Result | 'invalid_credentials';

export function getRoleLabel(role: string): string {
  switch (role) {
    case Role.Administrator:
      return 'Administrator';
    case Role.ShipOwner:
      return 'Armator';
    case Role.CruiseManager:
      return 'Kierownik';
    case Role.Guest:
      return 'Gość';
    case Role.ShipCrew:
      return 'Załoga statku';
    default:
      return role;
  }
}
