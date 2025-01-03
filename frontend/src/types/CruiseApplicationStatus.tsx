export enum CruiseApplicationStatus {
  Draft = "Wersja robocza",
  New = "Nowe",
  Accepted = "Zaakceptowane",
  WaitingForSupervisor = "Oczekujące na przełożonego",
  AcceptedBySupervisor = "Zaakceptowane przez przełożonego",
  Denied = "Odrzucone",
  DeniedBySupervisor = "Odrzucone przez przełożonego",
  FormBRequired = "Wymagane uzupełnienie formularza B przez kierownika",
  FormBFilled = "Formularz B wypełniony. Oczekiwanie na rejs",
  Undertaken = "Zrealizowane",
  Reported = "Rozliczone",
}
