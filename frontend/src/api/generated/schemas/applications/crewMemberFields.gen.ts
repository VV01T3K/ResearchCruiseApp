import { z as zod } from 'zod';

export const crewMemberFieldsTitleMin = 0;
export const crewMemberFieldsTitleMax = 1024;

export const crewMemberFieldsFirstNameMin = 0;
export const crewMemberFieldsFirstNameMax = 1024;

export const crewMemberFieldsLastNameMin = 0;
export const crewMemberFieldsLastNameMax = 1024;

export const crewMemberFieldsBirthPlaceMin = 0;
export const crewMemberFieldsBirthPlaceMax = 1024;

export const crewMemberFieldsBirthDateMin = 0;
export const crewMemberFieldsBirthDateMax = 1024;

export const crewMemberFieldsDocumentNumberMin = 0;
export const crewMemberFieldsDocumentNumberMax = 1024;

export const crewMemberFieldsDocumentExpiryDateMin = 0;
export const crewMemberFieldsDocumentExpiryDateMax = 1024;

export const crewMemberFieldsInstitutionMin = 0;
export const crewMemberFieldsInstitutionMax = 1024;



export const CrewMemberFields = zod.object({
  "title": zod.string().min(crewMemberFieldsTitleMin).max(crewMemberFieldsTitleMax).optional(),
  "firstName": zod.string().min(crewMemberFieldsFirstNameMin).max(crewMemberFieldsFirstNameMax).optional(),
  "lastName": zod.string().min(crewMemberFieldsLastNameMin).max(crewMemberFieldsLastNameMax).optional(),
  "birthPlace": zod.string().min(crewMemberFieldsBirthPlaceMin).max(crewMemberFieldsBirthPlaceMax).optional(),
  "birthDate": zod.string().min(crewMemberFieldsBirthDateMin).max(crewMemberFieldsBirthDateMax).optional(),
  "documentNumber": zod.string().min(crewMemberFieldsDocumentNumberMin).max(crewMemberFieldsDocumentNumberMax).optional(),
  "documentExpiryDate": zod.string().min(crewMemberFieldsDocumentExpiryDateMin).max(crewMemberFieldsDocumentExpiryDateMax).optional(),
  "institution": zod.string().min(crewMemberFieldsInstitutionMin).max(crewMemberFieldsInstitutionMax).optional()
});

export type CrewMemberFields = zod.input<typeof CrewMemberFields>;
export type CrewMemberFieldsOutput = zod.output<typeof CrewMemberFields>;
