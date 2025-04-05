import { z } from 'zod';

import { ResearchTaskDto, ResearchTaskDtoValidationSchema } from '@/cruise-applications/models/ResearchTaskDto';

type TaskEffect = {
  done: string;
  managerConditionMet: string;
  deputyConditionMet: string;
};
export type ResearchTaskEffectDto = ResearchTaskDto & TaskEffect;

export const ResearchTaskEffectDtoValidationSchema = z.intersection(
  ResearchTaskDtoValidationSchema,
  z.object({
    done: z.enum(['true', 'false']),
    managerConditionMet: z.enum(['true', 'false']),
    deputyConditionMet: z.enum(['true', 'false']),
  })
);
