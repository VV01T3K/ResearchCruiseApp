import Page from "../Page";
import React, {Dispatch, useState} from "react";
import PageSectionsGroup from "../CommonComponents/PageSectionsGroup";
import PageSection from "../CommonComponents/PageSection";
import PageTitleWithNavigation from "../CommonComponents/PageTitleWithNavigation";
import {Cruise} from "../CruisesPage/CruisesPage";
import {useLocation} from "react-router-dom";
import CruiseBasicInfo from "./CruiseDetailsSections/CruiseBasicInfo";
import CruiseDate from "./CruiseDetailsSections/CruiseDate";


type Props = {
    cruise: Cruise
}

type CruiseDetailsPageLocationState = {
    cruise: Cruise
}


export default function CruiseDetailsPage(props: Props) {
    const location = useLocation()
    const [locationState, _]: [CruiseDetailsPageLocationState, Dispatch<any>]
        = useState(location.state || { })

    const [sections, __] : [Record<string, string>, Dispatch<any>] = useState({
        "Podstawowe": "Podstawowe informacje o rejsie",
        "Termin": "Termin rejsu",
        "Zgłoszenia": "Zgłoszenia przypisane do rejsu"
    })

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
                            <span>TODO</span>
                        </PageSection>
                    </PageSectionsGroup>
                </div>
                <div className={`d-flex flex-row justify-content-center border-top border-black w-100 bg-white`} style={{zIndex:9999}}>
                    <div className="d-flex col-6 text-center p-2 justify-content-center">
                        <button className="btn btn-primary w-100" style={{fontSize:"inherit"}}>Zapisz</button>
                    </div>
                    <div className="d-flex col-6 text-center p-2 justify-content-center" >
                        <button className="btn btn-primary w-100" style={{fontSize:"inherit"}}>Wyślij</button>
                    </div>
                </div>
            </div>
        </Page>
    )
}