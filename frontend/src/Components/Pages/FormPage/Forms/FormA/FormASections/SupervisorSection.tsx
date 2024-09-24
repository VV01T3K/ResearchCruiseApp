import FormSection, {SectionProps} from "../../../Wrappers/FormSection";
import React from "react";
import {
    FormSectionType,
    SectionIdFromTitle, SectionWrapper
} from "../../../Wrappers/FormASections";
import TextArea from "../../../Inputs/TextArea";
import {emailPattern} from "../../../../../CommonComponents/useFormWrapper";
import {researchTeamsSectionFieldNames} from "./ResearchTeamsSection";
import {SpubTaskField} from "./SpubTasksSectionFields";

export const supervisorSectionFieldNames = {
    supervisor:"supervisorEmail"
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

export const SupervisorSection = () => SectionWrapper(
    {
        shortTitle: "Przełożony",
        longTitle: "Dane kontaktowe przełożonego",
        sectionFieldNames: supervisorSectionFieldNames,
        children: <SupervisorEmailField/>
    }
)