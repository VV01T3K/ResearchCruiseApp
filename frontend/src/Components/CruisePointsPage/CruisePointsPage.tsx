import React, {Dispatch, useState} from 'react';
import Page from "../Tools/Page";
import useCustomEvent from "../Tools/useCustomEvent";
import {useParams} from "react-router-dom";
import EvaluatedSpubTasksSection from "./EvaluatedSections/EvaluatedSpubTasksSection";
import EvaluatedSection from "./EvaluatedSections/Wrappers/EvaluatedSection";
import FormTitle from "../Forms/Tools/FormTitle";
import EvaluatedSections from "./EvaluatedSections/Wrappers/EvaluatedSections";


function CruisePointsPage() {
    let { logicalCruiseId } = useParams()

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
                    <EvaluatedSections sections={sections}>
                        <EvaluatedSection title={sections.SPUB}>
                            <EvaluatedSpubTasksSection
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
                        </EvaluatedSection>
                    </EvaluatedSections>
                </div>
            </Page>
        </>
    )
}


export default CruisePointsPage