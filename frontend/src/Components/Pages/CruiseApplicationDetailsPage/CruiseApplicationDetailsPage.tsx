import React, {createContext, Dispatch, useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import {CruiseApplication} from "../CruiseApplicationsPage/CruiseApplicationsPage";
import FormTemplate from "../FormPage/Wrappers/FormTemplate";
import {ApplicationDetailsSection} from "./CruiseApplicationsDetailsSections/ApplicationDetailsSection";
import {TaskSection} from "./CruiseApplicationsDetailsSections/TaskSection";
import {ContractSection} from "./CruiseApplicationsDetailsSections/ContractSection";
import {ResearchTeamsSection} from "./CruiseApplicationsDetailsSections/ResearchTeamsSection";
import {PublicationsSection} from "./CruiseApplicationsDetailsSections/PublicationsSection";
import {SpubTaskSection} from "./CruiseApplicationsDetailsSections/SpubTaskSection";
import {BottomOptionBar} from "../../Tools/CruiseApplicationBottomOptionBar";
import {formType} from "../CommonComponents/FormTitleWithNavigation";
import {extendedUseLocation} from "../FormPage/FormPage";


type CruiseApplicationDetailsPageLocationState = {
    cruiseApplication: CruiseApplication
}

export const CruiseApplicationContext = createContext<CruiseApplication|null>(null)

const ApplicationDetailsSections = () => {
    return[
        ApplicationDetailsSection(),
        TaskSection(),
        ContractSection(),
        ResearchTeamsSection(),
        PublicationsSection(),
        SpubTaskSection()
    ]

}

function CruiseApplicationDetailsPage() {
    const location = extendedUseLocation()

    const sections = ApplicationDetailsSections()


    return (
        <CruiseApplicationContext.Provider value={location?.state.cruiseApplication}>
            <FormTemplate type={formType.ApplicationDetails} sections={sections} BottomOptionBar={BottomOptionBar}/>
        </CruiseApplicationContext.Provider>

)
}


export default CruiseApplicationDetailsPage;