export enum CruiseApplicationStatus {
    New = 'Nowe',
    Accepted = 'Zaakceptowane',
    WaitingForSupervisor = 'Oczekujące na przełożonego',
    AcceptedBySupervisor = 'Zaakceptowane przez przełożonego',
    Denied = 'Odrzucone',
    DeniedBySupervisor = 'Odrzucone przez przełożonego',
    FormBRequired = 'Wymagane uzupełnienie formularza B przez kierownika',
    FormBFilled = 'Formularz B wypełniony oczekiwanie na rejs',
    Undertaken = 'Zrealizowane',
    Reported = 'Rozliczone',
}