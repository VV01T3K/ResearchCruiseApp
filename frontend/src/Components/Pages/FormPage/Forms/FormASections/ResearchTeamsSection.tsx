import FormSection, {SectionProps} from "../../Wrappers/FormSection";
import React, {useContext} from "react";
import {
    FormSectionType,
    SectionIdFromTitle
} from "../../Wrappers/FormASections";
import UgTeamsTable from "../../Inputs/UgTeamsTable/UgTeamsTable";
import {administrationUnits} from "../../../../../resources/administrationUnits";
import GuestTeamsTable from "../../Inputs/GuestTeamsTable/GuestTeamsTable";
import {FormContext} from "../../Wrappers/FormTemplate";

const researchTeamsSectionFieldNames = {
    ugTeams:"ugTeams",
    guestTeams:"guestTeams",
}

const UgTeamsField = () => {
    //const formContext = useContext(FormContext)

    return(
    <UgTeamsTable
        className="two-fields-beside-md"
        fieldLabel="Uczestnictwo osób z jednostek organizacyjnych UG"
        fieldName={researchTeamsSectionFieldNames.ugTeams}
        initValues={administrationUnits}
    />
        )
}

  const GuestTeamsField = () => {
      //const formContext = useContext(FormContext)
      return(
        <GuestTeamsTable
            className="two-fields-beside-md"
            fieldLabel="Uczestnictwo gości spoza UG"
            fieldName={researchTeamsSectionFieldNames.guestTeams}
            historicalGuestsInstitutions={[
                "Instytucja 1", "Instytucja 2", "Instytucja 3"
            ]}
        />
    )
  }



export const ResearchTeamsSection = ():FormSectionType => {
    const shortTitle = "Rejon"
    const longTitle = "Rejon prowadzenia badań"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props:SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            <UgTeamsField/>
            <GuestTeamsField/>
        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:researchTeamsSectionFieldNames}
}