export enum Role {
  Administrator = 'Administrator',
  ShipOwner = 'Shipowner',
  CruiseManager = 'CruiseManager',
  Guest = 'Guest',
}

export function getRoleLabel(role: Role): string {
  switch (role) {
    case Role.Administrator:
      return 'Administrator';
    case Role.ShipOwner:
      return 'Armator';
    case Role.CruiseManager:
      return 'Kierownik';
    case Role.Guest:
      return 'Gość';
  }
}

export function getRoleFromLabel(label: string): Role | undefined {
  switch (label) {
    case 'Administrator':
      return Role.Administrator;
    case 'Armator':
      return Role.ShipOwner;
    case 'Kierownik':
      return Role.CruiseManager;
    case 'Gość':
      return Role.Guest;
    default:
      return undefined;
  }
}
