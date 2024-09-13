import React, {createContext, Dispatch, useEffect, useState} from "react";
import PageSection from "../CommonComponents/PageSection";
import {Cruise} from "../CruisesPage/CruisesPage";
import {useLocation} from "react-router-dom";
import CruiseApplications from "./CruiseFormSections/CruiseApplications";
import {CruiseApplication} from "../CruiseApplicationsPage/CruiseApplicationsPage";
import {fetchCruiseApplications} from "../../Tools/Fetchers";
import FormTemplate from "../FormPage/Wrappers/FormTemplate";
import {ApplicationsSection} from "./CruiseFormSections/Sections/AppicationsSection";
import {DateSection} from "./CruiseFormSections/Sections/InfoSection";
import {CruiseManagersSection} from "./CruiseFormSections/Sections/CruiseManagersSection";
import {BottomOptionBar} from "../../Tools/CruiseFormBottomOptionBar";
import {InfoSection} from "./CruiseFormSections/Sections/DateSection";


type CruiseManagersTeam = {
    mainCruiseManagerId: string,
    mainDeputyManagerId: string
}

export type EditCruiseFormValues = {
    date: Time,
    managersTeam: CruiseManagersTeam,
    cruiseApplicationsIds: string[]
}

type CruiseFormPageLocationState = {
    cruise?: Cruise
}

export const EMPTY_GUID: string = "00000000-0000-0000-0000-000000000000"


const CruiseFormSections = () => [
    ApplicationsSection(),
    CruiseManagersSection(),
    DateSection(),
    InfoSection()
]


export const CruiseApplicationsContext = createContext<CruiseApplication[]|null>(null)

export default function CruiseFormPage() {

    const location = useLocation()
    const [locationState, _]: [CruiseFormPageLocationState, Dispatch<any>]
        = useState(location.state || { })

    const editCruiseFormDefaultValues: EditCruiseFormValues = {
        date:
            locationState.cruise?.date ??
            { start: "", end: "" },
        managersTeam: {
            mainCruiseManagerId:
                locationState.cruise?.mainCruiseManagerId ??
                EMPTY_GUID,
            mainDeputyManagerId:
                locationState.cruise?.mainDeputyManagerId ??
                EMPTY_GUID
        },
        cruiseApplicationsIds:
            locationState.cruise?.cruiseApplicationsShortInfo.map(app => app.id) ??
            []
    }



    const sections = CruiseFormSections()



    const [cruiseApplications, setCruiseApplications] =
        useState<CruiseApplication[]>([])
    useEffect(() => {
        if (locationState.cruise)
            (fetchCruiseApplications)(locationState.cruise.cruiseApplicationsShortInfo, setCruiseApplications)
    }, []);




    return (
        <CruiseApplicationsContext.Provider value={{cruiseApplications, setCruiseApplications}}>
            <FormTemplate sections={sections} type="1" BottomOptionBar={BottomOptionBar} defaultValues={editCruiseFormDefaultValues} />
        </CruiseApplicationsContext.Provider>)
}