import UgTeamsTable from "../../../Inputs/UgTeamsTable/UgTeamsTable"
import GuestTeamsTable from "../../../Inputs/GuestTeamsTable/GuestTeamsTable"
import { useContext } from "react"
import { researchTeamsSectionFieldNames } from "./ResearchTeamsSection"

import { FormContext } from "@contexts/FormContext"
import { FormAInitValues } from "FormAInitValues"

export const UgTeamsField = () => {
  const formContext = useContext(FormContext)
  return (
    <UgTeamsTable
      className="two-fields-beside-md"
      fieldLabel="Uczestnictwo osób z jednostek organizacyjnych UG"
      fieldName={researchTeamsSectionFieldNames.ugTeams}
      initValues={(formContext!.initValues as FormAInitValues)?.ugUnits}
    />
  )
}

export const GuestTeamsField = () => {
  const formContext = useContext(FormContext)
  return (
    <GuestTeamsTable
      className="two-fields-beside-md"
      fieldLabel="Uczestnictwo gości spoza UG"
      fieldName={researchTeamsSectionFieldNames.guestTeams}
      historicalGuestsInstitutions={
        (formContext!.initValues as FormAInitValues)?.historicalGuestInstitutions
      }
    />
  )
}
