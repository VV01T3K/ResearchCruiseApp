import React, {Dispatch, useState} from 'react';
import Page from "../Page";
import useCustomEvent from "../../Tools/useCustomEvent";
import {useLocation, useParams} from "react-router-dom";
import SpubTasksPoints from "./ApplicationPointsSections/SpubTasksPoints";
import PageTitleWithNavigation from "../CommonComponents/PageTitleWithNavigation";
import PageSectionsGroup from "../CommonComponents/PageSectionsGroup";
import PageSection from "../CommonComponents/PageSection";
import ApplicationInfo from "./ApplicationPointsSections/ApplicationInfo";
import ContractsPoints from "./ApplicationPointsSections/ContractsPoints";
import TasksPoints from "./ApplicationPointsSections/TasksPoints";
import PublicationsPoints from "./ApplicationPointsSections/PublicationsPoints";
import ThesisPoints from "./ApplicationPointsSections/ThesisPoints";
import {Application} from "../ApplicationsPage/ApplicationsPage";


function ApplicationDetailsPage() {
    const location = useLocation()
    const [{ application }, _] = useState(location.state || { })

    const { dispatchEvent } = useCustomEvent('busy')

    const [sections, setSections] : [Record<string, string>, Dispatch<any>] = useState({
        "Informacje": "Informacje o zgłoszeniu",
        "Zadania": "Zadania do zrealizowania w trakcie rejsu",
        "Umowy": "Umowy regulujące współpracę, w ramach której miałyby być realizowane zadania badawcze",
        "Z. badawcze": "Zespoły badawcze, jakie miałyby uczestniczyć w rejsie",
        "Publikacje": "Publikacje",
        "SPUB": "Zadania SPUB, z którymi pokrywają się zadania planowane do realizacji na rejsie"
    })

    return (
        <>
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
                                application={application}
                            />
                        </PageSection>

                        <PageSection title={sections.Zadania}>
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
                        </PageSection>

                        <PageSection title={sections.Umowy}>
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
                            <div>Brak danych o nowej punktacji</div>
                        </PageSection>

                        <PageSection title={sections["Publikacje"]}>
                            <PublicationsPoints
                                evaluatedPublications={[
                                    {
                                        category: "postscript",
                                        year: "2000",
                                        ministerialPoints: "200",
                                        DOI: "8t23467",
                                        authors: "Autor A",
                                        title: "Tytuł A",
                                        magazine: "Czasopismo A",
                                        points: "200"
                                    },
                                    {
                                        category: "subject",
                                        year: "2000",
                                        ministerialPoints: "200",
                                        DOI: "2345v6b",
                                        authors: "Autor B",
                                        title: "Tytuł B",
                                        magazine: "Czasopismo B",
                                        points: "100"
                                    },
                                    {
                                        category: "postscript",
                                        year: "2000",
                                        ministerialPoints: "200",
                                        DOI: "234tv",
                                        authors: "Autor C",
                                        title: "Tytuł C",
                                        magazine: "Czasopismo C",
                                        points: "200"
                                    },
                                ]}
                            />
                        </PageSection>

                        <PageSection title={sections.SPUB}>
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
                        </PageSection>
                    </PageSectionsGroup>
                </div>
            </Page>
        </>
    )
}


export default ApplicationDetailsPage