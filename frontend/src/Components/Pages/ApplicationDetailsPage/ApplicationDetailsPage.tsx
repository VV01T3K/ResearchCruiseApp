import React, {Dispatch, useEffect, useState} from 'react';
import Page from "../Page";
import {useLocation} from "react-router-dom";
import SpubTasksPoints from "./ApplicationPointsSections/SpubTasksPoints";
import PageTitleWithNavigation from "../CommonComponents/PageTitleWithNavigation";
import PageSectionsGroup from "../CommonComponents/PageSectionsGroup";
import PageSection from "../CommonComponents/PageSection";
import ApplicationInfo from "./ApplicationInfo";
import ContractsPoints from "./ApplicationPointsSections/ContractsPoints";
import TasksPoints from "./ApplicationPointsSections/TasksPoints";
import PublicationsPoints from "./ApplicationPointsSections/PublicationsPoints";
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
            Api
                .get(
                    `/api/applications/${locationState?.application.id}/points`
                )
                .then(response => {
                    setEvaluatedApplication(response.data)
                    }
                )
        }
    },[locationState]);

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
                             evaluatedApplication?.contracts ?? []
                           }
                        />
                    </PageSection>

                    <PageSection title={sections["Z. badawcze"]}>
                        <div className={"d-flex w-100"}>
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