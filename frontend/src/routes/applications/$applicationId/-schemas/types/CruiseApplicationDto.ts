import type { CruiseApplicationDto as GeneratedCruiseApplicationDto } from '@/api/generated/schemas';

import type { DeepRequired } from '@/types/utils';

export enum CruiseApplicationStatus {
  Draft = 'draft',
  Accepted = 'accepted',
  WaitingForSupervisor = 'waitingForSupervisor',
  AcceptedBySupervisor = 'acceptedBySupervisor',
  Denied = 'denied',
  DeniedBySupervisor = 'deniedBySupervisor',
  FormBRequired = 'formBRequired',
  FormBFilled = 'formBFilled',
  Undertaken = 'undertaken',
  Reported = 'reported',
}

type GeneratedApplication = DeepRequired<GeneratedCruiseApplicationDto>;

export type CruiseApplicationDto = Omit<GeneratedApplication, 'year' | 'points' | 'status' | 'cruiseDays'> & {
  year: number;
  points: number;
  status: CruiseApplicationStatus;
  cruiseDays: number | null;
};
