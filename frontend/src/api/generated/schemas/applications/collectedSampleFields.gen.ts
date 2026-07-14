import { z as zod } from 'zod';

export const collectedSampleFieldsTypeMin = 0;
export const collectedSampleFieldsTypeMax = 10240;

export const collectedSampleFieldsAmountMin = 0;
export const collectedSampleFieldsAmountMax = 10240;

export const collectedSampleFieldsAnalysisMin = 0;
export const collectedSampleFieldsAnalysisMax = 10240;

export const collectedSampleFieldsPublishingMin = 0;
export const collectedSampleFieldsPublishingMax = 10240;



export const CollectedSampleFields = zod.object({
  "type": zod.string().min(collectedSampleFieldsTypeMin).max(collectedSampleFieldsTypeMax),
  "amount": zod.string().min(collectedSampleFieldsAmountMin).max(collectedSampleFieldsAmountMax),
  "analysis": zod.string().min(collectedSampleFieldsAnalysisMin).max(collectedSampleFieldsAnalysisMax),
  "publishing": zod.string().min(collectedSampleFieldsPublishingMin).max(collectedSampleFieldsPublishingMax)
});

export type CollectedSampleFields = zod.input<typeof CollectedSampleFields>;
export type CollectedSampleFieldsOutput = zod.output<typeof CollectedSampleFields>;
