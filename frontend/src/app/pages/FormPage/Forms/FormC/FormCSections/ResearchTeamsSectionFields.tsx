import { researchTeamsSectionFieldNames } from "@app/pages/FormPage/Forms/FormB/FormBSections/ResearchTeamsSection"
import CrewTable from "@app/pages/FormPage/Inputs/CrewTable/CrewTable"
import { FormContext } from "@contexts/FormContext"
import { useContext } from "react"
import { FormBInitValues } from "FormBInitValues"

export const CrewField = () => {
  const formContext = useContext(FormContext)
  return (
    <CrewTable
      className="single-field"
      fieldLabel="Lista uczestników rejsu"
      fieldName={researchTeamsSectionFieldNames.crewMembers}
      historicalCrew={(formContext!.initValues as FormBInitValues)?.historicalCrew}
    />
  )
}
