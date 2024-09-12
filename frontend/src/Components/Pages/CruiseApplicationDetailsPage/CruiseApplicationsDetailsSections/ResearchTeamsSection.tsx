import {administrationUnits} from "../../../../resources/administrationUnits";
import NumberInput from "../../FormPage/Inputs/NumberInput";
import {FormSectionType, SectionIdFromTitle} from "../../FormPage/Wrappers/FormASections";
import FormSection, {SectionProps} from "../../FormPage/Wrappers/FormSection";
import React, {useContext} from "react";
import EvaluatedUgTeamsTable from "../../FormPage/Inputs/UgTeamsTable/EvaluatedUgTeamsTable";
import EvaluatedGuestTeamsTable from "../../FormPage/Inputs/GuestTeamsTable/EvaluatedGuestTeamsTable";
import {FormContext} from "../../FormPage/Wrappers/FormTemplate";


const researchTeamsSectionFieldNames = {
    calculatedPoints:"researchTeamsCalculatedPoints"
}

const UgTeamsField = () => {
    //const formContext = useContext(FormContext)

    return(
    <EvaluatedUgTeamsTable
        className="two-fields-beside-md"
        fieldLabel="Uczestnictwo osób z jednostek organizacyjnych UG"
        ugTeams={[
            {    unitId: "0",
                noOfEmployees: "8",
                noOfStudents: "7"}
        ]}
        initValues={administrationUnits.map((name, index)=>({name:name, id:String(index)}))}
    />
        )
}

  const GuestTeamsField = () => {
      //const formContext = useContext(FormContext)
      return(
        <EvaluatedGuestTeamsTable
            className="two-fields-beside-md"
            fieldLabel="Uczestnictwo gości spoza UG"
            guestTeams={[
                {institution:"a", noOfPersons: "9"},
                {institution:"n", noOfPersons: "0"},
            ]}
        />
    )
  }


  const CalculatedPointsField = () => {
    return(
        <NumberInput className="two-fields-beside-md"
                          fieldName={researchTeamsSectionFieldNames.calculatedPoints}
                          fieldLabel="Punkty"
      /> )
  }


export const ResearchTeamsSection = ():FormSectionType => {
    const shortTitle = "Z. badawcze"
    const longTitle = "Zespoły badawcze, jakie miałyby uczestniczyć w rejsie"
    const id = SectionIdFromTitle(shortTitle)
    const formContext = useContext(FormContext)
    console.log(formContext)
    const Content = (props:SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            <UgTeamsField/>
            <GuestTeamsField/>
            <CalculatedPointsField/>
        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:researchTeamsSectionFieldNames}
}