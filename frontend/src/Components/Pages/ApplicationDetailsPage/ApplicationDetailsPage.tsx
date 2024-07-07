import React, {Dispatch, useEffect, useState} from 'react';
import Page from "../Page";
import useCustomEvent from "../../Tools/useCustomEvent";
import {useLocation, useParams} from "react-router-dom";
import SpubTasksPoints from "./ApplicationPointsSections/SpubTasksPoints";
import PageTitleWithNavigation from "../CommonComponents/PageTitleWithNavigation";
import PageSectionsGroup from "../CommonComponents/PageSectionsGroup";
import PageSection from "../CommonComponents/PageSection";
import ApplicationInfo from "./ApplicationInfo";
import ContractsPoints from "./ApplicationPointsSections/ContractsPoints";
import TasksPoints from "./ApplicationPointsSections/TasksPoints";
import PublicationsPoints from "./ApplicationPointsSections/PublicationsPoints";
import ThesisPoints from "./ApplicationPointsSections/ThesisPoints";
import {Application} from "../ApplicationsPage/ApplicationsPage";
import {FormValues} from "../FormPage/Wrappers/FormTemplate";
import Api from "../../Tools/Api";
import UgTeams from "./ApplicationPointsSections/UgTeams";
import GuestTeams from "./ApplicationPointsSections/GuestTeams";


type ApplicationDetailsPageLocationState = {
    application: Application
}


function ApplicationDetailsPage() {
    const location = useLocation()
    const [locationState, _]: [ApplicationDetailsPageLocationState, Dispatch<any>]
        = useState(location.state || { })

    const { dispatchEvent } = useCustomEvent('busy')

    const [sections, __] : [Record<string, string>, Dispatch<any>] = useState({
        "Informacje": "Informacje o zgłoszeniu",
        "Zadania": "Zadania do zrealizowania w trakcie rejsu",
        "Umowy": "Umowy regulujące współpracę, w ramach której miałyby być realizowane zadania badawcze",
        "Z. badawcze": "Zespoły badawcze, jakie miałyby uczestniczyć w rejsie",
        "Publikacje": "Publikacje",
        "SPUB": "Zadania SPUB, z którymi pokrywają się zadania planowane do realizacji na rejsie"
    })

    // Set the values to be loaded to the form if applicable
    const [evaluatedApplication, setEvaluatedApplication]
        = useState<FormValues | undefined>()
    useEffect(() => {
        if (locationState?.application.id) {
            console.log(locationState)
            Api
                .get(
                    `/applications/${locationState?.application.id}/points`
                )
                .then(response => {
                    setEvaluatedApplication(response.data)
                    }
                )
                .catch(error =>
                    console.log(error)
                )
        }
    },[locationState]);
    console.log(evaluatedApplication)

    return (
        <Page className="justify-content-center col-12 col-xl-9 bg-white">
            <div className="d-flex flex-column w-100 h-100" style={{fontSize:"0.8rem"}}>
                <PageTitleWithNavigation
                    title="Szczegóły zgłoszenia"
                    sections={sections}
                    showRequiredSections={false}
                />
                <PageSectionsGroup sections={sections}>
                    <PageSection title={sections.Informacje}>
                        <ApplicationInfo
                            application={locationState.application}
                        />
                    </PageSection>

                    <PageSection title={sections.Zadania}>
                        <TasksPoints
                            evaluatedTasks={evaluatedApplication?.researchTasks ?? []}
                        />
                    </PageSection>

                    <PageSection title={sections.Umowy}>
                        <ContractsPoints
                            evaluatedContracts={
                            // evaluatedApplication?.contracts ?? []
                            [
                                {
                                    category: "international",
                                    institution: {
                                        name: "Instytucja 1",
                                        unit: "Jednostka 1",
                                        localization: "Lokalizacja 1"
                                    },
                                    description: "Opis 1",
                                    scan: {
                                        name: "Prezentacja.pdf",
                                        content:"data:application/pdfbase64JVBERi0xLjQKJSD"
                                    },
                                    points: "300"
                                },
                                {
                                    category: "international",
                                    institution: {
                                        name: "Instytucja 2",
                                        unit: "Jednostka 2",
                                        localization: "Lokalizacja 2"
                                    },
                                    description: "Opis 2",
                                    scan: {
                                        name: "Eksperyment",
                                        content: ""
                                    },
                                    points: "300"
                                },
                                {
                                    category: "domestic",
                                    institution: {
                                        name: "Instytucja 3",
                                        unit: "Jednostka 3",
                                        localization: "Lokalizacja 3"
                                    },
                                    description: "Opis 3",
                                    scan: {
                                        name: "Eksperyment",
                                        content: ""
                                    },
                                    points: "150"
                                },
                                {
                                    category: "domestic",
                                    institution: {
                                        name: "Instytucja 4",
                                        unit: "Jednostka 4",
                                        localization: "Lokalizacja 4"
                                    },
                                    description: "Opis 4",
                                    scan: {
                                        name: "teoria.pdf",
                                        content: "data:application/pdf;base64JVBERi0xLjUKJdDUxdgKMSA"
                                    },
                                    points: "150"
                                }
                            ]}
                        />
                    </PageSection>

                    <PageSection title={sections["Z. badawcze"]}>
                        <div className={"d-flex"}>
                        <UgTeams ugTeams={evaluatedApplication?.ugTeams ?? []}/>
                        <GuestTeams guestTeams={evaluatedApplication?.guestTeams ?? []}/>
                        </div>
                        <div className={" w-100 d-flex flex-column justify-content-center align-items-center"}>
                            Przyznane punkty
                            <input disabled className="text-center placeholder-glow p-1 w-25 form-control bg-light"
                                   value={evaluatedApplication?.ugTeamsPoints}
                            ></input>
                        </div>
                    </PageSection>

                    <PageSection title={sections["Publikacje"]}>
                        <PublicationsPoints
                            evaluatedPublications={evaluatedApplication?.publications ?? []}
                        />
                    </PageSection>

                    <PageSection title={sections.SPUB}>
                        <SpubTasksPoints
                            evaluatedSpubTasks={evaluatedApplication?.spubTasks ?? []}
                        />
                    </PageSection>
                </PageSectionsGroup>
            </div>
        </Page>
    )
}


export default ApplicationDetailsPage