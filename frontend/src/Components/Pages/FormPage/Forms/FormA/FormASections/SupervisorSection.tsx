import FormSection, {SectionProps} from "../../../Wrappers/FormSection";
import React from "react";
import {
    FormSectionType,
    SectionIdFromTitle
} from "../../../Wrappers/FormASections";
import TextArea from "../../../Inputs/TextArea";
import {emailPattern} from "../../../../../CommonComponents/useFormWrapper";

export const supervisorSectionFieldNames = {
    supervisor:"supervisor"
}

const SupervisorEmailField = () => (
    <TextArea
        className={"two-fields-beside-md"}
        fieldLabel={"Adres email"}
        fieldName={supervisorSectionFieldNames.supervisor}
        placeholder={"Wpisz adres email"}
        required={true}
        pattern={emailPattern}
    />
)

export const SupervisorSection = ():FormSectionType => {
    const shortTitle = "Przełożony"
    const longTitle = "Dane kontaktowe przełożonego"
    const id = SectionIdFromTitle(shortTitle)
    const Content = (props:SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            <SupervisorEmailField/>
        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:supervisorSectionFieldNames}
}