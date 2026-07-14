import { z } from 'zod';

import { ContractValues } from '@/routes/applications/$applicationId/-schemas/types/ContractValues';
import { GuestTeamValues } from '@/routes/applications/$applicationId/-schemas/types/GuestTeamValues';
import { PermissionValues } from '@/routes/applications/$applicationId/-schemas/types/PermissionValues';
import { PublicationValues } from '@/routes/applications/$applicationId/-schemas/types/PublicationValues';
import { ResearchAreaValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchAreaValues';
import { ResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';
import { SpubTaskValues } from '@/routes/applications/$applicationId/-schemas/types/SpubTaskValues';
import { UgTeamValues } from '@/routes/applications/$applicationId/-schemas/types/UgTeamValues';

export type FormAValues = {
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
  permissions: PermissionValues[];
  researchAreaDescriptions: ResearchAreaValues[];
  cruiseGoal: CruiseGoal | '';
  cruiseGoalDescription: string;
  researchTasks: ResearchTaskValues[];
  contracts: ContractValues[];
  ugTeams: UgTeamValues[];
  guestTeams: GuestTeamValues[];
  publications: PublicationValues[];
  spubTasks: SpubTaskValues[];
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
