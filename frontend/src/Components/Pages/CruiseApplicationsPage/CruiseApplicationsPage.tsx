import React from 'react';
import Page from "../Page";
import PageTitle from "../CommonComponents/PageTitle";
import CruiseApplicationsList from "./CruiseApplicationsList";


export enum CruiseApplicationStatus {
    New = "Nowe",
    Accepted = "Zaakceptowane",
    WaitingForSupervisor = "Oczekujące na przełożonego",
    AcceptedBySupervisor = "Zaakceptowane przez przełożonego",
    DeniedBySupervisor = "Odrzucone przez przełożonego",
    FormBRequired = "Wymagane uzupełnienie formularza B przez kierownika",
    FormBFilled = "Formularz B wypełniony oczekiwanie na rejs",
    CruiseBegan = "Rejs w trakcie",
    Undertaken = "Zrealizowane",
    Reported = "Rozliczone",
    Archived = "Archiwalne"
}

export type CruiseApplicationShortInfo = {
    id: string,
    number: string,
    points: number,
    cruiseManagerId:string,
    deputyManagerId:string
}

export type CruiseApplication = {
    id: string,
    number: string,
    date: string,
    year: string,
    cruiseManagerId: string,
    cruiseManagerEmail: string,
    cruiseManagerFirstName: string,
    cruiseManagerLastName: string,
    deputyManagerId: string,
    deputyManagerEmail: string,
    deputyManagerFirstName: string,
    deputyManagerLastName: string,
    hasFormA: boolean,
    hasFormB: boolean,
    hasFormC: boolean,
    status: CruiseApplicationStatus,
    points: string,
    pointsDetails: any
}


function CruiseApplicationsPage() {

    return (
        <Page className="form-page">
                <PageTitle title="Zgłoszenia" />
                <CruiseApplicationsList/>
        </Page>
    )
}


export default CruiseApplicationsPage;