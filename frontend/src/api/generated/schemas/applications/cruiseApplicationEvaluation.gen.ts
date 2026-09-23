import { z as zod } from 'zod';
import { GuestTeamFields } from './guestTeamFields.gen.ts';
import { NamedUgTeam } from './namedUgTeam.gen.ts';
import { ScoredContract } from './scoredContract.gen.ts';
import { ScoredPublication } from './scoredPublication.gen.ts';
import { ScoredResearchTask } from './scoredResearchTask.gen.ts';
import { ScoredSpubTask } from './scoredSpubTask.gen.ts';

export const CruiseApplicationEvaluation = zod.object({
  "formAResearchTasks": zod.array(ScoredResearchTask),
  "formAContracts": zod.array(ScoredContract),
  "ugTeams": zod.array(NamedUgTeam),
  "guestTeams": zod.array(GuestTeamFields),
  "ugUnitsPoints": zod.string(),
  "formAPublications": zod.array(ScoredPublication),
  "formASpubTasks": zod.array(ScoredSpubTask),
  "effectsPoints": zod.string()
});

export type CruiseApplicationEvaluation = zod.input<typeof CruiseApplicationEvaluation>;
export type CruiseApplicationEvaluationOutput = zod.output<typeof CruiseApplicationEvaluation>;
