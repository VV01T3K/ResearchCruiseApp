import React, {Dispatch, useState} from 'react';
import Page from "../Tools/Page";
import useCustomEvent from "../Tools/useCustomEvent";
import {useParams} from "react-router-dom";
import SpubTasksPoints from "./ApplicationPointsSections/SpubTasksPoints";
import FormTitle from "../Forms/Tools/FormTitle";
import ApplicationPointsSectionsGroup from "./ApplicationPointsSections/Wrappers/ApplicationPointsSectionsGroup";
import ApplicationPointsSection from "./ApplicationPointsSections/Wrappers/ApplicationPointsSection";
import ApplicationInfo from "./ApplicationPointsSections/ApplicationInfo";
import ContractsPoints from "./ApplicationPointsSections/ContractsPoints";
import TasksPoints from "./ApplicationPointsSections/TasksPoints";


type ApplicationSpecifics = {
    id: string,
    date: string,
    number: string,
    year: string,
    cruiseManagerFirstName: string,
    cruiseManagerLastName: string,
    status: string,
    points: any
}


function ApplicationPointsPage() {
    let { applicationId } = useParams()
    const applicationSpecifics: ApplicationSpecifics = {
        id: applicationId!,
        date: "2024-04-28",
        number: "2024/34",
        year: "2025",
        cruiseManagerFirstName: "Błażej",
        cruiseManagerLastName: "Laskowicz",
        status: "Nowe",
        points: []
    }

    const { dispatchEvent } = useCustomEvent('busy')

    const [sections, setSections] : [Record<string, string>, Dispatch<any>] = useState({
        "Informacje": "Informacje o zgłoszeniu",
        "Zadania": "Zadania do zrealizowania w trakcie rejsu",
        "Umowy": "Umowy regulujące współpracę, w ramach której miałyby być realizowane zadania badawcze",
        "Z. badawcze": "Zespoły badawcze, jakie miałyby uczestniczyć w rejsie",
        "Publikacje/prace": "Publikacje i prace",
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
                        <ApplicationPointsSection title={sections.Informacje}>
                            <ApplicationInfo
                                id={applicationSpecifics.id}
                                date={applicationSpecifics.date}
                                number={applicationSpecifics.number}
                                year={applicationSpecifics.year}
                                cruiseManagerFirstName={applicationSpecifics.cruiseManagerFirstName}
                                cruiseManagerLastName={applicationSpecifics.cruiseManagerLastName}
                                status={applicationSpecifics.status}
                            />
                        </ApplicationPointsSection>

                        <ApplicationPointsSection title={sections.Zadania}>
                            <TasksPoints
                                evaluatedTasks={[
                                    {
                                        type: 5,
                                        values: {
                                            title: "3re",
                                            time: {
                                                startDate: "Mon Jan 01 2024 00:00:00 GMT+0100 (czas środkowoeuropejski standardowy)",
                                                endDate: "Sun Dec 01 2024 00:00:00 GMT+0100 (czas środkowoeuropejski standardowy)"
                                            },
                                            financingAmount: "0.00"
                                        },
                                        points: "20"
                                    },
                                    {
                                        type: 5,
                                        values: {
                                            title: "3re",
                                            time: {
                                                startDate: "Wed May 01 2024 00:00:00 GMT+0200 (czas środkowoeuropejski letni)",
                                                endDate: "Wed May 01 2024 00:00:00 GMT+0200 (czas środkowoeuropejski letni)"
                                            },
                                            financingAmount: "0.00"
                                        },
                                        points: "30"
                                    },
                                    {
                                        type: 11,
                                        values: {
                                            description: "rtetretret"
                                        },
                                        points: "40"
                                    },
                                    {
                                        type: 3,
                                        values: {
                                            title: "fsdfds",
                                            institution: "ffsdff",
                                            date: "Fri Mar 15 2024 00:00:00 GMT+0100 (czas środkowoeuropejski standardowy)"
                                        },
                                        points: "50"
                                    },
                                    {
                                        type: 0,
                                        values: {
                                            author: "dfdsf",
                                            title: "dsfdfsd"
                                        },
                                        points: "60"
                                    }
                                ]}
                            />
                        </ApplicationPointsSection>

                        <ApplicationPointsSection title={sections.Umowy}>
                            <ContractsPoints
                                evaluatedContracts={[
                                    {
                                        category: "international",
                                        institution: {
                                            name: "Instytucja 1",
                                            unit: "Jednostka 1",
                                            localization: "Lokalizacja 1"
                                        },
                                        description: "Opis 1",
                                        scan: {
                                            name: "Skan 1",
                                            content: "1111111111"
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
                                            name: "Skan 2",
                                            content: "222222222"
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
                                            name: "Skan 3",
                                            content: "3333333333"
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
                                            name: "Skan 4",
                                            content: "444444444"
                                        },
                                        points: "150"
                                    }
                                ]}
                            />
                        </ApplicationPointsSection>

                        <ApplicationPointsSection title={sections["Z. badawcze"]}>
                            <div>Brak danych o nowej punktacji</div>
                        </ApplicationPointsSection>

                        <ApplicationPointsSection title={sections["Publikacje/prace"]}>
                            <div>Do uzupełnienia</div>
                        </ApplicationPointsSection>

                        <ApplicationPointsSection title={sections.SPUB}>
                            <SpubTasksPoints
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