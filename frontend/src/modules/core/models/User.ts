import { Role } from '@/core/models/Role';

export type User = {
  id: string;
  firstName: string;
  lastName: string;

  email: string;
  emailConfirmed: boolean;

  roles: Role[];

  accepted: boolean;
};
