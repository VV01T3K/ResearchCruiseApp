import {FormSectionType, SectionIdFromTitle} from "../../../FormPage/Wrappers/FormASections";
import FormSection, {SectionProps} from "../../../FormPage/Wrappers/FormSection";
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
export const ApplicationsSection = ():FormSectionType => {
    const shortTitle = "Zgłoszenia"
    const longTitle = "Zgłoszenia przypisane do rejsu"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props:SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            <ApplicationsField/>
        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:{}}
}