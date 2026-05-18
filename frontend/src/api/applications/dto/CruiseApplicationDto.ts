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

export type CruiseApplicationDto = {
  id: string;
  number: string;
  year: number;
  date: string;

  cruiseManagerId: string;
  cruiseManagerEmail: string;
  cruiseManagerFirstName: string;
  cruiseManagerLastName: string;

  deputyManagerId: string;
  deputyManagerEmail: string;
  deputyManagerFirstName: string;
  deputyManagerLastName: string;

  hasFormA: boolean;
  hasFormB: boolean;
  hasFormC: boolean;

  points: number;
  status: CruiseApplicationStatus;
  effectsDoneRate: string;
  note: string | null;

  cruiseHours: string;
  cruiseDays: number | null;
  acceptablePeriodBeg: string | null;
  acceptablePeriodEnd: string | null;
  optimalPeriodBeg: string | null;
  optimalPeriodEnd: string | null;
  precisePeriodStart: string | null;
  precisePeriodEnd: string | null;
  startDate: string | null;
  endDate: string | null;
};
