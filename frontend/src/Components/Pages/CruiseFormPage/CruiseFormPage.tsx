import Page from "../Page";
import React, {Dispatch, useEffect, useState} from "react";
import PageSectionsGroup from "../CommonComponents/PageSectionsGroup";
import PageSection from "../CommonComponents/PageSection";
import FormTitleWithNavigation from "../CommonComponents/FormTitleWithNavigation";
import {Cruise} from "../CruisesPage/CruisesPage";
import {useLocation, useNavigate} from "react-router-dom";
import CruiseBasicInfo from "./CruiseFormSections/CruiseBasicInfo";
import CruiseDate from "./CruiseFormSections/CruiseDate";
import {useForm} from "react-hook-form";
import CruiseApplications from "./CruiseFormSections/CruiseApplications";
import {CruiseApplication, CruiseApplicationShortInfo} from "../CruiseApplicationsPage/CruiseApplicationsPage";
import Api from "../../Tools/Api";
import {fetchCruiseApplications} from "../../Tools/Fetchers";
import CruiseManagers from "./CruiseFormSections/CruiseManagers";
import {Simulate} from "react-dom/test-utils";
import useCustomEvent from "../../Tools/useCustomEvent";
import FormTemplate from "../FormPage/Wrappers/FormTemplate";
import {CruiseManagerSection} from "../FormPage/Forms/FormA/FormASections/CruiseManagerSection";
import {TimeSection} from "../FormPage/Forms/FormA/FormASections/TimeSection";
import {PermissionsSection} from "../FormPage/Forms/FormA/FormASections/PermissionsSection";
import {ResearchAreaSection} from "../FormPage/Forms/FormA/FormASections/ResearchAreaSection";
import {GoalSection} from "../FormPage/Forms/FormA/FormASections/GoalSection";
import {TasksSection} from "../FormPage/Forms/FormA/FormASections/TasksSection";
import {ContractSection} from "../FormPage/Forms/FormA/FormASections/ContractSection";
import {ResearchTeamsSection} from "../FormPage/Forms/FormA/FormASections/ResearchTeamsSection";
import {PublicationAndThesesSection} from "../FormPage/Forms/FormA/FormASections/PublicationsSection";
import {SpubTasksSection} from "../FormPage/Forms/FormA/FormASections/SpubTasksSection";
import {ApplicationsSection} from "./CruiseFormSections/Sections/AppicationsSection";
import {DateSection} from "./CruiseFormSections/Sections/InfoSection";
import {InfoSection} from "./CruiseFormSections/Sections/DateSection";
import {CruiseManagersSection} from "./CruiseFormSections/Sections/CruiseManagersSection";


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


export default function CruiseFormPage() {

    const { dispatchEvent } = useCustomEvent('busy');
    const navigate = useNavigate()

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
    const cruiseForm = useForm<EditCruiseFormValues>({
        defaultValues: editCruiseFormDefaultValues
    })

    const handleEditCruise = () => {
        dispatchEvent("Trwa zapisywanie")
        Api.patch(
                `/api/Cruises/${locationState.cruise!.id}`,
                cruiseForm.getValues())
            .then(_ =>
                navigate("/Cruises")
            )
    }
    const handleAddCruise = () => Api
            .post(
                `/api/Cruises`,
                cruiseForm.getValues()
            )
            .then(_ =>
                navigate("/Cruises")
            )

    const resetEditCruiseForm = () => {
        cruiseForm.reset(editCruiseFormDefaultValues)

        if (locationState.cruise)
            fetchCruiseApplications(locationState.cruise.cruiseApplicationsShortInfo, setCruiseApplications)
    }

    const sections = CruiseFormSections()

    const [applicationsAddingMode, setApplicationsAddingMode] =
        useState(false)

    const [cruiseApplications, setCruiseApplications] =
        useState<CruiseApplication[]>([])
    useEffect(() => {
        if (locationState.cruise)
            (fetchCruiseApplications)(locationState.cruise.cruiseApplicationsShortInfo, setCruiseApplications)
    }, []);




    return (
        <FormTemplate sections={sections} type="2" /> )
            {/*<div className="d-flex flex-column w-100 h-100" style={{fontSize: "0.8rem"}}>*/}
            {/*    <div className="d-flex flex-column align-items-center w-100 h-100 overflow-auto" >*/}
            {/*        <FormTitleWithNavigation*/}
            {/*            title={locationState.cruise ? "Szczegóły rejsu" : "Nowy rejs"}*/}
            {/*            sections={sections}*/}
            {/*            showRequiredSections={false}*/}
            {/*        />*/}


            {/*            <PageSection title={sections["Termin"]}>*/}
            {/*            </PageSection>*/}

            {/*            <PageSection title={sections["Kierownicy"]}>*/}
            {/*                <CruiseManagers*/}
            {/*                    cruiseApplications={cruiseApplications}*/}
            {/*                    editCruiseForm={cruiseForm}*/}
            {/*                />*/}
            {/*            </PageSection>*/}

            {/*            <PageSection title={sections["Zgłoszenia"]}>*/}
            {/*                <CruiseApplications*/}
            {/*                    editCruiseForm={cruiseForm}*/}
            {/*                    cruiseApplications={cruiseApplications}*/}
            {/*                    setCruiseApplications={setCruiseApplications}*/}
            {/*                    addingMode={applicationsAddingMode}*/}
            {/*                    setAddingMode={setApplicationsAddingMode}*/}
            {/*                />*/}
            {/*            </PageSection>*/}
            {/*        </PageSectionsGroup>*/}
            {/*    </div>*/}
            {/*    <div className={`d-flex flex-row justify-content-center border-top border-black w-100 bg-white`} style={{zIndex:9999}}>*/}
            {/*        <div className="d-flex col-6 text-center p-2 justify-content-center">*/}
            {/*            <button*/}
            {/*                className="btn btn-primary w-100"*/}
            {/*                style={{fontSize:"inherit"}}*/}
            {/*                onClick={locationState.cruise ?*/}
            {/*                    cruiseForm.handleSubmit(handleEditCruise) :*/}
            {/*                    cruiseForm.handleSubmit(handleAddCruise)*/}
            {/*                }*/}
            {/*            >*/}
            {/*                Zapisz rejs*/}
            {/*            </button>*/}
            {/*        </div>*/}
            {/*        <div className="d-flex col-6 text-center p-2 justify-content-center" >*/}
            {/*            <button*/}
            {/*                className="btn btn-primary w-100"*/}
            {/*                style={{fontSize:"inherit"}}*/}
            {/*                onClick={resetEditCruiseForm}*/}
            {/*            >*/}
            {/*                {locationState.cruise ? "Cofnij zmiany" : "Wyczyść formularz"}*/}
            {/*            </button>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        // </Page>
    // )
}