import { z } from 'zod';

import { ContractDto } from '@/api/applications/dto/ContractDto';
import { GuestTeamDto } from '@/api/applications/dto/GuestTeamDto';
import { PermissionDto } from '@/api/applications/dto/PermissionDto';
import { PublicationDto } from '@/api/applications/dto/PublicationDto';
import { ResearchAreaDescriptionDto } from '@/api/applications/dto/ResearchAreaDescriptionDto';
import { ResearchTaskDto } from '@/api/applications/dto/ResearchTaskDto';
import { SpubTaskDto } from '@/api/applications/dto/SpubTaskDto';
import { UGTeamDto } from '@/api/applications/dto/UGTeamDto';

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
