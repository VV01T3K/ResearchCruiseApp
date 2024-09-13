import {FormSectionType, SectionIdFromTitle} from "../../../FormPage/Wrappers/FormASections";
import FormSection, {SectionProps} from "../../../FormPage/Wrappers/FormSection";
import React from "react";
import {StartDate} from "../../../CruisesPage/CruiseListFields";

const CruiseStartDateField = () => {
    return(
        <StartDate/>
    )
}

export const InfoSection = ():FormSectionType => {
    const shortTitle = "Termin"
    const longTitle = "Termin rejsu"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props:SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            {/*<CruiseStartDateField/>*/}
        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:{}}
}