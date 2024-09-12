import FormSection, {SectionProps} from "../../../Wrappers/FormSection";
import React, {useContext} from "react";
import {
    FormSectionType,
    SectionIdFromTitle
} from "../../../Wrappers/FormASections";
import UgTeamsTable from "../../../Inputs/UgTeamsTable/UgTeamsTable";
import {administrationUnits} from "../../../../../../resources/administrationUnits";
import GuestTeamsTable from "../../../Inputs/GuestTeamsTable/GuestTeamsTable";
import {FormContext} from "../../../Wrappers/FormTemplate";
import {EMPTY_GUID} from "../../../../CruiseFormPage/CruiseFormPage";
import {GuestTeamsField, UgTeamsField} from "./ResearchTeamsSectionFields";

export const researchTeamsSectionFieldNames = {
    ugTeams:"ugTeams",
    guestTeams:"guestTeams",
}
export const ResearchTeamsSection = ():FormSectionType => {
    const shortTitle = "Z. badawcze"
    const longTitle = "Zespoły badawcze, jakie miałyby uczestniczyć w rejsie"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props:SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            <UgTeamsField/>
            <GuestTeamsField/>
        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:researchTeamsSectionFieldNames}
}