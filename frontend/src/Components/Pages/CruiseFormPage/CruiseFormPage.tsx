import Page from "../Page";
import React, {Dispatch, useEffect, useState} from "react";
import PageSectionsGroup from "../CommonComponents/PageSectionsGroup";
import PageSection from "../CommonComponents/PageSection";
import PageTitleWithNavigation from "../CommonComponents/PageTitleWithNavigation";
import {Cruise} from "../CruisesPage/CruisesPage";
import {useLocation, useNavigate} from "react-router-dom";
import CruiseBasicInfo from "./CruiseFormSections/CruiseBasicInfo";
import CruiseDate from "./CruiseFormSections/CruiseDate";
import {FieldValues, useForm, UseFormReturn} from "react-hook-form";
import CruiseApplications from "./CruiseFormSections/CruiseApplications";
import {Application, ApplicationShortInfo} from "../ApplicationsPage/ApplicationsPage";
import Api from "../../Tools/Api";
import {Time} from "../FormPage/Inputs/TaskInput/TaskInput";
import {fetchApplications} from "../../Tools/Fetchers";
import CruiseManagers from "./CruiseFormSections/CruiseManagers";
import {Simulate} from "react-dom/test-utils";
import reset = Simulate.reset;
import useCustomEvent from "../../Tools/useCustomEvent";


type CruiseManagersTeam = {
    mainCruiseManagerId: string,
    mainDeputyManagerId: string
}

export type EditCruiseFormValues = {
    date: Time,
    managersTeam: CruiseManagersTeam,
    applicationsIds: string[]
}

type CruiseFormPageLocationState = {
    cruise?: Cruise
}


export default function CruiseFormPage() {
    const EMPTY_GUID: string = "00000000-0000-0000-0000-000000000000"

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
        applicationsIds:
            locationState.cruise?.applicationsShortInfo.map(app => app.id) ??
            []
    }
    const cruiseForm = useForm<EditCruiseFormValues>({
        defaultValues: editCruiseFormDefaultValues
    })

    const handleEditCruise = () => {
        dispatchEvent("Trwa zapisywanie")
        Api
            .patch(
                `/api/Cruises/${locationState.cruise!.id}`,
                cruiseForm.getValues()
            )
            .then(_ =>
                navigate("/Cruises")
            )
    }
    const handleAddCruise = () => {
        Api
            .post(
                `/api/Cruises`,
                cruiseForm.getValues()
            )
            .then(_ =>
                navigate("/Cruises")
            )
    }
    const resetEditCruiseForm = () => {
        cruiseForm.reset(editCruiseFormDefaultValues)

        if (locationState.cruise)
            fetchApplications(locationState.cruise.applicationsShortInfo, setApplications)
    }

    const [sections, __] : [Record<string, string>, Dispatch<any>] = useState({
        "Podstawowe": "Podstawowe informacje o rejsie",
        "Termin": "Termin rejsu",
        "Kierownicy": "Kierownik główny i zastępca kierownika głównego",
        "Zgłoszenia": "Zgłoszenia przypisane do rejsu"
    })

    const [applicationsAddingMode, setApplicationsAddingMode] =
        useState(false)

    const [applications, setApplications] =
        useState<Application[]>([])
    useEffect(() => {
        if (locationState.cruise)
            fetchApplications(locationState.cruise.applicationsShortInfo, setApplications)
    }, []);

    return (
        <Page className="justify-content-center col-12 col-xl-9 bg-white" >
            <div className="d-flex flex-column w-100 h-100" style={{fontSize: "0.8rem"}}>
                <div className="d-flex flex-column align-items-center w-100 h-100 overflow-auto" >
                    <PageTitleWithNavigation
                        title={locationState.cruise ? "Szczegóły rejsu" : "Nowy rejs"}
                        sections={sections}
                        showRequiredSections={false}
                    />

                    <PageSectionsGroup sections={sections}>
                        <PageSection title={sections["Podstawowe"]}>
                            <CruiseBasicInfo cruise={locationState.cruise} />
                        </PageSection>

                        <PageSection title={sections["Termin"]}>
                            <CruiseDate editCruiseForm={cruiseForm} />
                        </PageSection>

                        <PageSection title={sections["Kierownicy"]}>
                            <CruiseManagers
                                applications={applications}
                                editCruiseForm={cruiseForm}
                            />
                        </PageSection>

                        <PageSection title={sections["Zgłoszenia"]}>
                            <CruiseApplications
                                editCruiseForm={cruiseForm}
                                applications={applications}
                                setApplications={setApplications}
                                addingMode={applicationsAddingMode}
                                setAddingMode={setApplicationsAddingMode}
                            />
                        </PageSection>
                    </PageSectionsGroup>
                </div>
                <div className={`d-flex flex-row justify-content-center border-top border-black w-100 bg-white`} style={{zIndex:9999}}>
                    <div className="d-flex col-6 text-center p-2 justify-content-center">
                        <button
                            className="btn btn-primary w-100"
                            style={{fontSize:"inherit"}}
                            onClick={locationState.cruise ?
                                cruiseForm.handleSubmit(handleEditCruise) :
                                cruiseForm.handleSubmit(handleAddCruise)
                            }
                        >
                            Zapisz rejs
                        </button>
                    </div>
                    <div className="d-flex col-6 text-center p-2 justify-content-center" >
                        <button
                            className="btn btn-primary w-100"
                            style={{fontSize:"inherit"}}
                            onClick={resetEditCruiseForm}
                        >
                            {locationState.cruise ? "Cofnij zmiany" : "Wyczyść formularz"}
                        </button>
                    </div>
                </div>
            </div>
        </Page>
    )
}