import Page from "../Page";
import React, {Dispatch, useState} from "react";
import PageSectionsGroup from "../CommonComponents/PageSectionsGroup";
import PageSection from "../CommonComponents/PageSection";
import PageTitleWithNavigation from "../CommonComponents/PageTitleWithNavigation";
import {Cruise} from "../CruisesPage/CruisesPage";
import {useLocation} from "react-router-dom";
import CruiseBasicInfo from "./CruiseDetailsSections/CruiseBasicInfo";
import CruiseDate from "./CruiseDetailsSections/CruiseDate";
import {useForm} from "react-hook-form";
import CruiseApplications from "./CruiseDetailsSections/CruiseApplications";
import {Application, ApplicationShortInfo} from "../ApplicationsPage/ApplicationsPage";


type CruiseDetailsPageLocationState = {
    cruise: Cruise
}


export default function CruiseDetailsPage() {
    const location = useLocation()
    const [locationState, _]: [CruiseDetailsPageLocationState, Dispatch<any>]
        = useState(location.state || { })

    const [sections, __] : [Record<string, string>, Dispatch<any>] = useState({
        "Podstawowe": "Podstawowe informacje o rejsie",
        "Termin": "Termin rejsu",
        "Zgłoszenia": "Zgłoszenia przypisane do rejsu"
    })

    const [applicationsAddingMode, setApplicationsAddingMode] = useState(false)

    const fetchApplications = (applicationsShortInfo: ApplicationShortInfo[]) => {
        // Temporary solution. Here an actual API call will be performed

        const records: Application[] = [];
        for (let i = 1; i <= 2; i++) {
            const record: Application = {
                id: (Math.floor(Math.random() * 1000)).toString() + "-" + (Math.floor(Math.random() * 1000)).toString() + "-" + (Math.floor(Math.random() * 1000)).toString() + "-" + (Math.floor(Math.random() * 1000)).toString(),
                date: `2024-${Math.floor(Math.random() * 2 + 10)}-${Math.floor(Math.random() * 10 + 20)}`,
                number: `2024/${i}`,
                year: 2025 + Math.floor(Math.random() * 3),
                cruiseManagerFirstName: i % 3 == (Math.floor(Math.random() * 3)) ? "Sławomir" : (i % 3 == (Math.floor(Math.random() * 3)) ? "Mieczysław" : "Trzebiesław"),
                cruiseManagerLastName: i % 3 == (Math.floor(Math.random() * 3)) ? "Kiędonorski" : (i % 3 == (Math.floor(Math.random() * 3)) ? "Adamczykowski" : "Sokołogonogonogonogonowski"),
                deputyManagerFirstName: i % 3 == (Math.floor(Math.random() * 3)) ? "Maciej" : (i % 3 == (Math.floor(Math.random() * 3)) ? "Paweł" : "Sławomir"),
                deputyManagerLastName: i % 3 == (Math.floor(Math.random() * 3)) ? "Domorowicz" : (i % 3 == (Math.floor(Math.random() * 3)) ? "Międzypodczas" : "Golałchowski"),
                formAId: (i * 100).toString(),
                formBId: i % 2 === 0 ? null : (i * 1000).toString(),
                formCId:  null,
                status: "Nowe",
                points: (Math.floor(Math.random() * 300) + 1).toString(),
                pointsDetails: [{}, {}]
            };
            records.push(record);
        }
        return records;
    }

    return (
        <Page className="justify-content-center col-12 col-xl-9 bg-white" >
            <div className="d-flex flex-column w-100 h-100" style={{fontSize: "0.8rem"}}>
                <div className="d-flex flex-column align-items-center w-100 h-100 overflow-auto" >
                    <PageTitleWithNavigation
                        title="Szczegóły rejsu"
                        sections={sections}
                        showRequiredSections={false}
                    />

                    <PageSectionsGroup sections={sections}>
                        <PageSection title={sections["Podstawowe"]}>
                            <CruiseBasicInfo cruise={locationState.cruise} />
                        </PageSection>

                        <PageSection title={sections["Termin"]}>
                            <CruiseDate cruise={locationState.cruise} />
                        </PageSection>

                        <PageSection title={sections["Zgłoszenia"]}>
                            <CruiseApplications
                                applications={fetchApplications(locationState.cruise.applicationsShortInfo)}
                                addingMode={applicationsAddingMode}
                                setAddingMode={setApplicationsAddingMode}
                            />
                        </PageSection>
                    </PageSectionsGroup>
                </div>
                <div className={`d-flex flex-row justify-content-center border-top border-black w-100 bg-white`} style={{zIndex:9999}}>
                    <div className="d-flex col-6 text-center p-2 justify-content-center">
                        <button className="btn btn-primary w-100" style={{fontSize:"inherit"}}>Zapisz zmiany</button>
                    </div>
                    <div className="d-flex col-6 text-center p-2 justify-content-center" >
                        <button className="btn btn-primary w-100" style={{fontSize:"inherit"}}>:)</button>
                    </div>
                </div>
            </div>
        </Page>
    )
}