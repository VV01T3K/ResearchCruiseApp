import React, {Dispatch, useState} from 'react';
import Page from "../Tools/Page";
import useCustomEvent from "../Tools/useCustomEvent";
import {useParams} from "react-router-dom";
import EvaluatedSpubTasksSection from "./EvaluatedSections/EvaluatedSpubTasksSection";
import EvaluatedSection from "./EvaluatedSections/EvaluatedSection";
import FormTitle from "../Forms/Tools/FormTitle";


function CruisePointsPage() {
    let { logicalCruiseId } = useParams()

    const { dispatchEvent } = useCustomEvent('busy')

    const [sections, setSections] : [Record<string, string>, Dispatch<any>] = useState({
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
                <div className="bg-white w-100 d-flex flex-column pb-1 m-2 center align-self-start justify-content-center p-2">
                    <FormTitle title={"SDsds"} sections={sections} />

                    <EvaluatedSection id="1" title={sections.SPUB}>
                        <EvaluatedSpubTasksSection
                            className={"col12"}
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
                                    points: "140"
                                },
                                {
                                    yearFrom: "2024",
                                    yearTo: "2025",
                                    name: "Zadanie C",
                                    points: "34"
                                },
                                {
                                    yearFrom: "2024",
                                    yearTo: "2025",
                                    name: "Zadanie D",
                                    points: "64"
                                },
                            ]}
                        />
                    </EvaluatedSection>
                </div>
            </Page>
        </>
    )
}


export default CruisePointsPage