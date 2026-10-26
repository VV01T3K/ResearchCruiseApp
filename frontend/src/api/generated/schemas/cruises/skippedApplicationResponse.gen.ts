import * as zod from 'zod';

export const skippedApplicationResponseApplicationIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const SkippedApplicationResponse = zod.object({
  "applicationId": zod.string().regex(skippedApplicationResponseApplicationIdRegExp),
  "applicationNumber": zod.string(),
  "reason": zod.string()
});

export type SkippedApplicationResponse = zod.input<typeof SkippedApplicationResponse>;
export type SkippedApplicationResponseOutput = zod.output<typeof SkippedApplicationResponse>;
