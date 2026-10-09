import * as zod from 'zod';

export const researchTaskFieldsTitleMin = 0;
export const researchTaskFieldsTitleMax = 1024;

export const researchTaskFieldsMagazineMin = 0;
export const researchTaskFieldsMagazineMax = 1024;

export const researchTaskFieldsAuthorMin = 0;
export const researchTaskFieldsAuthorMax = 1024;

export const researchTaskFieldsInstitutionMin = 0;
export const researchTaskFieldsInstitutionMax = 1024;

export const researchTaskFieldsDateMin = 0;
export const researchTaskFieldsDateMax = 1024;

export const researchTaskFieldsStartDateMin = 0;
export const researchTaskFieldsStartDateMax = 1024;

export const researchTaskFieldsEndDateMin = 0;
export const researchTaskFieldsEndDateMax = 1024;

export const researchTaskFieldsFinancingAmountMin = 0;
export const researchTaskFieldsFinancingAmountMax = 1024;

export const researchTaskFieldsFinancingApprovedMin = 0;
export const researchTaskFieldsFinancingApprovedMax = 1024;

export const researchTaskFieldsDescriptionMin = 0;
export const researchTaskFieldsDescriptionMax = 10240;

export const researchTaskFieldsSecuredAmountMin = 0;
export const researchTaskFieldsSecuredAmountMax = 1024;

export const researchTaskFieldsMinisterialPointsMin = 0;
export const researchTaskFieldsMinisterialPointsMax = 1024;



export const ResearchTaskFields = zod.object({
  "type": zod.string().optional(),
  "title": zod.string().min(researchTaskFieldsTitleMin).max(researchTaskFieldsTitleMax).nullish(),
  "magazine": zod.string().min(researchTaskFieldsMagazineMin).max(researchTaskFieldsMagazineMax).nullish(),
  "author": zod.string().min(researchTaskFieldsAuthorMin).max(researchTaskFieldsAuthorMax).nullish(),
  "institution": zod.string().min(researchTaskFieldsInstitutionMin).max(researchTaskFieldsInstitutionMax).nullish(),
  "date": zod.string().min(researchTaskFieldsDateMin).max(researchTaskFieldsDateMax).nullish(),
  "startDate": zod.string().min(researchTaskFieldsStartDateMin).max(researchTaskFieldsStartDateMax).nullish(),
  "endDate": zod.string().min(researchTaskFieldsEndDateMin).max(researchTaskFieldsEndDateMax).nullish(),
  "financingAmount": zod.string().min(researchTaskFieldsFinancingAmountMin).max(researchTaskFieldsFinancingAmountMax).nullish(),
  "financingApproved": zod.string().min(researchTaskFieldsFinancingApprovedMin).max(researchTaskFieldsFinancingApprovedMax).nullish(),
  "description": zod.string().min(researchTaskFieldsDescriptionMin).max(researchTaskFieldsDescriptionMax).nullish(),
  "securedAmount": zod.string().min(researchTaskFieldsSecuredAmountMin).max(researchTaskFieldsSecuredAmountMax).nullish(),
  "ministerialPoints": zod.string().min(researchTaskFieldsMinisterialPointsMin).max(researchTaskFieldsMinisterialPointsMax).nullish()
});

export type ResearchTaskFields = zod.input<typeof ResearchTaskFields>;
export type ResearchTaskFieldsOutput = zod.output<typeof ResearchTaskFields>;
