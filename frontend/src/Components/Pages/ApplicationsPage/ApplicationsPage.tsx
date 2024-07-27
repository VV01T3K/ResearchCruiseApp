import React from 'react';
import Page from "../Page";
import PageTitle from "../CommonComponents/PageTitle";
import ApplicationsList from "./ApplicationsList";


export enum ApplicationStatus {
    New = "Nowe",
    Accepted = "Zaakceptowane",
    Undertaken = "Zrealizowane",
    Reported = "Rozliczone"
}

export type ApplicationShortInfo = {
    id: string,
    number: string,
    points: number
}

export type Application = {
    id: string,
    number: string,
    date: string,
    year: number,
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
    status: ApplicationStatus,
    points: string,
    pointsDetails: any
}


function ApplicationsPage() {

    return (
        <Page className="justify-content-center col-12 col-xl-9 bg-white">
            <div className="d-flex flex-column w-100 h-100" style={{fontSize: "0.8rem"}}>
                <div className="d-flex flex-column align-items-center w-100 h-100 overflow-auto">
                    <PageTitle title="Zgłoszenia" />
                    <ApplicationsList />
                </div>
            </div>
        </Page>
    )
}


export default ApplicationsPage