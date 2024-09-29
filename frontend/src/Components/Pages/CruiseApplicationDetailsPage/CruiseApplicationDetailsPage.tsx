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
    const [locationState, _]: [CruiseApplicationDetailsPageLocationState, Dispatch<any>]
        = useState(location.state || { })

    // Set the values to be loaded to the form if applicable
    // const [evaluatedApplication, setEvaluatedApplication]
    //     = useState<FormValues | undefined>()
    // useEffect(() => {
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
    // },[locationState]);

    const sections = ApplicationDetailsSections()


    return (
        <CruiseApplicationContext.Provider value={locationState.cruiseApplication}>
            <FormTemplate type={formType.ApplicationDetails} sections={sections} BottomOptionBar={BottomOptionBar}/>
        </CruiseApplicationContext.Provider>

)
}


export default CruiseApplicationDetailsPage;