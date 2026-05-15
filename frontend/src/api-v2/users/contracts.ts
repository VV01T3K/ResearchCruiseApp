import { Role } from '@/models/shared/Role';

export type UserResponse = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  emailConfirmed: boolean;
  accepted: boolean;
};

export type UserWriteRequest = {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

export type CruiseManagerOptionResponse = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};
