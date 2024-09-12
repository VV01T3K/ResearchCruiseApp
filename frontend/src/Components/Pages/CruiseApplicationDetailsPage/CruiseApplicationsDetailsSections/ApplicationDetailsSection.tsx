import React from "react";
import CruiseApplicationInfo from "../CruiseApplicationInfo";
import {FormSectionType, SectionIdFromTitle} from "../../FormPage/Wrappers/FormASections";
import FormSection, {SectionProps} from "../../FormPage/Wrappers/FormSection";

export const ApplicationDetailsSection = ():FormSectionType => {
    const shortTitle = "Informacje"
    const longTitle = "Informacje o zgłoszeniu"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props:SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            <CruiseApplicationInfo/>
        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:{}}
}