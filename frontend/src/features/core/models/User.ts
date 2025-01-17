export type User = {
  id: string;
  firstName: string;
  lastName: string;

  email: string;
  emailConfirmed: boolean;
  //Only for frontend purposes not exists in backend
  emailSent?: boolean;

  roles: Role[];

  accepted: boolean;
};

export enum Role {
  Administrator = 'Administrator',
  Shipowner = 'Shipowner',
  CruiseManager = 'CruiseManager',
  Guest = 'Guest',
}
