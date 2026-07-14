import { z as zod } from 'zod';
import { GuestTeamFields } from './guestTeamFields.gen.ts';
import { NamedUgTeam } from './namedUgTeam.gen.ts';
import { ScoredContract } from './scoredContract.gen.ts';
import { ScoredPublication } from './scoredPublication.gen.ts';
import { ScoredResearchTask } from './scoredResearchTask.gen.ts';
import { ScoredSpubTask } from './scoredSpubTask.gen.ts';

export const CruiseApplicationEvaluation = zod.object({
  "formAResearchTasks": zod.array(ScoredResearchTask).optional(),
  "formAContracts": zod.array(ScoredContract).optional(),
  "ugTeams": zod.array(NamedUgTeam).optional(),
  "guestTeams": zod.array(GuestTeamFields).optional(),
  "ugUnitsPoints": zod.string().optional(),
  "formAPublications": zod.array(ScoredPublication).optional(),
  "formASpubTasks": zod.array(ScoredSpubTask).optional(),
  "effectsPoints": zod.string().optional()
});

export type CruiseApplicationEvaluation = zod.input<typeof CruiseApplicationEvaluation>;
export type CruiseApplicationEvaluationOutput = zod.output<typeof CruiseApplicationEvaluation>;
