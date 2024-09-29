import React, {createContext, Dispatch, useEffect, useState} from "react";
import {Cruise} from "../CruisesPage/CruisesPage";
import {Location, useLocation} from "react-router-dom";
import {CruiseApplication} from "../CruiseApplicationsPage/CruiseApplicationsPage";
import {fetchCruiseApplications} from "../../Tools/Fetchers";
import FormTemplate from "../FormPage/Wrappers/FormTemplate";
import {ApplicationsSection} from "./CruiseFormSections/Sections/AppicationsSection";
import {DateSection} from "./CruiseFormSections/Sections/InfoSection";
import {CruiseManagersSection} from "./CruiseFormSections/Sections/CruiseManagersSection";
import {BottomOptionBar} from "../../Tools/CruiseFormBottomOptionBar";
import {InfoSection} from "./CruiseFormSections/Sections/DateSection";
import {formType} from "../CommonComponents/FormTitleWithNavigation";
import {extendedUseLocation} from "../FormPage/FormPage";
import Api from "../../Tools/Api";
import {ApplicationsContext} from "../CruiseApplicationsPage/CruiseApplicationsList";


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

const EditCruiseFormDefaultValues = (location?:Location) => {
    if(location?.state)
        return{
            startDate:
                new Date(location.state.cruise?.startDate).toISOString() ?? undefined ,
            endDate:
                new Date(location.state.cruise?.endDate).toISOString() ?? undefined ,
            managersTeam: {
                mainCruiseManagerId:
                    location.state.cruise?.mainCruiseManagerId ??
                    EMPTY_GUID,
                mainDeputyManagerId:
                    location.state.cruise?.mainDeputyManagerId ??
                    EMPTY_GUID
            },
            cruiseApplicationsIds:
                location.state.cruise?.cruiseApplicationsShortInfo.map(app => app.id) ??
                []
        }
    return{
        startDate: undefined ,
        endDate: undefined ,
        managersTeam: { mainCruiseManagerId:EMPTY_GUID, mainDeputyManagerId: EMPTY_GUID },
        cruiseApplicationsIds: []
    }

}

export const CruiseApplicationsContext =
    createContext<{cruiseApplications: CruiseApplication[],
        setCruiseApplications: React.Dispatch<React.SetStateAction<CruiseApplication[]>>}|null>
    (null)

export default function CruiseFormPage() {

    const location = extendedUseLocation()

    const editCruiseFormDefaultValues: EditCruiseFormValues = EditCruiseFormDefaultValues(location)

    const sections = CruiseFormSections()

    const [fetchedCruiseApplications, setFetchedCruiseApplications] = useState<CruiseApplication[]>([])
    useEffect(() => {
        if(!fetchedCruiseApplications.length)
            Api.get('/api/CruiseApplications').then(response =>
                setFetchedCruiseApplications(response?.data))
    }, []);

    return (
        <ApplicationsContext.Provider value={fetchedCruiseApplications}>
            <FormTemplate sections={sections} type={formType.CruiseDetails} BottomOptionBar={BottomOptionBar}
                          defaultValues={editCruiseFormDefaultValues} />
        </ApplicationsContext.Provider>
    )
}