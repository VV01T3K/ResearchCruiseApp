import React, {Dispatch, useState} from 'react';
import Page from "../Tools/Page";
import useCustomEvent from "../Tools/useCustomEvent";
import {useParams} from "react-router-dom";
import SpubTasksPoints from "./ApplicationPointsSections/SpubTasksPoints";
import FormTitle from "../Forms/Tools/FormTitle";
import ApplicationPointsSectionsGroup from "./ApplicationPointsSections/Wrappers/ApplicationPointsSectionsGroup";
import ApplicationPointsSection from "./ApplicationPointsSections/Wrappers/ApplicationPointsSection";
import ApplicationInfo from "./ApplicationPointsSections/ApplicationInfo";


function ApplicationPointsPage() {
    let { applicationId } = useParams()

    const { dispatchEvent } = useCustomEvent('busy')

    const [sections, setSections] : [Record<string, string>, Dispatch<any>] = useState({
        "Info": "Informacje o zgłoszeniu",
        "SPUB": "Zadania SPUB, z którymi pokrywają się zadania planowane do realizacji na rejsie"
    })

    // const fetchData = async () => {
    //     return  Api.get(
    //         '/Users',)
    //         .then(response => {
    //             return response.data;
    //         })
    //         .then(response => setUserList(response))
    //         .finally(() => dispatchEvent(null))
    //         .catch(()=>{})
    //
    // }

    return (
        <>
            <Page className="justify-content-center col-12 col-xl-9 bg-white">
                <div className="d-flex flex-column w-100" style={{fontSize:"0.8rem"}}>
                    <FormTitle title={"Punkty przyznane zgłoszeniu"} sections={sections} />
                    <ApplicationPointsSectionsGroup sections={sections}>
                        <ApplicationPointsSection title={sections.Info}>
                            <ApplicationInfo />
                        </ApplicationPointsSection>
                        <ApplicationPointsSection title={sections.SPUB}>
                            <SpubTasksPoints
                                name={"evaluatedSpubTasks"}
                                evaluatedSpubTasks={[
                                    {
                                        yearFrom: "2024",
                                        yearTo: "2025",
                                        name: "Zadanie A",
                                        points: "100"
                                    },
                                    {
                                        yearFrom: "2024",
                                        yearTo: "2025",
                                        name: "Zadanie B",
                                        points: "100"
                                    },
                                    {
                                        yearFrom: "2024",
                                        yearTo: "2025",
                                        name: "Zadanie C",
                                        points: "100"
                                    },
                                    {
                                        yearFrom: "2024",
                                        yearTo: "2025",
                                        name: "Zadanie D",
                                        points: "100"
                                    },
                                ]}
                            />
                        </ApplicationPointsSection>
                    </ApplicationPointsSectionsGroup>
                </div>
            </Page>
        </>
    )
}


export default ApplicationPointsPage