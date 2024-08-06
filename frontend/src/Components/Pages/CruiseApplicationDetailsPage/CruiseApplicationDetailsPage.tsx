import React, {Dispatch, useEffect, useState} from 'react';
import Page from "../Page";
import {useLocation} from "react-router-dom";
import SpubTasksPoints from "./CruiseApplicationPointsSections/SpubTasksPoints";
import PageTitleWithNavigation from "../CommonComponents/PageTitleWithNavigation";
import PageSectionsGroup from "../CommonComponents/PageSectionsGroup";
import PageSection from "../CommonComponents/PageSection";
import CruiseApplicationInfo from "./CruiseApplicationInfo";
import ContractsPoints from "./CruiseApplicationPointsSections/ContractsPoints";
import TasksPoints from "./CruiseApplicationPointsSections/TasksPoints";
import PublicationsPoints from "./CruiseApplicationPointsSections/PublicationsPoints";
import {CruiseApplication} from "../CruiseApplicationsPage/CruiseApplicationsPage";
import {FormValues} from "../FormPage/Wrappers/FormTemplate";
import Api from "../../Tools/Api";
import UgTeams from "./CruiseApplicationPointsSections/UgTeams";
import GuestTeams from "./CruiseApplicationPointsSections/GuestTeams";


type CruiseApplicationDetailsPageLocationState = {
    cruiseApplication: CruiseApplication
}


function CruiseApplicationDetailsPage() {
    const location = useLocation()
    const [locationState, _]: [CruiseApplicationDetailsPageLocationState, Dispatch<any>]
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
        // if (locationState?.cruiseApplication.id) {
        //     Api
        //         .get(
        //             `/api/CruiseApplications/${locationState?.cruiseApplication.id}/points`
        //         )
        //         .then(response => {
        //             console.log(response)
        //             // setEvaluatedApplication(response.data)
        //             }
        //         )
        //         .catch(error => {
        //             console.log(error.message)
        //         })
        // }
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
                        <CruiseApplicationInfo
                            cruiseApplication={locationState.cruiseApplication}
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


export default CruiseApplicationDetailsPage;