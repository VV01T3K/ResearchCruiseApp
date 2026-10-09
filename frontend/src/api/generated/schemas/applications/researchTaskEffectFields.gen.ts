import * as zod from 'zod';

export const researchTaskEffectFieldsTitleMin = 0;
export const researchTaskEffectFieldsTitleMax = 1024;

export const researchTaskEffectFieldsMagazineMin = 0;
export const researchTaskEffectFieldsMagazineMax = 1024;

export const researchTaskEffectFieldsAuthorMin = 0;
export const researchTaskEffectFieldsAuthorMax = 1024;

export const researchTaskEffectFieldsInstitutionMin = 0;
export const researchTaskEffectFieldsInstitutionMax = 1024;

export const researchTaskEffectFieldsDateMin = 0;
export const researchTaskEffectFieldsDateMax = 1024;

export const researchTaskEffectFieldsStartDateMin = 0;
export const researchTaskEffectFieldsStartDateMax = 1024;

export const researchTaskEffectFieldsEndDateMin = 0;
export const researchTaskEffectFieldsEndDateMax = 1024;

export const researchTaskEffectFieldsFinancingAmountMin = 0;
export const researchTaskEffectFieldsFinancingAmountMax = 1024;

export const researchTaskEffectFieldsFinancingApprovedMin = 0;
export const researchTaskEffectFieldsFinancingApprovedMax = 1024;

export const researchTaskEffectFieldsDescriptionMin = 0;
export const researchTaskEffectFieldsDescriptionMax = 10240;

export const researchTaskEffectFieldsSecuredAmountMin = 0;
export const researchTaskEffectFieldsSecuredAmountMax = 1024;

export const researchTaskEffectFieldsMinisterialPointsMin = 0;
export const researchTaskEffectFieldsMinisterialPointsMax = 1024;

export const researchTaskEffectFieldsDoneMin = 0;
export const researchTaskEffectFieldsDoneMax = 1024;

export const researchTaskEffectFieldsPublicationMinisterialPointsMin = 0;
export const researchTaskEffectFieldsPublicationMinisterialPointsMax = 1024;

export const researchTaskEffectFieldsManagerConditionMetMin = 0;
export const researchTaskEffectFieldsManagerConditionMetMax = 1024;

export const researchTaskEffectFieldsDeputyConditionMetMin = 0;
export const researchTaskEffectFieldsDeputyConditionMetMax = 1024;



export const ResearchTaskEffectFields = zod.object({
  "type": zod.string().optional(),
  "title": zod.string().min(researchTaskEffectFieldsTitleMin).max(researchTaskEffectFieldsTitleMax).nullish(),
  "magazine": zod.string().min(researchTaskEffectFieldsMagazineMin).max(researchTaskEffectFieldsMagazineMax).nullish(),
  "author": zod.string().min(researchTaskEffectFieldsAuthorMin).max(researchTaskEffectFieldsAuthorMax).nullish(),
  "institution": zod.string().min(researchTaskEffectFieldsInstitutionMin).max(researchTaskEffectFieldsInstitutionMax).nullish(),
  "date": zod.string().min(researchTaskEffectFieldsDateMin).max(researchTaskEffectFieldsDateMax).nullish(),
  "startDate": zod.string().min(researchTaskEffectFieldsStartDateMin).max(researchTaskEffectFieldsStartDateMax).nullish(),
  "endDate": zod.string().min(researchTaskEffectFieldsEndDateMin).max(researchTaskEffectFieldsEndDateMax).nullish(),
  "financingAmount": zod.string().min(researchTaskEffectFieldsFinancingAmountMin).max(researchTaskEffectFieldsFinancingAmountMax).nullish(),
  "financingApproved": zod.string().min(researchTaskEffectFieldsFinancingApprovedMin).max(researchTaskEffectFieldsFinancingApprovedMax).nullish(),
  "description": zod.string().min(researchTaskEffectFieldsDescriptionMin).max(researchTaskEffectFieldsDescriptionMax).nullish(),
  "securedAmount": zod.string().min(researchTaskEffectFieldsSecuredAmountMin).max(researchTaskEffectFieldsSecuredAmountMax).nullish(),
  "ministerialPoints": zod.string().min(researchTaskEffectFieldsMinisterialPointsMin).max(researchTaskEffectFieldsMinisterialPointsMax).nullish(),
  "done": zod.string().min(researchTaskEffectFieldsDoneMin).max(researchTaskEffectFieldsDoneMax).optional(),
  "publicationMinisterialPoints": zod.string().min(researchTaskEffectFieldsPublicationMinisterialPointsMin).max(researchTaskEffectFieldsPublicationMinisterialPointsMax).nullish(),
  "managerConditionMet": zod.string().min(researchTaskEffectFieldsManagerConditionMetMin).max(researchTaskEffectFieldsManagerConditionMetMax).optional(),
  "deputyConditionMet": zod.string().min(researchTaskEffectFieldsDeputyConditionMetMin).max(researchTaskEffectFieldsDeputyConditionMetMax).optional()
});

export type ResearchTaskEffectFields = zod.input<typeof ResearchTaskEffectFields>;
export type ResearchTaskEffectFieldsOutput = zod.output<typeof ResearchTaskEffectFields>;
