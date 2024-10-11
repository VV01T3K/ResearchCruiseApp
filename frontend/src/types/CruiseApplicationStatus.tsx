export enum CruiseApplicationStatus {
    New = 'Nowe',
    Accepted = 'Zaakceptowane',
    WaitingForSupervisor = 'Oczekujące na przełożonego',
    AcceptedBySupervisor = 'Zaakceptowane przez przełożonego',
    DeniedBySupervisor = 'Odrzucone przez przełożonego',
    FormBRequired = 'Wymagane uzupełnienie formularza B przez kierownika',
    FormBFilled = 'Formularz B wypełniony oczekiwanie na rejs',
    CruiseBegan = 'Rejs w trakcie',
    Undertaken = 'Zrealizowane',
    Reported = 'Rozliczone',
    Archived = 'Archiwalne',
}