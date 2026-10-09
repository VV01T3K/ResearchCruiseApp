import { CruiseApplicationStatus } from '@/api/generated/schemas';

export function getApplicationStatusLabel(status: CruiseApplicationStatus): string {
  switch (status) {
    case CruiseApplicationStatus.enum.draft:
      return 'Wersja robocza';
    case CruiseApplicationStatus.enum.waitingForSupervisor:
      return 'Oczekujące na przełożonego';
    case CruiseApplicationStatus.enum.acceptedBySupervisor:
      return 'Zaakceptowane przez przełożonego';
    case CruiseApplicationStatus.enum.deniedBySupervisor:
      return 'Odrzucone przez przełożonego';
    case CruiseApplicationStatus.enum.accepted:
      return 'Zaakceptowane';
    case CruiseApplicationStatus.enum.denied:
      return 'Odrzucone';
    case CruiseApplicationStatus.enum.formBRequired:
      return 'Wymagane uzupełnienie formularza B przez kierownika';
    case CruiseApplicationStatus.enum.formBFilled:
      return 'Formularz B wypełniony. Oczekiwanie na rejs';
    case CruiseApplicationStatus.enum.undertaken:
      return 'Zrealizowane';
    case CruiseApplicationStatus.enum.reported:
      return 'Rozliczone';
  }
}
