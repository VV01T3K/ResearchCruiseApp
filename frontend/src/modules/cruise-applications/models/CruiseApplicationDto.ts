export enum CruiseApplicationStatus {
  Draft = 'Wersja robocza',
  New = 'Nowe',
  Accepted = 'Zaakceptowane',
  WaitingForSupervisor = 'Oczekujące na przełożonego',
  AcceptedBySupervisor = 'Zaakceptowane przez przełożonego',
  Denied = 'Odrzucone',
  DeniedBySupervisor = 'Odrzucone przez przełożonego',
  FormBRequired = 'Wymagane uzupełnienie formularza B przez kierownika',
  FormBFilled = 'Formularz B wypełniony. Oczekiwanie na rejs',
  Undertaken = 'Zrealizowane',
  Reported = 'Rozliczone',
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
};
