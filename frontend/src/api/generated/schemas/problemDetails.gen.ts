import { z as zod } from 'zod';

export const problemDetailsStatusRegExpTwo = new RegExp('^-?(?:0|[1-9]\\d*)$');


export const ProblemDetails = zod.object({
  "type": zod.string().nullish(),
  "title": zod.string().nullish(),
  "status": zod.union([zod.number(),zod.stringFormat('int32', problemDetailsStatusRegExpTwo)]).nullish(),
  "detail": zod.string().nullish(),
  "instance": zod.string().nullish()
});

export type ProblemDetails = zod.input<typeof ProblemDetails>;
export type ProblemDetailsOutput = zod.output<typeof ProblemDetails>;
