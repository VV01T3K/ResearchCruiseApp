import { z as zod } from 'zod';

export const httpValidationProblemDetailsStatusRegExpTwo = new RegExp('^-?(?:0|[1-9]\\d*)$');


export const HttpValidationProblemDetails = zod.object({
  "type": zod.string().nullish(),
  "title": zod.string().nullish(),
  "status": zod.union([zod.number(),zod.stringFormat('int32', httpValidationProblemDetailsStatusRegExpTwo)]).nullish(),
  "detail": zod.string().nullish(),
  "instance": zod.string().nullish(),
  "errors": zod.record(zod.string(), zod.array(zod.string())).optional()
});

export type HttpValidationProblemDetails = zod.input<typeof HttpValidationProblemDetails>;
export type HttpValidationProblemDetailsOutput = zod.output<typeof HttpValidationProblemDetails>;
