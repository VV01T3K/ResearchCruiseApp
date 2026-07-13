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

export type UserCreateRequest = Omit<UserWriteRequest, 'role'> & {
  roles: string[];
};

export type UserProfilePatchRequest = Omit<UserWriteRequest, 'role'>;

export type CruiseManagerOptionResponse = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type CurrentUserResponse = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  emailConfirmed: boolean;
  accepted: boolean;
};

export type ChangePasswordRequest = {
  password: string;
  newPassword: string;
};

export type CurrentPublicationResponse = {
  id: string;
  category: string;
  doi: string | null;
  authors: string | null;
  title: string | null;
  magazine: string | null;
  year: string | null;
  ministerialPoints: string;
};

export type CurrentPublicationImportRequest = Omit<CurrentPublicationResponse, 'id'>;
