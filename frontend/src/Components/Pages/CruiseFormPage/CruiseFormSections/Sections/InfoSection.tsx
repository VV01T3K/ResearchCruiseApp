import {FormSectionType, SectionIdFromTitle} from "../../../FormPage/Wrappers/FormASections";
import FormSection, {SectionProps} from "../../../FormPage/Wrappers/FormSection";
import CruiseBasicInfo from "../CruiseBasicInfo";
import React from "react";
import {useLocation} from "react-router-dom";


export const BasicInfo = () => {
    const locationState = useLocation()
    return(
        <CruiseBasicInfo cruise={locationState.state.cruise} />
    )
}

export const DateSection = ():FormSectionType => {
    const shortTitle = "Podstawowe"
    const longTitle = "Podstawowe informacje o rejsie"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props:SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            <BasicInfo/>
        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:{}}
}