import React from 'react';
import Page from "../Page";
import PageTitle from "../CommonComponents/PageTitle";
import CruiseApplicationsList from "./CruiseApplicationsList";


export enum CruiseApplicationStatus {
    New = "Nowe",
    Accepted = "Zaakceptowane",
    Undertaken = "Zrealizowane",
    Reported = "Rozliczone"
}

export type CruiseApplicationShortInfo = {
    id: string,
    number: string,
    points: number
}

export type CruiseApplication = {
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
    status: CruiseApplicationStatus,
    points: string,
    pointsDetails: any
}


function CruiseApplicationsPage() {

    return (
        <Page className="justify-content-center col-12 col-xl-9 bg-white">
            <div className="d-flex flex-column w-100 h-100" style={{fontSize: "0.8rem"}}>
                <div className="d-flex flex-column align-items-center w-100 h-100 overflow-auto">
                    <PageTitle title="Zgłoszenia" />
                    <CruiseApplicationsList />
                </div>
            </div>
        </Page>
    )
}


export default CruiseApplicationsPage;