import React, {createContext, useEffect, useState} from 'react';
import Page from "../Page";
import "react-big-calendar/lib/css/react-big-calendar.css"
import PageTitle from "../CommonComponents/PageTitle";
import {CruiseApplication, CruiseApplicationShortInfo} from "../CruiseApplicationsPage/CruiseApplicationsPage";
import {CruisePageContent, fetchCruises} from "./CruisesPageMisc";


export type Cruise = {
    id: string,
    number: string,
    date: string,
    mainCruiseManagerId: string,
    mainCruiseManagerFirstName: string,
    mainCruiseManagerLastName: string,
    mainDeputyManagerId: string,
    cruiseApplicationsShortInfo: CruiseApplicationShortInfo[],
    cruiseApplications?:CruiseApplication[]
}

export const CruiseStateContext =
    createContext<null | {cruises:Cruise[],setCruises:React.Dispatch<React.SetStateAction<Cruise[]>>}>(null)

export default function CruisesPage() {
    const [cruises, setCruises] = useState<Cruise[]>([])

    useEffect(() => {
        if(cruises.length <= 0)
         fetchCruises().then((response) =>setCruises(response?.data))
    },[]);


    return (
        <Page className="form-page">
            <PageTitle title="Rejsy"/>
            <div className="form-page-content d-flex flex-column align-items-center">
                <CruiseStateContext.Provider value={{cruises, setCruises}}>
                    <CruisePageContent/>
                </CruiseStateContext.Provider>
            </div>
        </Page>
    )
}