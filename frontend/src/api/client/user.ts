import type { TokenResponse, UserResponse } from '@/api/generated/schemas';

export enum Role {
  Administrator = 'Administrator',
  ShipOwner = 'Shipowner',
  CruiseManager = 'CruiseManager',
  Guest = 'Guest',
  ShipCrew = 'ShipCrew',
}

export type User = Omit<UserResponse, 'roles'> & { roles: Role[] };

export type AuthDetails = Omit<TokenResponse, 'accessTokenExpirationDate' | 'refreshTokenExpirationDate'> & {
  accessTokenExpirationDate: Date;
  refreshTokenExpirationDate: Date;
};

export type Result = 'success' | 'error';
export type SignInResult = Result | 'invalid_credentials';

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
