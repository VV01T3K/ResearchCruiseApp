import {administrationUnits} from "../../../../resources/administrationUnits";
import NumberInput from "../../FormPage/Inputs/NumberInput";
import {FormSectionType, SectionIdFromTitle, SectionWrapper} from "../../FormPage/Wrappers/FormASections";
import FormSection, {SectionProps} from "../../FormPage/Wrappers/FormSection";
import React, {useContext} from "react";
import EvaluatedUgTeamsTable from "../../FormPage/Inputs/UgTeamsTable/EvaluatedUgTeamsTable";
import EvaluatedGuestTeamsTable from "../../FormPage/Inputs/GuestTeamsTable/EvaluatedGuestTeamsTable";
import {FormContext} from "../../FormPage/Wrappers/FormTemplate";


const researchTeamsSectionFieldNames = {
    points:"researchTeamsPoints"
}

const UgTeamsField = () => {
    const formContext = useContext(FormContext)
    console.log(formContext?.initValues!)
    return(
    <EvaluatedUgTeamsTable
        className="two-fields-beside-md"
        fieldLabel="Uczestnictwo osób z jednostek organizacyjnych UG"
        ugTeams={formContext!.initValues?.ugTeams}
        initValues={administrationUnits.map((name, index)=>({name:name, id:String(index)}))}
    />
        )
}

  const GuestTeamsField = () => {
      // const formContext = useContext(FormContext)
      return(
        <EvaluatedGuestTeamsTable
            className="two-fields-beside-md"
            fieldLabel="Uczestnictwo gości spoza UG"
            guestTeams={[

            ]}
        />
    )
  }


  const CalculatedPointsField = () => {
      const formContext = useContext(FormContext)
      return(
        <NumberInput className="two-fields-beside-md"
                          fieldName={researchTeamsSectionFieldNames.points}
                          fieldLabel="Punkty"
                     defaultValue={formContext!.initValues?.ugUnitsPoints}
      /> )
  }

export const ResearchTeamsSection = () => SectionWrapper(
    {
        shortTitle: "Z. badawcze",
        longTitle: "Zespoły badawcze, jakie miałyby uczestniczyć w rejsie",
        sectionFieldNames:researchTeamsSectionFieldNames,
        children:
            <>
                <UgTeamsField/>
                <GuestTeamsField/>
                <CalculatedPointsField/>
            </>
    }
)