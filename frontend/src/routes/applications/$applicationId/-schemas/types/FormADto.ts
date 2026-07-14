import { z } from 'zod';

import { ContractDto } from '@/routes/applications/$applicationId/-schemas/types/ContractDto';
import { GuestTeamDto } from '@/routes/applications/$applicationId/-schemas/types/GuestTeamDto';
import { PermissionDto } from '@/routes/applications/$applicationId/-schemas/types/PermissionDto';
import { PublicationDto } from '@/routes/applications/$applicationId/-schemas/types/PublicationDto';
import { ResearchAreaDescriptionDto } from '@/routes/applications/$applicationId/-schemas/types/ResearchAreaDescriptionDto';
import { ResearchTaskDto } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskDto';
import { SpubTaskDto } from '@/routes/applications/$applicationId/-schemas/types/SpubTaskDto';
import { UGTeamDto } from '@/routes/applications/$applicationId/-schemas/types/UGTeamDto';

export type FormADto = {
  id?: string | undefined;
  cruiseManagerId: string;
  deputyManagerId: string;
  year: string;
  periodSelectionType?: 'precise' | 'period';
  acceptablePeriod: CruisePeriodType | '';
  optimalPeriod: CruisePeriodType | '';
  precisePeriodStart: string | '';
  precisePeriodEnd: string | '';
  cruiseHours: string;
  periodNotes: string;
  shipUsage?: string;
  differentUsage: string;
  permissions: PermissionDto[];
  researchAreaDescriptions: ResearchAreaDescriptionDto[];
  cruiseGoal: CruiseGoal | '';
  cruiseGoalDescription: string;
  researchTasks: ResearchTaskDto[];
  contracts: ContractDto[];
  ugTeams: UGTeamDto[];
  guestTeams: GuestTeamDto[];
  publications: PublicationDto[];
  spubTasks: SpubTaskDto[];
  supervisorEmail: string;
  note?: string;
};

/**
 * Represents a Fortnight (first half of January for 0, second half of January for 1, etc.)
 */
export type FortnightType = z.infer<typeof FortnightValidationSchema>;
export const FortnightValidationSchema = z.enum([
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
]);

/**
 * Represents a Cruise Period
 * @example ['0', '1'] // represents the period from first half of January to second half of January
 */
export type CruisePeriodType = z.infer<typeof CruisePeriodValidationSchema>;
export const CruisePeriodValidationSchema = z
  .tuple([FortnightValidationSchema, FortnightValidationSchema])
  .or(z.literal(''));

export enum CruiseGoal {
  Research = '0',
  Commercial = '1',
  Educational = '2',
}
