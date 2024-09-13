import {FormSectionType, SectionIdFromTitle} from "../../../FormPage/Wrappers/FormASections";
import FormSection, {SectionProps} from "../../../FormPage/Wrappers/FormSection";
import React from "react";
import {useLocation} from "react-router-dom";
import CruiseBasicInfo from "../../../CruiseFormPage/CruiseFormSections/CruiseBasicInfo";


export const BasicInfo = () => {
    const locationState = useLocation()
    return(
        <CruiseBasicInfo cruise={locationState.state.cruise} />
    )
}

export const CruiseInfoSection = ():FormSectionType => {
    const shortTitle = "Rejs"
    const longTitle = "Numer ewidencyjny rejsu"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props:SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            <BasicInfo/>
        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:{}}
}