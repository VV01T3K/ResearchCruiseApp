import {SectionWrapper} from "../../../FormPage/Wrappers/FormASections";
import CruiseApplications from "../CruiseApplications";
import React, {useContext, useState} from "react";
import {CruiseApplicationsContext} from "../../CruiseFormPage";


const ApplicationsField = () => {
    const [applicationsAddingMode, setApplicationsAddingMode] =
        useState(false)

    const cruiseApplicationsContext = useContext(CruiseApplicationsContext)

    return(
        <CruiseApplications
            cruiseApplications={cruiseApplicationsContext!.cruiseApplications}
            setCruiseApplications={cruiseApplicationsContext!.setCruiseApplications}
            addingMode={applicationsAddingMode}
            setAddingMode={setApplicationsAddingMode}
        />
    )
}

export const ApplicationsSection = () => SectionWrapper(
    {
        shortTitle: "Zgłoszenia",
        longTitle: "Zgłoszenia przypisane do rejsu",
        children: <ApplicationsField/>
    }
)