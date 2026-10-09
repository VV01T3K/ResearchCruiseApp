import * as zod from 'zod';

export const publicationFieldsIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const publicationFieldsCategoryMin = 0;
export const publicationFieldsCategoryMax = 1024;

export const publicationFieldsDoiMin = 0;
export const publicationFieldsDoiMax = 1024;

export const publicationFieldsAuthorsMin = 0;
export const publicationFieldsAuthorsMax = 1024;

export const publicationFieldsTitleMin = 0;
export const publicationFieldsTitleMax = 1024;

export const publicationFieldsMagazineMin = 0;
export const publicationFieldsMagazineMax = 1024;

export const publicationFieldsYearMin = 0;
export const publicationFieldsYearMax = 1024;

export const publicationFieldsMinisterialPointsMin = 0;
export const publicationFieldsMinisterialPointsMax = 1024;



export const PublicationFields = zod.object({
  "id": zod.string().regex(publicationFieldsIdRegExp).optional(),
  "category": zod.string().min(publicationFieldsCategoryMin).max(publicationFieldsCategoryMax).optional(),
  "doi": zod.string().min(publicationFieldsDoiMin).max(publicationFieldsDoiMax).nullish(),
  "authors": zod.string().min(publicationFieldsAuthorsMin).max(publicationFieldsAuthorsMax).nullish(),
  "title": zod.string().min(publicationFieldsTitleMin).max(publicationFieldsTitleMax).nullish(),
  "magazine": zod.string().min(publicationFieldsMagazineMin).max(publicationFieldsMagazineMax).nullish(),
  "year": zod.string().min(publicationFieldsYearMin).max(publicationFieldsYearMax).nullish(),
  "ministerialPoints": zod.string().min(publicationFieldsMinisterialPointsMin).max(publicationFieldsMinisterialPointsMax).optional()
});

export type PublicationFields = zod.input<typeof PublicationFields>;
export type PublicationFieldsOutput = zod.output<typeof PublicationFields>;
