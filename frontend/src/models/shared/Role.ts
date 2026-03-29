export enum Role {
  Administrator = 'Administrator',
  ShipOwner = 'Shipowner',
  CruiseManager = 'CruiseManager',
  Guest = 'Guest',
  ShipCrew = 'ShipCrew',
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
    case Role.ShipCrew:
      return 'Załoga statku';
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
    case 'Załoga statku':
      return Role.ShipCrew;
    default:
      return undefined;
  }
}
